import { useEffect ,useState } from "react"
import "./dashboard-ui.css";

export default function Remove_scheme(){

    const[schemes,removescheme]=useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchSchemes = () => {
        setIsLoading(true);
        setError("");
        fetch("http://localhost:7500/getschemes")
        .then(resp=>resp.json())                                //resp.json - this will return an object from json response
        .then((obj)=>{
            removescheme(Array.isArray(obj) ? obj : []);
        })
        .catch(() => setError("Server problem. Please try again."))
        .finally(() => setIsLoading(false));
    };

    useEffect(()=>{
        fetchSchemes();
    },[])

    const deleteScheme=(s,e)=>{
      s.preventDefault();
        const ok = window.confirm("Remove this scheme?");
        if (!ok) return;
        fetch(`http://localhost:7500/deleteBysid?sid=${e}`)
        .then(resp=>resp.json())
        .then(obj=>  {    if(obj===true)
                        {
                            alert("Scheme removed...");
                            fetchSchemes();
                        } else {
                            setError("Failed to remove scheme.");
                        }
        })
        .catch(() => setError("Failed to remove scheme. Please try again."));
    }

    

    return(
        <div className="gs-page">
          <div className="gs-card">
            <div className="gs-header">
              <div>
                <h3 className="gs-title">Remove Schemes</h3>
                <p className="gs-subtitle">Delete outdated or invalid scheme entries.</p>
              </div>
              <span className="gs-chip">{schemes.length} total</span>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 mb-3">
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
            {!isLoading && !error && schemes.length === 0 ? (
                <div className="gs-empty">No schemes found.</div>
            ) : (
            <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                    <thead>
                        <tr>
                          <th>sid</th>
                          <th>sname</th>
                          <th>description</th>
                          <th>link</th>
                          <th>startdate</th>
                          <th>enddate</th>
                          <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {   
                        schemes.map((e)=>{
                            return (
                              <tr key={e.sid ?? `${e.sname}-${e.startdate}`}>
                                <td>{e.sid}</td>
                                <td>{e.sname}</td>
                                <td>{e.description}</td>
                                <td><a href={e.link} target="_blank" rel="noopener noreferrer">{e.sname} Link</a></td>
                                <td>{e.startdate}</td>
                                <td>{e.enddate}</td>
                                <td>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={(s)=>{deleteScheme(s,e.sid)}} >Remove</button>
                                </td>
                              </tr>
                            );
                        })  
                    }
                    </tbody>
                </table>
            </div>
            )}
          </div>
        </div>
    )
}
