package models

import (
	"encoding/json"
	"errors"
	"net/mail"
	"regexp"
	"strings"
	"time"
)

var (
	// phoneRegex verifies phone format allowing optional international prefix +, digits, spaces, hyphens, and parenthesis
	phoneRegex = regexp.MustCompile(`^[+]?[0-9\s\-().]{7,25}$`)
	// crlfRegex detects header injection attempts
	crlfRegex = regexp.MustCompile(`[\r\n]+`)
)

// ContactRequest represents the payload submitted by the Contact Us form.
type ContactRequest struct {
	FullName     string   `json:"name"`
	Email        string   `json:"email"`
	Phone        string   `json:"phone"`
	Company      string   `json:"company"`
	Services     []string `json:"services"`
	Requirements string   `json:"requirements"`
	SubmittedAt  time.Time `json:"-"`
}

// contactRequestAlias is a helper for flexible JSON unmarshaling.
type contactRequestAlias struct {
	Name         string          `json:"name"`
	FullName     string          `json:"fullName"`
	Email        string          `json:"email"`
	Phone        string          `json:"phone"`
	Company      string          `json:"company"`
	Services     json.RawMessage `json:"services"`
	Service      string          `json:"service"`
	Requirements string          `json:"requirements"`
	Message      string          `json:"message"`
}

// UnmarshalJSON custom unmarshaler to accept flexible field naming and service formats.
func (c *ContactRequest) UnmarshalJSON(data []byte) error {
	var aux contactRequestAlias
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	// Name fallback
	c.FullName = strings.TrimSpace(aux.Name)
	if c.FullName == "" {
		c.FullName = strings.TrimSpace(aux.FullName)
	}

	c.Email = strings.TrimSpace(aux.Email)
	c.Phone = strings.TrimSpace(aux.Phone)
	c.Company = strings.TrimSpace(aux.Company)

	// Requirements fallback
	c.Requirements = strings.TrimSpace(aux.Requirements)
	if c.Requirements == "" {
		c.Requirements = strings.TrimSpace(aux.Message)
	}

	// Services: try unmarshaling as []string
	if len(aux.Services) > 0 {
		var arr []string
		if err := json.Unmarshal(aux.Services, &arr); err == nil {
			c.Services = arr
		} else {
			// Try single string
			var single string
			if err := json.Unmarshal(aux.Services, &single); err == nil && strings.TrimSpace(single) != "" {
				c.Services = []string{strings.TrimSpace(single)}
			}
		}
	}

	// Fallback to single "service" field if "services" array was empty
	if len(c.Services) == 0 && strings.TrimSpace(aux.Service) != "" {
		c.Services = []string{strings.TrimSpace(aux.Service)}
	}

	c.SubmittedAt = time.Now().UTC()
	return nil
}

// Sanitize cleans user input and eliminates CRLF characters to prevent header injection.
func (c *ContactRequest) Sanitize() {
	c.FullName = crlfRegex.ReplaceAllString(strings.TrimSpace(c.FullName), "")
	c.Email = crlfRegex.ReplaceAllString(strings.TrimSpace(c.Email), "")
	c.Phone = crlfRegex.ReplaceAllString(strings.TrimSpace(c.Phone), "")
	c.Company = crlfRegex.ReplaceAllString(strings.TrimSpace(c.Company), "")

	var cleanServices []string
	for _, s := range c.Services {
		cleaned := crlfRegex.ReplaceAllString(strings.TrimSpace(s), "")
		if cleaned != "" {
			cleanServices = append(cleanServices, cleaned)
		}
	}
	c.Services = cleanServices

	// Requirements can have newlines, but remove null bytes and trim spaces
	c.Requirements = strings.ReplaceAll(strings.TrimSpace(c.Requirements), "\x00", "")
}

// Validate checks business rules and validation constraints for the contact submission.
func (c *ContactRequest) Validate() error {
	if len(c.FullName) < 2 || len(c.FullName) > 100 {
		return errors.New("full name must be between 2 and 100 characters")
	}

	if c.Email == "" {
		return errors.New("email address is required")
	}
	if len(c.Email) > 255 {
		return errors.New("email address exceeds maximum allowed length")
	}
	if crlfRegex.MatchString(c.Email) {
		return errors.New("email address contains invalid characters")
	}
	parsedAddr, err := mail.ParseAddress(c.Email)
	if err != nil || parsedAddr.Address != c.Email {
		return errors.New("please provide a valid email address (e.g., name@example.com)")
	}

	if c.Phone == "" {
		return errors.New("phone number is required")
	}
	if !phoneRegex.MatchString(c.Phone) {
		return errors.New("please provide a valid phone number (digits, spaces, +, -, or ())")
	}
	// Count actual digits in phone number
	digitsCount := 0
	for _, r := range c.Phone {
		if r >= '0' && r <= '9' {
			digitsCount++
		}
	}
	if digitsCount < 7 || digitsCount > 18 {
		return errors.New("phone number must contain between 7 and 18 digits")
	}

	if len(c.Company) > 150 {
		return errors.New("company name must not exceed 150 characters")
	}

	if len(c.Services) == 0 {
		return errors.New("please select at least one service")
	}
	for _, s := range c.Services {
		if len(s) < 2 || len(s) > 120 {
			return errors.New("each selected service must be between 2 and 120 characters")
		}
	}

	if len(c.Requirements) < 10 {
		return errors.New("please describe your requirements (minimum 10 characters)")
	}
	if len(c.Requirements) > 3000 {
		return errors.New("requirements description must not exceed 3000 characters")
	}

	return nil
}
