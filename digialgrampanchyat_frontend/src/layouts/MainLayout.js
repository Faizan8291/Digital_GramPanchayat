import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice";

export default function MainLayout() {
  const mystate = useSelector((state) => state.logged);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("loggeduser") || "null");
  const storedGram = JSON.parse(localStorage.getItem("loggedgram") || "null");
  const storedPdo = JSON.parse(localStorage.getItem("loggedpdo") || "null");
  const storedAdmin = JSON.parse(localStorage.getItem("loggedadmin") || "null");
  const hasStoredLogin = !!storedUser || !!storedGram || !!storedPdo || !!storedAdmin;
  const isLoggedIn = mystate?.loggedIn || hasStoredLogin;
  const effectiveAdmin = storedAdmin || storedPdo;
  const roleInfo = storedUser
    ? { label: "Citizen", name: `${storedUser.first_name} ${storedUser.last_name}` }
    : storedGram
    ? { label: "Gram Sevak", name: `${storedGram.first_name} ${storedGram.last_name}` }
    : effectiveAdmin
    ? { label: "Admin", name: `${effectiveAdmin.first_name} ${effectiveAdmin.last_name}` }
    : null;
  const handleLogout = () => {
    localStorage.removeItem("loggeduser");
    localStorage.removeItem("loggedgram");
    localStorage.removeItem("loggedpdo");
    localStorage.removeItem("loggedadmin");
    dispatch(logout());
    navigate("/");
  };
  const roleNavLinks = effectiveAdmin
    ? [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/dashboard", label: "User Management" },
        { to: "/admin/dashboard", label: "Statistics" },
        { to: "/PDOHome/Check_reports", label: "Check Reports" },
        { to: "/PDOHome/Browse_scheme", label: "Browse Schemes" },
        { to: "/PDOHome/Upload_Scheme", label: "Upload Scheme" }
      ]
    : storedGram
    ? [
        { to: "/gramsevak/dashboard", label: "Dashboard" },
        { to: "/gramsevak/dashboard", label: "Certificates" },
        { to: "/GramSevakHome/Browse_Schemes", label: "Browse Schemes" },
        { to: "/GramSevakHome/Upload_scheme", label: "Upload Scheme" },
        { to: "/GramSevakHome/Problem_approval", label: "Problem Approval" },
        { to: "/GramSevakHome/Remove_scheme", label: "Remove Scheme" },
        { to: "/GramSevakHome/Report_Register", label: "Register Report" }
      ]
    : storedUser
    ? [
        { to: "/citizen/dashboard", label: "Dashboard" },
        { to: "/citizen/dashboard", label: "My Certificates" },
        { to: "/VillagersHome/BrowseSchemes", label: "Browse Schemes" },
        { to: "/VillagersHome/Register_problem", label: "Register Problem" },
        { to: "/VillagersHome/Viewproblems", label: "View Problems" }
      ]
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Role Bar (visible after login) */}
      {isLoggedIn && roleInfo && (
        <div className="bg-dark text-white d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <strong>Logged in as:</strong>
            <span className="badge bg-warning text-dark">{roleInfo.label}</span>
            <span>{roleInfo.name}</span>
          </div>
          <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {isLoggedIn && roleInfo && (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
          <Link className="navbar-brand fw-semibold" to="/">
            Digital Grampanchayat
          </Link>
          <ul className="navbar-nav mr-auto flex-row flex-wrap">
            {roleNavLinks.map((link) => (
              <li className="nav-item me-3" key={`${link.to}-${link.label}`}>
                <Link className="nav-link" to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Header/Navbar */}
      {!isLoggedIn && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <img
            src={process.env.PUBLIC_URL + "logodg.png"}
            height="60"
            alt="logo"
          />

          <Link className="navbar-brand" to="/">
            Digital Grampanchayat
          </Link>

          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/Home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Userlogin">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/login">Admin Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Aboutus">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Contact">Contact</Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Page Content - flex-grow pushes footer to bottom */}
      <div style={{ flex: '1' }}>
        <Outlet />
      </div>

      {/* Footer - Reduced spacing */}
      <div className="p-3 bg-dark text-white text-center" style={{ fontSize: '0.9rem' }}>
        <p className="mb-1" id="contact">Contact Details : 020-345867</p>
        <p className="mb-1">Head Office : Shop no. 22 ,Grampanchayat building ,Near Bhairavnath mandir, Loni, Ahmednagar</p>
        <p className="mb-0">CopyRights :</p>
      </div>
    </div>
  );
}
