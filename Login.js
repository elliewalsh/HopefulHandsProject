// import { response } from "express";
import React, { Component, useState } from "react";
import '../../App.css';
import './SignUp.css';
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5321/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");

        if (data.status == "ok") {
          alert("login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
         
         

          window.location.href = "./account";
        }


      });
      // axios.get(`http://localhost:5321/userDataByEmail/${email}`)
      //   .then (response => {
      //     window.localStorage.setItem('id', response.data.data._id);
      //   })
  }

  return (
    <div className="containerSmall">
    <div className="header">
      <div className="text">Login</div>
      <div className="underline"></div>
        <form onSubmit={handleSubmit}>

        <div className="inputs">
          <div className="input">
          <i className="fa-solid fa-envelope"></i>
          <input type="email" placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="input">
          <i className="fa-solid fa-lock"></i>
          <input type="password" placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)}/>
          </div>

   
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="customCheck1"/>
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            
          </div>

          <div className="submit-container">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password">
            Return to <a href="/sign-up">Sign Up</a> page
          </p>
          </div>
        </form>
        
      </div>
    </div>
  );
}