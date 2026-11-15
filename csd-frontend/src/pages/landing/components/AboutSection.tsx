import { useEffect, useRef } from 'react'
import aboutDivider from '../assets/about-divider.svg'
import iconMission from '../assets/icon-mission.svg'
import iconVision from '../assets/icon-vision.svg'

const LEAD_STATIC_TEXT =
  'Most financial firms look backward, focusing on historical reporting. At CSD Consulting, our gaze is fixed on your future. We are a premier corporate advisory firm built to act as your strategic financial engine.'

const ANIMATED_WORDS = [
  'We', 'do', 'not', 'just', 'manage', 'risk;', 'we', 'actively', 'architect',
  'frameworks', 'for', 'sustainable,', 'aggressive', 'growth.',
]

function ScrollAnimatedLead() {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const paragraph = paragraphRef.current
    if (!paragraph) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wordRefs.current.forEach((el) => {
        if (el) el.style.color = 'var(--color-ink, #041538)'
      })
      return
    }

    let rafId: number | null = null

    const updateScroll = () => {
      rafId = null
      const rect = paragraph.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight

      // Start when paragraph top reaches 78% of viewport height
      // Complete when paragraph top reaches 20% of viewport height (wider scroll distance = slower speed)
      const startY = windowHeight * 0.78
      const endY = windowHeight * 0.20
      const rawProgress = (startY - rect.top) / (startY - endY)
      const progress = Math.min(1, Math.max(0, rawProgress))

      const totalWords = ANIMATED_WORDS.length

      for (let i = 0; i < totalWords; i++) {
        const el = wordRefs.current[i]
        if (!el) continue
        const threshold = i / totalWords
        const isActive = progress > threshold
        const targetColor = isActive ? 'var(--color-ink, #041538)' : '#c5cad3'
        if (el.style.color !== targetColor) {
          el.style.color = targetColor
        }
      }
    }

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScroll)
      }
    }

    updateScroll()

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  return (
    <p
      ref={paragraphRef}
      className="type-lead measure-about mx-auto mt-7 text-center leading-[1.25]"
    >
      <span className="text-ink">
        {LEAD_STATIC_TEXT}
      </span>{' '}
      {ANIMATED_WORDS.map((word, index) => (
        <span key={index}>
          <span
            ref={(el) => {
              wordRefs.current[index] = el
            }}
            className="transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ color: '#c5cad3' }}
          >
            {word}
          </span>
          {index < ANIMATED_WORDS.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

const cards = [
  {
    icon: iconMission,
    eyebrow: 'our mission',
    title: 'Empower our Clients',
    body: 'Our mission is to empower our clients with reliable financial expertise, practical advisory, and professional support that simplify complexity and enable smarter business decisions. We are committed to delivering accurate, transparent, and client-focused solutions.',
  },
  {
    icon: iconVision,
    eyebrow: 'our vision',
    title: 'Be the Unequivocal Choice',
    body: 'Our vision is to be the trusted financial and advisory partner of choice for businesses across industries. We strive to build enduring relationships through professional excellence, innovation, and integrity, helping our clients unlock opportunities.',
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="section-space-sm scroll-mt-20 font-sans font-normal text-ink [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]"
    >
      <div className="landing-container">
      <div className="flex h-[45px] items-center gap-2">
        <span className="h-[45px] w-0.5 shrink-0 bg-aqua" />
        <div>
          <p className="text-sm leading-[18px] text-aqua">001</p>
          <p className="mt-[7px] text-base leading-5 uppercase">About us</p>
        </div>
      </div>
      <img
        src={aboutDivider}
        alt=""
        width="1440"
        height="1"
        className="mt-4 block h-px w-full"
      />
      <ScrollAnimatedLead />
      <div className="measure-about mx-auto mt-stack grid grid-cols-1 gap-6 min-[768px]:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.eyebrow}
            className="bg-white p-7 ring-1 ring-line ring-inset transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:opacity-80 hover:shadow-[0_16px_36px_-6px_rgba(4,21,56,0.08),0_6px_16px_-4px_rgba(4,21,56,0.04)] hover:ring-black/[0.12]"
          >
            <img src={card.icon} alt="" width="60" height="60" className="block size-[clamp(48px,4.17cqi,60px)]" />
            <p className="mt-[clamp(28px,3.06cqi,44px)] text-sm leading-[18px] text-aqua uppercase">{card.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(20px,1.67cqi,24px)] leading-[1.08] font-light font-stretch-semi-condensed">
              {card.title}
            </h2>
            <p className="mt-3 text-base leading-5 text-muted">{card.body}</p>
          </article>
        ))}
      </div>
      </div>
    </section>
  )
}
