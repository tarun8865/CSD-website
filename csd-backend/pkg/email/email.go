package email

import (
	"crypto/tls"
	"fmt"

	"gopkg.in/gomail.v2"
)

// Config holds SMTP client configuration details.
type Config struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
	FromName string
}

// EmailMessage contains the payload for an outgoing email.
type EmailMessage struct {
	From     string
	Sender   string
	To       []string
	ReplyTo  string
	Subject  string
	TextBody string
	HTMLBody string
}

// Sender defines an abstract interface for sending emails, enabling testing and mocking.
type Sender interface {
	Send(msg EmailMessage) error
	SendMessage(to []string, subject, body string, isHTML bool) error
}

// Client wraps an SMTP dialer for sending transactional emails.
type Client struct {
	dialer *gomail.Dialer
	from   string
}

// NewClient initializes a new SMTP email client.
func NewClient(cfg Config) *Client {
	dialer := gomail.NewDialer(cfg.Host, cfg.Port, cfg.Username, cfg.Password)
	dialer.TLSConfig = &tls.Config{InsecureSkipVerify: false, ServerName: cfg.Host}

	senderAddress := cfg.From
	if cfg.FromName != "" {
		senderAddress = fmt.Sprintf("%s <%s>", cfg.FromName, cfg.From)
	}

	return &Client{
		dialer: dialer,
		from:   senderAddress,
	}
}

// Send dispatches an EmailMessage with support for dynamic From, Sender, Reply-To and multipart MIME (plain text + HTML).
func (c *Client) Send(msg EmailMessage) error {
	m := gomail.NewMessage()

	// 1. From header: Use visitor's details if provided, fallback to client default
	fromHeader := msg.From
	if fromHeader == "" {
		fromHeader = c.from
	}
	m.SetHeader("From", fromHeader)

	// 2. Sender header: Essential for authenticated relays like Gmail SMTP when From is the visitor
	senderHeader := msg.Sender
	if senderHeader == "" && c.from != "" && c.from != fromHeader {
		senderHeader = c.from
	}
	if senderHeader != "" {
		m.SetHeader("Sender", senderHeader)
	}

	m.SetHeader("To", msg.To...)

	if msg.ReplyTo != "" {
		m.SetHeader("Reply-To", msg.ReplyTo)
	}
	m.SetHeader("Subject", msg.Subject)

	if msg.TextBody != "" && msg.HTMLBody != "" {
		m.SetBody("text/plain", msg.TextBody)
		m.AddAlternative("text/html", msg.HTMLBody)
	} else if msg.HTMLBody != "" {
		m.SetBody("text/html", msg.HTMLBody)
	} else {
		m.SetBody("text/plain", msg.TextBody)
	}

	return c.dialer.DialAndSend(m)
}

// SendMessage sends an email with the specified recipients, subject, and body (supports HTML or plain text).
func (c *Client) SendMessage(to []string, subject, body string, isHTML bool) error {
	return c.Send(EmailMessage{
		To:       to,
		Subject:  subject,
		TextBody: body,
		HTMLBody: func() string {
			if isHTML {
				return body
			}
			return ""
		}(),
	})
}
