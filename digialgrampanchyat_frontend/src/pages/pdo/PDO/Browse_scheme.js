import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
export default function Browse_scheme() {


    const [browseschemes,setbrowseschemes] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

      const pdoUser = JSON.parse(localStorage.getItem("loggedpdo") || "null");
      const first_name = pdoUser?.first_name;
      const last_name = pdoUser?.last_name;

    // var Browsesch= (u) => {
    //     u.preventDefault();
       
    const fetchSchemes = () => {
        setIsLoading(true);
        setError("");
        fetch('http://localhost:7500/getschemes')
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
            setbrowseschemes(Array.isArray(obj) ? obj : []);
          })
          .catch(() =>
            setError("Server problem. Please try again.")
          )
          .finally(() => setIsLoading(false));
    };

    useEffect(()=>{
        fetchSchemes();
    },[]);

    const filteredSchemes = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return browseschemes;
      return browseschemes.filter((e) =>
        String(e.sname || "").toLowerCase().includes(q) ||
        String(e.description || "").toLowerCase().includes(q)
      );
    }, [browseschemes, query]);
    
        

    return (
        <div>
           {first_name && last_name && (
            <h5><strong><i> Welcome {first_name}  {last_name}</i></strong></h5>
           )}
             <div className="form-container">
    
    <div className="login-form">
      <div className="form">
      <h3><i>Government Schemes</i></h3>  
        <form>
          <div className="input-container">
            <div className="d-flex flex-column flex-md-row gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by scheme name or description"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={fetchSchemes}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <div className="alert alert-info">Loading schemes...</div>}
            {!isLoading && !error && filteredSchemes.length === 0 && (
              <div className="alert alert-warning">No schemes found.</div>
            )}

            <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
                <thead>
                    <tr>
                        <th scope="co1">Scheme Name</th>
                        <th scope="co1">Scheme Description</th>
                        <th scope="co1">Link</th>
                        <th scope="co1">Start Date</th>
                        <th scope="co1">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSchemes.map((e) => {
                        return(
                            <tr key={e.sid ?? `${e.sname}-${e.startdate}`}>
                                <td>{e.sname}</td>
                                <td>{e.description}</td>
                                <td><a href={e.link} target="_blank" rel="noopener noreferrer">{e.sname} Link</a></td>
                                <td>{e.startdate}</td>
                                <td>{e.enddate}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        </div>
        </form>
        
        
      </div>
      </div>
     
      </div>
     
      </div>
    )
}
