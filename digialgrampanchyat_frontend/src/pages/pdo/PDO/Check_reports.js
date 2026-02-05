import React, { useEffect, useState } from "react";
import "./style.css";
export default function Check_reports() {


    const [ReportStatus,setReportStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

      const pdoUser = JSON.parse(localStorage.getItem("loggedpdo") || "null");
      const first_name = pdoUser?.first_name;
      const last_name = pdoUser?.last_name;

    // var Browsesch= (u) => {
    //     u.preventDefault();
       
    const fetchReports = () => {
        setIsLoading(true);
        setError("");
        fetch('http://localhost:7500/viewReports')
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
                setReportStatus(Array.isArray(obj) ? obj : []);
          })
          .catch(() =>
            setError("Server problem. Please try again.")
          )
          .finally(() => setIsLoading(false));
    };

    useEffect(()=>{
        fetchReports();
    },[]);

    var approveReport = (u) => {
        fetch('http://localhost:7500/approveReport?id='+u)
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
                //Navigate("/Userlogin");
                alert(" Report Approved Sucessfully")
              
          })
         
      };
    
      var declineReport = (d) => {
        fetch('http://localhost:7500/declineReport?id='+d)
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
              //  Navigate("/Userlogin");
              alert(" Report Declined ")
              
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
      <h3><i>Reports</i></h3>  
        <div className="d-flex flex-column flex-md-row gap-2 mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={fetchReports}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading && <div className="alert alert-info">Loading reports...</div>}
        {!isLoading && !error && ReportStatus.length === 0 && (
          <div className="alert alert-warning">No reports found.</div>
        )}

          <div className="input-container">
            <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
                <thead>
                    <tr>
                        <th scope="co1">firstname</th>
                        <th scope="co1">lastname</th>
                        <th scope="co1">work description</th>
                        <th scope="co1">actions</th>
                        {/* <th scope="co1">Start Date</th>
                        <th scope="co1">End Date</th> */}
                       
                    </tr>
                </thead>
                <tbody>
                    {ReportStatus.map((e) => {
                        return(
                            <tr key={e.id ?? `${e.fname}-${e.lname}-${e.work_desc}`}>
                                <td>{e.fname}</td>
                                <td>{e.lname}</td>
                                <td>{e.work_desc}</td>
                                <td className="d-flex gap-2">
                                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{approveReport(e.id)}} >Approve</button>
                                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{declineReport(e.id)}} >Decline</button>
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
