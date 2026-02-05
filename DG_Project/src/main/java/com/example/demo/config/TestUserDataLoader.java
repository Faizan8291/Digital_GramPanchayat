package com.example.demo.config;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.entities.User;
import com.example.demo.entities.UserType;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.UserTypeRepository;
import com.example.demo.security.PasswordEncoder;

@Configuration
public class TestUserDataLoader {

    @Bean
    CommandLineRunner loadTestUser(UserRepository userRepo, UserTypeRepository userTypeRepo, PasswordEncoder encoder) {
        return args -> {
            String testUsername = "testuser";
            if (userRepo.existsByUsername(testUsername)) {
                System.out.println("\u2139\uFE0F Test user already exists, skipping insert");
                return;
            }

            Optional<UserType> citizenType = userTypeRepo.findAll().stream()
                    .filter(t -> "CITIZEN".equalsIgnoreCase(t.getUser_type()))
                    .findFirst();

            if (!citizenType.isPresent()) {
                System.out.println("\u26A0\uFE0F No CITIZEN user type found. Test user not created.");
                return;
            }

            User u = new User();
            u.setUt(citizenType.get());
            u.setUsername(testUsername);
            u.setFirst_name("Test");
            u.setLast_name("User");
            u.setEmail("testuser@example.com");
            u.setAddress("Demo Street");
            u.setContact_no("9999999999");
            u.setAadharcard_no("123456789012");
            u.setIsActive(true);

            String salt = encoder.generateSalt();
            String hashedPassword = encoder.hashPassword("test123", salt);
            u.setPassword(hashedPassword);
            u.setPassword_salt(salt);

            userRepo.save(u);
            System.out.println("\u2705 Test user created: username=testuser password=test123 role=CITIZEN");
        };
    }
}
