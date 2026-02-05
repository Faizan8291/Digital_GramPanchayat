package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entities.LoginCheck;
import com.example.demo.entities.User;
import com.example.demo.entities.UserType;
import com.example.demo.services.UserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class UserController {

	@Autowired
	private UserService userservice;
	
	/**
	 * Register new user as villager (default role)
	 */
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User u) {
		try {
			u.setUt(new UserType(1, "villagers"));
			User savedUser = userservice.register(u);
			
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "User registered successfully");
			response.put("userId", savedUser.getUser_id());
			
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (RuntimeException e) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}
	
	/**
	 * Register user with specific role (Admin only)
	 */
	@PostMapping("/register/role/{roleId}")
	public ResponseEntity<?> registerUserWithRole(@RequestBody User u, @PathVariable int roleId) {
		try {
			User savedUser = userservice.registerWithRole(u, roleId);
			
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "User registered successfully with role");
			response.put("userId", savedUser.getUser_id());
			response.put("role", savedUser.getUt().getUser_type());
			
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (RuntimeException e) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}
	
	/**
	 * Enhanced login with role-based authentication
	 */
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
		LoginResponse response = userservice.authenticateUser(
			loginRequest.getUsername(), 
			loginRequest.getPassword()
		);
		
		if (response.isSuccess()) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		}
	}
	
	/**
	 * Legacy login endpoint for backward compatibility
	 */
	@PostMapping("/checkLogin")
	public ResponseEntity<?> checkLogin(@RequestBody LoginCheck lcheck) {
		User user = userservice.getLogin(lcheck.getUsername(), lcheck.getPassword());
		
		if (user != null) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("user", user);
			return ResponseEntity.ok(response);
		} else {
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", "Invalid credentials");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		}
	}
	
	/**
	 * Get users by role type
	 */
	@GetMapping("/users/role/{roleId}")
	public ResponseEntity<List<User>> getUsersByRole(@PathVariable int roleId) {
		List<User> users = userservice.getUsersByRole(roleId);
		return ResponseEntity.ok(users);
	}
	
	/**
	 * Get active users by role type
	 */
	@GetMapping("/users/role/{roleId}/active")
	public ResponseEntity<List<User>> getActiveUsersByRole(@PathVariable int roleId) {
		List<User> users = userservice.getActiveUsersByRole(roleId);
		return ResponseEntity.ok(users);
	}
	
	/**
	 * Get user by ID
	 */
	@GetMapping("/users/{userId}")
	public ResponseEntity<?> getUserById(@PathVariable int userId) {
		Optional<User> user = userservice.getUserById(userId);
		if (user.isPresent()) {
			return ResponseEntity.ok(user.get());
		} else {
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", "User not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}
	
	/**
	 * Activate user account
	 */
	@PutMapping("/users/{userId}/activate")
	public ResponseEntity<?> activateUser(@PathVariable int userId) {
		try {
			userservice.activateUser(userId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "User activated successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", "Failed to activate user");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	/**
	 * Deactivate user account
	 */
	@PutMapping("/users/{userId}/deactivate")
	public ResponseEntity<?> deactivateUser(@PathVariable int userId) {
		try {
			userservice.deactivateUser(userId);
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "User deactivated successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", "Failed to deactivate user");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	/**
	 * Change password
	 */
	@PutMapping("/users/{userId}/change-password")
	public ResponseEntity<?> changePassword(
			@PathVariable int userId,
			@RequestParam String oldPassword,
			@RequestParam String newPassword) {
		
		boolean success = userservice.changePassword(userId, oldPassword, newPassword);
		
		Map<String, Object> response = new HashMap<>();
		if (success) {
			response.put("success", true);
			response.put("message", "Password changed successfully");
			return ResponseEntity.ok(response);
		} else {
			response.put("success", false);
			response.put("message", "Failed to change password. Check old password.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}
	
	/**
	 * Get all users (Admin only)
	 */
	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userservice.getAllUsers();
		return ResponseEntity.ok(users);
	}
}
