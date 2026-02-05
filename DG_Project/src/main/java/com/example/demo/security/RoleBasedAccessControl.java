package com.example.demo.security;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

/**
 * Role-based access control configuration
 * Defines permissions for each user role
 */
@Component
public class RoleBasedAccessControl {
    
    // Role IDs
    public static final int ROLE_VILLAGER = 1;
    public static final int ROLE_SARPANCH = 2;
    public static final int ROLE_SECRETARY = 3;
    public static final int ROLE_BLOCK_OFFICER = 4;
    public static final int ROLE_DISTRICT_OFFICER = 5;
    public static final int ROLE_ADMIN = 6;
    
    // Permissions
    public static final String PERM_VIEW_SCHEMES = "VIEW_SCHEMES";
    public static final String PERM_APPLY_SCHEMES = "APPLY_SCHEMES";
    public static final String PERM_VIEW_PROBLEMS = "VIEW_PROBLEMS";
    public static final String PERM_SUBMIT_PROBLEMS = "SUBMIT_PROBLEMS";
    public static final String PERM_MANAGE_PROBLEMS = "MANAGE_PROBLEMS";
    public static final String PERM_VIEW_REPORTS = "VIEW_REPORTS";
    public static final String PERM_GENERATE_REPORTS = "GENERATE_REPORTS";
    public static final String PERM_MANAGE_USERS = "MANAGE_USERS";
    public static final String PERM_APPROVE_DOCUMENTS = "APPROVE_DOCUMENTS";
    public static final String PERM_VIEW_BIRTH_DEATH = "VIEW_BIRTH_DEATH";
    public static final String PERM_REGISTER_BIRTH_DEATH = "REGISTER_BIRTH_DEATH";
    public static final String PERM_VERIFY_BIRTH_DEATH = "VERIFY_BIRTH_DEATH";
    public static final String PERM_MANAGE_SCHEMES = "MANAGE_SCHEMES";
    public static final String PERM_VIEW_ALL_PANCHAYATS = "VIEW_ALL_PANCHAYATS";
    
    private Map<Integer, Set<String>> rolePermissions;
    
    public RoleBasedAccessControl() {
        initializePermissions();
    }
    
    private void initializePermissions() {
        rolePermissions = new HashMap<>();
        
        // Villager permissions
        Set<String> villagerPerms = new HashSet<>();
        villagerPerms.add(PERM_VIEW_SCHEMES);
        villagerPerms.add(PERM_APPLY_SCHEMES);
        villagerPerms.add(PERM_VIEW_PROBLEMS);
        villagerPerms.add(PERM_SUBMIT_PROBLEMS);
        villagerPerms.add(PERM_REGISTER_BIRTH_DEATH);
        rolePermissions.put(ROLE_VILLAGER, villagerPerms);
        
        // Sarpanch permissions
        Set<String> sarpanchPerms = new HashSet<>();
        sarpanchPerms.addAll(villagerPerms);
        sarpanchPerms.add(PERM_MANAGE_PROBLEMS);
        sarpanchPerms.add(PERM_VIEW_REPORTS);
        sarpanchPerms.add(PERM_GENERATE_REPORTS);
        sarpanchPerms.add(PERM_APPROVE_DOCUMENTS);
        sarpanchPerms.add(PERM_VIEW_BIRTH_DEATH);
        sarpanchPerms.add(PERM_VERIFY_BIRTH_DEATH);
        rolePermissions.put(ROLE_SARPANCH, sarpanchPerms);
        
        // Secretary permissions
        Set<String> secretaryPerms = new HashSet<>();
        secretaryPerms.addAll(sarpanchPerms);
        secretaryPerms.add(PERM_MANAGE_SCHEMES);
        rolePermissions.put(ROLE_SECRETARY, secretaryPerms);
        
        // Block Officer permissions
        Set<String> blockOfficerPerms = new HashSet<>();
        blockOfficerPerms.addAll(secretaryPerms);
        blockOfficerPerms.add(PERM_VIEW_ALL_PANCHAYATS);
        rolePermissions.put(ROLE_BLOCK_OFFICER, blockOfficerPerms);
        
        // District Officer permissions
        Set<String> districtOfficerPerms = new HashSet<>();
        districtOfficerPerms.addAll(blockOfficerPerms);
        districtOfficerPerms.add(PERM_MANAGE_USERS);
        rolePermissions.put(ROLE_DISTRICT_OFFICER, districtOfficerPerms);
        
        // Admin permissions (all permissions)
        Set<String> adminPerms = new HashSet<>();
        adminPerms.addAll(districtOfficerPerms);
        rolePermissions.put(ROLE_ADMIN, adminPerms);
    }
    
    /**
     * Check if a role has a specific permission
     */
    public boolean hasPermission(int roleId, String permission) {
        Set<String> permissions = rolePermissions.get(roleId);
        return permissions != null && permissions.contains(permission);
    }
    
    /**
     * Get all permissions for a role
     */
    public Set<String> getPermissions(int roleId) {
        return rolePermissions.getOrDefault(roleId, new HashSet<>());
    }
    
    /**
     * Get role name by ID
     */
    public static String getRoleName(int roleId) {
        switch (roleId) {
            case ROLE_VILLAGER: return "Villager";
            case ROLE_SARPANCH: return "Sarpanch";
            case ROLE_SECRETARY: return "Secretary";
            case ROLE_BLOCK_OFFICER: return "Block Officer";
            case ROLE_DISTRICT_OFFICER: return "District Officer";
            case ROLE_ADMIN: return "Admin";
            default: return "Unknown";
        }
    }
}
