# CSD Backend

Production-ready Go backend service for the CSD Consulting website. Built with [Gin](https://gin-gonic.com/), structured logging with [Uber Zap](https://github.com/uber-go/zap), CORS support, request validation, in-memory rate limiting, and an SMTP email service dispatching consultation inquiries directly to `mayank@csd-india.com`.

---

## Architecture & Directory Structure

This project follows standard Go application layout conventions:

```text
csd-backend/
├── cmd/
│   └── server/
│       └── main.go             # Application bootstrap, graceful shutdown & server listener
├── internal/                   # Private application and business code
│   ├── config/
│   │   └── config.go           # Environment variables configuration loader (.env)
│   ├── handlers/
│   │   ├── contact.go          # Contact form POST handler
│   │   ├── contact_test.go     # Comprehensive unit & integration tests
│   │   ├── health.go           # System health check handler
│   │   └── health_test.go      # Health check unit test
│   ├── middleware/
│   │   ├── cors.go             # CORS middleware using gin-contrib/cors
│   │   ├── logger.go           # Structured JSON/console request logger via Zap
│   │   ├── ratelimit.go        # Thread-safe in-memory IP rate limiter
│   │   └── recovery.go         # Panic recovery middleware with JSON error responses
│   ├── models/
│   │   ├── contact.go          # Contact submission model, unmarshaler, validation & sanitizer
│   │   └── response.go         # Standard API responses and domain entities
│   ├── repositories/
│   │   ├── postgres.go         # PostgreSQL connection pool using GORM (for future use)
│   │   └── repositories.go     # Repository interface contracts
│   ├── routes/
│   │   └── routes.go           # Gin engine setup, middleware attachment, route mapping
│   └── services/
│       ├── email_service.go    # HTML & plain-text email generation and SMTP dispatch
│       └── services.go         # Service layer interface contracts
├── pkg/                        # Reusable packages safe for external or internal use
│   ├── email/
│   │   └── email.go            # SMTP email client wrapper (gomail.v2) with Reply-To support
│   ├── logger/
│   │   └── logger.go           # Zap logger initialization (Dev vs Prod mode)
│   └── validator/
│       └── validator.go        # Validator/v10 wrapper and friendly error formatting
├── templates/                  # Production-level email templates
│   ├── emails/
│   │   └── contact_enquiry.html # Standalone responsive HTML email template
│   ├── templates.go            # Embedded template engine (go:embed)
│   └── templates_test.go       # Template rendering unit tests
├── .env.example                # Example environment configuration template
├── .env                        # Local environment file (git-ignored)
├── .gitignore                  # Git ignore rules for Go and IDE files
├── go.mod                      # Go module definitions
├── go.sum                      # Checksums for dependencies
└── README.md                   # Setup and execution guide
```

---

## Dependencies

- **HTTP Web Framework:** [`github.com/gin-gonic/gin`](https://github.com/gin-gonic/gin)
- **CORS Handling:** [`github.com/gin-contrib/cors`](https://github.com/gin-contrib/cors)
- **Environment Management:** [`github.com/joho/godotenv`](https://github.com/joho/godotenv)
- **Structured Logging:** [`go.uber.org/zap`](https://github.com/uber-go/zap)
- **Request Validation:** [`github.com/go-playground/validator/v10`](https://github.com/go-playground/validator)
- **Database ORM & Driver:** [`gorm.io/gorm`](https://gorm.io/) and [`gorm.io/driver/postgres`](https://github.com/go-gorm/postgres) (future use)
- **SMTP Email Client:** [`gopkg.in/gomail.v2`](https://gopkg.in/gomail.v2)

---

## Environment Variables

Copy the provided template to create your `.env` file:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Port on which the HTTP server listens |
| `APP_ENV` | `development` | Environment name (`development` or `production`) |
| `GIN_MODE` | `debug` | Gin runtime mode (`debug` or `release`) |
| `READ_TIMEOUT` | `15s` | Maximum duration for reading the entire request |
| `WRITE_TIMEOUT` | `15s` | Maximum duration before timing out writes of response |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000` | Comma-separated origins permitted by CORS |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP port (`587` for STARTTLS, `465` for SSL) |
| `SMTP_USER` | `""` | SMTP authentication username / email |
| `SMTP_PASS` | `""` | SMTP authentication password / App password |
| `SMTP_FROM` | `mayank@csd-india.com` | Default sender email address |
| `SMTP_FROM_NAME` | `CSD Consulting Website` | Default sender display name |
| `SMTP_TO` | `mayank@csd-india.com` | Primary inbox receiving contact form enquiries |

> **Note on Gmail SMTP:** If using Gmail, generate an **App Password** via Google Account > Security > 2-Step Verification > App passwords, and set `SMTP_PASS` to the generated 16-character token.

---

## Getting Started

### 1. Download Dependencies

```bash
go mod download
```

### 2. Run in Development Mode

```bash
go run ./cmd/server
```

The server will start listening at `http://localhost:8080`.

### 3. Build for Production

Compile the standalone binary into `bin/server`:

```bash
go build -o bin/server ./cmd/server
```

Run the compiled executable:

```bash
./bin/server
```

### 4. Run Test Suite

```bash
go test -v ./...
```

---

## API Endpoints

### 1. Contact Form Submission

Receives enquiries from the React frontend, validates fields, and sends a styled notification email directly to `mayank@csd-india.com`.

- **Method:** `POST`
- **Path:** `/api/contact` (also mounted at `/api/v1/contact`)
- **Rate Limit:** 5 requests per minute per IP address
- **Content-Type:** `application/json`

#### Request Payload Specification

| Field | Type | Required | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | 2 - 100 characters | Visitor's full name (alias: `fullName`) |
| `email` | string | **Yes** | Valid RFC 5322 email | Visitor's email (used as `Reply-To`) |
| `phone` | string | **Yes** | 7 - 18 digits (`+`, `-`, spaces allowed) | Visitor's telephone number |
| `company` | string | No | Max 150 characters | Visitor's company name |
| `services` | []string | **Yes** | Array of 1+ strings | Selected services from list |
| `requirements` | string | **Yes** | 10 - 3000 characters | Project details (alias: `message`) |

#### Example Request

```json
{
  "name": "Rajesh Sharma",
  "email": "rajesh.sharma@example.com",
  "phone": "+91 98765 43210",
  "company": "FinTech Innovators Pvt Ltd",
  "services": [
    "CFO Advisory & Strategic Finance",
    "Tax & Regulatory Advisory"
  ],
  "requirements": "We are planning a series of cross-border investments and require end-to-end tax structuring and valuation advisory."
}
```

#### Example Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "message": "Thank you for reaching out to CSD Consulting. Your enquiry has been received and our team will get back to you shortly."
  }
}
```

#### Example Validation Error (`422 Unprocessable Entity`)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "please provide a valid email address (e.g., name@example.com)"
  }
}
```

#### Example Rate Limit Error (`429 Too Many Requests`)

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many submissions from your network. Please wait a moment before trying again."
  }
}
```

---

### 2. Health Check

Checks if the service is running, returning current status, environment, and uptime:

- **Method:** `GET`
- **Path:** `/health` (also available under `/api/v1/health`)
- **Example Response:**

```json
{
  "status": "ok",
  "service": "csd-backend",
  "environment": "development",
  "timestamp": "2026-10-31T12:09:45Z",
  "uptime": "5m12s"
}
```

---

## Security & Reliability Design

1. **Email Header Injection Prevention:** All single-line fields (`name`, `email`, `phone`, `company`, `services`) are stripped of carriage returns (`\r`) and line feeds (`\n`).
2. **HTML Escaping / XSS Protection:** All user-supplied inputs are escaped via `html.EscapeString` before being injected into the HTML email template.
3. **Reply-To Direct Workflow:** Enquiry emails are sent **From** and **To** `mayank@csd-india.com`, with `Reply-To` set to the visitor's contact-form email so a reply goes straight to the client.
4. **Internal Error Masking:** Detailed SMTP connection or authentication failures are logged to Zap server logs with full diagnostic details, while returning a sanitized, user-friendly `500 Internal Server Error` to the client.
5. **Direct Dispatch (Zero Database Dependency):** Adhering to architectural constraints, contact submissions are dispatched directly via SMTP without writing to PostgreSQL or disk storage.
