import React, { useEffect ,useState} from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
export default function Viewproblems() {

    const [deleteproblem,deletevillagerprnb] = useState([]);
    const [viewproblems,setProblem] = useState([]);
    const [user,setUser] = useState([]);

    const first_name = JSON.parse(localStorage.getItem("loggeduser")).first_name;
    const last_name = JSON.parse(localStorage.getItem("loggeduser")).last_name;

    // var Browsesch= (u) => {
    //     u.preventDefault();
       
    useEffect(()=>{
        const user_id = JSON.parse(localStorage.getItem("loggeduser")).user_id;

        fetch(`http://localhost:8080/viewproblems/${user_id}`)
          .then((res) => {
            console.log(res);

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
            
                setProblem(obj);
          })
          .catch((Error) =>
            alert("server problem ! sever is down")
          )

    //       fetch(`http://localhost:8080/deleteproblems/${user_id}`)
    //       .then((res) => {
    //         console.log(res);

    //         if(res.ok)
    //         {
    //           return res.json();
    //         }
    //         else
    //         { 
    //           throw new Error("server Error")
    //         }
    //       })
    //       .then(obj => {
    //           console.log(obj)
    //           deletevillagerprnb(obj);
    //       })
    //       // .catch((Error) =>
    //       //   alert("server problem ! sever is down")
    //       // )

          
        
     },[]);
    const navigate=useNavigate();

    const deleteProb=(s,e)=>{
      s.preventDefault();
        fetch(`http://localhost:8080/deleteBypid?pid=${e}`)
        .then(resp=>resp.json())
        .then(obj=>  {    if(obj===true)
                        {
                            alert("Problem removed...");
                        }
         navigate("/viewproblems");
        })
    }
    
        

    return (
        <div >
                    
             <div className="form-container">
    
    <div className="login-form">
      <div className="form">
      <h3><i>Your Registered Problems</i></h3>
        <form>
          <div className="input-container">
            
            <table className="table">
                <thead>
                    
                    <tr>
                        <th scope="co1">Problem Description</th>
                        <th scope="co1">Area</th>
                        <th scope="co1">Date</th>
                        <th scope="co1">status</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {viewproblems.map((e) => {
                        return(
                            <tr>
                                <td>{e.probdesc}</td>
                                <td>{e.area}</td>
                                <td>{e.date}</td>
                                <td>{e.status}</td>
                               
                                {/* <td><a href="#" onClick={(e) => deleteproblem(e)}>delete</a></td> */}
                               <td> <button  className="btn btn-primary btn-lg ms-2" onClick={(s)=>{deleteProb(s,e.pid)}} >Delete</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </form>
        {/* <h1>Welcome {user && user.first_name}{user && user.last_name}</h1> */}
        
        
      </div>
      </div>
     
      </div>
     
      </div>
    )
}
