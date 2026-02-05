package com.example.demo.controller;

import com.example.demo.entities.User;
import com.example.demo.entities.UserType;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.UserTypeRepository;
import com.example.demo.security.PasswordEncoder;
import com.example.demo.security.RoleBasedAccessControl;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTypeRepository userTypeRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        String usernameOrEmail = loginRequest.get("usernameOrEmail");
        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
            usernameOrEmail = loginRequest.get("username");
        }
        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
            usernameOrEmail = loginRequest.get("email");
        }
        String password = loginRequest.get("password");

        if (usernameOrEmail == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "usernameOrEmail/username/email and password are required"));
        }

        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        User user = userOpt.get();
        int roleType = user.getUt() != null ? user.getUt().getType() : -1;
        String roleName = user.getUt() != null ? user.getUt().getUser_type() : "";
        boolean isAdminRole = roleType == RoleBasedAccessControl.ROLE_ADMIN
            || roleType == 1
            || "ADMIN".equalsIgnoreCase(roleName)
            || "SUPER_ADMIN".equalsIgnoreCase(roleName);
        if (!isAdminRole) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Access denied. Admin role required."));
        }

        boolean passwordMatch;
        if (user.getPassword_salt() != null && !user.getPassword_salt().isEmpty()) {
            passwordMatch = passwordEncoder.verifyPassword(password, user.getPassword_salt(), user.getPassword());
        } else {
            String encoded = passwordEncoder.simpleEncode(password);
            passwordMatch = encoded.equals(user.getPassword()) || password.equals(user.getPassword());
        }

        if (!passwordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Account is inactive"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Admin login successful");
        response.put("userId", user.getUser_id());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("roleType", roleType);
        response.put("roleName", user.getUt() != null ? user.getUt().getUser_type() : "Admin");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) Integer roleType,
                                         @RequestParam(required = false) Boolean isActive) {
        List<User> users = userRepository.findAll();

        if (roleType != null) {
            users = users.stream()
                .filter(user -> user.getUt() != null && user.getUt().getType() == roleType)
                .collect(Collectors.toList());
        }

        if (isActive != null) {
            users = users.stream()
                .filter(user -> isActive.equals(user.getIsActive()))
                .collect(Collectors.toList());
        }

        List<Map<String, Object>> userDTOs = users.stream()
            .map(this::userToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
            "users", userDTOs,
            "totalCount", userDTOs.size()
        ));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        return ResponseEntity.ok(userToDTO(userOpt.get()));
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> body) {
        String username = String.valueOf(body.get("username"));
        String email = String.valueOf(body.get("email"));
        String password = String.valueOf(body.get("password"));
        String firstName = String.valueOf(body.getOrDefault("first_name", ""));
        String lastName = String.valueOf(body.getOrDefault("last_name", ""));
        String address = String.valueOf(body.getOrDefault("address", ""));
        String contactNo = String.valueOf(body.getOrDefault("contact_no", ""));
        String aadhar = String.valueOf(body.getOrDefault("aadharcard_no", ""));
        int roleType = Integer.parseInt(String.valueOf(body.getOrDefault("type", RoleBasedAccessControl.ROLE_VILLAGER)));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setFirst_name(firstName);
        user.setLast_name(lastName);
        user.setAddress(address);
        user.setContact_no(contactNo);
        user.setAadharcard_no(aadhar);

        User saved = userService.registerWithRole(user, roleType);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "User created successfully", "user", userToDTO(saved)));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id,
                                        @RequestBody Map<String, Object> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        if (body.get("username") != null) user.setUsername(String.valueOf(body.get("username")));
        if (body.get("email") != null) user.setEmail(String.valueOf(body.get("email")));
        if (body.get("first_name") != null) user.setFirst_name(String.valueOf(body.get("first_name")));
        if (body.get("last_name") != null) user.setLast_name(String.valueOf(body.get("last_name")));
        if (body.get("address") != null) user.setAddress(String.valueOf(body.get("address")));
        if (body.get("contact_no") != null) user.setContact_no(String.valueOf(body.get("contact_no")));
        if (body.get("aadharcard_no") != null) user.setAadharcard_no(String.valueOf(body.get("aadharcard_no")));

        if (body.get("type") != null) {
            int roleType = Integer.parseInt(String.valueOf(body.get("type")));
            Optional<UserType> utOpt = userTypeRepository.findById(roleType);
            utOpt.ifPresent(user::setUt);
        }

        if (body.get("password") != null && !String.valueOf(body.get("password")).isEmpty()) {
            String salt = passwordEncoder.generateSalt();
            String hashed = passwordEncoder.hashPassword(String.valueOf(body.get("password")), salt);
            user.setPassword_salt(salt);
            user.setPassword(hashed);
        }

        User updated = userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User updated successfully", "user", userToDTO(updated)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deactivateUser(@PathVariable int id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User deactivated successfully"));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable int id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        user.setIsActive(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User activated successfully"));
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long activeUsers = users.stream().filter(u -> u.getIsActive() != null && u.getIsActive()).count();

        Map<Integer, Long> roleCount = new HashMap<>();
        for (User u : users) {
            if (u.getUt() != null) {
                int roleType = u.getUt().getType();
                roleCount.put(roleType, roleCount.getOrDefault(roleType, 0L) + 1);
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", totalUsers - activeUsers);
        stats.put("roleDistribution", roleCount);

        return ResponseEntity.ok(stats);
    }

    private Map<String, Object> userToDTO(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getUser_id());
        dto.put("username", user.getUsername());
        dto.put("email", user.getEmail());
        dto.put("first_name", user.getFirst_name());
        dto.put("last_name", user.getLast_name());
        dto.put("address", user.getAddress());
        dto.put("contact_no", user.getContact_no());
        dto.put("aadharcard_no", user.getAadharcard_no());
        dto.put("isActive", user.getIsActive());
        if (user.getUt() != null) {
            dto.put("type", user.getUt().getType());
            dto.put("user_type", user.getUt().getUser_type());
        }
        return dto;
    }
}
