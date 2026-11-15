import industryAi from '../assets/industry-ai.png'
import industryAiB from '../assets/industry-ai-b.png'
import industryVenture from '../assets/industry-venture.png'
import industryFintech from '../assets/industry-fintech.png'
import industryManufacturing from '../assets/industry-manufacturing.png'
import industrySaas from '../assets/industry-saas.png'
import industryFamily from '../assets/industry-family.png'
import industryDivider from '../assets/industry-divider.svg'

type Industry = {
  number: string
  title: string
  body: string
  images: string[]
  crop?: 'family'
}

const industries: Industry[] = [
  {
    number: '(01)',
    title: 'AI, Deep Tech & Emerging Technologies',
    body: 'Supporting innovation-driven businesses with financial expertise, strategic advisory, and regulatory compliance.',
    images: [industryAi, industryAiB],
  },
  {
    number: '(02)',
    title: 'Venture-Backed Startups',
    body: 'Helping high growth startups strengthen financial foundations, manage compliance, and prepare for investment.',
    images: [industryVenture],
  },
  {
    number: '(03)',
    title: 'Fintech & Financial Services',
    body: 'Enabling financial businesses to navigate complex regulations, strengthen controls, and maintain financial transparency.',
    images: [industryFintech],
  },
  {
    number: '(04)',
    title: 'Manufacturing & Industrial Enterprises',
    body: 'Helping industrial businesses improve financial oversight, manage tax obligations, and strengthen operational controls.',
    images: [industryManufacturing],
  },
  {
    number: '(05)',
    title: 'SaaS & Technology Businesses',
    body: 'Supporting technology companies with streamlined accounting, tax planning, and scalable financial processes.',
    images: [industrySaas],
  },
  {
    number: '(06)',
    title: 'Promoter-Led & Family-Owned Businesses /\nFamily Offices',
    body: 'Delivering tailored financial guidance to support governance, tax efficiency, and long term growth.',
    images: [industryFamily],
    crop: 'family',
  },
]

function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <article className="group flex h-full flex-col bg-white px-5 pt-5 pb-5">
      <div className="flex items-center gap-3 text-sm leading-[18px] text-muted">
        <span className="shrink-0">Industries We Serve</span>
        <span className="h-px min-w-0 flex-1 bg-line" />
        <span className="shrink-0">{industry.number}</span>
      </div>
      <div className="relative mt-5 aspect-[424/252] w-full overflow-hidden isolate">
        <div className="relative size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform-gpu group-hover:scale-110">
          {industry.images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className={
                industry.crop === 'family'
                  ? 'pointer-events-none absolute top-[0.19%] left-[-0.12%] h-[126.19%] w-full max-w-none'
                  : 'pointer-events-none absolute inset-0 size-full object-cover'
              }
            />
          ))}
        </div>
      </div>
      <h3 className="type-title mt-5 leading-[1.25]">
        {industry.title.split('\n').map((line, index) => (
          <span key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </h3>
      <p className="mt-3 text-base leading-5 text-muted">{industry.body}</p>
    </article>
  )
}

export default function IndustriesSection() {
  return (
    <section
      id="industries"
      className="section-space scroll-mt-20 font-sans font-normal text-ink [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]"
    >
      <div className="landing-container">
      <div className="flex h-[45px] items-center gap-2">
        <span className="h-[45px] w-0.5 shrink-0 bg-aqua" />
        <div>
          <p className="text-sm leading-[18px] text-aqua">004</p>
          <p className="mt-[7px] text-base leading-5 uppercase">Industries We Serve</p>
        </div>
      </div>
      <img
        src={industryDivider}
        alt=""
        width="1440"
        height="1"
        className="mt-4 block h-px w-full"
      />

      <div className="mt-[27px] text-center">
        <h2 className="type-section m-0 font-display leading-[1.1042] font-light tracking-[0.06em]">
          Sector-Specific Strategic Intelligence
        </h2>
        <p className="mx-auto mt-7 max-w-[min(100%,63.2cqi)] text-base leading-5 text-muted">
          We do not believe in generic solutions. Our advisory frameworks are deeply
          adapted to the specific regulatory, capital, and operational realities of your
          sector.
        </p>
      </div>

      <div className="mt-stack grid grid-cols-1 gap-6 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3">
        {industries.map((industry) => (
          <IndustryCard key={industry.number} industry={industry} />
        ))}
      </div>
      </div>
    </section>
  )
}
