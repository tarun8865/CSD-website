import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import logo from '../assets/logo-mark.svg'
import iconMail from '../assets/icon-mail.svg'
import iconCall from '../assets/icon-call.svg'
import dividerVertical from '../assets/divider-vertical.svg'
import dividerHorizontal from '../assets/divider-horizontal.svg'
import chevronDown from '../assets/chevron-down.svg'
import CtaButton from './CtaButton'

const contactLinkClass =
  "inline-flex items-center gap-2 text-sm leading-5 whitespace-nowrap text-white no-underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white min-[480px]:text-base [&_img]:block [&_img]:shrink-0"

const navButtonClass =
  "inline-flex cursor-pointer items-center border-0 bg-transparent p-0 font-sans text-base leading-5 font-normal whitespace-nowrap text-white no-underline [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"

const servicesList = [
  {
    id: 'service-cfo',
    title: 'CFO Advisory & Strategic Finance',
    subtitle: 'Finance leadership for growing & ambitious businesses.',
    hue: '#ff6f43',
  },
  {
    id: 'service-transactions',
    title: 'Transactions, Fundraising & Valuations',
    subtitle: 'Supporting capital raising, investments & strategic deals.',
    hue: '#e3c35c',
  },
  {
    id: 'service-finance',
    title: 'Finance Operations & Accounting Advisory',
    subtitle: 'Scalable & technology-enabled finance functions.',
    hue: '#759cff',
  },
  {
    id: 'service-tax',
    title: 'Tax & Regulatory Advisory',
    subtitle: "Navigating India's evolving tax & regulatory landscape.",
    hue: '#4cdbca',
  },
  {
    id: 'service-startup',
    title: 'Startup & International Business Advisory',
    subtitle: 'Global expansion, structuring & compliance support.',
    hue: '#db7008',
  },
]

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  const [isScrolled, setIsScrolled] = useState(false)
  const [floatingServicesOpen, setFloatingServicesOpen] = useState(false)
  const [floatingMobileMenuOpen, setFloatingMobileMenuOpen] = useState(false)
  const [floatingMobileServicesOpen, setFloatingMobileServicesOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollY > 90)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header>
      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
        <a className={contactLinkClass} href="mailto:mayank@csd-india.com">
          <img src={iconMail} alt="" width="20" height="20" />
          <span>mayank@csd-india.com</span>
        </a>
        <span className="hidden h-5 w-px shrink-0 items-center justify-center min-[480px]:flex" aria-hidden="true">
          <img
            src={dividerVertical}
            alt=""
            width="20"
            height="1"
            className="h-px w-5 rotate-90"
          />
        </span>
        <a className={contactLinkClass} href="tel:+919958129516">
          <img src={iconCall} alt="" width="20" height="20" />
          <span>+91 - 9958129516</span>
        </a>
      </div>
      <img
        className="mt-3 block h-px w-full"
        src={dividerHorizontal}
        alt=""
        width="1440"
        height="1"
      />
      <div className="mt-[11px] grid h-[clamp(52px,4.17cqi,60px)] grid-cols-[1fr_auto] items-center min-[1024px]:grid-cols-[1fr_auto_1fr]">
        <div className="flex w-[clamp(132px,11.8cqi,170px)] items-center justify-self-start">
          <img
            src={logo}
            alt="CSD"
            width="169.84"
            height="47.6248"
            className="block h-auto w-full"
          />
        </div>
        <nav
          className="hidden items-center justify-center justify-self-center gap-[clamp(16px,2.78cqi,40px)] min-[1024px]:flex"
          aria-label="Primary"
        >
          <a href="#about" className={navButtonClass}>
            About Us
          </a>

          {/* Services Dropdown Trigger & Floating Menu */}
          <div
            className="relative inline-flex items-center group/services"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={`${navButtonClass} gap-2`}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((open) => !open)}
            >
              <span>Services</span>
              <img
                src={chevronDown}
                alt=""
                width="16"
                height="16"
                className={`block size-4 shrink-0 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180' : 'group-hover/services:rotate-180'
                }`}
              />
            </button>

            {/* Dropdown Menu with hover bridge */}
            <div
              className={`absolute top-full left-0 pt-2 transition-all duration-200 z-50 ${
                servicesOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                  : 'opacity-0 -translate-y-2 pointer-events-none invisible group-hover/services:opacity-100 group-hover/services:translate-y-0 group-hover/services:pointer-events-auto group-hover/services:visible'
              }`}
            >
              {/* Invisible bridge to prevent pointer gap dismissal */}
              <div className="absolute -top-2 inset-x-0 h-2" />

              <div className="w-[270px] rounded-lg border border-line bg-white p-1.5 shadow-[0_12px_32px_rgba(4,21,56,0.08)] ring-1 ring-black/5">
                <div className="flex flex-col gap-0.5">
                  {servicesList.map((service) => (
                    <a
                      key={service.id}
                      href={`#${service.id}`}
                      onClick={() => setServicesOpen(false)}
                      className="group/item flex items-center justify-between gap-2.5 rounded-md px-3 py-2.5 text-left text-[13.5px] leading-5 font-normal text-ink no-underline border-l-2 border-transparent transition-all duration-150 hover:border-aqua hover:bg-gradient-to-r hover:from-[#eef7ff] hover:via-[#e6f2fe] hover:to-[#eef7ff] focus-visible:outline-2 focus-visible:outline-ink"
                    >
                      <span className="flex-1 transition-colors group-hover/item:text-ink font-medium">
                        {service.title}
                      </span>
                      <span className="text-muted/40 text-xs transition-transform duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-aqua shrink-0">
                        &rarr;
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <a href="#industries" className={navButtonClass}>
            Industries
          </a>
        </nav>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-white hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white min-[1024px]:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <div className="flex h-4 w-5 flex-col justify-between" aria-hidden="true">
              <span
                className={`block h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-in-out ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-full bg-white transition-all duration-200 ease-in-out ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-in-out ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
          <div className="hidden min-[1024px]:block">
            <CtaButton
              label="get in touch"
              variant="light"
              href="#contact-form"
              pill
              size="sm"
            />
          </div>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" className="flex flex-col items-start gap-1 py-4 min-[1024px]:hidden [&_button]:min-h-11 [&_a]:min-h-11" aria-label="Primary">
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className={navButtonClass}
          >
            About Us
          </a>
          <div className="w-full">
            <button
              type="button"
              className={`${navButtonClass} w-full justify-between gap-2`}
              aria-expanded={mobileServicesOpen}
              onClick={() => setMobileServicesOpen((open) => !open)}
            >
              <span>Services</span>
              <img
                src={chevronDown}
                alt=""
                width="16"
                height="16"
                className={`block size-4 shrink-0 transition-transform duration-200 ${
                  mobileServicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileServicesOpen && (
              <div className="mt-2 mb-2 flex flex-col gap-0.5 rounded-lg border border-line bg-white p-1.5 shadow-md">
                {servicesList.map((service) => (
                  <a
                    key={service.id}
                    href={`#${service.id}`}
                    onClick={() => {
                      setMenuOpen(false)
                      setMobileServicesOpen(false)
                    }}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-ink no-underline border-l-2 border-transparent hover:border-aqua hover:bg-gradient-to-r hover:from-[#eef7ff] hover:via-[#e6f2fe] hover:to-[#eef7ff] rounded-md transition-all"
                  >
                    <span>{service.title}</span>
                    <span className="text-xs text-muted/40">&rarr;</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a
            href="#industries"
            onClick={() => setMenuOpen(false)}
            className={navButtonClass}
          >
            Industries
          </a>
          <CtaButton
            label="get in touch"
            variant="light"
            className="mt-2"
            href="#contact-form"
            onClick={() => setMenuOpen(false)}
            pill
            size="sm"
          />
        </nav>
      )}

      {/* Floating Circular / Pill Navbar for Scrolling */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { y: -50, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { y: -50, opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[860px]"
              >
                <div className="relative flex h-[52px] sm:h-[58px] items-center justify-between gap-3 sm:gap-6 rounded-full border border-white/20 bg-[#041538]/90 px-4 sm:px-6 shadow-[0_16px_36px_rgba(4,21,56,0.35),0_1px_2px_rgba(255,255,255,0.12)_inset] backdrop-blur-xl">
                  {/* Left: CSD Logo */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      window.dispatchEvent(
                        new CustomEvent('csd:scroll-top', {
                          detail: { behavior: 'auto' },
                        }),
                      )
                    }}
                    className="flex shrink-0 items-center transition-opacity hover:opacity-85"
                    aria-label="CSD Consulting - Back to top"
                  >
                    <img
                      src={logo}
                      alt="CSD"
                      width="120"
                      height="34"
                      className="block h-[22px] sm:h-[28px] w-auto"
                    />
                  </a>

                  {/* Center: Three Nav Links */}
                  <nav
                    className="hidden md:flex items-center gap-6 lg:gap-8"
                    aria-label="Sticky Navigation"
                  >
                    <a
                      href="#about"
                      className="font-sans text-[13.5px] sm:text-sm font-normal text-white/90 no-underline transition-colors hover:text-aqua"
                    >
                      About Us
                    </a>

                    {/* Services Dropdown */}
                    <div
                      className="relative inline-flex items-center group/float-services"
                      onMouseEnter={() => setFloatingServicesOpen(true)}
                      onMouseLeave={() => setFloatingServicesOpen(false)}
                    >
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[13.5px] sm:text-sm font-normal text-white/90 no-underline transition-colors hover:text-aqua"
                        aria-expanded={floatingServicesOpen}
                        onClick={() => setFloatingServicesOpen((open) => !open)}
                      >
                        <span>Services</span>
                        <img
                          src={chevronDown}
                          alt=""
                          width="14"
                          height="14"
                          className={`block size-3.5 shrink-0 transition-transform duration-200 ${
                            floatingServicesOpen
                              ? 'rotate-180'
                              : 'group-hover/float-services:rotate-180'
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu with hover bridge */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2.5 transition-all duration-200 z-50 ${
                          floatingServicesOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                            : 'opacity-0 -translate-y-2 pointer-events-none invisible group-hover/float-services:opacity-100 group-hover/float-services:translate-y-0 group-hover/float-services:pointer-events-auto group-hover/float-services:visible'
                        }`}
                      >
                        <div className="absolute -top-2.5 inset-x-0 h-2.5" />
                        <div className="w-[270px] rounded-xl border border-line bg-white p-1.5 shadow-[0_16px_36px_rgba(4,21,56,0.14)] ring-1 ring-black/5">
                          <div className="flex flex-col gap-0.5">
                            {servicesList.map((service) => (
                              <a
                                key={service.id}
                                href={`#${service.id}`}
                                onClick={() => setFloatingServicesOpen(false)}
                                className="group/item flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] leading-5 font-normal text-ink no-underline border-l-2 border-transparent transition-all duration-150 hover:border-aqua hover:bg-gradient-to-r hover:from-[#eef7ff] hover:via-[#e6f2fe] hover:to-[#eef7ff]"
                              >
                                <span className="flex-1 font-medium transition-colors group-hover/item:text-ink">
                                  {service.title}
                                </span>
                                <span className="shrink-0 text-xs text-muted/40 transition-transform duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-aqua">
                                  &rarr;
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <a
                      href="#industries"
                      className="font-sans text-[13.5px] sm:text-sm font-normal text-white/90 no-underline transition-colors hover:text-aqua"
                    >
                      Industries
                    </a>
                  </nav>

                  {/* Right: CTA button & Mobile toggle */}
                  <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center">
                      <CtaButton
                        label="get in touch"
                        variant="light"
                        href="#contact-form"
                        pill
                        size="sm"
                        className="h-[36px] sm:h-[40px] text-xs sm:text-[13px] pl-3.5 sm:pl-4 pr-1 gap-2 shrink-0"
                      />
                    </div>

                    {/* Mobile Hamburger toggle */}
                    <button
                      type="button"
                      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:hidden"
                      aria-expanded={floatingMobileMenuOpen}
                      aria-label={floatingMobileMenuOpen ? 'Close menu' : 'Open menu'}
                      onClick={() => setFloatingMobileMenuOpen((open) => !open)}
                    >
                      <div className="flex h-3.5 w-4 flex-col justify-between" aria-hidden="true">
                        <span
                          className={`block h-0.5 w-full rounded-full bg-white transition-all duration-300 ${
                            floatingMobileMenuOpen ? 'translate-y-[6px] rotate-45' : ''
                          }`}
                        />
                        <span
                          className={`block h-0.5 w-full rounded-full bg-white transition-all duration-200 ${
                            floatingMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                        <span
                          className={`block h-0.5 w-full rounded-full bg-white transition-all duration-300 ${
                            floatingMobileMenuOpen ? '-translate-y-[6px] -rotate-45' : ''
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Floating Mobile Dropdown Menu */}
                {floatingMobileMenuOpen && (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#041538]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
                    <nav className="flex flex-col gap-1 text-sm" aria-label="Mobile Floating Navigation">
                      <a
                        href="#about"
                        onClick={() => setFloatingMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 font-normal text-white no-underline transition-colors hover:bg-white/10 hover:text-aqua"
                      >
                        About Us
                      </a>
                      <div>
                        <button
                          type="button"
                          onClick={() => setFloatingMobileServicesOpen((open) => !open)}
                          className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 font-normal text-white transition-colors hover:bg-white/10 hover:text-aqua"
                        >
                          <span>Services</span>
                          <img
                            src={chevronDown}
                            alt=""
                            width="14"
                            height="14"
                            className={`size-3.5 transition-transform duration-200 ${
                              floatingMobileServicesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {floatingMobileServicesOpen && (
                          <div className="mt-1 mb-1 ml-3 flex flex-col gap-0.5 border-l border-white/20 pl-2">
                            {servicesList.map((service) => (
                              <a
                                key={service.id}
                                href={`#${service.id}`}
                                onClick={() => {
                                  setFloatingMobileMenuOpen(false)
                                  setFloatingMobileServicesOpen(false)
                                }}
                                className="rounded-md px-2.5 py-2 text-xs text-white/80 no-underline transition-colors hover:text-aqua"
                              >
                                {service.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <a
                        href="#industries"
                        onClick={() => setFloatingMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 font-normal text-white no-underline transition-colors hover:bg-white/10 hover:text-aqua"
                      >
                        Industries
                      </a>
                      <div className="pt-2 flex justify-start">
                        <CtaButton
                          label="get in touch"
                          variant="light"
                          href="#contact-form"
                          onClick={() => setFloatingMobileMenuOpen(false)}
                          pill
                          size="sm"
                        />
                      </div>
                    </nav>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  )
}
