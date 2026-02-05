package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.entities.Schemes;
import com.example.demo.services.SchemesService;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
public class SchemesController {
	@Autowired
	SchemesService schemserv;
	
	@GetMapping("/getschemes")
	public List<Schemes> getAll()
	{
		return schemserv.getSchemes();
	}
	
	
	@PostMapping("/uploadscheme")
	public Schemes registerUser(@RequestBody Schemes u)
	{
//		u.setUt(new UserType (1,"villagers"));
		return schemserv.uploadscheme(u);
	
    }
	
	@GetMapping("/deleteBysid")
	public boolean deleteBysid(@RequestParam("sid")int s_id)
	{
		schemserv.deleteBysid(s_id);
		return true;
	}
}
