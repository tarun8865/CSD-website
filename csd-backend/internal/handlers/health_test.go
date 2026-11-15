package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"csd-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func TestHealthCheck(t *testing.T) {
	gin.SetMode(gin.TestMode)

	handler := NewHealthHandler("test")
	router := gin.New()
	router.GET("/health", handler.Check)

	req, err := http.NewRequest(http.MethodGet, "/health", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, w.Code)
	}

	var response models.HealthStatus
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if response.Status != "ok" {
		t.Errorf("Expected status 'ok', got '%s'", response.Status)
	}

	if response.Service != "csd-backend" {
		t.Errorf("Expected service 'csd-backend', got '%s'", response.Service)
	}

	if response.Environment != "test" {
		t.Errorf("Expected environment 'test', got '%s'", response.Environment)
	}
}
