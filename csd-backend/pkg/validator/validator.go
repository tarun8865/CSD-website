package validator

import (
	"errors"
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

// GetValidator returns the shared validator instance.
func GetValidator() *validator.Validate {
	return validate
}

// ValidationErrorDetail represents a single field validation error.
type ValidationErrorDetail struct {
	Field   string `json:"field"`
	Tag     string `json:"tag"`
	Message string `json:"message"`
}

// FormatValidationErrors formats Go validator errors into a structured slice.
func FormatValidationErrors(err error) []ValidationErrorDetail {
	var errs []ValidationErrorDetail
	var valErrors validator.ValidationErrors

	if errors.As(err, &valErrors) {
		for _, fieldErr := range valErrors {
			message := formatMessage(fieldErr)
			errs = append(errs, ValidationErrorDetail{
				Field:   strings.ToLower(fieldErr.Field()),
				Tag:     fieldErr.Tag(),
				Message: message,
			})
		}
	} else if err != nil {
		errs = append(errs, ValidationErrorDetail{
			Field:   "general",
			Tag:     "invalid",
			Message: err.Error(),
		})
	}

	return errs
}

func formatMessage(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", fe.Field())
	case "email":
		return fmt.Sprintf("%s must be a valid email address", fe.Field())
	case "min":
		return fmt.Sprintf("%s must be at least %s characters long", fe.Field(), fe.Param())
	case "max":
		return fmt.Sprintf("%s must not exceed %s characters", fe.Field(), fe.Param())
	default:
		return fmt.Sprintf("%s failed on '%s' rule", fe.Field(), fe.Tag())
	}
}
