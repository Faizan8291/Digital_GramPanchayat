import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function PDOHome() {
  const navigate = useNavigate();
  const pdoUser = JSON.parse(localStorage.getItem("loggedpdo") || "null");
  const adminUser = JSON.parse(localStorage.getItem("loggedadmin") || "null");
  const user = pdoUser || adminUser;

  useEffect(() => {
    if (!user) {
      navigate("/Userlogin");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container py-3">
      <h1 className="h3">Admin Operations</h1>
      <Outlet />
    </div>
  );
}
