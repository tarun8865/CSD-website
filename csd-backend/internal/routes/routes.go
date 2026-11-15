package routes

import (
	"net/http"
	"time"

	"csd-backend/internal/config"
	"csd-backend/internal/handlers"
	"csd-backend/internal/middleware"
	"csd-backend/internal/services"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// SetupRouter initializes and configures the Gin HTTP engine with all middlewares and routes.
func SetupRouter(cfg *config.Config, log *zap.Logger, emailSvc services.EmailService) *gin.Engine {
	// Set Gin operational mode
	gin.SetMode(cfg.Server.GinMode)

	// Create blank Gin engine without default logger/recovery to use our custom Zap middlewares
	router := gin.New()

	// Global Middlewares
	router.Use(middleware.Recovery(log))
	router.Use(middleware.RequestLogger(log))
	router.Use(middleware.CORS(cfg.CORS))

	// Health handler
	healthHandler := handlers.NewHealthHandler(cfg.Server.AppEnv)

	// Contact handler
	contactHandler := handlers.NewContactHandler(emailSvc, log)

	// In-memory rate limiting for contact submissions: 5 requests per 1 minute per IP
	contactRateLimiter := middleware.RateLimit(5, 1*time.Minute)

	// Public Health-Check Endpoint
	router.GET("/health", healthHandler.Check)

	// Root welcome endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service": "CSD Consulting Backend API",
			"version": "1.0.0",
			"status":  "running",
			"docs":    "/health",
		})
	})

	// Direct API Group (e.g. POST /api/contact)
	api := router.Group("/api")
	{
		api.POST("/contact", contactRateLimiter, contactHandler.SubmitContactForm)
	}

	// API v1 Versioned Route Group (e.g. POST /api/v1/contact)
	v1 := router.Group("/api/v1")
	{
		v1.GET("/health", healthHandler.Check)
		v1.POST("/contact", contactRateLimiter, contactHandler.SubmitContactForm)
	}

	return router
}
