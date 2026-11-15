import { useEffect, useRef, useState } from 'react'
import whyPhoto from '../assets/why-photo.png'
import whyGlobe from '../assets/why-globe.png'
import whyTexture from '../assets/why-texture.png'
import whyDivider from '../assets/why-divider.svg'
import iconQuote from '../assets/icon-quote.svg'
import quoteRule from '../assets/quote-rule.svg'
import iconCheck from '../assets/icon-check.svg'
import glowA from '../assets/glow-a.svg'
import glowB from '../assets/glow-b.svg'
import glowC from '../assets/glow-c.svg'
import mahendraAvatar from '../assets/mahendra.png'
import abhishekAvatar from '../assets/abhishek.png'
import sumitAvatar from '../assets/Sumit-srivastava.png'
import robinAvatar from '../assets/Robin-sharma.png'
import CtaButton from './CtaButton'

const highlights = [
  'Trusted by Founders & Growing Enterprises',
  'Experience Across Startups & Listed Companies',
  'Big-firm Expertise, Partner-Led Attention',
  'Supporting Businesses Across Growth Stages',
]

const stats = [
  {
    target: 13,
    suffix: '+',
    label: 'Years of Professional Experience',
  },
  {
    target: 100,
    suffix: '+',
    label: 'Clients Across Industries and Different Sectors',
  },
]

const testimonials = [
  {
    quote:
      "CSD has been my trusted advisors and first port of call for audit and tax advisory matters. CA Suresh Chawla is an encyclopedia on direct tax and international taxation while CA Mayank brings great depth to the firm's assurance and advisory practice.",
    name: 'CA Mahender Kumar',
    role: 'Fractional CFO and Former CFO GoldVIP / Crownit',
    avatar: mahendraAvatar,
  },
  {
    quote:
      'CSD brings a strong combination of technical expertise, professionalism, and commercial understanding. Their ability to navigate complex financial and regulatory matters while remaining solution-oriented makes them a dependable advisory partner.',
    name: 'Abhishek Upperwal',
    role: 'Founder, Soket AI',
    avatar: abhishekAvatar,
  },
  {
    quote:
      'As a fast-growing startup, having the right financial partner is critical. CSD has played an integral role in strengthening our finance function, bringing strategic financial insights, discipline, and structure as we scale. Their team works closely with us as an extension of our leadership, going beyond traditional finance and compliance to support key business decisions and long-term growth.',
    name: 'Sumit Srivastava',
    role: 'Founder, Befikr',
    avatar: sumitAvatar,
  },
  {
    quote:
      'Our experience working with CSD has been extremely positive. The team brings strong technical expertise, professionalism, and a thorough understanding of complex corporate and financial matters. Their attention to detail, practical advice, and commitment to delivering quality work make them a dependable professional partner.',
    name: 'Robin Sharma',
    role: 'Finance Lead, SRF',
    avatar: robinAvatar,
  },
]

type AnimatedCounterProps = {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  padDigits?: number
  useLocale?: boolean
  className?: string
}

function AnimatedCounter({
  end,
  duration = 1600,
  prefix = '',
  suffix = '',
  padDigits,
  useLocale = false,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return end
    }
    return 0
  })

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let rafId: number | null = null

    const startAnimation = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(1, elapsed / duration)
        const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        const currentVal = Math.round(easedProgress * end)

        setCount(currentVal)

        if (progress < 1) {
          rafId = requestAnimationFrame(animate)
        } else {
          setCount(end)
          rafId = null
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    if (!('IntersectionObserver' in window)) {
      startAnimation()
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation()
        } else if (
          entry.boundingClientRect.top >
          (window.innerHeight || document.documentElement.clientHeight)
        ) {
          if (rafId !== null) {
            cancelAnimationFrame(rafId)
            rafId = null
          }
          setCount(0)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [end, duration])

  let formatted = useLocale ? count.toLocaleString('en-IN') : String(count)
  if (padDigits && formatted.length < padDigits) {
    formatted = formatted.padStart(padDigits, '0')
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}

export default function WhyChooseSection() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return highlights.length
    }
    return 0
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let rafId: number | null = null
    let cascadeTimeoutId: ReturnType<typeof setTimeout> | null = null

    const clearCascade = () => {
      if (cascadeTimeoutId !== null) {
        clearTimeout(cascadeTimeoutId)
        cascadeTimeoutId = null
      }
    }

    const scheduleCascade = (nextCount: number) => {
      clearCascade()
      if (nextCount < highlights.length) {
        cascadeTimeoutId = setTimeout(() => {
          setVisibleCount((prev) => {
            const updated = Math.max(prev, nextCount + 1)
            if (updated < highlights.length) {
              scheduleCascade(updated)
            }
            return updated
          })
        }, 180)
      }
    }

    const updateScroll = () => {
      rafId = null
      const rect = card.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight

      // Start when top of card reaches 82% of viewport height
      // Complete scroll progress by 48% of viewport height
      const startY = windowHeight * 0.82
      const endY = windowHeight * 0.48
      const rawProgress = (startY - rect.top) / (startY - endY)
      const progress = Math.min(1, Math.max(0, rawProgress))

      // When scrolled back above the card, reset smoothly
      if (rect.top > windowHeight * 0.88) {
        clearCascade()
        setVisibleCount(0)
        return
      }

      // Calculate how many items should be visible based on scroll position
      let scrollTargetCount = 0
      if (progress >= 0.85) scrollTargetCount = 4
      else if (progress >= 0.60) scrollTargetCount = 3
      else if (progress >= 0.35) scrollTargetCount = 2
      else if (progress >= 0.10) scrollTargetCount = 1

      setVisibleCount((prev) => {
        const next = Math.max(prev, scrollTargetCount)
        if (next > prev && next < highlights.length) {
          scheduleCascade(next)
        }
        return next
      })
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
      if (rafId !== null) cancelAnimationFrame(rafId)
      clearCascade()
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  return (
    <section className="section-space font-sans font-normal text-ink [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]">
      <div className="landing-container">
      <div className="flex h-[45px] items-center gap-2">
        <span className="h-[45px] w-0.5 shrink-0 bg-aqua" />
        <div>
          <p className="text-sm leading-[18px] text-aqua">002</p>
          <p className="mt-[7px] text-base leading-5 uppercase">Why choose us</p>
        </div>
      </div>
      <img src={whyDivider} alt="" width="1440" height="1" className="mt-4 block h-px w-full" />

      <div className="mt-[27px] grid items-start gap-10 min-[1024px]:grid-cols-[626fr_708fr] min-[1024px]:gap-x-[clamp(56px,7.36cqi,106px)]">
        <h2 className="type-section measure-heading-sm m-0 font-display leading-[1.25] font-light tracking-normal font-stretch-semi-condensed">
          Beyond Compliance. Towards
          <br />
          Strategic Transformation.
        </h2>
        <div>
          <p className="text-base leading-5 text-muted">
            Guided by a mission to empower clients through sophisticated financial
            strategies and deep operational insights, we serve as a comprehensive
            resource that brings essential advisory services together to add
            measurable value to every organization we touch.
          </p>
          <div className="mt-10 flex justify-end">
            <CtaButton label="let’s talk" variant="talk" href="#contact-form" />
          </div>
        </div>
      </div>

      <div className="mt-stack grid grid-cols-1 gap-6 min-[1024px]:grid-cols-[586fr_830fr]">
        <div className="@container relative mx-auto aspect-[586/649] w-full max-w-[586px] overflow-hidden">
          <img
            src={whyPhoto}
            alt=""
            width={1024}
            height={683}
            className="pointer-events-none absolute inset-0 size-full max-w-none object-fill object-bottom"
          />
          <figure className="absolute top-1/2 left-1/2 flex h-[min(64cqi,400px)] w-[min(79.5cqi,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 flex-col bg-ink/20 px-[clamp(16px,4.8cqi,28px)] pt-[clamp(24px,6.8cqi,40px)] pb-[clamp(20px,6.7cqi,39px)] text-white max-[640px]:h-auto max-[640px]:min-h-[260px]">
            <div className="relative min-h-[9.5rem] flex-1">
              {testimonials.map((item, index) => (
                <blockquote
                  key={item.name}
                  aria-hidden={index !== quoteIndex}
                  className={`m-0 text-[clamp(13px,1.05cqi,16px)] leading-5 transition-opacity duration-500 ${
                    index === quoteIndex
                      ? 'relative opacity-100'
                      : 'pointer-events-none absolute inset-0 opacity-0'
                  }`}
                >
                  “{item.quote}”
                </blockquote>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2" role="tablist" aria-label="Testimonials">
              {testimonials.map((item, index) => (
                <button
                  key={`dot-${item.name}`}
                  type="button"
                  role="tab"
                  aria-selected={index === quoteIndex}
                  aria-label={`Show quote from ${item.name}`}
                  onClick={() => setQuoteIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === quoteIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            <img
              src={quoteRule}
              alt=""
              width="410"
              height="1"
              className="mt-4 block h-px w-full"
            />
            <figcaption className="relative mt-5 min-h-[3.25rem] pr-14 max-[640px]:pr-[4.25rem]">
              {testimonials.map((item, index) => (
                <span
                  key={`caption-${item.name}`}
                  aria-hidden={index !== quoteIndex}
                  className={`flex items-start gap-3 transition-opacity duration-500 ${
                    index === quoteIndex
                      ? 'relative opacity-100'
                      : 'pointer-events-none absolute inset-0 opacity-0'
                  }`}
                >
                  <img
                    src={item.avatar}
                    alt=""
                    width="96"
                    height="96"
                    className="mt-px size-12 shrink-0 rounded-full object-cover max-[640px]:size-10"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="type-title block leading-[1.25]">{item.name}</span>
                    <span className="mt-1 block text-sm leading-5 text-white/60 max-[640px]:text-[13px] max-[640px]:leading-[18px]">
                      {item.role}
                    </span>
                  </span>
                </span>
              ))}
            </figcaption>
            <span className="pointer-events-none absolute right-7 bottom-5 size-[60px] max-[640px]:right-7 max-[640px]:bottom-4 max-[640px]:size-9">
              <img
                src={iconQuote}
                alt=""
                width="59.8612"
                height="43.248"
                className="absolute top-[15.5%] left-0 h-[43.248px] w-[59.8612px] max-w-none max-[640px]:top-0 max-[640px]:h-9 max-[640px]:w-[49px]"
              />
            </span>
          </figure>
        </div>

        <div className="grid gap-6">
          <div
            ref={cardRef}
            className="relative flex flex-col min-h-[clamp(220px,21.74cqi,313px)] min-[1024px]:h-[clamp(220px,21.74cqi,313px)] overflow-hidden bg-ink text-white"
          >
            <img
              src={whyGlobe}
              alt=""
              className="pointer-events-none absolute inset-0 size-full object-cover"
            />
            <img
              src={glowC}
              alt=""
              className="pointer-events-none absolute top-[-87.5%] left-[-32.9%] h-[174%] w-[65.7%] max-w-none"
            />
            <img
              src={glowA}
              alt=""
              className="pointer-events-none absolute top-[8%] left-[-17.8%] h-[206%] w-[77.8%] max-w-none"
            />
            <img
              src={glowB}
              alt=""
              className="pointer-events-none absolute top-[-57.2%] left-[62.3%] h-[218%] w-[82.2%] max-w-none"
            />
            <img
              src={whyTexture}
              alt=""
              width={1020}
              height={1020}
              className="pointer-events-none absolute top-0 left-[0.12%] h-[264.86%] w-[99.88%] max-w-none object-cover mix-blend-soft-light"
            />
            <div className="relative flex flex-1 flex-col justify-between gap-6 p-5">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <p className="type-title leading-[1.25]"> CSD Corporate Consulting Private Limited</p>
              </div>
              <div className="flex flex-col gap-6 min-[640px]:flex-row min-[640px]:items-end min-[640px]:justify-between">
                <div>
                  <p className="text-[clamp(36px,3.33cqi,48px)] leading-[1.25]">Growth</p>
                  <p className="mt-1 text-base leading-5">Beyond compliance</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {highlights.map((item, index) => {
                    const isVisible = visibleCount > index
                    return (
                      <li
                        key={item}
                        className="flex min-h-5 items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                          transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                          pointerEvents: isVisible ? 'auto' : 'none',
                        }}
                      >
                        <span
                          className="relative size-5 shrink-0 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-20deg)',
                            transitionDelay: isVisible ? `${index * 80 + 100}ms` : '0ms',
                          }}
                        >
                          <img
                            src={iconCheck}
                            alt=""
                            width="19.9992"
                            height="19.0274"
                            className="absolute inset-x-0 top-[2.43%] h-[19.0274px] w-[19.9992px] max-w-none"
                          />
                        </span>
                        <span className="text-sm leading-[18px]">{item}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-2">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="@container flex flex-col justify-center gap-3 bg-white px-5 py-8 ring-1 ring-line ring-inset min-[768px]:min-h-[clamp(140px,12cqi,180px)]"
              >
                <p className="text-[clamp(32px,21.05cqi,48px)] leading-[1.25]">
                  <AnimatedCounter end={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-base leading-5">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
