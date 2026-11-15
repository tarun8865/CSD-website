package config

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config aggregates all application configuration parameters.
type Config struct {
	Server   ServerConfig
	CORS     CORSConfig
	Database DatabaseConfig
	SMTP     SMTPConfig
}

// ServerConfig stores HTTP server runtime configurations.
type ServerConfig struct {
	Port         string
	AppEnv       string
	GinMode      string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

// CORSConfig stores Cross-Origin Resource Sharing parameters.
type CORSConfig struct {
	AllowedOrigins   []string
	AllowedMethods   []string
	AllowedHeaders   []string
	AllowCredentials bool
	MaxAge           time.Duration
}

// DatabaseConfig stores PostgreSQL connection parameters.
type DatabaseConfig struct {
	Host            string
	Port            int
	User            string
	Password        string
	DBName          string
	SSLMode         string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

// SMTPConfig stores email provider settings.
type SMTPConfig struct {
	Host           string
	Port           int
	Username       string
	Password       string
	From           string
	FromName       string
	RecipientEmail string
}

// Load loads configuration from environment variables, optionally reading from .env.
func Load() (*Config, error) {
	// Attempt to load .env file if it exists, without failing if missing in production
	_ = godotenv.Load()

	serverConfig := ServerConfig{
		Port:         getEnv("PORT", "8080"),
		AppEnv:       getEnv("APP_ENV", "development"),
		GinMode:      getEnv("GIN_MODE", "debug"),
		ReadTimeout:  getEnvAsDuration("READ_TIMEOUT", 15*time.Second),
		WriteTimeout: getEnvAsDuration("WRITE_TIMEOUT", 15*time.Second),
	}

	rawOrigins := getEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
	var allowedOrigins []string
	for _, origin := range strings.Split(rawOrigins, ",") {
		trimmed := strings.TrimSpace(origin)
		if trimmed != "" {
			allowedOrigins = append(allowedOrigins, trimmed)
		}
	}

	corsConfig := CORSConfig{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Requested-With",
			"X-Request-ID",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	databaseConfig := DatabaseConfig{
		Host:            getEnv("DB_HOST", "localhost"),
		Port:            getEnvAsInt("DB_PORT", 5432),
		User:            getEnv("DB_USER", "postgres"),
		Password:        getEnv("DB_PASSWORD", "postgres"),
		DBName:          getEnv("DB_NAME", "csd_db"),
		SSLMode:         getEnv("DB_SSLMODE", "disable"),
		MaxOpenConns:    getEnvAsInt("DB_MAX_OPEN_CONNS", 25),
		MaxIdleConns:    getEnvAsInt("DB_MAX_IDLE_CONNS", 10),
		ConnMaxLifetime: getEnvAsDuration("DB_CONN_MAX_LIFETIME", 5*time.Minute),
	}

	smtpConfig := SMTPConfig{
		Host:           getEnv("SMTP_HOST", "smtp.gmail.com"),
		Port:           getEnvAsInt("SMTP_PORT", 587),
		Username:       getEnv("SMTP_USER", ""),
		Password:       strings.ReplaceAll(getEnv("SMTP_PASS", ""), " ", ""),
		From:           getEnv("SMTP_FROM", "mayank@csd-india.com"),
		FromName:       getEnv("SMTP_FROM_NAME", "CSD Consulting Website"),
		RecipientEmail: getEnv("SMTP_TO", "mayank@csd-india.com"),
	}

	return &Config{
		Server:   serverConfig,
		CORS:     corsConfig,
		Database: databaseConfig,
		SMTP:     smtpConfig,
	}, nil
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	valStr := getEnv(key, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return fallback
}

func getEnvAsDuration(key string, fallback time.Duration) time.Duration {
	valStr := getEnv(key, "")
	if val, err := time.ParseDuration(valStr); err == nil {
		return val
	}
	return fallback
}
