import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
// import { useSelector, Provider } from 'react-redux';
// import io from 'socket.io-client';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import Footer component
import "./App.css";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, Route, Redirect,  } from "react-router-dom";
import AboutUs from "./components/pages/AboutUs";
import Chatbox from "./components/pages/Chat/Chatbox";
import SignUp from "./components/pages/SignUp";
import Login from "./components/pages/Login";
import Account from "./components/pages/Account";
import Products from "./components/pages/Products";
import ProductDisplay from "./components/pages/ProductDisplay";
import ProductInfo from "./components/pages/ProductInfo";
import CreateDonation from "./components/pages/CreateDonation";
import UpdateDonation from "./components/pages/UpdateDonation";
import useUser from "./hooks/useUser";
import Contact from "./components/Contact/Contact";
import DeleteDonation from "./components/pages/DeleteDonation";

// const socket = io.connect('https://localhost:3001');

function App() {
  // const userDetails = useSelector((state)=>state.user);
  // let user = userDetails?.user

  const ADMIN_USER = "Admin";
  const userData = useUser();
  const userType = userData ? userData.userType : null;
  // const userType = 'admin';

  return (
    <>
      <Router>
        <Navbar />
        <Route>
          <Route path="/" exact component={Home} />
          <Route path="/aboutus" exact component={AboutUs} />
          <Route path="/chatbox" component={Chatbox} />
          <Route path="/sign-up" exact component={SignUp} />
          <Route path="/login" exact component={Login} />
          <Route path="/account" exact component={Account} />
          <Route path="/productdisplay" exact component={ProductDisplay} />
          <Route
            path="/products/edit"
            render={(props) => {
              return userType === ADMIN_USER ? (
                <Products {...props} />
              ) : (
                <Redirect to="/productdisplay" />
              );
            }}
          />
          <Route path="/productinfo/:id" component={ProductInfo} />
          <Route path="/create" exact component={CreateDonation} />
          <Route path="/update/:id" exact component={UpdateDonation} />
          <Route path="/delete/:id" exact component={DeleteDonation}/>
        </Route>
        <Footer />
      </Router>
    </>
  );
}

export default App;
