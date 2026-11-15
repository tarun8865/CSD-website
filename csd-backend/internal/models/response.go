package models

import "time"

// APIResponse represents the standard JSON API response structure.
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
}

// APIError represents an API error object.
type APIError struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

// HealthStatus represents the payload returned by health-check endpoints.
type HealthStatus struct {
	Status      string    `json:"status"`
	Service     string    `json:"service"`
	Environment string    `json:"environment"`
	Timestamp   time.Time `json:"timestamp"`
	Uptime      string    `json:"uptime,omitempty"`
}

// ContactSubmission represents a future consultation or inquiry request.
type ContactSubmission struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" binding:"required,min=2,max=100"`
	Email     string    `json:"email" binding:"required,email"`
	Phone     string    `json:"phone,omitempty"`
	Subject   string    `json:"subject,omitempty"`
	Message   string    `json:"message" binding:"required,min=10,max=2000"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
