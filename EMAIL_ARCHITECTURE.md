# Email Notification System - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Digital Gram Panchayat System                    │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │   Citizen    │         │  Gram Sevak  │         │     PDO      │
    │   (User)     │         │  (Approver)  │         │   (Admin)    │
    └──────┬───────┘         └──────┬───────┘         └──────────────┘
           │                         │
           │ 1. Apply Certificate    │
           ├─────────────────────────▶
           │                         │
           │                         │ 2. Review Application
           │                         │
           │                         ├─── Approve ───┐
           │                         │               │
           │                         │               ▼
           │                         │    ┌──────────────────┐
           │                         │    │ EmailService     │
           │                         │    │ - Generates HTML │
           │                         │    │ - Sends Email    │
           │                         │    └────────┬─────────┘
           │                         │             │
           │ 3. Email Notification   │             │
           │◀────────────────────────┼─────────────┘
           │   (Approval/Rejection)  │
           │                         │
           │ 4. Download Certificate │
           │   (if approved)         │
           └─────────────────────────┘
```

## Email Flow Diagram

### Approval Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CERTIFICATE APPROVAL FLOW                      │
└─────────────────────────────────────────────────────────────────────┘

1. Citizen applies for certificate
   │
   └──▶ Certificate saved with status: PENDING
        │
        ▼
2. Gram Sevak reviews application
   │
   └──▶ Clicks "Approve"
        │
        ▼
3. CertificateController.approveCertificate()
   │
   ├──▶ Updates status to APPROVED/ISSUED
   ├──▶ Generates certificate number
   ├──▶ Sets approval timestamp
   │
   └──▶ 4. Calls EmailService.sendCertificateApprovalEmail()
        │
        ├──▶ Builds HTML email template
        ├──▶ Includes certificate details
        ├──▶ Sends via JavaMailSender
        │
        ▼
5. Citizen receives email
   │
   ├──▶ Subject: "Certificate Approved - {Type}"
   ├──▶ Contains: Certificate number, Status, Download link
   └──▶ Professional HTML template (Green theme)
```

### Rejection Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CERTIFICATE REJECTION FLOW                     │
└─────────────────────────────────────────────────────────────────────┘

1. Citizen applies for certificate
   │
   └──▶ Certificate saved with status: PENDING
        │
        ▼
2. Gram Sevak reviews application
   │
   └──▶ Finds issues → Clicks "Reject"
        │
        └──▶ Enters rejection reason
             │
             ▼
3. CertificateController.rejectCertificate()
   │
   ├──▶ Updates status to REJECTED
   ├──▶ Saves rejection reason
   ├──▶ Sets rejection timestamp
   │
   └──▶ 4. Calls EmailService.sendCertificateRejectionEmail()
        │
        ├──▶ Builds HTML email template
        ├──▶ Includes rejection reason
        ├──▶ Sends via JavaMailSender
        │
        ▼
5. Citizen receives email
   │
   ├──▶ Subject: "Certificate Application Update - {Type}"
   ├──▶ Contains: Rejection reason, Resubmission instructions
   └──▶ Professional HTML template (Red theme)
```

## Component Interaction

```
┌───────────────────────────────────────────────────────────────────┐
│                       COMPONENT DIAGRAM                           │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  Frontend       │
│  (React)        │
└────────┬────────┘
         │ HTTP Request
         │ POST /api/certificates/{id}/approve
         │
         ▼
┌──────────────────────────────────────┐
│  CertificateController               │
│  ┌────────────────────────────────┐  │
│  │ @PostMapping("/{id}/approve")  │  │
│  │ approveCertificate()           │  │
│  └────────┬───────────────────────┘  │
│           │                          │
│           │ 1. Update Certificate    │
│           │                          │
│  ┌────────▼───────────────────────┐  │
│  │ certificateRepository.save()   │  │
│  └────────┬───────────────────────┘  │
│           │                          │
│           │ 2. Send Email            │
│           │                          │
│  ┌────────▼───────────────────────┐  │
│  │ emailService.send...Email()    │──┼─────┐
│  └────────────────────────────────┘  │     │
└──────────────────────────────────────┘     │
                                              │
         ┌────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  EmailService                        │
│  ┌────────────────────────────────┐  │
│  │ sendCertificateApprovalEmail() │  │
│  │ - buildApprovalEmailHtml()     │  │
│  │ - sendHtmlEmail()              │  │
│  └────────┬───────────────────────┘  │
│           │                          │
│           │ 3. Prepare Email         │
│           │                          │
│  ┌────────▼───────────────────────┐  │
│  │ JavaMailSender.send()          │──┼─────┐
│  └────────────────────────────────┘  │     │
└──────────────────────────────────────┘     │
                                              │
         ┌────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  SMTP Server (Gmail)                 │
│  - Authenticates sender              │
│  - Delivers to recipient             │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Citizen's Email Inbox               │
│  - Receives formatted email          │
│  - Can click links                   │
└──────────────────────────────────────┘
```

## Email Template Structure

### Approval Email HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Professional CSS styling */
        - Green color theme (#4CAF50)
        - Responsive layout
        - Clear hierarchy
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Digital Gram Panchayat
        </div>
        <div class="content">
            ✓ Success Icon
            Certificate Approved!
            
            Dear [Applicant Name],
            
            [Approval Message]
            
            ┌────────────────────────┐
            │ Certificate Details:    │
            │ Type: [Type]           │
            │ Number: [Number]       │
            │ Status: ISSUED         │
            └────────────────────────┘
            
            [Download Instructions]
        </div>
        <div class="footer">
            Automated Email Disclaimer
        </div>
    </div>
</body>
</html>
```

### Rejection Email HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Professional CSS styling */
        - Red color theme (#f44336)
        - Responsive layout
        - Clear hierarchy
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Digital Gram Panchayat
        </div>
        <div class="content">
            ✕ Info Icon
            Certificate Application Update
            
            Dear [Applicant Name],
            
            [Update Message]
            
            ┌────────────────────────┐
            │ Certificate Details:    │
            │ Type: [Type]           │
            │ Status: REJECTED       │
            └────────────────────────┘
            
            ┌────────────────────────┐
            │ Rejection Reason:      │
            │ [Detailed Reason]      │
            └────────────────────────┘
            
            [Resubmission Instructions]
        </div>
        <div class="footer">
            Automated Email Disclaimer
        </div>
    </div>
</body>
</html>
```

## Database Schema Impact

### Certificate Table (Updated)

```sql
CREATE TABLE certificates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    certificate_type VARCHAR(100) NOT NULL,
    applicant_name VARCHAR(200) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,  -- 📧 Used for email
    applicant_phone VARCHAR(20),
    applicant_id BIGINT NOT NULL,
    panchayat_id VARCHAR(50),
    application_details TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ISSUED'),
    approved_by BIGINT,
    approved_at DATETIME,
    rejection_reason TEXT,                   -- 📧 Sent in rejection email
    certificate_number VARCHAR(50),          -- 📧 Sent in approval email
    remarks TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (applicant_id) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);
```

## API Endpoints with Email Triggers

| Endpoint | Method | Email Sent? | Email Type |
|----------|--------|-------------|------------|
| `/api/certificates/apply` | POST | ❌ No | - |
| `/api/certificates/my-applications` | GET | ❌ No | - |
| `/api/certificates/pending` | GET | ❌ No | - |
| `/api/certificates/all` | GET | ❌ No | - |
| `/api/certificates/{id}/approve` | POST | ✅ Yes | Approval Email |
| `/api/certificates/{id}/reject` | POST | ✅ Yes | Rejection Email |
| `/api/certificates/{id}/download` | GET | ❌ No | - |

## Error Handling Strategy

```
Email Sending Process:
│
├─▶ Try to send email
│   │
│   ├─▶ Success
│   │   └─▶ Log: "Email sent successfully"
│   │
│   └─▶ Failure
│       ├─▶ Log error to console
│       ├─▶ Certificate status still updated
│       └─▶ Continue without blocking user
│
└─▶ User sees success message regardless
    (Email failure doesn't affect certificate status)
```

## Email Configuration Properties

```properties
# Server Configuration
spring.mail.host          → SMTP server address
spring.mail.port          → SMTP port (587 for TLS)
spring.mail.username      → Email account username
spring.mail.password      → Email account password/app-password

# SMTP Properties
mail.smtp.auth            → Enable authentication
mail.smtp.starttls.enable → Enable TLS encryption
mail.smtp.connectiontimeout → Connection timeout (ms)
mail.smtp.timeout         → Socket timeout (ms)
mail.smtp.writetimeout    → Write timeout (ms)

# Application Properties
app.mail.from             → Sender email address
app.mail.fromName         → Sender display name
```

## Security Considerations

```
┌─────────────────────────────────────────────────────────┐
│              SECURITY BEST PRACTICES                    │
└─────────────────────────────────────────────────────────┘

1. CREDENTIAL STORAGE
   ✅ Use environment variables in production
   ✅ Never commit passwords to Git
   ✅ Use .gitignore for config files

2. EMAIL AUTHENTICATION
   ✅ Enable 2-Factor Authentication
   ✅ Use App Passwords (not regular password)
   ✅ Rotate passwords regularly

3. DATA PROTECTION
   ✅ Validate email addresses
   ✅ Sanitize user inputs
   ✅ Use TLS/SSL for transmission

4. ACCESS CONTROL
   ✅ Only authorized users can approve/reject
   ✅ Log all email sending attempts
   ✅ Monitor for abuse

5. RATE LIMITING
   ✅ Implement email rate limits
   ✅ Monitor for spam patterns
   ✅ Use email queuing for high volume
```

## Performance Optimization

```
Current Implementation:
├─ Synchronous email sending
└─ Blocks thread until email is sent

Recommended for Production:
├─ Asynchronous email sending (@Async)
├─ Email queue with retry mechanism
├─ Batch email processing
└─ Email service monitoring
```

## Monitoring and Logging

```java
// Email Service logs to console:

[SUCCESS] Email sent successfully to: user@example.com
[ERROR] Failed to send email to: user@example.com
[ERROR] SMTP connection failed: Connection timeout
[ERROR] Authentication failed: Invalid credentials
```

## Testing Checklist

- [ ] Configure email credentials in application.properties
- [ ] Build project: `mvn clean install`
- [ ] Start application: `mvn spring-boot:run`
- [ ] Create a test certificate application
- [ ] Approve it and check citizen's email
- [ ] Reject another and verify rejection email
- [ ] Check email in spam folder initially
- [ ] Verify HTML rendering in different email clients
- [ ] Test with Gmail, Outlook, Yahoo
- [ ] Check console logs for errors
- [ ] Test error handling (wrong credentials)

---

**Project**: Digital Gram Panchayat  
**Feature**: Email Notification System  
**Version**: 1.0  
**Date**: February 4, 2026
