package com.example.demo.controller;

import com.example.demo.entities.Certificate;
import com.example.demo.entities.CertificateStatus;
import com.example.demo.entities.User;
import com.example.demo.repositories.CertificateRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyCertificate(@RequestBody Map<String, Object> applicationData) {
        Object applicantIdRaw = applicationData.get("applicantId");
        if (applicantIdRaw == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "applicantId is required"));
        }

        int applicantId = Integer.parseInt(String.valueOf(applicantIdRaw));
        Optional<User> applicantOpt = userRepository.findById(applicantId);
        if (!applicantOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Applicant not found"));
        }

        User applicant = applicantOpt.get();
        Certificate certificate = new Certificate();
        certificate.setCertificateType(String.valueOf(applicationData.get("certificateType")));
        certificate.setApplicantName(
            String.valueOf(applicationData.getOrDefault("applicantName",
                (applicant.getFirst_name() + " " + applicant.getLast_name()).trim()))
        );
        certificate.setApplicantEmail(
            String.valueOf(applicationData.getOrDefault("applicantEmail", applicant.getEmail()))
        );
        certificate.setApplicantPhone(String.valueOf(applicationData.getOrDefault("phone", "")));
        certificate.setApplicant(applicant);
        certificate.setPanchayatId(String.valueOf(applicationData.getOrDefault("panchayatId", "")));
        certificate.setApplicationDetails(String.valueOf(applicationData.getOrDefault("details", "")));
        certificate.setStatus(CertificateStatus.PENDING);

        Certificate saved = certificateRepository.save(certificate);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Certificate application submitted successfully");
        response.put("certificateId", saved.getId());
        response.put("status", saved.getStatus());
        response.put("submittedAt", saved.getCreatedAt());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam int applicantId) {
        List<Certificate> certificates = certificateRepository
            .findByApplicantIdOrderByCreatedAtDesc(applicantId);

        List<Map<String, Object>> dto = new ArrayList<>();
        for (Certificate cert : certificates) {
            dto.add(certificateToDTO(cert));
        }
        return ResponseEntity.ok(Map.of(
            "applications", dto,
            "totalCount", dto.size()
        ));
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingCertificates(@RequestParam(required = false) String panchayatId) {
        List<Certificate> pending;
        if (panchayatId != null && !panchayatId.isEmpty()) {
            pending = certificateRepository.findByPanchayatIdAndStatus(panchayatId, CertificateStatus.PENDING);
        } else {
            pending = certificateRepository.findByStatus(CertificateStatus.PENDING);
        }

        List<Map<String, Object>> dto = new ArrayList<>();
        for (Certificate cert : pending) {
            dto.add(certificateToDTO(cert));
        }
        return ResponseEntity.ok(Map.of(
            "pendingCertificates", dto,
            "totalCount", dto.size()
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCertificates(@RequestParam(required = false) String status,
                                                @RequestParam(required = false) String panchayatId) {
        List<Certificate> certificates;

        if (status != null && !status.isEmpty()) {
            CertificateStatus certStatus = CertificateStatus.valueOf(status);
            if (panchayatId != null && !panchayatId.isEmpty()) {
                certificates = certificateRepository.findByPanchayatIdAndStatus(panchayatId, certStatus);
            } else {
                certificates = certificateRepository.findByStatus(certStatus);
            }
        } else if (panchayatId != null && !panchayatId.isEmpty()) {
            certificates = certificateRepository.findByPanchayatId(panchayatId);
        } else {
            certificates = certificateRepository.findAll();
        }

        List<Map<String, Object>> dto = new ArrayList<>();
        for (Certificate cert : certificates) {
            dto.add(certificateToDTO(cert));
        }

        Map<String, Long> statusCount = new HashMap<>();
        for (CertificateStatus s : CertificateStatus.values()) {
            long count = certificates.stream().filter(cert -> cert.getStatus() == s).count();
            statusCount.put(s.name(), count);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("certificates", dto);
        response.put("totalCount", dto.size());
        response.put("statusCount", statusCount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveCertificate(@PathVariable Long id,
                                                @RequestBody(required = false) Map<String, Object> approvalData) {
        Optional<Certificate> certOpt = certificateRepository.findById(id);
        if (!certOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Certificate not found"));
        }

        Certificate certificate = certOpt.get();
        if (certificate.getStatus() != CertificateStatus.PENDING) {
            return ResponseEntity.badRequest().body(Map.of("message", "Certificate has already been processed"));
        }

        User approver = null;
        if (approvalData != null && approvalData.get("approverId") != null) {
            int approverId = Integer.parseInt(String.valueOf(approvalData.get("approverId")));
            approver = userRepository.findById(approverId).orElse(null);
        }

        certificate.setStatus(CertificateStatus.APPROVED);
        certificate.setApprovedBy(approver);
        certificate.setApprovedAt(LocalDateTime.now());
        certificate.setCertificateNumber(generateCertificateNumber(certificate));

        if (approvalData != null && approvalData.get("remarks") != null) {
            certificate.setRemarks(String.valueOf(approvalData.get("remarks")));
        }

        certificate.setStatus(CertificateStatus.ISSUED);
        Certificate updated = certificateRepository.save(certificate);

        // Send approval email to the citizen
        try {
            emailService.sendCertificateApprovalEmail(
                updated.getApplicantEmail(),
                updated.getApplicantName(),
                updated.getCertificateType(),
                updated.getCertificateNumber()
            );
        } catch (Exception e) {
            System.err.println("Failed to send approval email: " + e.getMessage());
            // Continue even if email fails
        }

        return ResponseEntity.ok(Map.of(
            "message", "Certificate approved and issued",
            "certificate", certificateToDTO(updated)
        ));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectCertificate(@PathVariable Long id,
                                               @RequestBody Map<String, Object> rejectionData) {
        Optional<Certificate> certOpt = certificateRepository.findById(id);
        if (!certOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Certificate not found"));
        }

        Certificate certificate = certOpt.get();
        if (certificate.getStatus() != CertificateStatus.PENDING) {
            return ResponseEntity.badRequest().body(Map.of("message", "Certificate has already been processed"));
        }

        String reason = rejectionData == null ? null : String.valueOf(rejectionData.get("reason"));
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Rejection reason is required"));
        }

        User approver = null;
        if (rejectionData.get("approverId") != null) {
            int approverId = Integer.parseInt(String.valueOf(rejectionData.get("approverId")));
            approver = userRepository.findById(approverId).orElse(null);
        }

        certificate.setStatus(CertificateStatus.REJECTED);
        certificate.setApprovedBy(approver);
        certificate.setApprovedAt(LocalDateTime.now());
        certificate.setRejectionReason(reason);

        Certificate updated = certificateRepository.save(certificate);
        
        // Send rejection email to the citizen
        try {
            emailService.sendCertificateRejectionEmail(
                updated.getApplicantEmail(),
                updated.getApplicantName(),
                updated.getCertificateType(),
                updated.getRejectionReason()
            );
        } catch (Exception e) {
            System.err.println("Failed to send rejection email: " + e.getMessage());
            // Continue even if email fails
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Certificate rejected",
            "certificate", certificateToDTO(updated)
        ));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadCertificate(@PathVariable Long id,
                                                 @RequestParam int applicantId) {
        Optional<Certificate> certOpt = certificateRepository.findById(id);
        if (!certOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Certificate not found"));
        }

        Certificate certificate = certOpt.get();
        if (certificate.getApplicant() == null || certificate.getApplicant().getUser_id() != applicantId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied"));
        }

        if (!(certificate.getStatus() == CertificateStatus.APPROVED || certificate.getStatus() == CertificateStatus.ISSUED)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Certificate is not approved yet"));
        }

        try {
            byte[] pdf = generateCertificatePdf(certificate);
            String certNo = certificate.getCertificateNumber() != null ? certificate.getCertificateNumber() : ("CERT-" + certificate.getId());
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate-" + certNo + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to generate certificate PDF"));
        }
    }

    private Map<String, Object> certificateToDTO(Certificate cert) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", cert.getId());
        dto.put("certificateType", cert.getCertificateType());
        dto.put("applicantName", cert.getApplicantName());
        dto.put("applicantEmail", cert.getApplicantEmail());
        dto.put("applicantPhone", cert.getApplicantPhone());
        dto.put("panchayatId", cert.getPanchayatId());
        dto.put("applicationDetails", cert.getApplicationDetails());
        dto.put("status", cert.getStatus().name());
        dto.put("certificateNumber", cert.getCertificateNumber());
        dto.put("remarks", cert.getRemarks());
        dto.put("rejectionReason", cert.getRejectionReason());
        dto.put("createdAt", cert.getCreatedAt());
        dto.put("updatedAt", cert.getUpdatedAt());
        dto.put("approvedAt", cert.getApprovedAt());

        if (cert.getApprovedBy() != null) {
            dto.put("approvedBy", Map.of(
                "id", cert.getApprovedBy().getUser_id(),
                "name", (cert.getApprovedBy().getFirst_name() + " " + cert.getApprovedBy().getLast_name()).trim(),
                "username", cert.getApprovedBy().getUsername()
            ));
        }
        return dto;
    }

    private String generateCertificateNumber(Certificate certificate) {
        String type = certificate.getCertificateType() == null ? "CERT" : certificate.getCertificateType();
        String typeCode = type.substring(0, Math.min(3, type.length())).toUpperCase();
        String panchayatCode = certificate.getPanchayatId() == null ? "" :
            certificate.getPanchayatId().replaceAll("[^A-Z0-9]", "").toUpperCase();
        String timestamp = String.valueOf(System.currentTimeMillis() % 1000000);
        return String.format("%s-%s-%s", typeCode, panchayatCode, timestamp);
    }

    private byte[] generateCertificatePdf(Certificate certificate) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font labelFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        Font valueFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

        document.add(new Paragraph("Digital Gram Panchayat", titleFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Certificate", titleFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Certificate Number: ", labelFont));
        document.add(new Paragraph(
            certificate.getCertificateNumber() != null ? certificate.getCertificateNumber() : ("CERT-" + certificate.getId()),
            valueFont
        ));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Certificate Type: ", labelFont));
        document.add(new Paragraph(String.valueOf(certificate.getCertificateType()), valueFont));
        document.add(new Paragraph("Applicant Name: ", labelFont));
        document.add(new Paragraph(String.valueOf(certificate.getApplicantName()), valueFont));
        document.add(new Paragraph("Applicant Email: ", labelFont));
        document.add(new Paragraph(String.valueOf(certificate.getApplicantEmail()), valueFont));
        document.add(new Paragraph("Status: ", labelFont));
        document.add(new Paragraph(String.valueOf(certificate.getStatus()), valueFont));
        document.add(new Paragraph("Issued At: ", labelFont));
        document.add(new Paragraph(
            certificate.getApprovedAt() != null ? certificate.getApprovedAt().toString() : LocalDateTime.now().toString(),
            valueFont
        ));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("This certificate is generated electronically by Digital Gram Panchayat.", valueFont));
        document.close();
        return out.toByteArray();
    }
}
