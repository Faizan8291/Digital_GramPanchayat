import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MainLayout() {
  const mystate = useSelector((state) => state.logged);

  return (
    <>
      {!mystate.loggedIn && (
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
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Userlogin">Login</Link>
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

      {/* Page Content */}
      <Outlet />
    </>
  );
}
