# Email Service Implementation for Digital Gram Panchayat

## Overview
This document explains the email notification system implemented for the Digital Gram Panchayat project. The system automatically sends emails to citizens when their certificate applications are approved or rejected by the Gram Sevak.

---

## Changes Made

### 1. **Added Dependencies** (`pom.xml`)
Added Spring Boot Mail Starter dependency for email functionality:
```xml
<!-- Email Service Dependencies -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 2. **Email Configuration** (`application.properties`)
Added email server configuration:
```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# Application Email Settings
app.mail.from=your-email@gmail.com
app.mail.fromName=Digital Gram Panchayat
```

### 3. **Created EmailService** (`EmailService.java`)
A new service class that handles all email operations:
- **sendSimpleEmail()**: Sends plain text emails
- **sendHtmlEmail()**: Sends HTML formatted emails
- **sendCertificateApprovalEmail()**: Sends approval notification with certificate details
- **sendCertificateRejectionEmail()**: Sends rejection notification with reason

### 4. **Updated CertificateController** (`CertificateController.java`)
Integrated EmailService to automatically send emails:
- **On Approval**: Sends email with certificate number and success message
- **On Rejection**: Sends email with rejection reason and guidance

---

## Setup Instructions

### Step 1: Configure Gmail for Sending Emails

#### Option A: Using Gmail with App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to Google Account Settings → Security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to Google Account Settings → Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. **Update `application.properties`**:
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=xxxx xxxx xxxx xxxx  # Your 16-character app password
   app.mail.from=your-email@gmail.com
   ```

#### Option B: Using Gmail with Less Secure Apps (Not Recommended)

1. Enable "Less secure app access" in Gmail settings
2. Use your regular Gmail password in `application.properties`

**⚠️ Warning**: This method is less secure and may be blocked by Google.

---

### Step 2: Alternative Email Providers

#### Using Outlook/Hotmail
```properties
spring.mail.host=smtp.office365.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

#### Using Yahoo Mail
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

#### Using Custom SMTP Server
```properties
spring.mail.host=smtp.your-domain.com
spring.mail.port=587
spring.mail.username=your-username
spring.mail.password=your-password
```

---

## Email Templates

### Approval Email
When a certificate is approved, the citizen receives:
- ✅ Success header with green theme
- Certificate type and certificate number
- Status: ISSUED
- Instructions to download from dashboard
- Professional HTML formatting

### Rejection Email
When a certificate is rejected, the citizen receives:
- ❌ Update header with red theme
- Certificate type
- Status: REJECTED
- Detailed rejection reason in a highlighted box
- Instructions to resubmit
- Professional HTML formatting

---

## Testing the Email Service

### 1. Build the Project
```bash
cd DG_Project
mvn clean install
```

### 2. Run the Application
```bash
mvn spring-boot:run
```

### 3. Test Email Sending

#### Test Certificate Approval
```bash
# First, create a certificate application
curl -X POST http://localhost:7500/api/certificates/apply \
  -H "Content-Type: application/json" \
  -d '{
    "applicantId": 1,
    "certificateType": "Income Certificate",
    "applicantName": "John Doe",
    "applicantEmail": "john@example.com",
    "phone": "1234567890",
    "panchayatId": "GP001",
    "details": "Need income certificate for loan application"
  }'

# Then approve it (replace {id} with actual certificate ID)
curl -X POST http://localhost:7500/api/certificates/{id}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approverId": 2,
    "remarks": "All documents verified"
  }'
```

#### Test Certificate Rejection
```bash
curl -X POST http://localhost:7500/api/certificates/{id}/reject \
  -H "Content-Type: application/json" \
  -d '{
    "approverId": 2,
    "reason": "Incomplete documents. Please provide address proof."
  }'
```

---

## Troubleshooting

### Email Not Sending

1. **Check Console Logs**: Look for error messages in the application console
   ```
   Failed to send email to: user@example.com
   ```

2. **Verify Email Credentials**: Make sure username and password are correct

3. **Check Firewall**: Ensure port 587 is not blocked

4. **Gmail Specific Issues**:
   - Verify 2FA is enabled
   - Regenerate App Password
   - Check if "Less secure app access" is needed

5. **Check Email Format**: Ensure applicant email in database is valid

### Testing Email Configuration
You can add a test endpoint to verify email setup:

```java
@GetMapping("/test-email")
public ResponseEntity<?> testEmail(@RequestParam String to) {
    try {
        emailService.sendSimpleEmail(
            to, 
            "Test Email", 
            "This is a test email from Digital Gram Panchayat"
        );
        return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
    } catch (Exception e) {
        return ResponseEntity.status(500)
            .body(Map.of("error", e.getMessage()));
    }
}
```

Test it:
```bash
curl "http://localhost:7500/api/certificates/test-email?to=your-email@gmail.com"
```

---

## Security Best Practices

1. **Never Commit Credentials**: Don't push `application.properties` with real credentials to Git
   
2. **Use Environment Variables**: In production, use environment variables:
   ```properties
   spring.mail.username=${EMAIL_USERNAME}
   spring.mail.password=${EMAIL_PASSWORD}
   ```

3. **Create `.gitignore` Entry**:
   ```
   application.properties
   application-prod.properties
   ```

4. **Use Separate Configuration**: Create `application-prod.properties` for production

---

## Future Enhancements

1. **Email Queue System**: Implement async email sending with retry logic
2. **Email Templates**: Store templates in database for easy customization
3. **SMS Notifications**: Add SMS along with email notifications
4. **Email Logging**: Store email send status in database
5. **Rich Email Templates**: Add more sophisticated HTML templates with images
6. **Multi-language Support**: Send emails in regional languages
7. **Email Verification**: Verify email addresses before sending
8. **Notification Preferences**: Allow users to opt-in/opt-out of emails

---

## API Endpoints Reference

### Certificate Endpoints (with Email Notifications)

1. **Apply for Certificate**
   - Endpoint: `POST /api/certificates/apply`
   - No email sent at this stage

2. **Approve Certificate**
   - Endpoint: `POST /api/certificates/{id}/approve`
   - **Sends Email**: ✅ Approval email to applicant

3. **Reject Certificate**
   - Endpoint: `POST /api/certificates/{id}/reject`
   - **Sends Email**: ✅ Rejection email with reason to applicant

4. **Get My Applications**
   - Endpoint: `GET /api/certificates/my-applications?applicantId={id}`
   - No email sent

5. **Download Certificate**
   - Endpoint: `GET /api/certificates/{id}/download?applicantId={id}`
   - No email sent

---

## Email Service Class Methods

### EmailService.java

```java
// Send simple text email
public void sendSimpleEmail(String to, String subject, String text)

// Send HTML formatted email
public void sendHtmlEmail(String to, String subject, String htmlContent)

// Send approval notification
public void sendCertificateApprovalEmail(
    String applicantEmail, 
    String applicantName, 
    String certificateType, 
    String certificateNumber
)

// Send rejection notification
public void sendCertificateRejectionEmail(
    String applicantEmail, 
    String applicantName, 
    String certificateType, 
    String rejectionReason
)
```

---

## Database Requirements

Ensure the `certificates` table has the following columns:
- `applicant_email` (VARCHAR) - To store citizen's email
- `applicant_name` (VARCHAR) - To personalize email
- `certificate_type` (VARCHAR) - Included in email
- `certificate_number` (VARCHAR) - Sent in approval email
- `rejection_reason` (VARCHAR) - Sent in rejection email

---

## Production Deployment Checklist

- [ ] Configure production email credentials
- [ ] Use environment variables for sensitive data
- [ ] Test email delivery in production environment
- [ ] Set up email monitoring/logging
- [ ] Configure proper error handling
- [ ] Set up email rate limiting if needed
- [ ] Add email bounce handling
- [ ] Configure SPF/DKIM records for email domain
- [ ] Test with different email providers (Gmail, Outlook, etc.)
- [ ] Document email sending limits of your provider

---

## Support and Contact

For issues or questions:
1. Check application logs for detailed error messages
2. Verify email provider settings
3. Test with a simple email first
4. Ensure all dependencies are properly installed

---

## Version History

**Version 1.0** (Current)
- Basic email notification for approval/rejection
- HTML email templates
- Gmail SMTP configuration
- Error handling with fallback

---

**Created by**: AI Assistant  
**Date**: February 4, 2026  
**Project**: Digital Gram Panchayat
