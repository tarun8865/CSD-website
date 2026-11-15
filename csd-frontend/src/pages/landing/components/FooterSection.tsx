import footerBg from '../assets/footer-bg.png'
import footerWordmark from '../assets/footer-wordmark.svg'
import footerLineV from '../assets/footer-line-v.svg'
import footerLineH from '../assets/footer-line-h.svg'
import footerLineCol from '../assets/footer-line-col.svg'
import footerLineAbout from '../assets/footer-line-about.svg'
import footerPin from '../assets/footer-pin.svg'
import footerMail from '../assets/footer-mail.svg'
import footerCall from '../assets/footer-call.svg'
import footerLinkedin from '../assets/footer-linkedin.svg'

const LINKEDIN_URL = 'https://www.linkedin.com/company/c-s-d-and-co-llp/posts/'

const quickLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Contact Us', href: '#contact-form' },
]

const services = [
  { label: 'CFO Advisory & Strategic Finance', href: '#service-cfo' },
  { label: 'Transactions, Fundraising & Valuations', href: '#service-transactions' },
  { label: 'Finance Operations & Accounting Advisory', href: '#service-finance' },
  { label: 'Tax & Regulatory Advisory', href: '#service-tax' },
  { label: 'Startup & International Business Advisory', href: '#service-startup' },
]

const textLink =
  'cursor-pointer border-0 bg-transparent p-0 text-left font-inherit text-base leading-5 text-white no-underline transition-colors hover:text-aqua'

function ColumnRule() {
  return (
    <div
      className="hidden min-[1100px]:col-start-2 min-[1100px]:row-span-2 min-[1100px]:flex min-[1100px]:justify-center"
      aria-hidden="true"
    >
      <img src={footerLineV} alt="" width="482" height="1" className="h-full w-px" />
    </div>
  )
}

function Heading({ children }: { children: string }) {
  return <h2 className="type-title m-0 leading-[1.25] text-aqua uppercase">{children}</h2>
}

function Hairline({ src, width }: { src: string; width: string }) {
  return <img src={src} alt="" width={width} height="1" className="mt-5 block h-px w-full" />
}

export default function FooterSection() {
  return (
    <footer className="section-space relative w-full overflow-hidden bg-ink font-sans font-normal text-white [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]">
      <img
        src={footerBg}
        alt=""
        width="1920"
        height="1222"
        className="pointer-events-none absolute inset-0 h-full w-full max-w-none"
      />

      <div className="landing-container relative pt-20">
        <div className="grid grid-cols-1 gap-12 min-[768px]:grid-cols-2 min-[768px]:gap-x-10 min-[1100px]:grid-cols-[464fr_108fr_380fr_108fr_380fr] min-[1100px]:grid-rows-[auto_auto] min-[1100px]:gap-x-0 min-[1100px]:gap-y-10">
          <div className="min-[768px]:max-[1099px]:col-span-2 min-[1100px]:col-start-1 min-[1100px]:row-span-2">
            <h2 className="type-block m-0 leading-[1.25]">About Company</h2>
            <p className="mt-4 text-base leading-5 text-white/60">
              Empowering businesses with trusted financial expertise and professional guidance. We
              deliver audit, taxation, accounting, and advisory solutions that simplify complexity,
              strengthen compliance, and support sustainable growth.
            </p>
            <img
              src={footerLineAbout}
              alt=""
              width="464"
              height="1"
              className="mt-10 block h-px w-full"
            />
            <div className="mt-[39px] flex flex-wrap gap-[10px]">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group grid size-[60px] cursor-pointer place-items-center rounded-full border border-white/20 bg-transparent p-0 no-underline transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-aqua hover:bg-aqua hover:shadow-[0_8px_24px_rgba(65,223,226,0.35)] active:translate-y-0 active:scale-95"
              >
                <img
                  src={footerLinkedin}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:brightness-0"
                />
              </a>
            </div>
          </div>

          <ColumnRule />

          <div className="min-[1100px]:col-start-3 min-[1100px]:row-start-1">
            <Heading>Quick Links</Heading>
            <Hairline src={footerLineCol} width="380" />
            <div className="mt-[19px] flex flex-col gap-4">
              {quickLinks.map((link) => (
                <a key={link.href} href={link.href} className={textLink}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div
            className="hidden min-[1100px]:col-start-4 min-[1100px]:row-span-2 min-[1100px]:flex min-[1100px]:justify-center"
            aria-hidden="true"
          >
            <img src={footerLineV} alt="" width="482" height="1" className="h-full w-px" />
          </div>

          <div className="min-[1100px]:col-start-5 min-[1100px]:row-start-1">
            <Heading>Services</Heading>
            <Hairline src={footerLineCol} width="380" />
            <div className="mt-[19px] flex flex-col gap-4">
              {services.map((service) => (
                <a key={service.href} href={service.href} className={textLink}>
                  {service.label}
                </a>
              ))}
            </div>
          </div>

          <div className="min-[1100px]:col-start-3 min-[1100px]:row-start-2">
            <Heading>location</Heading>
            <Hairline src={footerLineCol} width="380" />
            <div className="mt-[19px] flex items-center gap-1 text-sm leading-[18px] text-white/60">
              <span className="grid size-4 place-items-center">
                <img
                  src={footerPin}
                  alt=""
                  width="11.3418"
                  height="13.7777"
                  className="h-[13.7777px] w-[11.3418px]"
                />
              </span>
              Address :
            </div>
            <p className="mt-2 text-base leading-5">
              223-224, Vipul Trade Centre, Sector 48, Gurugram-122018, Haryana, India
            </p>
          </div>

          <div className="min-[1100px]:col-start-5 min-[1100px]:row-start-2">
            <Heading>get in touch</Heading>
            <Hairline src={footerLineCol} width="380" />
            <div className="mt-[19px] flex items-center gap-1 text-sm leading-[18px] text-white/60">
              <img src={footerMail} alt="" width={16} height={16} className="size-4" />
              Email Us :
            </div>
            <p className="mt-2 text-base leading-5">
              <a href="mailto:mayank@csd-india.com" className="text-inherit no-underline">
                mayank@csd-india.com
              </a>
            </p>
            <div className="mt-5 flex items-center gap-1 text-sm leading-[18px] text-white/60">
              <img src={footerCall} alt="" width={16} height={16} className="size-4" />
              Call Us :
            </div>
            <p className="mt-2 text-base leading-5">
              <a href="tel:+919958129516" className="text-inherit no-underline">
                +91-9958129516
              </a>
            </p>
          </div>
        </div>

        <img
          src={footerLineH}
          alt=""
          width="1440"
          height="1"
          className="mt-[60px] block h-px w-full"
        />
        <img
          src={footerWordmark}
          alt=""
          width="1440"
          height="403.792"
          className="mt-[59px] block h-auto w-full"
        />
        <img
          src={footerLineH}
          alt=""
          width="1440"
          height="1"
          className="mt-[60px] block h-px w-full"
        />
        <div className="mt-[27px] flex flex-col gap-4 pb-7 text-base leading-5 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
          <p className="text-white/70">
            © 2026 <span className="font-semibold text-white">CSD Corporate Consulting</span>. All rights
            reserved.
          </p>
          <p>
            <button type="button" className={textLink}>
              Privacy Policy
            </button>
            {' | '}
            <button type="button" className={textLink}>
              Terms of Service
            </button>
            {' | '}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textLink} text-inherit`}
            >
              LinkedIn Page
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
