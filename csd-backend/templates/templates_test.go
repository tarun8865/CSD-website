package templates

import (
	"strings"
	"testing"
)

func TestRenderContactEnquiryHTML(t *testing.T) {
	data := ContactEmailData{
		SubmittedAt:  "31 Oct 2026, 06:17 PM UTC",
		FullName:     "Vikramaditya Singhania",
		Email:        "vikram@singhania.com",
		Phone:        "+91 98765 00000",
		Company:      "Singhania Global Enterprises",
		Services:     []string{"CFO Advisory & Strategic Finance", "Transactions, Fundraising & Valuations"},
		Requirements: "Seeking strategic financial advisory for overseas debt syndication.",
		ReplySubject: "Re: New Website Enquiry: Vikramaditya Singhania",
	}

	rendered, err := RenderContactEnquiryHTML(data)
	if err != nil {
		t.Fatalf("Failed to render email HTML template: %v", err)
	}

	expectedSnippets := []string{
		"New CSD Business Enquiry",
		"CSD",
		"CONSULTING SERVICES",
		"31 Oct 2026, 06:17 PM UTC",
		"CSD Website — Contact Us",
		"Vikramaditya Singhania",
		"mailto:vikram@singhania.com?subject=Re",
		"98765 00000",
		"Singhania Global Enterprises",
		"CFO Advisory &amp; Strategic Finance",
		"Transactions, Fundraising &amp; Valuations",
		"Seeking strategic financial advisory for overseas debt syndication.",
		"Reply to Enquiry",
	}

	for _, snippet := range expectedSnippets {
		if !strings.Contains(rendered, snippet) {
			t.Errorf("Rendered HTML missing expected snippet: %q", snippet)
		}
	}
}

func TestRenderContactEnquiryHTML_EmptyServices(t *testing.T) {
	data := ContactEmailData{
		SubmittedAt:  "31 Oct 2026, 06:17 PM UTC",
		FullName:     "Vikram Singhania",
		Email:        "vikram@singhania.com",
		Phone:        "+91 98765 00000",
		Company:      "Not provided",
		Services:     []string{},
		Requirements: "General inquiry.",
	}

	rendered, err := RenderContactEnquiryHTML(data)
	if err != nil {
		t.Fatalf("Failed to render email HTML template: %v", err)
	}

	if !strings.Contains(rendered, "No services selected") {
		t.Errorf("Expected 'No services selected' when services list is empty")
	}
}
