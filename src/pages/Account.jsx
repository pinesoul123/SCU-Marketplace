import React from "react";
import { useEffect, useState } from "react"
import ListingCard from "../components/ListingCard.jsx"
import { getMyListings } from "../api/account";
import "../styles/Account.css";

function AccountInfo() {
  return (
    <div id="account-info-container">
      <h1>Account</h1>
      Name
      Email
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
  
  const myListings = myListingDocs.map(listingDoc => <ListingCard key={listingDoc.id} listingData={listingDoc}></ListingCard>)

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