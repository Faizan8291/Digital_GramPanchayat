package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Register_report;
import com.example.demo.services.ReportService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class GramsevakRegisterReport {
	@Autowired
	ReportService reportservice;
	
	@PostMapping("/Report_Register")
	public Register_report registerReport(@RequestBody Register_report r)
	{
		return reportservice.registerReport(r);
	}

}
