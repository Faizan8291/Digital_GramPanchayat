import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function GramSevakHome() {
  const navigate = useNavigate();
  const gramUser = JSON.parse(localStorage.getItem("loggedgram") || "null");

  useEffect(() => {
    if (!gramUser) {
      navigate("/Userlogin");
    }
  }, [gramUser, navigate]);

  if (!gramUser) return null;

  return (
    <div className="container py-3">
      <h1 className="h3">GramSevak Dashboard</h1>
      <Outlet />
    </div>
  );
}
