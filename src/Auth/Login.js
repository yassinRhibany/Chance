import axios from "axios";
import { useState } from "react";
import { baseURL, LOGIN,  } from "../Api/Api";

export default function Login(){
    // states
    const [form,SetForm]=useState({
        name: "",
        email: "",
        password: "",
        repeatPassword:""
    });
  // handel form change
    function handelChange(e){
        SetForm({...form,[e.target.name]:e.target.value})
      }
   
    
    async function  handelSubmit(e){
        e.preventDefault();
        try{
           await axios.post(`${baseURL}/${LOGIN}`,form);
            console.log("success");
        }catch(err){
            console.log(err);
        }

    }
    
    
       
    return (
        <div className="container">
        <div className="row h-100"> 
        <form className="form " onSubmit={handelSubmit}>
            <div className="custom-form">
                <h1>Register Now</h1>
      

        <div className="form-control">
      
        <input id="email" name="email" onChange={handelChange} value={form.email} type="email" placeholder="enter your email" required/>
        <label htmlFor="email">Email</label>
        </div>
        <div className="form-control">
       
        <input id="password" name="password" onChange={handelChange} value={form.password} type="password" placeholder="enter your password" required minLength={6}/>
        <label htmlFor="password">Password</label>
        </div>
        
        <div className="customButton">
        <button className="RejisterButton" >submit</button>
        </div>
       
        </div>
        </form>
        </div>
     
    </div>
        
    );
}