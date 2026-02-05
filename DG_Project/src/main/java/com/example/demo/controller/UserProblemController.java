	package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.entities.UserProblem;
import com.example.demo.services.UserProblemService;

@CrossOrigin(origins = "http://localhost:3000")  //*** Security
@RestController
public class UserProblemController {

	@Autowired 
	UserProblemService upserv;
	
	@PostMapping("/regprob")
	public UserProblem regprob(@RequestBody UserProblem up)
	{
		return upserv.problemreg(up) ;
	}
	
	@GetMapping("/viewproblems/{useridfk}")
	public List<UserProblem> getAll(@PathVariable int useridfk)
	{
		return upserv.getProblem(useridfk);
	}
	
	@GetMapping("/deleteBypid")
	public boolean deleteBypid(@RequestParam("pid")int p_id)
	{
		upserv.deleteBypid(p_id);
		return true;
	}
	
}
