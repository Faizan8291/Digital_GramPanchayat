package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.entities.Birthdeath;
import com.example.demo.repositories.BirthdeathRepository;
import com.example.demo.utility.BirthCertificatePdfGenerator;
import com.example.demo.utility.CertificateNumberGenerator;

@Service
public class BirthdeathService {
	
	@Autowired
	BirthdeathRepository birthdeathrepo;
	
	public Birthdeath registerbd(@RequestBody Birthdeath bd) {
		// Generate certificate number
		String certNo = CertificateNumberGenerator.generate();
		bd.setCertificateNumber(certNo);
		
		// Generate PDF certificate
		byte[] pdfData = BirthCertificatePdfGenerator.generate(
			bd.getBname(),
			bd.getDate(),
			bd.getBplace(),
			bd.getHospitalname(),
			certNo
		);
		bd.setPdfData(pdfData);
		
		return birthdeathrepo.save(bd);
	}
}
