import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Register_problem() {

    const loggedUser = JSON.parse(localStorage.getItem("loggeduser") || "null");
    const userid = loggedUser?.user_id;

    const init = {
        probdesc: '',
        area: '',
        date: '',
        status: '',
        useridfk: '',
    };

    var reducer = (state, action) => {
        switch (action.type) {
            case 'probregister':
                return { ...state, [action.field]: action.val };
            default:
                return state;
        }
    };

    const [userproblem, dispatch] = useReducer(reducer, init);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    var probregister = (u) => {
        u.preventDefault();
        if (!userid) {
            setMsg("Please login again to register a problem.");
            return;
        }
        setIsSubmitting(true);
        setMsg("");
        const payload = { ...userproblem, useridfk: userid };
        
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        };


        fetch('http://localhost:7500/regprob', options)
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
                navigate("/VillagersHome/Viewproblems");
            })
            .catch(() => {
                setMsg("Could not register the problem. Please try again.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });

    };


    return (
        <div>
                      

            <div className="form-container">

                <div className="login-form">
                    <div className="form">
                        <h3>Register Problem</h3>
                        {!loggedUser && (
                            <div className="alert alert-warning">
                                Please login to register a problem.
                            </div>
                        )}
                        {msg && (
                            <div className="alert alert-danger">
                                {msg}
                            </div>
                        )}
                        <form onSubmit={probregister}>
                            <div className="input-container">
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label">Area Where Problem Occured</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Area"
                                            name="area"
                                            value={userproblem.area}
                                            onChange={(u) => {
                                                dispatch({
                                                    type: 'probregister',
                                                    field: u.target.name,
                                                    val: u.target.value,
                                                });
                                            }}
                                            required
                                            disabled={!loggedUser || isSubmitting}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={userproblem.date}
                                            onChange={(u) => {
                                                dispatch({
                                                    type: 'probregister',
                                                    field: u.target.name,
                                                    val: u.target.value,
                                                });
                                            }}
                                            required
                                            disabled={!loggedUser || isSubmitting}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Problem Description</label>
                                        <textarea
                                            className="form-control"
                                            name="probdesc"
                                            rows="4"
                                            placeholder="Enter Problem here..."
                                            value={userproblem.probdesc}
                                            onChange={(u) => {
                                                dispatch({
                                                    type: 'probregister',
                                                    field: u.target.name,
                                                    val: u.target.value,
                                                });
                                            }}
                                            required
                                            disabled={!loggedUser || isSubmitting}
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-3"
                                    disabled={!loggedUser || isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Register Problem"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </div>

    )
}
