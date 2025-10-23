// Purpose: fetch the current user's saved listings via backend helper "getSavedListings()"
// UI notes:
//  - Use "loading" to show a spinner and disable actions while fetching.
//  - Use "error" to surface an error message or retry CTA.
//  - Each entry in "savedItems" has `{ id, ...listingFields }` from the "listings" collection.

import { useEffect, useState } from "react";
import { getSavedListings } from "../api/saved";

export default function Saved() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //loadSaved() runs automatically on page load, but can be called manually for a refresh
  useEffect(() => {
    async function loadSaved() { 
      try {
        setLoading(true);
        const items = await getSavedListings();
        setSavedItems(items);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  return (
    <div id="content">
      <h1>Saved Listings</h1>
    </div>
  );
}