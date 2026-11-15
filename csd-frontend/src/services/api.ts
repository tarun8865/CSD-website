export interface ContactPayload {
  name: string
  email: string
  phone: string
  company?: string
  services: string[]
  requirements: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// In Vite development, relative URLs hit the Vite dev proxy to localhost:8080.
// In production or when VITE_API_URL is specified, it uses the provided absolute URL.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

/**
 * Submits the Contact Us enquiry form to the CSD backend.
 */
export async function submitContactForm(
  payload: ContactPayload,
): Promise<ApiResponse<{ message: string }>> {
  const url = `${API_BASE_URL}/api/contact`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data: ApiResponse<{ message: string }> = await response.json().catch(() => ({
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: 'Unexpected response from server. Please try again.',
      },
    }))

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: {
          code: data.error?.code || `HTTP_${response.status}`,
          message:
            data.error?.message ||
            'Unable to submit your enquiry at this time. Please try again or email us directly at mayank@csd-india.com.',
        },
      }
    }

    return data
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Network connection error. Please ensure the backend server is running and try again.'

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message:
          errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')
            ? 'Unable to reach the server. Please check your connection or try again shortly.'
            : errorMessage,
      },
    }
  }
}

/**
 * Health check helper to verify backend connectivity.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}
