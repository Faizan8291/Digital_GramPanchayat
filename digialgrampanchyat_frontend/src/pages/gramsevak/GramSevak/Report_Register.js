import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./dashboard-ui.css";

export default function Report_Register() {
        
        

    const init = {
        id: '',
        fname: '',
        lname: '',
        address: '',
        work_desc: '',
        status: '',
        type: '',
        link: ''
      };

      var reducer = (state, action) => {
        switch (action.type) {
          case 'register': 
            return { ...state, [action.field]: action.val };
          default:
            return state;
        }
      };



      const [Register_report, dispatch] = useReducer(reducer, init);
      const [msg,setMsg] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);


      const navigate=useNavigate();
    
      var register = (u) => {
        u.preventDefault();
        setIsSubmitting(true);
        setMsg("");
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(Register_report),
        };
        fetch('http://localhost:7500/Report_Register', options)
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
              window.alert("report send");
                //navigate("/Userlogin");
                navigate("/gramsevak/dashboard");
              
          })
          .catch(() => {
            setMsg("Unable to register report. Please try again.");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
         
      };

    
    return (
      <div className="gs-page">
        <div className="gs-card">
          <div className="gs-header">
            <div>
              <h3 className="gs-title">Register Report</h3>
              <p className="gs-subtitle">Submit field work details for review.</p>
            </div>
          </div>

          {msg && <div className="alert alert-danger">{msg}</div>}

          <form onSubmit={register}>
            <div className="gs-grid">
              <div>
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  name="fname"
                  value={Register_report.fname}
                  onChange={(u) => {
                    dispatch({
                      type: 'register',
                      field: u.target.name,
                      val: u.target.value,
                    });
                  }}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  name="lname"
                  value={Register_report.lname}
                  onChange={(u) => {
                    dispatch({
                      type: 'register',
                      field: u.target.name,
                      val: u.target.value,
                    });
                  }}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="gs-grid-full">
                <label className="form-label">Link</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter report reference link"
                  name="link"
                  value={Register_report.link}
                  onChange={(u) => {
                    dispatch({
                      type: 'register',
                      field: u.target.name,
                      val: u.target.value,
                    });
                  }}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="gs-grid-full">
                <label className="form-label">Work Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter work description"
                  name="work_desc"
                  value={Register_report.work_desc}
                  onChange={(u) => {
                    dispatch({
                      type: 'register',
                      field: u.target.name,
                      val: u.target.value,
                    });
                  }}
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="gs-actions mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>

    )
}
