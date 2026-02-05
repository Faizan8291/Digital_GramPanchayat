package com.example.demo.dto;

import com.example.demo.entities.UserType;

public class LoginResponse {
    private boolean success;
    private String message;
    private UserData userData;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message, UserData userData) {
        this.success = success;
        this.message = message;
        this.userData = userData;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserData getUserData() {
        return userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    // Inner class for user data
    public static class UserData {
        private int userId;
        private String username;
        private String firstName;
        private String lastName;
        private String email;
        private String contactNo;
        private UserType userType;
        private String token; // For future JWT implementation

        public UserData() {
        }

        public UserData(int userId, String username, String firstName, String lastName, 
                       String email, String contactNo, UserType userType) {
            this.userId = userId;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.contactNo = contactNo;
            this.userType = userType;
        }

        // Getters and Setters
        public int getUserId() {
            return userId;
        }

        public void setUserId(int userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getContactNo() {
            return contactNo;
        }

        public void setContactNo(String contactNo) {
            this.contactNo = contactNo;
        }

        public UserType getUserType() {
            return userType;
        }

        public void setUserType(UserType userType) {
            this.userType = userType;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
