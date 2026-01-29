import React, { useState } from 'react';
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Register_problem() {

    const userid = JSON.parse(localStorage.getItem("loggeduser")).user_id;
    console.log(userid)

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
        }
    };

    const [userproblem, dispatch] = useReducer(reducer, init);

    const navigate = useNavigate();

    var probregister = (u) => {
        u.preventDefault();
        userproblem.useridfk=userid;
        
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(userproblem),
        };


        fetch('http://localhost:8080/regprob', options)
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
                navigate("/viewproblems");

            })

    };


    return (
        <div>
                      

            <div className="form-container">

                <div className="login-form">
                    <div className="form">
                        <h3>Register Problem</h3>
                        <form>
                            <div className="input-container">

                                <table >


                                    <tr><td> <label>Area Where Problem Occured : </label></td><td>
                                        <input type="text" placeholder="Enter Area" name="area" value={userproblem.area}
                                            onChange={(u) => {
                                                dispatch({
                                                    type: 'probregister',
                                                    field: u.target.name,
                                                    val: u.target.value,
                                                });
                                            }} required /><br /> </td></tr>

                                    <tr><td><label>Problem Description : </label></td><td>
                                        <textarea name="probdesc" form="usrform" placeholder="Enter Problem here..." value={userproblem.probdesc}
                                            onChange={(u) => {
                                                dispatch({
                                                    type: 'probregister',
                                                    field: u.target.name,
                                                    val: u.target.value,
                                                });
                                            }} required  ></textarea></td></tr>

                                    <tr><td> <label>Date: </label> </td><td>
                                        <input type="date" placeholder=" Enter Date" name="date" value={userproblem.date}
                                            onChange={(u) => {
                                                dispatch({
                                                    type: 'probregister',
                                                    field: u.target.name,
                                                    val: u.target.value,
                                                });
                                            }} required /><br /></td></tr>

                                    <button type="submit"
                                        onClick={(u) => {
                                            probregister(u);
                                        }}
                                    >Register Problem</button>
                                </table>

                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </div>

    )
}