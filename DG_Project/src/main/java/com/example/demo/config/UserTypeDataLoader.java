package com.example.demo.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.entities.UserType;
import com.example.demo.repositories.UserTypeRepository;

@Configuration
public class UserTypeDataLoader {

    @Bean
    CommandLineRunner loadUserTypes(UserTypeRepository repo) {
        return args -> {

            if (repo.count() == 0) {
                repo.saveAll(List.of(
                        new UserType(0, "ADMIN"),
                        new UserType(0, "MANAGER"),
                        new UserType(0, "CITIZEN")
                ));
                System.out.println("✅ User types inserted");
            } else {
                System.out.println("ℹ️ User types already exist, skipping insert");
            }
        };
    }
}