export default function Home() {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <img
            src={process.env.PUBLIC_URL + "/logodg.png"}
            height="60"
            alt="logo"
          />
  
          <ul className="navbar-nav ms-3">
            <li className="nav-item"><a className="nav-link" href="/Home">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/Userlogin">Login</a></li>
            <li className="nav-item"><a className="nav-link" href="/Register">Register</a></li>
            <li className="nav-item"><a className="nav-link" href="/Aboutus">About Us</a></li>
            <li className="nav-item"><a className="nav-link" href="/Contact">Contact</a></li>
          </ul>
        </nav>
        
  
        {/* <div className="container mt-5">
          <h2>Welcome to Digital Grampanchayat</h2>
        </div> */}
      </>
    );
  }
  
 
  