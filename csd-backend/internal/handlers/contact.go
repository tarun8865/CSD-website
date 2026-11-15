package handlers

import (
	"context"
	"net/http"
	"time"

	"csd-backend/internal/models"
	"csd-backend/internal/services"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// ContactHandler processes incoming contact form submissions.
type ContactHandler struct {
	emailService services.EmailService
	log          *zap.Logger
}

// NewContactHandler constructs a new ContactHandler instance.
func NewContactHandler(emailService services.EmailService, log *zap.Logger) *ContactHandler {
	return &ContactHandler{
		emailService: emailService,
		log:          log,
	}
}

// SubmitContactForm handles POST /api/contact requests.
// Validates immediately, returns success at once, and sends the notification
// email in the background so the UI is not blocked on SMTP latency.
// @Summary Submit contact inquiry
// @Description Validates contact form data and queues notification email to mayank@csd-india.com
// @Tags contact
// @Accept json
// @Produce json
// @Param request body models.ContactRequest true "Contact Form Submission"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 422 {object} models.APIResponse
// @Failure 429 {object} models.APIResponse
// @Router /api/contact [post]
func (h *ContactHandler) SubmitContactForm(c *gin.Context) {
	var req models.ContactRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Warn("Invalid JSON payload received on contact endpoint",
			zap.Error(err),
			zap.String("ip", c.ClientIP()),
		)
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error: &models.APIError{
				Code:    "INVALID_REQUEST_BODY",
				Message: "Malformed or invalid JSON payload provided. Please check submitted data.",
			},
		})
		return
	}

	// Sanitize against email header injection and excess whitespace
	req.Sanitize()

	// Validate required fields, email format, phone, and requirements length
	if err := req.Validate(); err != nil {
		h.log.Warn("Validation failed for contact submission",
			zap.String("validation_error", err.Error()),
			zap.String("ip", c.ClientIP()),
		)
		c.JSON(http.StatusUnprocessableEntity, models.APIResponse{
			Success: false,
			Error: &models.APIError{
				Code:    "VALIDATION_ERROR",
				Message: err.Error(),
			},
		})
		return
	}

	// Copy request for background work so the HTTP request can finish immediately.
	enquiry := req
	clientIP := c.ClientIP()

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		if err := h.emailService.SendContactNotification(ctx, &enquiry); err != nil {
			h.log.Error("Failed to deliver contact inquiry email via SMTP (async)",
				zap.Error(err),
				zap.String("visitor_email", enquiry.Email),
				zap.String("visitor_name", enquiry.FullName),
				zap.String("ip", clientIP),
			)
			return
		}

		h.log.Info("Contact enquiry email delivered (async)",
			zap.String("visitor_email", enquiry.Email),
			zap.String("visitor_name", enquiry.FullName),
			zap.String("ip", clientIP),
		)
	}()

	h.log.Info("Contact enquiry accepted; email queued for delivery",
		zap.String("visitor_email", req.Email),
		zap.String("visitor_name", req.FullName),
		zap.String("ip", clientIP),
	)

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: gin.H{
			"message": "Thank you for reaching out to CSD Consulting. Your enquiry has been received and our team will get back to you shortly.",
		},
	})
}
