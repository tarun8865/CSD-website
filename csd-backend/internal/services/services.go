package services

import (
	"context"

	"csd-backend/internal/models"
)

// EmailService defines the interface for transactional and notification emails.
type EmailService interface {
	SendContactNotification(ctx context.Context, req *models.ContactRequest) error
	SendInquiryNotification(ctx context.Context, submission *models.ContactSubmission) error
	SendInquiryConfirmation(ctx context.Context, recipientEmail, recipientName string) error
}

// ContactService defines the business logic interface for handling customer consultations and inquiries.
type ContactService interface {
	SubmitInquiry(ctx context.Context, submission *models.ContactSubmission) (*models.ContactSubmission, error)
	GetInquiries(ctx context.Context, page, pageSize int) ([]models.ContactSubmission, int64, error)
}
