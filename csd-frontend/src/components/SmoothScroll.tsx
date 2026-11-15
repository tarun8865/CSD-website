import { useEffect, type ReactNode } from 'react'

type SmoothScrollProps = {
  children: ReactNode
}

const HEADER_OFFSET = 80
/** Matches ServicesSection sticky `top-[72px]` + useScroll offset start */
const SERVICES_STICKY_TOP = 72
const SERVICES_PROGRESS_START = 60
/** After resting at an edge this long, further overscroll is blocked */
const EDGE_LOCK_MS = 180

/** Document Y of an element’s layout position (correct for sticky targets). */
function getLayoutTop(el: HTMLElement) {
  let top = 0
  let node: HTMLElement | null = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

function scrollToElement(el: HTMLElement) {
  const top = getLayoutTop(el) - HEADER_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
}

/**
 * Land on the same stacked frame you’d see while scrolling the services deck.
 * Card i is the front of the stack around progress i * step; last card uses the hold zone.
 */
function scrollToStackedService(anchor: HTMLElement) {
  const container = document.querySelector<HTMLElement>('[data-services-stack]')
  const indexAttr = anchor.dataset.serviceIndex
  const countAttr = container?.dataset.servicesCount
  const index = indexAttr != null ? Number(indexAttr) : NaN
  const total = countAttr != null ? Number(countAttr) : NaN
  const isDesktop = window.matchMedia('(min-width: 768px)').matches

  if (!container || !isDesktop || !Number.isFinite(index) || !Number.isFinite(total) || total < 1) {
    scrollToElement(anchor)
    return
  }

  const step = 1 / total
  // Match StackingCardItem: card i fronts the stack near i*step; last card sits in the hold zone
  const progress =
    index >= total - 1 ? 0.9 : Math.min(0.95, index * step + step * 0.4)

  const containerTop = getLayoutTop(container)
  const containerHeight = container.offsetHeight
  const y0 = containerTop - SERVICES_PROGRESS_START
  const y1 = containerTop + containerHeight - window.innerHeight
  const targetY = y0 + progress * Math.max(0, y1 - y0)

  window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' })

  // Nudge so the sticky card sits exactly on its stack top (esp. last card with negative margin)
  const sticky = document.querySelector<HTMLElement>(
    `[data-service-sticky="${anchor.dataset.serviceStack}"]`,
  )
  if (!sticky) return

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const delta = sticky.getBoundingClientRect().top - SERVICES_STICKY_TOP
      if (Math.abs(delta) > 1) {
        window.scrollBy({ top: delta, behavior: 'auto' })
      }
    })
  })
}

function scrollToHashTarget(el: HTMLElement) {
  if (el.dataset.serviceStack != null) {
    scrollToStackedService(el)
    return
  }
  scrollToElement(el)
}

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0
}

function getMaxScroll() {
  const el = document.scrollingElement || document.documentElement
  return Math.max(0, el.scrollHeight - window.innerHeight)
}

function isAtTop() {
  return getScrollY() <= 0.5
}

function isAtBottom() {
  return getScrollY() >= getMaxScroll() - 0.5
}

/**
 * Native browser/OS scroll only (Google / Microsoft style).
 * Keeps hash-link + back-to-top helpers without Lenis inertia.
 * Allows one edge bounce when first reaching top/bottom, then locks
 * further overscroll while the user stays at that edge.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      const el = document.querySelector(href)
      if (!(el instanceof HTMLElement)) return

      event.preventDefault()
      scrollToHashTarget(el)
      history.pushState(null, '', href)
    }

    const onBackToTop = () => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      // Drop any previous hash (#about, #service-*, etc.) from the URL
      const { pathname, search } = window.location
      if (window.location.hash) {
        history.replaceState(null, '', `${pathname}${search}`)
      }
    }

    document.addEventListener('click', onClick)
    window.addEventListener('csd:scroll-top', onBackToTop)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('csd:scroll-top', onBackToTop)
    }
  }, [])

  useEffect(() => {
    let lockedTop = isAtTop()
    let lockedBottom = isAtBottom()
    let topTimer: ReturnType<typeof setTimeout> | null = null
    let bottomTimer: ReturnType<typeof setTimeout> | null = null
    let touchStartY = 0

    const clearTimers = () => {
      if (topTimer) clearTimeout(topTimer)
      if (bottomTimer) clearTimeout(bottomTimer)
      topTimer = null
      bottomTimer = null
    }

    const onScroll = () => {
      if (!isAtTop()) {
        lockedTop = false
        if (topTimer) {
          clearTimeout(topTimer)
          topTimer = null
        }
      } else if (!lockedTop && !topTimer) {
        // First arrival at top: allow bounce, then lock after settle
        topTimer = setTimeout(() => {
          lockedTop = true
          topTimer = null
        }, EDGE_LOCK_MS)
      }

      if (!isAtBottom()) {
        lockedBottom = false
        if (bottomTimer) {
          clearTimeout(bottomTimer)
          bottomTimer = null
        }
      } else if (!lockedBottom && !bottomTimer) {
        bottomTimer = setTimeout(() => {
          lockedBottom = true
          bottomTimer = null
        }, EDGE_LOCK_MS)
      }
    }

    const shouldBlockOverscroll = (deltaY: number) => {
      if (lockedTop && isAtTop() && deltaY < 0) return true
      if (lockedBottom && isAtBottom() && deltaY > 0) return true
      return false
    }

    const onWheel = (event: WheelEvent) => {
      if (shouldBlockOverscroll(event.deltaY)) {
        event.preventDefault()
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - y
      if (shouldBlockOverscroll(deltaY)) {
        event.preventDefault()
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      clearTimers()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <>{children}</>
}
