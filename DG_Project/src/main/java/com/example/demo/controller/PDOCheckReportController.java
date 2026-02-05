package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Register_report;
import com.example.demo.services.ReportService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class PDOCheckReportController {

	@Autowired 
	ReportService rpserv;
	
	@GetMapping("/viewReports")
	public List<Register_report> viewReports()
	{
		return rpserv.getAllReports();
	}
	
	@GetMapping("/approveReport")
	public int approveReport(@RequestParam("id") int rid)
	{
		return rpserv.approveReport(rid);
	}
	
	@GetMapping("/declineReport")
	public int declineReport(@RequestParam("id") int rid)
	{
		return rpserv.declineReport(rid);
	}
}
