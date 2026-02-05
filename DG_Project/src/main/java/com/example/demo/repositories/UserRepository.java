package com.example.demo.repositories;

import java.util.Optional;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.User;

@Transactional
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	
	// Find user by username
	@Query("SELECT u FROM User u WHERE u.username = :username")
	Optional<User> findByUsername(@Param("username") String username);
	
	// Find user by email
	@Query("SELECT u FROM User u WHERE u.email = :email")
	Optional<User> findByEmail(@Param("email") String email);
	
	// Original login method (deprecated - use findByUsername instead)
	@Query("SELECT u FROM User u WHERE u.username = :username AND u.password = :password")
	Optional<User> getLogin(@Param("username") String username, @Param("password") String password);
	
	// Find active users by role type
	@Query("SELECT u FROM User u WHERE u.ut.type = :typeId AND u.isActive = true")
	List<User> findActiveUsersByType(@Param("typeId") int typeId);
	
	// Find all users by role type
	@Query("SELECT u FROM User u WHERE u.ut.type = :typeId")
	List<User> findUsersByType(@Param("typeId") int typeId);
	
	// Check if username exists
	@Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :username")
	boolean existsByUsername(@Param("username") String username);
	
	// Check if email exists
	@Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
	boolean existsByEmail(@Param("email") String email);
	
	// Update last login time
	@Modifying
	@Query("UPDATE User u SET u.lastLogin = CURRENT_TIMESTAMP WHERE u.user_id = :userId")
	void updateLastLogin(@Param("userId") int userId);
	
	// Activate/Deactivate user
	@Modifying
	@Query("UPDATE User u SET u.isActive = :status WHERE u.user_id = :userId")
	void updateUserStatus(@Param("userId") int userId, @Param("status") boolean status);
}
