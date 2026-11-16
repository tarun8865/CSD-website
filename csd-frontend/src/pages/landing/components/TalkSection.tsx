import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react'
import { sendContactEmail } from '../../../services/emailjs'
import talkWash from '../assets/talk-wash.png'
import talkDivider from '../assets/talk-divider.svg'
import talkLineLeft from '../assets/talk-line-left.svg'
import talkLineForm from '../assets/talk-line-form.svg'
import talkMail from '../assets/talk-mail.svg'
import talkPin from '../assets/talk-pin.svg'
import talkMobile from '../assets/talk-mobile.svg'
import talkLinkedin from '../assets/talk-linkedin.svg'
import talkChevron from '../assets/talk-chevron.svg'

const LINKEDIN_URL = 'https://www.linkedin.com/company/c-s-d-and-co-llp/posts/'

const services = [
  'CFO Advisory & Strategic Finance',
  'Transactions, Fundraising & Valuations',
  'Finance Operations & Accounting Advisory',
  'Tax & Regulatory Advisory',
  'Startup & International Business Advisory',
]

const fieldClass =
  'w-full border-0 bg-white px-4 text-base leading-5 text-ink outline-none placeholder:text-muted [font-variation-settings:\'GRAD\'_0,\'ROND\'_0,\'wdth\'_100]'

function SocialLink({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group grid size-[60px] shrink-0 cursor-pointer place-items-center border-0 bg-white no-underline transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:bg-aqua hover:shadow-[0_8px_24px_rgba(65,223,226,0.4)] active:translate-y-0 active:scale-95"
    >
      {children}
    </a>
  )
}

export default function TalkSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: '',
  })
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    )
    if (errorMessage) setErrorMessage(null)
  }

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([])
    } else {
      setSelectedServices([...services])
    }
    if (errorMessage) setErrorMessage(null)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Client-side validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).')
      return
    }

    const digitsOnly = formData.phone.replace(/\D/g, '')
    if (digitsOnly.length < 7 || digitsOnly.length > 18) {
      setErrorMessage('Please enter a valid phone number (between 7 and 18 digits).')
      return
    }

    if (selectedServices.length === 0) {
      setErrorMessage('Please select at least one service you are interested in.')
      return
    }

    if (!formData.requirements.trim() || formData.requirements.trim().length < 10) {
      setErrorMessage('Please describe your requirements (minimum 10 characters).')
      return
    }

    setStatus('submitting')

    const res = await sendContactEmail({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      services: selectedServices,
      requirements: formData.requirements.trim(),
    })

    if (res.success) {
      setStatus('success')
      setSuccessMessage(
        'Thank you for contacting CSD Corporate Consulting. Your enquiry has been submitted successfully.',
      )
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        requirements: '',
      })
      setSelectedServices([])
      setIsDropdownOpen(false)
    } else {
      setStatus('error')
      setErrorMessage(
        res.error?.message ||
          'Unable to submit your enquiry right now. Please try again later.',
      )
    }
  }

  return (
    <section
      id="contact"
      className="section-space scroll-mt-20 font-sans font-normal text-ink [font-variation-settings:'GRAD'_0,'ROND'_0,'wdth'_100]"
    >
      <div className="landing-container">
      <div className="flex h-[45px] items-center gap-2">
        <span className="h-[45px] w-0.5 shrink-0 bg-aqua" />
        <div>
          <p className="text-sm leading-[18px] text-aqua">005</p>
          <p className="mt-[7px] text-base leading-5 uppercase">let’s talk</p>
        </div>
      </div>
      <img
        src={talkDivider}
        alt=""
        width="1440"
        height="1"
        className="mt-4 block h-px w-full"
      />

      <h2 className="type-section m-0 mt-[27px] text-center font-display leading-[1.1042] font-light tracking-[0.0424em]">
        Have a Question, Challenge, or Idea?
      </h2>

      <div className="relative mt-stack">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -scale-y-100 rotate-180">
            <img src={talkWash} alt="" className="size-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.01)] backdrop-blur-[200px]" />
        </div>

        <div className="relative grid grid-cols-1 gap-12 px-[clamp(16px,1.67cqi,24px)] py-[clamp(28px,2.78cqi,40px)] min-[1024px]:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] min-[1024px]:gap-x-[clamp(32px,4cqi,56px)] min-[1024px]:px-[clamp(24px,2.78cqi,40px)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 min-[1024px]:h-[60px] min-[1024px]:flex-nowrap">
              <p className="type-block leading-[1.25]">Follow us</p>
              <div className="flex gap-[10px]">
                <SocialLink label="LinkedIn" href={LINKEDIN_URL}>
                  <img
                    src={talkLinkedin}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 transition-transform duration-300 ease-out group-hover:scale-110"
                  />
                </SocialLink>
              </div>
            </div>

            <img
              src={talkLineLeft}
              alt=""
              width="734"
              height="1"
              className="mt-8 block h-px w-full min-[1024px]:mt-[47px]"
            />

            <div className="mt-[39px] flex flex-col gap-8">
              <div className="flex items-start gap-3">
                <span className="mt-[3px] grid size-12 shrink-0 place-items-center rounded-full bg-white">
                  <img
                    src={talkPin}
                    alt=""
                    width="23.3899"
                    height="24.0004"
                    className="h-[24px] w-[23.3899px]"
                  />
                </span>
                <div>
                  <p className="type-title leading-[1.25]">Address</p>
                  <p className="mt-2 max-w-[420px] text-base leading-5 text-muted">
                    223-224, Vipul Trade Centre, Sector 48, Gurugram-122018, Haryana, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-[3px] grid size-12 shrink-0 place-items-center rounded-full bg-white">
                  <img src={talkMail} alt="" width={24} height={24} className="size-6" />
                </span>
                <div>
                  <p className="type-title leading-[1.25]">Email Address</p>
                  <p className="mt-2 text-base leading-5 text-muted">
                    <a href="mailto:mayank@csd-india.com" className="text-inherit no-underline">
                      mayank@csd-india.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-[3px] grid size-12 shrink-0 place-items-center rounded-full bg-white">
                  <img src={talkMobile} alt="" width={24} height={24} className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="type-title leading-[1.25]">Mobile Number</p>
                  <p className="mt-2 text-base leading-5 text-muted">
                    <a href="tel:+919958129516" className="text-inherit no-underline">
                      +91-9958129516
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative hidden self-stretch min-[1024px]:block"
            aria-hidden="true"
          >
            <span className="absolute inset-y-0 left-0 w-px bg-line" />
          </div>

          {status === 'success' ? (
            <div
              id="contact-form"
              className="scroll-mt-28 flex flex-col justify-center rounded-lg border border-aqua/40 bg-white/95 p-8 text-center backdrop-blur-md shadow-sm min-[1024px]:p-10"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-aqua/20 text-aqua">
                <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-2xl font-light tracking-wide text-ink min-[1024px]:text-3xl">
                Enquiry Received
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {successMessage}
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="h-control cursor-pointer border-0 bg-ink px-8 text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-aqua hover:text-ink active:scale-95"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              noValidate
              className="scroll-mt-28"
            >
              <p className="type-block leading-[1.25] tracking-[0.003em]">Let&apos;s Discuss Your Business Needs.</p>
              <p className="mt-3 text-base leading-5 text-muted">
                Fill out the form below, and our team will get back to you shortly.
              </p>
              <img
                src={talkLineForm}
                alt=""
                width="546"
                height="1"
                className="mt-10 block h-px w-full"
              />

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded border border-rose-300 bg-rose-50/95 p-4 text-sm text-rose-800"
                >
                  <svg className="mt-0.5 size-5 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="flex-1 leading-snug">{errorMessage}</span>
                </div>
              )}

              <div className="mt-[39px] grid grid-cols-1 gap-3 min-[1024px]:grid-cols-2 min-[1024px]:gap-x-4">
                <input
                  className={`${fieldClass} h-control`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={status === 'submitting'}
                  placeholder="Your Full Name"
                  required
                />
                <input
                  className={`${fieldClass} h-control`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={status === 'submitting'}
                  placeholder="Your Email Address"
                  required
                />
                <input
                  className={`${fieldClass} h-control`}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={status === 'submitting'}
                  placeholder="Your Phone Number"
                  required
                />
                <input
                  className={`${fieldClass} h-control`}
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={status === 'submitting'}
                  placeholder="Your Company Name"
                />
                <div ref={dropdownRef} className="relative min-[1024px]:col-span-2">
                  <button
                    type="button"
                    role="combobox"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                    aria-label="Select Services You're Interested In"
                    disabled={status === 'submitting'}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`${fieldClass} h-control flex items-center justify-between cursor-pointer text-left pr-4 ${
                      status === 'submitting' ? 'cursor-not-allowed opacity-75' : ''
                    } ${isDropdownOpen ? 'ring-2 ring-ink/15' : ''}`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden py-1">
                      {selectedServices.length === 0 ? (
                        <span className="truncate text-muted">
                          Select Services You’re Interested In (Multiple choice)
                        </span>
                      ) : (
                        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                          <span className="shrink-0 rounded bg-ink px-2 py-0.5 text-xs font-medium text-white">
                            {selectedServices.length} Selected
                          </span>
                          <span className="truncate text-xs sm:text-sm text-ink">
                            {selectedServices.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <img
                      src={talkChevron}
                      alt=""
                      width={24}
                      height={24}
                      className={`ml-2 size-6 shrink-0 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      role="listbox"
                      aria-multiselectable="true"
                      className="absolute top-full left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-line bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="flex items-center justify-between border-b border-line/60 bg-slate-50/70 px-4 py-2.5 text-xs">
                        <span className="font-medium text-muted">
                          {selectedServices.length === 0
                            ? 'Select all that apply'
                            : `${selectedServices.length} of ${services.length} selected`}
                        </span>
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="cursor-pointer font-medium text-ink underline transition-colors hover:text-aqua"
                        >
                          {selectedServices.length === services.length ? 'Clear All' : 'Select All'}
                        </button>
                      </div>

                      <div className="max-h-[260px] overflow-y-auto divide-y divide-line/40">
                        {services.map((service) => {
                          const isSelected = selectedServices.includes(service)
                          return (
                            <div
                              key={service}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => toggleService(service)}
                              className={`flex cursor-pointer select-none items-center gap-3 px-4 py-3 transition-colors ${
                                isSelected ? 'bg-aqua/10' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div
                                className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isSelected
                                    ? 'border-ink bg-ink text-aqua'
                                    : 'border-line bg-white'
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="size-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span
                                className={`text-sm leading-snug ${
                                  isSelected ? 'font-medium text-ink' : 'text-ink'
                                }`}
                              >
                                {service}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex items-center justify-between border-t border-line/60 bg-slate-50/70 px-4 py-2">
                        <span className="text-xs text-muted">
                          Click options to select/deselect
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(false)}
                          className="cursor-pointer rounded bg-ink px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-aqua hover:text-ink active:scale-95"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Removable Tag Pills below the input */}
                  {selectedServices.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {selectedServices.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center gap-1.5 rounded bg-white px-2.5 py-1 text-xs text-ink shadow-xs ring-1 ring-line/80"
                        >
                          <span className="size-1.5 rounded-full bg-aqua shrink-0" />
                          <span className="leading-none">{service}</span>
                          <button
                            type="button"
                            onClick={() => toggleService(service)}
                            className="ml-0.5 grid size-4 place-items-center rounded-full text-muted hover:bg-ink/10 hover:text-ink cursor-pointer"
                            aria-label={`Remove ${service}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  disabled={status === 'submitting'}
                  placeholder="Tell Us About Your Requirements"
                  className={`${fieldClass} h-[120px] resize-none pt-5 min-[1024px]:col-span-2`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`h-control mt-5 flex w-full cursor-pointer items-center justify-center border-0 bg-ink text-[clamp(15px,1.11cqi,16px)] leading-5 text-white uppercase transition-all duration-200 ${
                  status === 'submitting'
                    ? 'cursor-not-allowed opacity-75'
                    : 'hover:bg-aqua hover:text-ink hover:shadow-[0_8px_24px_rgba(65,223,226,0.35)] active:scale-[0.99]'
                }`}
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Submit Your Enquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      </div>
    </section>
  )
}
