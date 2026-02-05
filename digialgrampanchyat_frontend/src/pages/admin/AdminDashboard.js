import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [filters, setFilters] = useState({
    roleType: "",
    isActive: ""
  });
  const navigate = useNavigate();
  const loggedAdmin = useMemo(
    () => JSON.parse(localStorage.getItem("loggedadmin") || "null"),
    []
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    contact_no: "",
    address: "",
    aadharcard_no: "",
    type: ""
  });

  const fetchUserTypes = useCallback(async () => {
    try {
      const res = await fetch(API.userTypes);
      const data = await res.json();
      setUserTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load user types:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.roleType) params.append("roleType", filters.roleType);
      if (filters.isActive !== "") params.append("isActive", filters.isActive);

      const res = await fetch(`${API.admin.users}?${params.toString()}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStatistics = useCallback(async () => {
    try {
      const res = await fetch(API.admin.statistics);
      const data = await res.json();
      setStatistics(data || {});
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, []);

  useEffect(() => {
    if (!loggedAdmin) {
      navigate("/Userlogin");
      return;
    }
    fetchUserTypes();
    fetchUsers();
    fetchStatistics();
  }, [fetchStatistics, fetchUserTypes, fetchUsers, loggedAdmin, navigate]);

  if (!loggedAdmin) return null;

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      contact_no: "",
      address: "",
      aadharcard_no: "",
      type: ""
    });
    setSelectedUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      contact_no: user.contact_no || "",
      address: user.address || "",
      aadharcard_no: user.aadharcard_no || "",
      type: user.type || ""
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API.admin.users, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create user");
      setFeedback("User created successfully");
      setShowModal(false);
      resetForm();
      fetchUsers();
      fetchStatistics();
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API.admin.userById(selectedUser.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update user");
      setFeedback("User updated successfully");
      setShowModal(false);
      setIsEditing(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.message || "Failed to update user");
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      const res = await fetch(API.admin.userById(userId), {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to deactivate user");
      setFeedback("User deactivated successfully");
      fetchUsers();
      fetchStatistics();
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert(error.message || "Failed to deactivate user");
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      const res = await fetch(API.admin.activateUser(userId), {
        method: "PUT"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to activate user");
      setFeedback("User activated successfully");
      fetchUsers();
      fetchStatistics();
    } catch (error) {
      console.error("Error activating user:", error);
      alert(error.message || "Failed to activate user");
    }
  };

  const getRoleName = (type) => {
    const match = userTypes.find((u) => String(u.type) === String(type));
    return match ? match.user_type : "Unknown";
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard - User Management</h1>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => { fetchUsers(); fetchStatistics(); }}>
            Refresh
          </button>
          <button className="btn-primary" onClick={openCreateModal}>
            + Create New User
          </button>
        </div>
      </div>
      {feedback && <p className="feedback">{feedback}</p>}

      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{statistics.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-number">{statistics.activeUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Inactive Users</h3>
          <p className="stat-number">{statistics.inactiveUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p className="stat-number">{statistics.roleDistribution?.[6] || 0}</p>
        </div>
      </div>

      <div className="filters">
        <select
          value={filters.roleType}
          onChange={(e) => setFilters({ ...filters, roleType: e.target.value })}
        >
          <option value="">All Roles</option>
          {userTypes.map((role) => (
            <option key={role.type} value={role.type}>
              {role.user_type}
            </option>
          ))}
        </select>

        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{`${user.first_name || ""} ${user.last_name || ""}`.trim()}</td>
                  <td>{user.email}</td>
                  <td>{user.contact_no || "-"}</td>
                  <td>{getRoleName(user.type)}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => openEditModal(user)}>
                        Edit
                      </button>
                      {user.isActive ? (
                        <button className="btn-delete" onClick={() => handleDeactivateUser(user.id)}>
                          Deactivate
                        </button>
                      ) : (
                        <button className="btn-activate" onClick={() => handleActivateUser(user.id)}>
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit User" : "Create New User"}</h2>
            <form onSubmit={isEditing ? handleUpdateUser : handleCreateUser}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password {!isEditing && "*"}</label>
                <input
                  type="password"
                  required={!isEditing}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditing ? "Leave blank to keep current" : ""}
                />
              </div>

              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact_no}
                  onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  value={formData.aadharcard_no}
                  onChange={(e) => setFormData({ ...formData, aadharcard_no: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>User Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Select user type</option>
                  {userTypes.map((role) => (
                    <option key={role.type} value={role.type}>
                      {role.user_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {isEditing ? "Update User" : "Create User"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
