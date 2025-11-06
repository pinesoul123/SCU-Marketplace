import React from "react";
import { useEffect, useState } from "react"
import ListingCard from "../components/ListingCard.jsx"
import { getMyListings } from "../api/account";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Account.css";

function AccountInfo() {
  const navigate = useNavigate();
  async function handleSignOut() {
    await signOut(auth);
    // alert("Signed out!");
    navigate("/auth")
  }

  return (
    <div id="account-info-container">
      <h1>Account</h1>
      <div id="account-info">
        Name
        Email
      </div>
      <a href="/saved"><button className="button" >Saved Listings</button></a>
      <button className="button">Edit Account Info</button>
      <button className="button" onClick={handleSignOut}>Log Out</button>
    </div>
  )
}

function MyListings() {
  const [myListingDocs, setMyListingDocs] = useState([]);
  const getListingDocs = getMyListings();
  
  useEffect(() => {
    getListingDocs
    .then(myListingDocs => {
      setMyListingDocs(myListingDocs); 
    });
  }, [])
  
  const myListings = myListingDocs.map(listingDoc => <ListingCard key={listingDoc.id} id={listingDoc.id} listingData={listingDoc}></ListingCard>)

  return (
    <>
      <div id="account-listings-container">
        {myListings}
      </div>
    </>
  )
}

class Account extends React.Component {
  // If you later want to load profile data, use lifecycle methods:
  // state = { profile: null, loading: true, error: null };
  // async componentDidMount() { /* fetch profile here */ }

  render() {
    return (
      <div id="content">
        <div id="account-container">
          <AccountInfo />
          <MyListings />
        </div>
      </div>
    );
  }
}

export default Account;