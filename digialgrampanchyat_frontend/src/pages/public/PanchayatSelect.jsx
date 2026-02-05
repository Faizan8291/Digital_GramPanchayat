import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function SelectPanchayat() {
  const navigate = useNavigate();

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [gp, setGp] = useState("");

  const handleFind = () => {
    // after find → go to home page (not login)
    navigate("/Home");
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>

        {/* ✅ BLUE NAVBAR */}
        <div style={styles.navbar}>
          <div style={styles.navLeft}>
            <img
              src={process.env.PUBLIC_URL + "/logodg.png"}
              height="60"
              alt="logo"
            />
            <h2 style={styles.navTitle}>Digital Gram Panchayat</h2>
          </div>
        </div>

        {/* ✅ HERO */}
        <div style={styles.hero}>
          <h1 style={styles.heroH1}>Welcome to Digital Gram Panchayat</h1>
          <p style={styles.heroP}>Select your Panchayat to continue</p>
        </div>

        {/* ✅ SELECTION CARD */}
        <div style={styles.card}>
          <select style={styles.select} value={state} onChange={e => setState(e.target.value)}>
            <option value="">Select State</option>
            <option>Maharashtra</option>
            <option>Gujarat</option>
          </select>

          <select style={styles.select} value={district} onChange={e => setDistrict(e.target.value)}>
            <option value="">Select District</option>
            <option>Pune</option>
            <option>Nagpur</option>
          </select>

          <select style={styles.select} value={subDistrict} onChange={e => setSubDistrict(e.target.value)}>
            <option value="">Select Sub District</option>
            <option>Haveli</option>
            <option>Mulshi</option>
          </select>

          <select style={styles.select} value={gp} onChange={e => setGp(e.target.value)}>
            <option value="">Select Gram Panchayat</option>
            <option>Shivapur</option>
            <option>Wagholi</option>
          </select>

          <button style={styles.btn} onClick={handleFind}>Find</button>
        </div>

      </div>
    </div>
  );
}

export default SelectPanchayat;

  const styles = {
  navbar: {
    background: "#0d6efd",
    color: "white",
    padding: "12px 30px",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navTitle: {
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "600",
  },
  hero: {
    textAlign: "center",
    padding: "20px 200px",
    color: "white",
    
  },
  heroH1: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "6.5rem",
    fontWeight: "600", // Use 900 for that maximum "aesthetic" impact
    letterSpacing: "-0.05em", // Slightly tighter for Montserrat
    marginBottom: "10px",
    color: "#e5ff00b0",
    textShadow: "0 4px 20px rgba(0,0,0,0.4)"
  },
  heroP: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.4rem",
    fontWeight: "300",
    letterSpacing: "0.05em", // Subtext looks better slightly spaced out
    opacity: "0.85"
  },

  btn: {
    fontFamily: "'Montserrat', sans-serif",
    padding: "8px",
    borderRadius: "12px",
    backgroundColor: "#49ec13df",
    color: "white",
    fontWeight: "600",
    letterSpacing: "0.5px", // Makes the button text look cleaner
    border: "none",
    cursor: "pointer"
  },

 
 

  card: {
    width: "480px",
    margin: "auto",
    backdropFilter: "blur(20px)", 
    boxShadow: "0 8px 30px rgba(173, 181, 83, 0.78)",
    backgroundColor: "rgba(245, 245, 245, 0.02)", 
    border: "1px solid rgba(214, 233, 120, 0.97)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },   

  page: {
    minHeight: "100vh",
    backgroundImage: "url(/Panchayat_bg.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },

  overlay: {
    minHeight: "100vh",
    background: "rgba(0,0,0,0.45)",
    paddingBottom: "40px"
  }

};
