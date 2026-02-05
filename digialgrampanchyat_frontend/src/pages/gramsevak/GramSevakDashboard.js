import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import "./GramSevakDashboard.css";

export default function GramSevakDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [statistics, setStatistics] = useState({});

  const loggedGram = useMemo(
    () => JSON.parse(localStorage.getItem("loggedgram") || "null"),
    []
  );
  const loggedPdo = useMemo(
    () => JSON.parse(localStorage.getItem("loggedpdo") || "null"),
    []
  );
  const currentUser = loggedGram || loggedPdo;
  const navigate = useNavigate();

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentUser?.panchayatId) {
        params.append("panchayatId", currentUser.panchayatId);
      }

      const endpoint =
        statusFilter === "PENDING"
          ? API.certificates.pending(params.toString())
          : API.certificates.all(`status=${statusFilter}${params.toString() ? `&${params.toString()}` : ""}`);

      const res = await fetch(endpoint);
      const data = await res.json();

      const certs = data.pendingCertificates || data.certificates || [];
      setCertificates(certs);

      const statsRes = await fetch(API.certificates.all(params.toString()));
      const statsData = await statsRes.json();
      setStatistics(statsData.statusCount || {});
    } catch (error) {
      console.error("Error fetching certificates:", error);
      alert("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.panchayatId, statusFilter]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/Userlogin");
      return;
    }
    fetchCertificates();
  }, [fetchCertificates, navigate, currentUser]);

  if (!currentUser) return null;

  const openApprovalModal = (certificate) => {
    setSelectedCertificate(certificate);
    setActionType("approve");
    setRemarks("");
    setShowModal(true);
  };

  const openRejectionModal = (certificate) => {
    setSelectedCertificate(certificate);
    setActionType("reject");
    setRejectionReason("");
    setShowModal(true);
  };

  const handleApproveCertificate = async () => {
    if (!selectedCertificate) return;
    try {
      const payload = {
        approverId: currentUser?.user_id ?? currentUser?.userId,
        remarks
      };
      const res = await fetch(API.certificates.approve(selectedCertificate.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to approve certificate");

      alert("Certificate approved successfully");
      setShowModal(false);
      fetchCertificates();
    } catch (error) {
      console.error("Error approving certificate:", error);
      alert(error.message || "Failed to approve certificate");
    }
  };

  const handleRejectCertificate = async () => {
    if (!selectedCertificate) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      const payload = {
        approverId: currentUser?.user_id ?? currentUser?.userId,
        reason: rejectionReason
      };
      const res = await fetch(API.certificates.reject(selectedCertificate.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reject certificate");

      alert("Certificate rejected");
      setShowModal(false);
      fetchCertificates();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      alert(error.message || "Failed to reject certificate");
    }
  };

  const viewCertificateDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setActionType("view");
    setShowModal(true);
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

  return (
    <div className="gramsevak-dashboard">
      <div className="dashboard-header">
        <h1>Gram Sevak Dashboard - Certificate Management</h1>
        <div className="user-info">
          Welcome, {currentUser?.first_name || "Officer"}
        </div>
      </div>

      <div className="statistics-grid">
        <div className="stat-card pending">
          <h3>Pending Applications</h3>
          <p className="stat-number">{statistics.PENDING || 0}</p>
        </div>
        <div className="stat-card approved">
          <h3>Approved</h3>
          <p className="stat-number">{statistics.APPROVED || 0}</p>
        </div>
        <div className="stat-card issued">
          <h3>Issued</h3>
          <p className="stat-number">{statistics.ISSUED || 0}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <p className="stat-number">{statistics.REJECTED || 0}</p>
        </div>
      </div>

      <div className="filters">
        <label>Filter by Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="">All Certificates</option>
          <option value="APPROVED">Approved</option>
          <option value="ISSUED">Issued</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="no-data">No certificates found</div>
        ) : (
          <table className="certificates-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Certificate Type</th>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.id}</td>
                  <td><strong>{cert.certificateType}</strong></td>
                  <td>{cert.applicantName}</td>
                  <td>{cert.applicantEmail}</td>
                  <td>{cert.applicantPhone || "-"}</td>
                  <td>{formatDate(cert.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${String(cert.status).toLowerCase()}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view" onClick={() => viewCertificateDetails(cert)}>
                        View
                      </button>
                      {cert.status === "PENDING" && (
                        <>
                          <button className="btn-approve" onClick={() => openApprovalModal(cert)}>
                            Approve
                          </button>
                          <button className="btn-reject" onClick={() => openRejectionModal(cert)}>
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedCertificate && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {actionType === "view" && (
              <>
                <h2>Certificate Details</h2>
                <div className="certificate-details">
                  <div className="detail-row"><strong>Certificate ID:</strong><span>{selectedCertificate.id}</span></div>
                  <div className="detail-row"><strong>Certificate Type:</strong><span>{selectedCertificate.certificateType}</span></div>
                  <div className="detail-row"><strong>Applicant Name:</strong><span>{selectedCertificate.applicantName}</span></div>
                  <div className="detail-row"><strong>Email:</strong><span>{selectedCertificate.applicantEmail}</span></div>
                  <div className="detail-row"><strong>Phone:</strong><span>{selectedCertificate.applicantPhone || "-"}</span></div>
                  <div className="detail-row"><strong>Application Details:</strong><span>{selectedCertificate.applicationDetails}</span></div>
                  <div className="detail-row"><strong>Status:</strong><span className={`status-badge ${String(selectedCertificate.status).toLowerCase()}`}>{selectedCertificate.status}</span></div>
                  <div className="detail-row"><strong>Applied On:</strong><span>{formatDate(selectedCertificate.createdAt)}</span></div>
                  {selectedCertificate.certificateNumber && (
                    <div className="detail-row"><strong>Certificate Number:</strong><span>{selectedCertificate.certificateNumber}</span></div>
                  )}
                  {selectedCertificate.rejectionReason && (
                    <div className="detail-row"><strong>Rejection Reason:</strong><span className="rejection-text">{selectedCertificate.rejectionReason}</span></div>
                  )}
                  {selectedCertificate.remarks && (
                    <div className="detail-row"><strong>Remarks:</strong><span>{selectedCertificate.remarks}</span></div>
                  )}
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </>
            )}

            {actionType === "approve" && (
              <>
                <h2>Approve Certificate</h2>
                <div className="certificate-summary">
                  <p><strong>Applicant:</strong> {selectedCertificate.applicantName}</p>
                  <p><strong>Type:</strong> {selectedCertificate.certificateType}</p>
                </div>
                <div className="form-group">
                  <label>Remarks (Optional):</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks"
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button className="btn-approve" onClick={handleApproveCertificate}>
                    Confirm Approval
                  </button>
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {actionType === "reject" && (
              <>
                <h2>Reject Certificate</h2>
                <div className="certificate-summary">
                  <p><strong>Applicant:</strong> {selectedCertificate.applicantName}</p>
                  <p><strong>Type:</strong> {selectedCertificate.certificateType}</p>
                </div>
                <div className="form-group">
                  <label>Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide reason"
                    rows="4"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button className="btn-reject" onClick={handleRejectCertificate}>
                    Confirm Rejection
                  </button>
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
