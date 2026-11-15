package handlers

import (
	"net/http"
	"time"

	"csd-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// HealthHandler handles health-check requests.
type HealthHandler struct {
	startTime   time.Time
	environment string
}

// NewHealthHandler creates a new instance of HealthHandler.
func NewHealthHandler(environment string) *HealthHandler {
	return &HealthHandler{
		startTime:   time.Now(),
		environment: environment,
	}
}

// Check returns the system health status.
// @Summary System health check
// @Description Returns server health, environment, and uptime
// @Tags health
// @Produce json
// @Success 200 {object} models.HealthStatus
// @Router /health [get]
func (h *HealthHandler) Check(c *gin.Context) {
	uptime := time.Since(h.startTime).Truncate(time.Second).String()

	c.JSON(http.StatusOK, models.HealthStatus{
		Status:      "ok",
		Service:     "csd-backend",
		Environment: h.environment,
		Timestamp:   time.Now().UTC(),
		Uptime:      uptime,
	})
}
