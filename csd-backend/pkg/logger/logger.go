package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Log *zap.Logger
var Sugar *zap.SugaredLogger

// InitLogger initializes a Zap structured logger based on the application environment.
func InitLogger(env string) (*zap.Logger, error) {
	var config zap.Config

	if env == "production" {
		config = zap.NewProductionConfig()
		config.EncoderConfig.TimeKey = "timestamp"
		config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	} else {
		config = zap.NewDevelopmentConfig()
		config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		config.EncoderConfig.TimeKey = "timestamp"
		config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	}

	loggerInstance, err := config.Build(zap.AddCallerSkip(0))
	if err != nil {
		return nil, err
	}

	Log = loggerInstance
	Sugar = loggerInstance.Sugar()

	return Log, nil
}

// Sync flushes any buffered log entries.
func Sync() {
	if Log != nil {
		_ = Log.Sync()
	}
}

// GetLogger returns the current zap.Logger instance.
func GetLogger() *zap.Logger {
	if Log == nil {
		// Fallback to a basic console logger if uninitialized
		core := zapcore.NewCore(
			zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig()),
			zapcore.AddSync(os.Stdout),
			zapcore.DebugLevel,
		)
		Log = zap.New(core)
		Sugar = Log.Sugar()
	}
	return Log
}
