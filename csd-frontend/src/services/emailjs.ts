import emailjs from '@emailjs/browser'

export type ContactEmailPayload = {
  name: string
  email: string
  phone: string
  company?: string
  services: string[]
  requirements: string
}

export type ContactEmailResult = {
  success: boolean
  error?: {
    code: string
    message: string
  }
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

function buildMessage(payload: ContactEmailPayload): string {
  const company = payload.company?.trim() || 'Not provided'
  const services =
    payload.services.length > 0 ? payload.services.join(', ') : 'No services selected'

  return [
    `Company: ${company}`,
    `Services: ${services}`,
    '',
    'Requirements:',
    payload.requirements.trim(),
  ].join('\n')
}

/**
 * Sends a Contact Us enquiry via EmailJS.
 * Template variables: name, email, phone, message (Reply-To uses {{email}}).
 */
export async function sendContactEmail(
  payload: ContactEmailPayload,
): Promise<ContactEmailResult> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return {
      success: false,
      error: {
        code: 'EMAILJS_CONFIG_MISSING',
        message: 'Unable to submit your enquiry right now. Please try again later.',
      },
    }
  }

  const name = payload.name.trim()
  const email = payload.email.trim()
  const phone = payload.phone.trim()
  const company = payload.company?.trim() || 'Not provided'
  const services =
    payload.services.length > 0 ? payload.services.join(', ') : 'No services selected'
  const requirements = payload.requirements.trim()
  const submittedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  })

  // Core vars required by the EmailJS template (name, email, phone, message).
  // Extra vars are harmless if unused, and support the richer HTML body if configured.
  const templateParams = {
    name,
    email,
    phone,
    message: buildMessage(payload),
    company,
    services,
    requirements,
    submitted_at: submittedAt,
    reply_subject: `Re: New Website Enquiry: ${name}`,
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    })

    return { success: true }
  } catch (err) {
    console.error('EmailJS send failed:', err)
    return {
      success: false,
      error: {
        code: 'EMAILJS_SEND_FAILED',
        message: 'Unable to submit your enquiry right now. Please try again later.',
      },
    }
  }
}
