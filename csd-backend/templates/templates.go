package templates

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
)

//go:embed emails/*.html
var emailFS embed.FS

// ContactEmailData represents the dynamic template context for contact notification emails.
type ContactEmailData struct {
	SubmittedAt  string
	FullName     string
	Email        string
	Phone        string
	Company      string
	Services     []string
	Requirements string
	ReplySubject string
}

var (
	contactEnquiryTmpl *template.Template
)

func init() {
	var err error
	contactEnquiryTmpl, err = template.ParseFS(emailFS, "emails/contact_enquiry.html")
	if err != nil {
		panic(fmt.Sprintf("failed to parse contact enquiry email template: %v", err))
	}
}

// RenderContactEnquiryHTML renders the standalone HTML template with provided data.
func RenderContactEnquiryHTML(data ContactEmailData) (string, error) {
	var buf bytes.Buffer
	if err := contactEnquiryTmpl.Execute(&buf, data); err != nil {
		return "", fmt.Errorf("failed to execute contact enquiry template: %w", err)
	}
	return buf.String(), nil
}
