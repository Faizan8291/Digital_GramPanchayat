import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function VillagersHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggeduser") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/Userlogin");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <div className="container mt-4 text-center">
        <h5 className="fw-bold fst-italic">
          Welcome {user.first_name} {user.last_name}
        </h5>
      </div>
      <Outlet />
    </>
  );
}
