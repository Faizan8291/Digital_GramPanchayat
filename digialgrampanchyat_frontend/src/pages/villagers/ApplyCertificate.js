import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ApplyCertificate = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        Apply for Services / Certificates
      </h2>

      <div className="row">
        {/* Birth Certificate */}
        <div className="col-md-3 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Birth Certificate</h5>
              <p className="card-text">
                Apply for new birth certificate or get duplicate.
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("birth")}   // 👈 RELATIVE PATH
              >
                Apply Now →
              </button>
            </div>
          </div>
        </div>

        {/* Other cards unchanged */}
      </div>

      {/* 👇 THIS IS REQUIRED */}
      <Outlet />
    </div>
  );
};

export default ApplyCertificate;
