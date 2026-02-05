import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Upload_scheme() {
const init = {
    sid: '',
    sname: '',
    startdate: '',
    enddate: '',
    description: '',
    link: '',
};

var reducer = (state, action) => {
    switch (action.type) {
        case 'updatescheme': 
            return { ...state, [action.field]: action.val };
        default:
            return state;
    }
};

const [schemes, dispatch] = useReducer(reducer, init);
const [isSubmitting, setIsSubmitting] = useState(false);
const [msg, setMsg] = useState("");

const navigate = useNavigate();

var updatescheme = (s) => {
    s.preventDefault();
    setIsSubmitting(true);
    setMsg("");
    // userproblem.useridfk=userid;
    
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(schemes),
    };


    fetch('http://localhost:7500/uploadscheme', options)
        .then((res) => {
            if (res.ok) {
                console.log(res);
                return res.text();
            }
            else {
                throw new Error("server Error")
            }
        })


        .then(text => text.length ? JSON.parse(text) : {})
        .then(obj => {
            console.log(obj);
          // navigate("/Browse_Schemes");
          alert(" Scheme uploaded Sucessfully Navigate to show schemes")


        })
        .catch(() => {
            setMsg("Could not upload scheme. Please try again.");
        })
        .finally(() => {
            setIsSubmitting(false);
        });

};
return(
    <div>
        <div className="form-container">

            <div className="login-form">
                <div className="form">
                    <h3>Upload schemes</h3>
                    {msg && <div className="alert alert-danger">{msg}</div>}
                    <form onSubmit={updatescheme}>
                        <div className="input-container">

                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Scheme Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter scheme name"
                                        name="sname"
                                        value={schemes.sname}
                                        onChange={(s) => {
                                            dispatch({
                                                type: 'updatescheme',
                                                field: s.target.name,
                                                val: s.target.value,
                                            });
                                        }}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">Link</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Put link here"
                                        name="link"
                                        value={schemes.link}
                                        onChange={(s) => {
                                            dispatch({
                                                type: 'updatescheme',
                                                field: s.target.name,
                                                val: s.target.value,
                                            });
                                        }}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Scheme Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        placeholder="Enter scheme here..."
                                        value={schemes.description}
                                        onChange={(s) => {
                                            dispatch({
                                                type: 'updatescheme',
                                                field: s.target.name,
                                                val: s.target.value,
                                            });
                                        }}
                                        rows="4"
                                        required
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="startdate"
                                        value={schemes.startdate}
                                        onChange={(s) => {
                                            dispatch({
                                                type: 'updatescheme',
                                                field: s.target.name,
                                                val: s.target.value,
                                            });
                                        }}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="enddate"
                                        value={schemes.enddate}
                                        onChange={(s) => {
                                            dispatch({
                                                type: 'updatescheme',
                                                field: s.target.name,
                                                val: s.target.value,
                                            });
                                        }}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Update Scheme"}
                            </button>

                        </div>
                    </form>
                </div>
            </div>

        </div>

    </div>

)
}
