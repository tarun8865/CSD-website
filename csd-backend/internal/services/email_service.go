package services

import (
	"context"
	"fmt"
	"strings"
	"time"

	"csd-backend/internal/config"
	"csd-backend/internal/models"
	"csd-backend/pkg/email"
	"csd-backend/templates"

	"go.uber.org/zap"
)

type emailService struct {
	sender email.Sender
	cfg    config.SMTPConfig
	log    *zap.Logger
}

// NewEmailService instantiates a production-ready EmailService.
func NewEmailService(sender email.Sender, cfg config.SMTPConfig, log *zap.Logger) EmailService {
	return &emailService{
		sender: sender,
		cfg:    cfg,
		log:    log,
	}
}

// SendContactNotification dispatches a formatted notification email to configured recipient.
func (s *emailService) SendContactNotification(ctx context.Context, req *models.ContactRequest) error {
	recipient := s.cfg.RecipientEmail
	if recipient == "" {
		recipient = "mayank@csd-india.com"
	}

	fromAddress := s.cfg.From
	if fromAddress == "" {
		fromAddress = "mayank@csd-india.com"
	}
	fromHeader := fromAddress
	if s.cfg.FromName != "" {
		fromHeader = fmt.Sprintf("%s <%s>", s.cfg.FromName, fromAddress)
	}

	subject := fmt.Sprintf("New Website Enquiry: %s", req.FullName)
	if req.Company != "" {
		subject = fmt.Sprintf("New Website Enquiry: %s (%s)", req.FullName, req.Company)
	}

	// Reply-To uses the email provided in the contact form so replies go to the client
	replyTo := req.Email
	if req.FullName != "" {
		replyTo = fmt.Sprintf("%s <%s>", req.FullName, req.Email)
	}

	// Format submission timestamp
	submissionTime := req.SubmittedAt
	if submissionTime.IsZero() {
		submissionTime = time.Now().UTC()
	}
	formattedTime := submissionTime.Format("02 Jan 2006, 03:04 PM UTC")

	company := req.Company
	if company == "" {
		company = "Not provided"
	}

	emailData := templates.ContactEmailData{
		SubmittedAt:  formattedTime,
		FullName:     req.FullName,
		Email:        req.Email,
		Phone:        req.Phone,
		Company:      company,
		Services:     req.Services,
		Requirements: req.Requirements,
		ReplySubject: "Re: " + subject,
	}

	// Render from standalone production HTML template
	htmlBody, err := templates.RenderContactEnquiryHTML(emailData)
	if err != nil {
		s.log.Error("Failed to render contact email HTML template", zap.Error(err))
		return fmt.Errorf("failed to render email template: %w", err)
	}

	textBody := s.renderContactPlainText(req)

	msg := email.EmailMessage{
		From:     fromHeader,
		To:       []string{recipient},
		ReplyTo:  replyTo,
		Subject:  subject,
		TextBody: textBody,
		HTMLBody: htmlBody,
	}

	s.log.Info("Dispatching contact enquiry email via SMTP",
		zap.String("recipient", recipient),
		zap.String("from", fromHeader),
		zap.String("reply_to", replyTo),
		zap.String("visitor_name", req.FullName),
	)

	if err := s.sender.Send(msg); err != nil {
		s.log.Error("SMTP delivery failed for contact enquiry email",
			zap.Error(err),
			zap.String("recipient", recipient),
			zap.String("visitor_email", req.Email),
		)
		return fmt.Errorf("failed to send contact enquiry email: %w", err)
	}

	s.log.Info("Contact enquiry email successfully delivered",
		zap.String("recipient", recipient),
		zap.String("visitor_email", req.Email),
	)
	return nil
}

// SendInquiryNotification is a placeholder implementation for the interface.
func (s *emailService) SendInquiryNotification(ctx context.Context, submission *models.ContactSubmission) error {
	return nil
}

// SendInquiryConfirmation is a placeholder implementation for sending auto-responder confirmations.
func (s *emailService) SendInquiryConfirmation(ctx context.Context, recipientEmail, recipientName string) error {
	return nil
}

// renderContactPlainText constructs a fallback plain-text email representation.
func (s *emailService) renderContactPlainText(req *models.ContactRequest) string {
	var sb strings.Builder
	sb.WriteString("=== NEW CSD BUSINESS ENQUIRY ===\n\n")
	sb.WriteString(fmt.Sprintf("Full Name:     %s\n", req.FullName))
	sb.WriteString(fmt.Sprintf("Email Address: %s\n", req.Email))
	sb.WriteString(fmt.Sprintf("Phone Number:  %s\n", req.Phone))
	company := req.Company
	if company == "" {
		company = "Not provided"
	}
	sb.WriteString(fmt.Sprintf("Company Name:  %s\n", company))
	sb.WriteString(fmt.Sprintf("Services:      %s\n", strings.Join(req.Services, ", ")))

	submissionTime := req.SubmittedAt
	if submissionTime.IsZero() {
		submissionTime = time.Now().UTC()
	}
	sb.WriteString(fmt.Sprintf("Received On:   %s\n\n", submissionTime.Format("02 Jan 2006, 03:04 PM UTC")))

	sb.WriteString("--- Requirements / Project Details ---\n")
	sb.WriteString(req.Requirements)
	sb.WriteString("\n\n---------------------------------------\n")
	sb.WriteString(fmt.Sprintf("Note: Reply directly to this email to respond to %s (%s).\n", req.FullName, req.Email))

	return sb.String()
}
