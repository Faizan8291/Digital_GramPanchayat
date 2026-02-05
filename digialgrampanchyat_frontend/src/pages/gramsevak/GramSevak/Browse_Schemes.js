import React, { useEffect, useMemo, useState } from "react";
import "./dashboard-ui.css";
export default function Browse_Schemes() {


    const [browseschemes,setbrowseschemes] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

      const gramUser = JSON.parse(localStorage.getItem("loggedgram") || "null");
      const first_name = gramUser?.first_name;
      const last_name = gramUser?.last_name;

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
      <div className="gs-page">
        <div className="gs-card">
          <div className="gs-header">
            <div>
              <h3 className="gs-title">Browse Schemes</h3>
              <p className="gs-subtitle">
                {first_name && last_name ? `Welcome ${first_name} ${last_name}` : "View all available government schemes."}
              </p>
            </div>
            <span className="gs-chip">{filteredSchemes.length} schemes</span>
          </div>

          <div className="gs-actions mb-3">
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

          {!isLoading && !error && filteredSchemes.length === 0 ? (
            <div className="gs-empty">No schemes found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle gs-table">
                <thead>
                  <tr>
                    <th>Scheme Name</th>
                    <th>Scheme Description</th>
                    <th>Link</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchemes.map((e) => (
                    <tr key={e.sid ?? `${e.sname}-${e.startdate}`}>
                      <td>{e.sname}</td>
                      <td>{e.description}</td>
                      <td>
                        <a href={e.link} target="_blank" rel="noopener noreferrer">
                          Open Link
                        </a>
                      </td>
                      <td>{e.startdate}</td>
                      <td>{e.enddate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
}
