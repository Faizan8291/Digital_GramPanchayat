package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Birthdeath;
import com.example.demo.repositories.BirthdeathRepository;
import com.example.demo.services.BirthdeathService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class BirthdeathController {
	
	@Autowired
	BirthdeathService birthdeathService;
	
	@Autowired
	BirthdeathRepository birthdeathRepository;
	
	@PostMapping("/registerrecord")
	public Birthdeath registerUser(@RequestBody Birthdeath u) {
		return birthdeathService.registerbd(u);
	}
	
	/**
	 * Download birth certificate PDF by certificate number
	 */
	@GetMapping("/birth-certificate/download/{certNo}")
	public ResponseEntity<byte[]> downloadCertificate(@PathVariable String certNo) {
		
		Birthdeath record = birthdeathRepository.findByCertificateNumber(certNo)
				.orElseThrow(() -> new RuntimeException("Certificate not found: " + certNo));
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, 
						"attachment; filename=" + certNo + ".pdf")
				.contentType(MediaType.APPLICATION_PDF)
				.body(record.getPdfData());
	}
	
	/**
	 * Download birth certificate PDF by birth record ID
	 */
	@GetMapping("/birth-certificate/download/id/{bid}")
	public ResponseEntity<byte[]> downloadCertificateById(@PathVariable int bid) {
		
		Birthdeath record = birthdeathRepository.findById(bid)
				.orElseThrow(() -> new RuntimeException("Birth record not found with ID: " + bid));
		
		if (record.getPdfData() == null) {
			throw new RuntimeException("PDF certificate not generated for this record");
		}
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, 
						"attachment; filename=" + record.getCertificateNumber() + ".pdf")
				.contentType(MediaType.APPLICATION_PDF)
				.body(record.getPdfData());
	}
}
