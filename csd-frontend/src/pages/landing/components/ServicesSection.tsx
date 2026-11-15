import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import serviceWash from '../assets/service-wash.png'
import serviceCfo from '../assets/service-cfo.png'
import serviceCfoMask from '../assets/service-cfo-mask.png'
import serviceTransactions from '../assets/service-transactions.png'
import serviceTransactionsMask from '../assets/service-transactions-mask.png'
import serviceFinance from '../assets/service-finance.png'
import serviceFinanceMask from '../assets/service-finance-mask.png'
import serviceTax from '../assets/service-tax.png'
import serviceTaxMask from '../assets/service-tax-mask.png'
import serviceStartup from '../assets/service-startup.png'
import serviceStartupMask from '../assets/service-startup-mask.png'
import serviceDivider from '../assets/service-divider.svg'
import serviceCheck from '../assets/service-check.svg'

type Service = {
  id: string
  title: string
  subtitle: string
  body: string
  hue: string
  art: string
  mask: string
  artWidth: string
  artHeight: string
  left: string[]
  right: string[]
}

const services: Service[] = [
  {
    id: 'service-cfo',
    title: 'CFO Advisory & Strategic Finance',
    subtitle: 'Finance leadership for growing and ambitious businesses.',
    body: 'Growing a business requires more than accurate bookkeeping; it demands predictive financial modeling and strategic foresight. Our Fractional CFOs embed within your leadership team to drive capital allocation, optimize cash flow, and deliver board-level clarity.',
    hue: '#ff6f43',
    art: serviceCfo,
    mask: serviceCfoMask,
    artWidth: 'w-[83.333%]',
    artHeight: 'h-[55.556%]',
    left: [
      'Budgeting, Forecasting & Financial Modelling',
      'Cash Flow & Working Capital Management',
      'Business Strategy & Financial Decision Support',
      'Financial Governance & Internal Controls',
    ],
    right: [
      'Budgeting, Forecasting & Financial Modelling',
      'Management Information Systems (MIS) & KPI Reporting',
      'Board & Investor Reporting',
      'Finance Function Transformation',
    ],
  },
  {
    id: 'service-transactions',
    title: 'Transactions, Fundraising & Valuations',
    subtitle:
      'Supporting businesses through capital raising, investments, and strategic transactions.',
    body: 'Capital is the fuel for your next phase of growth. We guide founders, investors, and boards through the intricate mechanics of capital raising, strategic acquisitions, and liquidity events, ensuring your valuation is defended and your terms are optimized.',
    hue: '#e3c35c',
    art: serviceTransactions,
    mask: serviceTransactionsMask,
    artWidth: 'w-[69.444%]',
    artHeight: 'h-[63.492%]',
    left: [
      'Startup Fundraising Advisory',
      'Investor Readiness & Due Diligence',
      'Business Valuation & Financial Modelling',
      'Investor Relations & Stakeholder Reporting',
    ],
    right: [
      'Equity & Debt Financing Support',
      'Financial Due Diligence - Buy-side & Sell-side',
      'Cap Table Management & ESOP Advisory',
      'Term Sheet & Investment Documentation Support',
    ],
  },
  {
    id: 'service-finance',
    title: 'Finance Operations & Accounting Advisory',
    subtitle: 'Building efficient, scalable, and technology-enabled finance functions.',
    body: 'A scalable business breaks down if its underlying finance operations cannot keep pace. We restructure, automate, and manage your end-to-end finance function, turning a traditional cost center into a streamlined, data-generating asset.',
    hue: '#759cff',
    art: serviceFinance,
    mask: serviceFinanceMask,
    artWidth: 'w-[69.444%]',
    artHeight: 'h-[63.492%]',
    left: [
      'End-to-End Accounting & Bookkeeping',
      'Financial Reporting & Month-End Closures',
      'Reconciliations & Financial Controls',
      'Accounting Process Automation',
    ],
    right: [
      'Financial Statement Preparation & Consolidation',
      'Accounts Payable & Receivable Management',
      'Payroll & Employee Compliance',
      'Accounting Systems Implementation & Optimisation',
    ],
  },
  {
    id: 'service-tax',
    title: 'Tax & Regulatory Advisory',
    subtitle: "Helping businesses navigate India's evolving tax and regulatory environment.",
    body: "In India's highly dynamic regulatory environment, reactive compliance is a risk. We proactively structure your operations, cross-border transactions, and tax frameworks to minimize exposure and maximize operational efficiency.",
    hue: '#4cdbca',
    art: serviceTax,
    mask: serviceTaxMask,
    artWidth: 'w-[83.135%]',
    artHeight: 'h-[63.492%]',
    left: [
      'Corporate & Individual Tax Advisory',
      'GST Advisory, Compliance & Litigation',
      'Tax Structuring & Transaction Tax Advisory',
      'Corporate & Regulatory Compliance',
    ],
    right: [
      'Direct Tax Compliance & Litigation Support',
      'Withholding Tax & Foreign Remittances',
      'Tax Assessments, Appeals & Representation',
      'Tax Due Diligence',
    ],
  },
  {
    id: 'service-startup',
    title: 'Startup & International Business Advisory',
    subtitle:
      'Supporting entrepreneurs, technology companies, and global businesses throughout their growth journey.',
    body: 'Whether you are a deep-tech founder incorporating in India or a global enterprise establishing a subsidiary, we navigate the bureaucratic complexities so you can focus on market penetration and product development.',
    hue: '#db7008',
    art: serviceStartup,
    mask: serviceStartupMask,
    artWidth: 'w-[83.135%]',
    artHeight: 'h-[63.492%]',
    left: [
      'Startup Incorporation & Business Structuring',
      'ESOP Structuring & Administration',
      'India Market Entry & Subsidiary Setup',
    ],
    right: [
      'Startup Finance & Compliance Management',
      'Corporate Governance & Secretarial Compliance',
    ],
  },
]


function Bullet({ label }: { label: string }) {
  return (
    <li className="flex min-h-5 items-start gap-2">
      <span className="relative mt-px size-5 shrink-0">
        <img
          src={serviceCheck}
          alt=""
          width="19.9992"
          height="19.0274"
          className="absolute inset-x-0 top-[2.43%] h-[19.0274px] w-[19.9992px] max-w-none"
        />
      </span>
      <span className="min-w-0 flex-1 text-sm leading-[18px] text-muted">{label}</span>
    </li>
  )
}

function ServiceCard({
  service,
  reducedMotion = false,
}: {
  service: Service
  reducedMotion?: boolean
}) {
  return (
    <article
      className="group relative isolate overflow-hidden rounded-2xl border border-line/90 bg-white shadow-[0_10px_30px_-5px_rgba(4,21,56,0.06),0_20px_40px_-15px_rgba(4,21,56,0.08)] transition-all duration-300 min-[768px]:rounded-3xl hover:shadow-[0_14px_40px_-4px_rgba(4,21,56,0.1),0_24px_50px_-12px_rgba(4,21,56,0.12)]"
    >
      {/* Brand accent indicator line at the top of the card */}
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: service.hue }}
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 min-[768px]:grid-cols-[minmax(0,35cqi)_minmax(0,1fr)] min-[768px]:gap-x-[clamp(24px,2.78cqi,40px)] min-[768px]:p-8 min-[1024px]:p-10">
        <div className="relative isolate mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-xl min-[480px]:max-w-[320px] min-[768px]:max-w-[504px] min-[768px]:self-start min-[768px]:rounded-2xl">
          {/* Static wash background */}
          <img
            src={serviceWash}
            alt=""
            width={1024}
            height={683}
            className="pointer-events-none absolute inset-0 size-full max-w-none object-fill object-bottom"
          />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-hue"
            style={{ backgroundColor: service.hue }}
          />

          {/* SVG / Artwork on top of the bg: Single, continuous smooth zoom on card entry */}
          <motion.div
            initial={reducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.72, opacity: 0.88 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ amount: 0.25, once: false }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1], // Silky smooth easeOutExpo
            }}
            className={`pointer-events-none absolute top-1/2 left-1/2 ${service.artWidth} ${service.artHeight} -translate-x-1/2 -translate-y-1/2 will-change-transform transform-gpu`}
            style={{ transformOrigin: 'center center' }}
          >
            <div className="relative size-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106">
              <img
                src={service.art}
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-hue"
                style={{
                  backgroundColor: service.hue,
                  maskImage: `url(${service.mask})`,
                  WebkitMaskImage: `url(${service.mask})`,
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
            </div>
          </motion.div>
        </div>

        <div className="flex min-w-0 flex-col justify-start min-[768px]:py-2">
          <h3 className="type-service m-0 font-display leading-[1.09375] font-light tracking-[0.058em]">
            {service.title}
          </h3>
          <p className="type-title mt-4 max-w-[848px] font-display leading-[1.1] font-light tracking-[0.04em] italic">
            {service.subtitle.split('\n').map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          <p className="mt-5 max-w-[848px] text-base leading-5 text-muted">{service.body}</p>
          <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-[minmax(0,26.4cqi)_minmax(0,26.4cqi)]">
            <ul className="flex flex-col gap-3">
              {service.left.map((item) => (
                <Bullet key={item} label={item} />
              ))}
            </ul>
            <ul className="flex flex-col gap-3">
              {service.right.map((item) => (
                <Bullet key={`${service.title}-${item}`} label={item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()

    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

type StackingCardItemProps = {
  service: Service
  index: number
  total: number
  progress: MotionValue<number>
  reducedMotion: boolean
  isDesktop: boolean
}

function StackingCardItem({
  service,
  index,
  total,
  progress,
  reducedMotion,
  isDesktop,
}: StackingCardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Total cards = 5. Transitions = 4.
  // Each transition gets 0.20 of the progress; the final 0.20 (0.80 - 1.00) is the hold zone.
  const step = 0.2
  const scaleStep = 0.035
  const progressPoints = [0, 0.2, 0.4, 0.6, 0.8, 1.0]

  const maxCardsAbove = total - 1 - index

  const scalePoints = progressPoints.map((p) => {
    // Mobile: no sticky stack / scale — cards must stay fully readable
    if (reducedMotion || !isDesktop) return 1
    if (p <= index * step) return 1
    const rawCardsAbove = (p - index * step) / step
    const cardsAbove = Math.min(maxCardsAbove, rawCardsAbove)
    return Number((1 - cardsAbove * scaleStep).toFixed(3))
  })

  const scale = useTransform(progress, progressPoints, scalePoints)

  const isLast = index === total - 1
  const isPenultimate = index === total - 2

  // Mobile: normal document flow so tall cards never clip bullet points.
  // Desktop: sticky stack with spacers + last-card overlap.
  // Hash targets live on in-flow anchors (not sticky cards) so header links
  // can navigate to a card above the one currently stuck in the stack.
  if (!isDesktop) {
    return (
      <div
        id={service.id}
        data-service-stack={service.id}
        data-service-index={index}
        className="relative mb-6 scroll-mt-28 last:mb-0"
      >
        <ServiceCard service={service} reducedMotion={reducedMotion} />
      </div>
    )
  }

  return (
    <>
      {/* In-flow hash target; SmoothScroll maps index → stack progress for exact view */}
      <div
        id={service.id}
        data-service-stack={service.id}
        data-service-index={index}
        className="pointer-events-none relative z-0 h-0 scroll-mt-[72px]"
        aria-hidden="true"
      />
      <div
        className="sticky top-[72px]"
        data-service-sticky={service.id}
        style={{
          zIndex: 10 + index,
          marginTop: isLast ? 'clamp(-360px, -48vh, -220px)' : undefined,
        }}
      >
        <motion.div
          ref={cardRef}
          style={{
            scale: reducedMotion ? 1 : scale,
            transformOrigin: 'center top',
          }}
        >
          <ServiceCard
            service={service}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </div>
      {isPenultimate ? (
        <div
          className="pointer-events-none h-[clamp(320px,52vh,480px)]"
          aria-hidden="true"
        />
      ) : !isLast ? (
        <div
          className="pointer-events-none h-[clamp(240px,40vh,400px)]"
          aria-hidden="true"
        />
      ) : (
        <div
          className="pointer-events-none h-[clamp(120px,24vh,260px)]"
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 60px', 'end end'],
  })

  return (
    <section
      id="services"
      className="section-space-lg font-sans font-normal text-ink scroll-mt-20 [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]"
    >
      <div className="landing-container">
        <div className="flex h-[45px] items-center gap-2">
          <span className="h-[45px] w-0.5 shrink-0 bg-aqua" />
          <div>
            <p className="text-sm leading-[18px] text-aqua">003</p>
            <p className="mt-[7px] text-base leading-5 uppercase">What we do</p>
          </div>
        </div>
        <img
          src={serviceDivider}
          alt=""
          width="1440"
          height="1"
          className="mt-4 block h-px w-full"
        />

        <div className="mt-[27px] grid items-end gap-8 min-[1024px]:grid-cols-[708fr_586fr] min-[1024px]:gap-x-[clamp(72px,10.14cqi,146px)]">
          <h2 className="type-section measure-heading m-0 font-display leading-[1.25] font-light tracking-[0.074em]">
            Our Services
          </h2>
          <p className="max-w-[min(100%,40.7cqi)] text-base leading-5 text-muted min-[1024px]:justify-self-end">
            We align deep domain expertise with your strategic objectives, delivering
            institutional-grade financial and regulatory solutions.
          </p>
        </div>

        {/* Scroll-driven Stacking Cards Deck across all viewports */}
        <div
          ref={containerRef}
          data-services-stack
          data-services-count={services.length}
          className="relative mt-stack pb-[clamp(80px,12vh,160px)]"
        >
          {services.map((service, index) => (
            <StackingCardItem
              key={service.id}
              service={service}
              index={index}
              total={services.length}
              progress={scrollYProgress}
              reducedMotion={Boolean(shouldReduceMotion)}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
