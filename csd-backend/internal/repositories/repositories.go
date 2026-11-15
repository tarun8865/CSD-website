package repositories

import (
	"context"

	"csd-backend/internal/models"
)

// ContactRepository defines data persistence operations for contact submissions and inquiries.
type ContactRepository interface {
	Create(ctx context.Context, submission *models.ContactSubmission) error
	FindByID(ctx context.Context, id uint) (*models.ContactSubmission, error)
	FindAll(ctx context.Context, offset, limit int) ([]models.ContactSubmission, int64, error)
}
