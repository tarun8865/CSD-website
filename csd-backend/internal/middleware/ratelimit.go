package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type ipBucket struct {
	tokens     int
	lastRefill time.Time
}

// IPRateLimiter implements an in-memory token bucket rate limiter per client IP.
type IPRateLimiter struct {
	mu       sync.Mutex
	buckets  map[string]*ipBucket
	rate     int           // tokens added per window
	window   time.Duration // window duration
	capacity int           // max burst tokens
}

// NewIPRateLimiter creates a new rate limiter instance and starts cleanup worker.
func NewIPRateLimiter(rate int, window time.Duration) *IPRateLimiter {
	limiter := &IPRateLimiter{
		buckets:  make(map[string]*ipBucket),
		rate:     rate,
		window:   window,
		capacity: rate,
	}

	// Periodically clean up stale client entries to prevent unbounded memory growth
	go limiter.cleanupLoop(window * 3)

	return limiter
}

func (l *IPRateLimiter) allow(ip string) (bool, time.Duration) {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	bucket, exists := l.buckets[ip]
	if !exists {
		l.buckets[ip] = &ipBucket{
			tokens:     l.capacity - 1,
			lastRefill: now,
		}
		return true, 0
	}

	// Refill tokens based on elapsed time
	elapsed := now.Sub(bucket.lastRefill)
	if elapsed >= l.window {
		bucket.tokens = l.capacity
		bucket.lastRefill = now
	}

	if bucket.tokens > 0 {
		bucket.tokens--
		return true, 0
	}

	retryAfter := l.window - elapsed
	if retryAfter < time.Second {
		retryAfter = time.Second
	}
	return false, retryAfter
}

func (l *IPRateLimiter) cleanupLoop(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		l.mu.Lock()
		now := time.Now()
		for ip, bucket := range l.buckets {
			if now.Sub(bucket.lastRefill) > l.window*2 {
				delete(l.buckets, ip)
			}
		}
		l.mu.Unlock()
	}
}

// RateLimit creates a Gin middleware that enforces IP-based rate limits.
func RateLimit(limit int, window time.Duration) gin.HandlerFunc {
	limiter := NewIPRateLimiter(limit, window)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		allowed, retryAfter := limiter.allow(ip)
		if !allowed {
			c.Header("Retry-After", time.Duration(retryAfter.Seconds()).String())
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "TOO_MANY_REQUESTS",
					"message": "Too many submissions from your network. Please wait a moment before trying again.",
				},
			})
			return
		}

		c.Next()
	}
}
