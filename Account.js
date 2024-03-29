import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useUser from "../../hooks/useUser";
import axios from "axios";
import "../../App.css";
import "./Account.css";

const Account = () => {
  const userData = useUser();
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [listingsFetched, setListingsFetched] = useState(false);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        if (userData && !listingsFetched) {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5321/api/mylistings/${userData.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserListings(response.data);
          setListingsFetched(true);
        }
      } catch (err) {
        setError("Failed to fetch user listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    if (!listingsFetched) {
      fetchUserListings();
    }
  }, [userData, listingsFetched]);  
  

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {userData ? (
        <>
          <div className="header">
            <div className="text">WELCOME</div>
            <div className="underline"></div>
          </div>
          <div className="contentContainer"> {/* Updated className */}
            <div className="account-text">Name: {userData.fname}</div> {/* Updated className */}
            <div className="account-text">Email: {userData.email}</div> {/* Updated className */}
            <div className="account-text">User Type: {userData.userType}</div> {/* Updated className */}
          </div>
          <button onClick={logOut} className="button">Log Out</button> {/* Updated className */}
          <div className="header">
            <div className="text">My Listings</div> {/* Updated className */}
            <div className="underline"></div>
          </div>
          <div className="product-grid"> {/* Updated className */}
            {userListings.map((listing, index) => (
              <Link key={index} to={`/productinfo/${listing._id}`} className="product-card"> {/* Updated className */}
                {index === 0 || userListings[index - 1]._id !== listing._id ? (
                  <>
                    <div className="product-image">
                      {listing.imageUrls && listing.imageUrls.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={`http://localhost:3000/${imageUrl}`}
                          alt={listing.product}
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      ))}
                    </div>
                    <div className="product-details">
                      <h3>{listing.product}</h3>
                      <p>{listing.description}</p>
                      <p>{listing.category}</p>
                    </div>
                  </>
                ) : null}
              </Link>
            ))}
          </div>
          
        </>
      ) : (
        <div>
          <p>
            You are not logged in. Please log in <Link to="/login">here</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Account;
