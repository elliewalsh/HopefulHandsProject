import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook
import '../../App.css';
import './SignUp.css';

const SECRET_KEY = "ewalsh";

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [action, setAction] = useState('Sign Up');
  const history = useHistory(); // Get the history object

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if userType is empty or null
    if (!userType) {
      alert("Please select User or Admin");
      return;
    }

    if (userType === "Admin" && secretKey !== SECRET_KEY) {
      alert("Invalid Admin");
      return;
    }

    //console.log(fname, lname, email, password, userType);
    fetch("http://localhost:5321/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        password,
        userType,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("Registration Successful");
          history.push("/login"); // Redirect to login page
        } else {
          alert("Something went wrong");
        }
      });
  };

  return (
    <div className="containerSmall">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div>
              <div className="register">
                Register As
                <input
                  type="radio"
                  name="UserType"
                  value="User"
                  onChange={(e) => setUserType(e.target.value)}
                />
                User
                <input
                  type="radio"
                  name="UserType"
                  value="Admin"
                  onChange={(e) => setUserType(e.target.value)}
                />
                Admin
              </div>
            </div>

            {userType === "Admin" ? (
              <div className="input">
                <i className="fa-solid fa-key"></i>
                <input
                  type="text"
                  placeholder="Secret Key"
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            ) : null}

            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="First Name"
                onChange={(e) => setFname(e.target.value)}
              />
            </div>

            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="Last Name"
                onChange={(e) => setLname(e.target.value)}
              />
            </div>

            <div className="input">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="submit-container">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
            <p className="forgot-password">
              Already registered <a href="/login">Log in?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}