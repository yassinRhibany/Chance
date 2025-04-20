import axios from "axios";
import { useState } from "react";
import { baseURL, LOGIN,  } from "../Api/Api";
export default function Login(){
    // states
const [form,SetForm]=useState({
        email: "",
        password: ""
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
            <form onSubmit={handelSubmit}>
            
            <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" onChange={handelChange} value={form.email} type="email" placeholder="enter your email"/>
            </div>
            <div className="mb-3">
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" onChange={handelChange} value={form.password} type="password" placeholder="enter your password"/>
            </div>
            <button >submit</button>
            </form>
         
        </div>
    );
}