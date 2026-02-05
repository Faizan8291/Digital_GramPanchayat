import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const res = await fetch(API.auth.adminLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, username: usernameOrEmail, password })
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        localStorage.removeItem("loggeduser");
        localStorage.removeItem("loggedgram");
        localStorage.removeItem("loggedpdo");
        localStorage.setItem(
          "loggedadmin",
          JSON.stringify({
            user_id: data.userId,
            username: data.username,
            email: data.email,
            first_name: "Admin",
            last_name: ""
          })
        );
        navigate("/admin/dashboard");
        return;
      }

      // Fallback: if admin endpoint is restrictive/misaligned, use common auth endpoint and validate role.
      const authRes = await fetch(API.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameOrEmail, password })
      });
      const authData = await authRes.json().catch(() => null);
      if (!authRes.ok || !authData?.success) {
        throw new Error(data?.message || authData?.message || "Admin login failed");
      }

      const responseUser = authData?.userData ?? authData?.user ?? {};
      const userTypeObj = responseUser?.userType ?? responseUser?.ut ?? {};
      const roleStr = String(
        userTypeObj?.user_type ??
          userTypeObj?.userType ??
          responseUser?.role ??
          responseUser?.userType ??
          ""
      ).toLowerCase();
      const rawType = userTypeObj?.type ?? responseUser?.type ?? responseUser?.userTypeId;
      const resolvedType = Number.isFinite(Number(rawType))
        ? Number(rawType)
        : ["admin", "administrator"].includes(roleStr)
        ? 1
        : NaN;

      if (resolvedType !== 1) {
        throw new Error("Access denied. Admin role required.");
      }

      localStorage.removeItem("loggeduser");
      localStorage.removeItem("loggedgram");
      localStorage.removeItem("loggedpdo");
      localStorage.setItem(
        "loggedadmin",
        JSON.stringify({
          user_id: responseUser?.userId ?? responseUser?.user_id,
          username: responseUser?.username ?? usernameOrEmail,
          email: responseUser?.email ?? "",
          first_name: responseUser?.firstName ?? responseUser?.first_name ?? "Admin",
          last_name: responseUser?.lastName ?? responseUser?.last_name ?? ""
        })
      );
      navigate("/admin/dashboard");
    } catch (error) {
      setMessage(error.message || "Admin login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h2>Admin Sign In</h2>
        <p>Use admin credentials to access user management tools.</p>
        {message && <div className="admin-login-error">{message}</div>}
        <label>Username or Email</label>
        <input
          type="text"
          required
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="admin@example.com"
        />
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
