# Quick Setup Guide - Email Service

## 🚀 Quick Start (5 Minutes)

### Step 1: Update Email Configuration
Open `application.properties` and replace these values:

```properties
# Replace with your actual Gmail account
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Replace with your actual Gmail account
app.mail.from=your-email@gmail.com
```

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already enabled)
3. Go to "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
6. Paste it in `spring.mail.password` (keep the spaces)

### Step 3: Build and Run

```bash
# Navigate to project directory
cd DG_Project

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### Step 4: Test It!

1. **Create a certificate application** (via your frontend or API)
2. **Approve or Reject it** as Gram Sevak
3. **Check the applicant's email inbox**

✅ Done! Citizens will now receive emails when certificates are approved/rejected.

---

## 📧 What Gets Sent?

### When Certificate is APPROVED:
- **Subject**: Certificate Approved - {Certificate Type}
- **Content**: 
  - Success message
  - Certificate Number
  - Status: ISSUED
  - Download instructions
  - Professional HTML template with green theme

### When Certificate is REJECTED:
- **Subject**: Certificate Application Update - {Certificate Type}
- **Content**:
  - Status: REJECTED
  - Reason for rejection (highlighted)
  - Instructions to resubmit
  - Professional HTML template with red theme

---

## 🔧 Configuration Options

### Using Different Email Provider?

**Outlook/Hotmail:**
```properties
spring.mail.host=smtp.office365.com
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

**Yahoo:**
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

---

## ❌ Troubleshooting

### Emails Not Sending?

1. **Check Console** - Look for error messages
2. **Verify Gmail Settings** - Ensure 2FA and App Password are set up
3. **Check Email Address** - Make sure applicant email is valid
4. **Test Simple Email** - Add this endpoint to controller:

```java
@GetMapping("/test-email")
public ResponseEntity<?> testEmail(@RequestParam String to) {
    emailService.sendSimpleEmail(to, "Test", "Test email works!");
    return ResponseEntity.ok("Sent");
}
```

Test: `http://localhost:7500/api/certificates/test-email?to=test@example.com`

---

## 🔐 Security Tips

- ✅ Never commit real passwords to Git
- ✅ Use environment variables in production
- ✅ Enable 2FA on email account
- ✅ Use App Passwords instead of regular password
- ✅ Keep credentials in `.gitignore`

---

## 📝 Files Modified

1. ✅ `pom.xml` - Added email dependency
2. ✅ `application.properties` - Added email configuration
3. ✅ `EmailService.java` - New service class
4. ✅ `CertificateController.java` - Integrated email service

---

## 🎯 Next Steps

1. Configure your email credentials
2. Test with a real certificate application
3. Customize email templates if needed
4. Deploy to production with environment variables

---

**Need Help?** Check the detailed documentation in `EMAIL_SERVICE_DOCUMENTATION.md`
