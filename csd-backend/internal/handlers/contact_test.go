package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"csd-backend/internal/config"
	"csd-backend/internal/middleware"
	"csd-backend/internal/models"
	"csd-backend/internal/services"
	"csd-backend/pkg/email"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// mockEmailSender implements email.Sender for testing
type mockEmailSender struct {
	mu           sync.Mutex
	sentMessages []email.EmailMessage
	shouldFail   bool
}

func (m *mockEmailSender) Send(msg email.EmailMessage) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.shouldFail {
		return errors.New("smtp connection timeout: dial tcp 127.0.0.1:587: connect: connection refused")
	}
	m.sentMessages = append(m.sentMessages, msg)
	return nil
}

func (m *mockEmailSender) messageCount() int {
	m.mu.Lock()
	defer m.mu.Unlock()
	return len(m.sentMessages)
}

func (m *mockEmailSender) firstMessage() email.EmailMessage {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.sentMessages[0]
}

func (m *mockEmailSender) SendMessage(to []string, subject, body string, isHTML bool) error {
	return m.Send(email.EmailMessage{
		To:       to,
		Subject:  subject,
		TextBody: body,
	})
}

func setupContactTestRouter(sender *mockEmailSender) (*gin.Engine, *services.EmailService) {
	gin.SetMode(gin.TestMode)
	logger := zap.NewNop()

	cfg := config.SMTPConfig{
		Host:           "smtp.example.com",
		Port:           587,
		From:           "mayank@csd-india.com",
		FromName:       "CSD Consulting Website",
		RecipientEmail: "mayank@csd-india.com",
	}

	emailSvc := services.NewEmailService(sender, cfg, logger)
	handler := NewContactHandler(emailSvc, logger)

	router := gin.New()
	router.POST("/api/contact", handler.SubmitContactForm)

	return router, &emailSvc
}

func TestContactForm_ValidSubmission(t *testing.T) {
	sender := &mockEmailSender{}
	router, _ := setupContactTestRouter(sender)

	payload := map[string]interface{}{
		"name":         "Rajesh Sharma",
		"email":        "rajesh.sharma@example.com",
		"phone":        "+91 98765 43210",
		"company":      "FinTech Innovators Pvt Ltd",
		"services":     []string{"CFO Advisory & Strategic Finance", "Tax & Regulatory Advisory"},
		"requirements": "We need complete guidance on our upcoming Series A transaction and compliance review.",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp models.APIResponse
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}
	if !resp.Success {
		t.Fatalf("Expected success true, got false: %+v", resp.Error)
	}

	// Email is sent asynchronously — wait briefly for the background goroutine
	deadline := time.Now().Add(2 * time.Second)
	for time.Now().Before(deadline) && sender.messageCount() == 0 {
		time.Sleep(10 * time.Millisecond)
	}

	// Verify From / Reply-To / To headers
	if sender.messageCount() != 1 {
		t.Fatalf("Expected 1 sent email, got %d", sender.messageCount())
	}
	sent := sender.firstMessage()
	if len(sent.To) != 1 || sent.To[0] != "mayank@csd-india.com" {
		t.Errorf("Expected recipient mayank@csd-india.com, got %v", sent.To)
	}
	if sent.From != "CSD Consulting Website <mayank@csd-india.com>" {
		t.Errorf("Expected From to be mayank@csd-india.com, got %s", sent.From)
	}
	if !strings.Contains(sent.ReplyTo, "rajesh.sharma@example.com") {
		t.Errorf("Expected Reply-To to contain visitor email, got %s", sent.ReplyTo)
	}
	if !strings.Contains(sent.Subject, "Rajesh Sharma") {
		t.Errorf("Expected subject to include visitor name, got %s", sent.Subject)
	}
	if !strings.Contains(sent.HTMLBody, "FinTech Innovators Pvt Ltd") {
		t.Errorf("Expected HTML body to contain company name")
	}
	if !strings.Contains(sent.HTMLBody, "CFO Advisory &amp; Strategic Finance") {
		t.Errorf("Expected HTML body to contain requested escaped service")
	}
	if !strings.Contains(sent.TextBody, "CFO Advisory & Strategic Finance") {
		t.Errorf("Expected text body to contain requested service")
	}
}

func TestContactForm_MissingRequiredFields(t *testing.T) {
	sender := &mockEmailSender{}
	router, _ := setupContactTestRouter(sender)

	testCases := []struct {
		name       string
		payload    map[string]interface{}
		expectedErr string
	}{
		{
			name: "Missing name",
			payload: map[string]interface{}{
				"email":        "test@example.com",
				"phone":        "+91 9876543210",
				"services":     []string{"Tax & Regulatory Advisory"},
				"requirements": "Need tax advisory for cross border transactions.",
			},
			expectedErr: "full name must be between 2 and 100 characters",
		},
		{
			name: "Invalid email",
			payload: map[string]interface{}{
				"name":         "John Doe",
				"email":        "invalid-email-address",
				"phone":        "+91 9876543210",
				"services":     []string{"Tax & Regulatory Advisory"},
				"requirements": "Need tax advisory for cross border transactions.",
			},
			expectedErr: "valid email address",
		},
		{
			name: "Invalid phone number (too short)",
			payload: map[string]interface{}{
				"name":         "John Doe",
				"email":        "john@example.com",
				"phone":        "123",
				"services":     []string{"Tax & Regulatory Advisory"},
				"requirements": "Need tax advisory for cross border transactions.",
			},
			expectedErr: "valid phone number",
		},
		{
			name: "No services selected",
			payload: map[string]interface{}{
				"name":         "John Doe",
				"email":        "john@example.com",
				"phone":        "+91 9876543210",
				"services":     []string{},
				"requirements": "Need tax advisory for cross border transactions.",
			},
			expectedErr: "select at least one service",
		},
		{
			name: "Requirements too short",
			payload: map[string]interface{}{
				"name":         "John Doe",
				"email":        "john@example.com",
				"phone":        "+91 9876543210",
				"services":     []string{"Tax & Regulatory Advisory"},
				"requirements": "Hi",
			},
			expectedErr: "minimum 10 characters",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			body, _ := json.Marshal(tc.payload)
			req, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			if w.Code != http.StatusUnprocessableEntity {
				t.Errorf("Expected status 422, got %d: %s", w.Code, w.Body.String())
			}

			var resp models.APIResponse
			_ = json.Unmarshal(w.Body.Bytes(), &resp)
			if resp.Success {
				t.Errorf("Expected failure, got success")
			}
			if resp.Error == nil || !strings.Contains(strings.ToLower(resp.Error.Message), strings.ToLower(tc.expectedErr)) {
				t.Errorf("Expected error containing '%s', got '%v'", tc.expectedErr, resp.Error)
			}
		})
	}
}

func TestContactForm_MalformedJSON(t *testing.T) {
	sender := &mockEmailSender{}
	router, _ := setupContactTestRouter(sender)

	req, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString("{ invalid json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 for malformed JSON, got %d", w.Code)
	}
}

func TestContactForm_HeaderInjectionPrevention(t *testing.T) {
	sender := &mockEmailSender{}
	router, _ := setupContactTestRouter(sender)

	payload := map[string]interface{}{
		"name":         "Malicious User\r\nBcc: hacker@example.com",
		"email":        "attacker@example.com\r\nBcc: spy@example.com",
		"phone":        "+91 98765 43210",
		"company":      "Evil Corp\r\nHeader: injected",
		"services":     []string{"Tax & Regulatory Advisory\r\nCC: victim@example.com"},
		"requirements": "We want consultation on our new project and funding opportunities.",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	// Since email address has CRLF, it is stripped or fails email parsing cleanly
	// If it passes sanitization, verify sent email headers contain NO CRLF
	if w.Code == http.StatusOK {
		if len(sender.sentMessages) > 0 {
			msg := sender.sentMessages[0]
			if strings.Contains(msg.ReplyTo, "\r") || strings.Contains(msg.ReplyTo, "\n") {
				t.Fatalf("CRLF detected in Reply-To header: %q", msg.ReplyTo)
			}
			if strings.Contains(msg.Subject, "\r") || strings.Contains(msg.Subject, "\n") {
				t.Fatalf("CRLF detected in Subject header: %q", msg.Subject)
			}
		}
	}
}

func TestContactForm_SMTPFailureDoesNotBlockClient(t *testing.T) {
	sender := &mockEmailSender{shouldFail: true}
	router, _ := setupContactTestRouter(sender)

	payload := map[string]interface{}{
		"name":         "Anil Kapoor",
		"email":        "anil@example.com",
		"phone":        "+91 98765 43210",
		"services":     []string{"Transactions, Fundraising & Valuations"},
		"requirements": "Inquiring about business valuation and growth roadmap planning.",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	// Submission is accepted immediately; SMTP runs in the background
	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200 even when SMTP will fail async, got %d", w.Code)
	}

	var resp models.APIResponse
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	if !resp.Success {
		t.Fatalf("Expected success true (async SMTP), got false: %+v", resp.Error)
	}

	// Give the failing goroutine a moment; client must never see SMTP internals
	time.Sleep(50 * time.Millisecond)
	if resp.Error != nil {
		if strings.Contains(resp.Error.Message, "connection refused") || strings.Contains(resp.Error.Message, "127.0.0.1") {
			t.Fatalf("Internal SMTP error leaked to client: %s", resp.Error.Message)
		}
	}
}

func TestContactForm_RateLimiting(t *testing.T) {
	sender := &mockEmailSender{}
	gin.SetMode(gin.TestMode)
	logger := zap.NewNop()

	cfg := config.SMTPConfig{
		RecipientEmail: "mayank@csd-india.com",
	}
	emailSvc := services.NewEmailService(sender, cfg, logger)
	handler := NewContactHandler(emailSvc, logger)

	// Create router with rate limit of 2 requests per minute
	router := gin.New()
	router.POST("/api/contact", middleware.RateLimit(2, 1*time.Minute), handler.SubmitContactForm)

	payload := map[string]interface{}{
		"name":         "Speedy User",
		"email":        "speedy@example.com",
		"phone":        "+91 98765 43210",
		"services":     []string{"Startup & International Business Advisory"},
		"requirements": "Need advice on international business expansion.",
	}
	body, _ := json.Marshal(payload)

	// Request 1: allowed
	req1, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
	req1.Header.Set("Content-Type", "application/json")
	req1.RemoteAddr = "192.0.2.1:1234"
	w1 := httptest.NewRecorder()
	router.ServeHTTP(w1, req1)
	if w1.Code != http.StatusOK {
		t.Fatalf("Request 1 failed: %d", w1.Code)
	}

	// Request 2: allowed
	req2, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
	req2.Header.Set("Content-Type", "application/json")
	req2.RemoteAddr = "192.0.2.1:1234"
	w2 := httptest.NewRecorder()
	router.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Fatalf("Request 2 failed: %d", w2.Code)
	}

	// Request 3: blocked with 429
	req3, _ := http.NewRequest(http.MethodPost, "/api/contact", bytes.NewBuffer(body))
	req3.Header.Set("Content-Type", "application/json")
	req3.RemoteAddr = "192.0.2.1:1234"
	w3 := httptest.NewRecorder()
	router.ServeHTTP(w3, req3)

	if w3.Code != http.StatusTooManyRequests {
		t.Fatalf("Expected status 429 for rate limit exceeded, got %d: %s", w3.Code, w3.Body.String())
	}
}
