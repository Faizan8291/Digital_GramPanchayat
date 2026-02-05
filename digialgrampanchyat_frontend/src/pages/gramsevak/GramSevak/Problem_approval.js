import React, { useEffect, useState } from "react";
import "./style.css";
export default function Problem_approval() {


    const [problemStatus,setProblemStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const gramUser = JSON.parse(localStorage.getItem("loggedgram") || "null");
    const first_name = gramUser?.first_name;
    const last_name = gramUser?.last_name;

    // var Browsesch= (u) => {
    //     u.preventDefault();
       
    const fetchProblems = () => {
        setIsLoading(true);
        setError("");
        fetch('http://localhost:7500/viewproblems')
          .then((res) => {
            if(res.ok)
            {
              return res.json();
            }
            else
            {
              throw new Error("server Error")
            }
          })
          .then(obj => {
                console.log(obj);
                setProblemStatus(Array.isArray(obj) ? obj : []);
          })
          .catch(() =>
            setError("Server problem. Please try again.")
          )
          .finally(() => setIsLoading(false));
    };

    useEffect(()=>{
        fetchProblems();
    },[]);

    var approveScheme = (u) => {
        fetch('http://localhost:7500/approveProblem?pid='+u)
          .then((res) => {
            if(res.ok)
            {
              return res.text();
            }
            else
            {
              throw new Error("server Error")
            }
          })
    
    
          .then(text => text.length ? JSON.parse(text) : {})
          .then(obj => {
               // Navigate("/Userlogin");
              alert("Problem Approved")
          })
         
      };
    
      var declineScheme = (d) => {
        fetch('http://localhost:7500/declineProblem?pid='+d)
          .then((res) => {
            if(res.ok)
            {
              return res.text();
            }
            else
            {
              throw new Error("server Error")
            }
          })
    
    
          .then(text => text.length ? JSON.parse(text) : {})
          .then(obj => {
               // Navigate("/Userlogin");
              alert("Problem Declined")
          })
         
      };
    
      
    

    return (
        <div>
           {first_name && last_name && (
            <h5><strong><i> Welcome {first_name}  {last_name}</i></strong></h5>
           )}
             <div className="form-container">
    
    <div className="login-form">
      <div className="form">
      <h3><i>Problem Approvals</i></h3>  
        <div className="d-flex flex-column flex-md-row gap-2 mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={fetchProblems}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading && <div className="alert alert-info">Loading problems...</div>}
        {!isLoading && !error && problemStatus.length === 0 && (
          <div className="alert alert-warning">No problems found.</div>
        )}

          <div className="input-container">
            <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
                <thead>
                    <tr>
                        <th scope="co1">Area</th>
                        <th scope="co1">date</th>
                        <th scope="co1">problem description</th>
                        <th scope="co1">Actions</th>
                        {/* <th scope="co1">Start Date</th>
                        <th scope="co1">End Date</th> */}
                       
                    </tr>
                </thead>
                <tbody>
                    {problemStatus.map((e) => {
                        return(
                            <tr key={e.pid ?? `${e.area}-${e.date}-${e.probdesc}`}>
                                <td>{e.area}</td>
                                <td>{e.date}</td>
                                <td>{e.probdesc}</td>
                                <td className="d-flex gap-2">
                                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{approveScheme(e.pid)}} >Approve</button>
                                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{declineScheme(e.pid)}} >Decline</button>
                                </td>
                                
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        </div>
        
        
      </div>
      </div>
     
      </div>
     
      </div>
    )
}
