import { useState } from "react";
import "./BirthCertificate.css";
import { useNavigate } from "react-router-dom";

function BirthCertificateForm() {
  const [formData, setFormData] = useState({
    bname: "",
    date: "",
    hospitalname: "",
    bplace: "",
    useridfk: 1, // Default user ID
    bdtype: 1, // 1 for birth, 2 for death
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  // For downloading existing certificates
  const [searchCertNo, setSearchCertNo] = useState("");
  const [searchBid, setSearchBid] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:7500/registerrecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register birth record");
      }

      const data = await response.json();
      setCertificateData(data);
      setSuccess(true);
      
      // Reset form
      setFormData({
        bname: "",
        date: "",
        hospitalname: "",
        bplace: "",
        useridfk: 1,
        bdtype: 1,
      });

      // Show success message
      alert(`Birth certificate registered successfully!\nCertificate Number: ${data.certificateNumber}`);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadByCertificateNumber = async () => {
    if (!searchCertNo) {
      alert("Please enter a certificate number");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7500/birth-certificate/download/${searchCertNo}`
      );

      if (!response.ok) {
        throw new Error("Certificate not found");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${searchCertNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || "Failed to download certificate");
      console.error("Error:", err);
    }
  };

  const downloadByRecordId = async () => {
    if (!searchBid) {
      alert("Please enter a record ID");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7500/birth-certificate/download/id/${searchBid}`
      );

      if (!response.ok) {
        throw new Error("Certificate not found");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `birth_certificate_${searchBid}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || "Failed to download certificate");
      console.error("Error:", err);
    }
  };

  const downloadCurrentCertificate = async () => {
    if (!certificateData || !certificateData.certificateNumber) {
      alert("No certificate data available");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7500/birth-certificate/download/${certificateData.certificateNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to download certificate");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certificateData.certificateNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || "Failed to download certificate");
      console.error("Error:", err);
    }
  };

  return (
    <div className="birth-certificate-container">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Registration Form */}
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Birth Certificate Registration
                </h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && certificateData && (
                  <div className="alert alert-success" role="alert">
                    <h5 className="alert-heading">Success!</h5>
                    <p className="mb-1">
                      Birth certificate registered successfully!
                    </p>
                    <hr />
                    <p className="mb-0">
                      <strong>Certificate Number:</strong>{" "}
                      {certificateData.certificateNumber}
                    </p>
                    <p className="mb-0">
                      <strong>Record ID:</strong> {certificateData.bid}
                    </p>
                    <button
                      className="btn btn-success mt-3"
                      onClick={downloadCurrentCertificate}
                    >
                      <i className="bi bi-download me-2"></i>
                      Download Certificate PDF
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="bname" className="form-label">
                      <strong>Full Name of Child *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bname"
                      name="bname"
                      value={formData.bname}
                      onChange={handleChange}
                      placeholder="Enter child's full name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      <strong>Date of Birth *</strong>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="bplace" className="form-label">
                      <strong>Place of Birth *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bplace"
                      name="bplace"
                      value={formData.bplace}
                      onChange={handleChange}
                      placeholder="Enter place of birth"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="hospitalname" className="form-label">
                      <strong>Hospital Name</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="hospitalname"
                      name="hospitalname"
                      value={formData.hospitalname}
                      onChange={handleChange}
                      placeholder="Enter hospital name (optional)"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-plus me-2"></i>
                          Register & Generate Certificate
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Download Existing Certificate Section */}
            <div className="card shadow-lg">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                  <i className="bi bi-download me-2"></i>
                  Download Existing Certificate
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <strong>By Certificate Number</strong>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={searchCertNo}
                        onChange={(e) => setSearchCertNo(e.target.value)}
                        placeholder="e.g., BC-2026-ABC123"
                      />
                      <button
                        className="btn btn-success"
                        onClick={downloadByCertificateNumber}
                      >
                        <i className="bi bi-download"></i> Download
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <strong>By Record ID</strong>
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={searchBid}
                        onChange={(e) => setSearchBid(e.target.value)}
                        placeholder="e.g., 1"
                      />
                      <button
                        className="btn btn-success"
                        onClick={downloadByRecordId}
                      >
                        <i className="bi bi-download"></i> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BirthCertificateForm;
