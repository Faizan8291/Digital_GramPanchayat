import React , {useEffect} from "react";
import { Link, Outlet , useNavigate } from "react-router-dom";

export default function VillagersHome() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggeduser"));

 useEffect(() => {
      if (!user) {
        navigate("/Userlogin");
      }
    }, [user, navigate]);


if (!user) return null;

  const { first_name, last_name } = user;


  return (
    <>
      {/* ✅ VILLAGERS NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <img
          src={process.env.PUBLIC_URL + "/logodg.png"}
          height="60"
          alt="logo"
        />

        <ul className="navbar-nav ms-3">
          <li className="nav-item">
            <Link className="nav-link" to="/VillagersHome">Home</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="BrowseSchemes">Browse Schemes</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="Register_problem">Register Problem</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="Viewproblems">View Problems</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="apply-certificate">
              Apply for Certificate
            </Link>
          </li>

        </ul>
        <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown user-dropdown">
              <span
                className="nav-link dropdown-toggle user-name"
                data-bs-toggle="dropdown"
              >
                <strong>{user.first_name} {user.last_name}</strong>
              </span>
            <ul className="dropdown-menu user-menu">

              <li className="user-info">
                <strong>{user.first_name} {user.last_name}</strong>
                
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button className="dropdown-item logout-btn"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >    
                  Logout
                </button>
              </li>
            </ul>
            </li>
            </ul>
      </nav>
          <div className="container mt-4 text-center">
          <h5 className="fw-bold fst-italic">
            Welcome {first_name} {last_name}
          </h5>
        </div>
      
      <Outlet />
    </>
  );
}

