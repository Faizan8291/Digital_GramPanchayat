import React, { useEffect } from 'react'
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./style.css";

export default function Register() {

  const [userTypes, setUserTypes] = useState([]);


    const [msgType, setMsgType] = useState(""); // success | error
    const [msg,setMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");




    useEffect(() => {
  fetch('http://localhost:8080/getusertypes')
    .then(res => res.json())
    .then(data => {
      setUserTypes(data);
    })
    .catch(err => {
      console.error("Error fetching user types:", err);
    });
}, []);

        
        

    const init = {
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        contact_no: '',
        aadharcard_no: '',
        username: '',
        type: '',
        password: ''
      };

      var reducer = (state, action) => {
        switch (action.type) {
          case 'logincheck':
            return { ...state, [action.field]: action.val };
        }
      };



      const [user, dispatch] = useReducer(reducer, init);



      const navigate=useNavigate();
    
      var logincheck = (e) => {
        e.preventDefault();
      
        setSuccessMsg("");
        setErrorMsg("");
      
        if (
          !user.username?.trim() ||
          !user.email?.trim() ||
          !user.password?.trim() ||
          !user.type?.trim()
        ) {
          setErrorMsg("All fields are mandatory");
          return;
        }
      
        fetch("http://localhost:8080/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then(() => {
            setSuccessMsg("Registration successful. Please login.");
            setTimeout(() => navigate("/Userlogin"), 1500);
          })
          .catch(() => {
            setErrorMsg("Registration failed. Please try again.");
          });
      };
      




    
    return (
        <div >
             <div className="form-container">
            <div className="login-form">
             <div className="form">
             
            <h1><i> Registration Form</i></h1>
            <br/>
            <form   >
            <div className="input-container">
                <table>
                    <tr><td> <label>First Name : </label> </td><td>
            <input type="text" placeholder=" Enter First name" name="first_name" value={user.firstname} 
            
            onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required
            /><br/></td></tr>
            
            <tr><td> <label>Last Name : </label></td><td>
            <input type="text" placeholder="Enter Lastname" name="last_name" value={user.lastname} 
             onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}

            required/><br/></td></tr>

            <tr><td> <label>Email : </label></td><td>   
            <input type="email" placeholder="Enter email" name="email" value={user.email} 
            
            onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required/><br/> </td></tr>
           
            <tr><td><label>Address : </label></td><td>
            <input type="text" placeholder="Enter Address" name="address" value={user.address} 
             onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required/><br/></td></tr>

            <tr><td><label>Contact : </label></td><td>
            <input type="number" placeholder="Enter Contact" name="contact_no" value={user.contact} 
            
            onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required/><br/></td></tr>

            <tr><td> <label>Adhar : </label></td><td>
            <input type="number" placeholder="Enter Adhar" name="aadharcard_no" value={user.adhar}
            
            onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required/><br/></td></tr>

            <tr><td> <label>Username : </label></td><td>   
            <input type="text" placeholder="Enter Username" name="username" value={user.username} 
            
            onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required/><br/></td></tr>


           
             <tr><td>  <label>Type : </label></td><td>
            <select name="type"
                    value={user.type}
                    onChange={(u) => {
                      dispatch({
                        type: 'logincheck',
                        field: u.target.name,
                        val: u.target.value,
                      });
                    }}
                  >
                    <option value="">Choose...</option>

                    {userTypes.map((v, index) => (
                      <option key={index} value={v.user_type}>
                        {v.user_type}
                      </option>
                    ))}
                  </select>
</td></tr> 

            <tr><td> <label>Password : </label></td><td>   
            <input type="password" placeholder="Enter Password" name="password" value={user.password}
             onChange={(u) => {
                dispatch({
                  type: 'logincheck',
                  field: u.target.name,
                  val: u.target.value,
                });}}
            required/> <br/>  </td></tr>


            <button type="submit"
            onClick={(u) => {
                logincheck(u);
              }}
              >Register</button>   
            </table>
            </div>
            </form> 

            {errorMsg && (
              <div className="form-message error">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="form-message success">
                {successMsg}
              </div>
            )}


        </div>
        </div>
        </div>
        </div>

    )
}