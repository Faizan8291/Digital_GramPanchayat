package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entities.User;
import com.example.demo.entities.UserType;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.UserTypeRepository;
import com.example.demo.security.PasswordEncoder;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.LoginResponse.UserData;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userrepo;
	
	@Autowired
	private UserTypeRepository userTypeRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	/**
	 * Register new user with encrypted password
	 */
	@Transactional
	public User register(User u) {
		// Check if username already exists
		if (userrepo.existsByUsername(u.getUsername())) {
			throw new RuntimeException("Username already exists");
		}
		
		// Check if email already exists
		if (userrepo.existsByEmail(u.getEmail())) {
			throw new RuntimeException("Email already exists");
		}
		
		// Generate salt and hash password
		String salt = passwordEncoder.generateSalt();
		String hashedPassword = passwordEncoder.hashPassword(u.getPassword(), salt);
		
		u.setPassword(hashedPassword);
		u.setPassword_salt(salt);
		u.setIsActive(true);
		
		return userrepo.save(u);
	}
	
	/**
	 * Register user with specific role
	 */
	@Transactional
	public User registerWithRole(User u, int roleTypeId) {
		Optional<UserType> userType = userTypeRepo.findById(roleTypeId);
		if (userType.isPresent()) {
			u.setUt(userType.get());
		} else {
			throw new RuntimeException("Invalid user type");
		}
		return register(u);
	}
	
	/**
	 * Authenticate user with role-based login
	 */
	@Transactional
	public LoginResponse authenticateUser(String username, String password) {
		Optional<User> userOpt = userrepo.findByUsername(username);
		
		if (!userOpt.isPresent()) {
			return new LoginResponse(false, "Invalid username or password", null);
		}
		
		User user = userOpt.get();
		
		// Check if user is active
		// Treat legacy null values as active to avoid breaking old accounts
		if (user.getIsActive() == null) {
			user.setIsActive(true);
			userrepo.save(user);
		}
		if (Boolean.FALSE.equals(user.getIsActive())) {
			return new LoginResponse(false, "Account is deactivated. Please contact administrator.", null);
		}
		
		// Verify password
		boolean passwordMatch = false;
		if (user.getPassword_salt() != null && !user.getPassword_salt().isEmpty()) {
			// New password with salt
			passwordMatch = passwordEncoder.verifyPassword(password, user.getPassword_salt(), user.getPassword());
		} else {
			// Legacy password without salt (backward compatibility)
			String encodedPassword = passwordEncoder.simpleEncode(password);
			passwordMatch = encodedPassword.equals(user.getPassword()) || password.equals(user.getPassword());
		}
		
		if (!passwordMatch) {
			return new LoginResponse(false, "Invalid username or password", null);
		}
		
		// Update last login time
		userrepo.updateLastLogin(user.getUser_id());
		
		// Create user data response
		UserData userData = new UserData(
			user.getUser_id(),
			user.getUsername(),
			user.getFirst_name(),
			user.getLast_name(),
			user.getEmail(),
			user.getContact_no(),
			user.getUt()
		);
		
		String roleMessage = "Login successful as " + 
			(user.getUt() != null ? user.getUt().getUser_type() : "User");
		
		return new LoginResponse(true, roleMessage, userData);
	}
	
	/**
	 * Original login method for backward compatibility
	 */
	public User getLogin(String username, String password) {
		User r;
		Optional<User> a1 = userrepo.getLogin(username, password);
		try {
			r = a1.get();
		} catch (Exception e) {
			r = null;
		}
		return r;
	}
	
	/**
	 * Get users by role type
	 */
	public List<User> getUsersByRole(int roleTypeId) {
		return userrepo.findUsersByType(roleTypeId);
	}
	
	/**
	 * Get active users by role type
	 */
	public List<User> getActiveUsersByRole(int roleTypeId) {
		return userrepo.findActiveUsersByType(roleTypeId);
	}
	
	/**
	 * Activate user account
	 */
	@Transactional
	public void activateUser(int userId) {
		userrepo.updateUserStatus(userId, true);
	}
	
	/**
	 * Deactivate user account
	 */
	@Transactional
	public void deactivateUser(int userId) {
		userrepo.updateUserStatus(userId, false);
	}
	
	/**
	 * Change user password
	 */
	@Transactional
	public boolean changePassword(int userId, String oldPassword, String newPassword) {
		Optional<User> userOpt = userrepo.findById(userId);
		if (!userOpt.isPresent()) {
			return false;
		}
		
		User user = userOpt.get();
		
		// Verify old password
		boolean passwordMatch = false;
		if (user.getPassword_salt() != null && !user.getPassword_salt().isEmpty()) {
			passwordMatch = passwordEncoder.verifyPassword(oldPassword, user.getPassword_salt(), user.getPassword());
		} else {
			String encodedPassword = passwordEncoder.simpleEncode(oldPassword);
			passwordMatch = encodedPassword.equals(user.getPassword()) || oldPassword.equals(user.getPassword());
		}
		
		if (!passwordMatch) {
			return false;
		}
		
		// Set new password
		String salt = passwordEncoder.generateSalt();
		String hashedPassword = passwordEncoder.hashPassword(newPassword, salt);
		user.setPassword(hashedPassword);
		user.setPassword_salt(salt);
		
		userrepo.save(user);
		return true;
	}
	
	/**
	 * Get user by ID
	 */
	public Optional<User> getUserById(int userId) {
		return userrepo.findById(userId);
	}
	
	/**
	 * Get all users
	 */
	public List<User> getAllUsers() {
		return userrepo.findAll();
	}
}
