package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@grampanchayat.com}")
    private String fromEmail;

    @Value("${app.mail.fromName:Digital Gram Panchayat}")
    private String fromName;

    /**
     * Send a simple text email
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to: " + to);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send an HTML email
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            System.out.println("HTML Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email to: " + to);
            e.printStackTrace();
            throw new RuntimeException("Failed to send HTML email", e);
        } catch (Exception e) {
            System.err.println("Unexpected error sending email to: " + to);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send certificate approval notification email
     */
    public void sendCertificateApprovalEmail(String applicantEmail, String applicantName, 
                                            String certificateType, String certificateNumber) {
        String subject = "Certificate Approved - " + certificateType;
        
        String htmlContent = buildApprovalEmailHtml(applicantName, certificateType, certificateNumber);
        
        sendHtmlEmail(applicantEmail, subject, htmlContent);
    }

    /**
     * Send certificate rejection notification email
     */
    public void sendCertificateRejectionEmail(String applicantEmail, String applicantName, 
                                              String certificateType, String rejectionReason) {
        String subject = "Certificate Application Update - " + certificateType;
        
        String htmlContent = buildRejectionEmailHtml(applicantName, certificateType, rejectionReason);
        
        sendHtmlEmail(applicantEmail, subject, htmlContent);
    }

    /**
     * Build HTML content for approval email
     */
    private String buildApprovalEmailHtml(String applicantName, String certificateType, String certificateNumber) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }" +
                "        .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }" +
                "        .certificate-info { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50; }" +
                "        .footer { text-align: center; margin-top: 20px; padding: 20px; font-size: 12px; color: #666; }" +
                "        .success-icon { font-size: 48px; color: #4CAF50; text-align: center; margin: 20px 0; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>Digital Gram Panchayat</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <div class='success-icon'>✓</div>" +
                "            <h2 style='color: #4CAF50; text-align: center;'>Certificate Approved!</h2>" +
                "            <p>Dear <strong>" + applicantName + "</strong>,</p>" +
                "            <p>We are pleased to inform you that your certificate application has been <strong>approved</strong> by the Gram Sevak.</p>" +
                "            <div class='certificate-info'>" +
                "                <p><strong>Certificate Type:</strong> " + certificateType + "</p>" +
                "                <p><strong>Certificate Number:</strong> " + certificateNumber + "</p>" +
                "                <p><strong>Status:</strong> <span style='color: #4CAF50;'>ISSUED</span></p>" +
                "            </div>" +
                "            <p>You can now download your certificate from your dashboard by logging into the Digital Gram Panchayat portal.</p>" +
                "            <p style='margin-top: 30px;'>If you have any questions, please contact your local Gram Panchayat office.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>This is an automated email from Digital Gram Panchayat System.</p>" +
                "            <p>Please do not reply to this email.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Build HTML content for rejection email
     */
    private String buildRejectionEmailHtml(String applicantName, String certificateType, String rejectionReason) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }" +
                "        .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }" +
                "        .certificate-info { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #f44336; }" +
                "        .reason-box { background-color: #fff3cd; padding: 15px; margin: 20px 0; border: 1px solid #ffc107; border-radius: 4px; }" +
                "        .footer { text-align: center; margin-top: 20px; padding: 20px; font-size: 12px; color: #666; }" +
                "        .info-icon { font-size: 48px; color: #f44336; text-align: center; margin: 20px 0; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>Digital Gram Panchayat</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <div class='info-icon'>✕</div>" +
                "            <h2 style='color: #f44336; text-align: center;'>Certificate Application Update</h2>" +
                "            <p>Dear <strong>" + applicantName + "</strong>,</p>" +
                "            <p>We regret to inform you that your certificate application has been reviewed and <strong>requires resubmission</strong>.</p>" +
                "            <div class='certificate-info'>" +
                "                <p><strong>Certificate Type:</strong> " + certificateType + "</p>" +
                "                <p><strong>Status:</strong> <span style='color: #f44336;'>REJECTED</span></p>" +
                "            </div>" +
                "            <div class='reason-box'>" +
                "                <p><strong>Reason for Rejection:</strong></p>" +
                "                <p>" + rejectionReason + "</p>" +
                "            </div>" +
                "            <p>Please review the rejection reason carefully and submit a new application with the necessary corrections or additional information.</p>" +
                "            <p style='margin-top: 30px;'>If you have any questions or need clarification, please contact your local Gram Panchayat office.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>This is an automated email from Digital Gram Panchayat System.</p>" +
                "            <p>Please do not reply to this email.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
