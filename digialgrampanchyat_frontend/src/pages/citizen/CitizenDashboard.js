import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import "./CitizenDashboard.css";

export default function CitizenDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    certificateType: "",
    phone: "",
    details: ""
  });

  const loggedUser = useMemo(
    () => JSON.parse(localStorage.getItem("loggeduser") || "null"),
    []
  );
  const applicantId = loggedUser?.user_id ?? loggedUser?.userId;
  const navigate = useNavigate();

  const certificateTypes = [
    { value: "INCOME", label: "Income Certificate" },
    { value: "CASTE", label: "Caste Certificate" },
    { value: "DOMICILE", label: "Domicile Certificate" },
    { value: "BIRTH", label: "Birth Certificate" },
    { value: "DEATH", label: "Death Certificate" },
    { value: "RESIDENCE", label: "Residence Certificate" },
    { value: "CHARACTER", label: "Character Certificate" },
    { value: "OTHER", label: "Other" }
  ];

  const fetchMyApplications = useCallback(async () => {
    if (!applicantId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(API.certificates.myApplications(applicantId));
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [applicantId]);

  useEffect(() => {
    if (!loggedUser) {
      navigate("/Userlogin");
      return;
    }
    fetchMyApplications();
  }, [fetchMyApplications, navigate, loggedUser]);

  if (!loggedUser) return null;

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!applicantId) {
      alert("Please login again");
      return;
    }

    if (!formData.certificateType || !formData.phone || !formData.details) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      applicantId,
      applicantName: `${loggedUser?.first_name || ""} ${loggedUser?.last_name || ""}`.trim(),
      applicantEmail: loggedUser?.email || "",
      certificateType: formData.certificateType,
      phone: formData.phone,
      details: formData.details,
      panchayatId: loggedUser?.panchayatId || ""
    };

    try {
      const res = await fetch(API.certificates.apply, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit application");

      alert("Certificate application submitted successfully");
      setShowModal(false);
      setFormData({ certificateType: "", phone: "", details: "" });
      fetchMyApplications();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(error.message || "Failed to submit application");
    }
  };

  const downloadCertificate = async (application) => {
    try {
      if (!applicantId) {
        alert("Please login again");
        return;
      }
      const res = await fetch(API.certificates.download(application.id, applicantId));
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to download certificate");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${application.certificateNumber || application.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message || "Failed to download certificate");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "APPROVED":
        return "status-approved";
      case "ISSUED":
        return "status-issued";
      case "REJECTED":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div className="citizen-dashboard">
      <div className="dashboard-header">
        <h1>Citizen Dashboard - Certificate Services</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Apply for Certificate
        </button>
      </div>

      <div className="info-banner">
        <h3>How It Works</h3>
        <ol>
          <li>Apply for the certificate by filling the application form</li>
          <li>Gram Sevak will review your application</li>
          <li>You can track your application status here</li>
        </ol>
      </div>

      <div className="applications-section">
        <h2>My Applications</h2>
        <div className="table-container">
          {loading ? (
            <div className="loading">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="no-data">
              <p>No applications yet</p>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                Apply for Your First Certificate
              </button>
            </div>
          ) : (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Certificate Type</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Certificate Number</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td><strong>{app.certificateType}</strong></td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.certificateNumber || "-"}</td>
                    <td>
                      <div className="application-details">
                        {app.status === "ISSUED" && (
                          <p className="success-text">Certificate issued</p>
                        )}
                        {app.status === "PENDING" && (
                          <p className="info-text">Under review by Gram Sevak</p>
                        )}
                        {app.status === "APPROVED" && (
                          <p className="success-text">Approved, issuing certificate</p>
                        )}
                        {app.status === "REJECTED" && (
                          <div className="rejection-info">
                            <p className="error-text">Application rejected</p>
                            <p className="rejection-reason">
                              <strong>Reason:</strong> {app.rejectionReason}
                            </p>
                          </div>
                        )}
                        {app.remarks && (
                          <p className="remarks"><strong>Remarks:</strong> {app.remarks}</p>
                        )}
                        {(app.status === "APPROVED" || app.status === "ISSUED") && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => downloadCertificate(app)}
                          >
                            Download PDF
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
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for Certificate</h2>
            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>Certificate Type *</label>
                <select
                  required
                  value={formData.certificateType}
                  onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                >
                  <option value="">Select Certificate Type</option>
                  {certificateTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Application Details *</label>
                <textarea
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Provide purpose and required details"
                  rows="5"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Submit Application
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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
