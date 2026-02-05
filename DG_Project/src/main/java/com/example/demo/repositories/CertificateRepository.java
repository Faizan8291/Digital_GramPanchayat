package com.example.demo.repositories;

import com.example.demo.entities.Certificate;
import com.example.demo.entities.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByPanchayatId(String panchayatId);

    List<Certificate> findByStatus(CertificateStatus status);

    List<Certificate> findByPanchayatIdAndStatus(String panchayatId, CertificateStatus status);

    @Query("SELECT c FROM Certificate c WHERE c.applicant.user_id = :applicantId")
    List<Certificate> findByApplicantId(@Param("applicantId") int applicantId);

    @Query("SELECT c FROM Certificate c WHERE c.applicant.user_id = :applicantId ORDER BY c.createdAt DESC")
    List<Certificate> findByApplicantIdOrderByCreatedAtDesc(@Param("applicantId") int applicantId);
}
