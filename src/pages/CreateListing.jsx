import { createListing } from "../api/listings";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup.jsx";
import "../styles/CreateListing.css"
import { useAuth } from "../lib/AuthProvider";

const categories = ["Furniture", "Appliances", "Books", "Clothes", "Other"];
const conditions = ["New", "Used - Very Good", "Used - Moderate"];

function SuccessPopup({render}) {
  let navigate = useNavigate();
  const redirect = () => navigate("/account");
  if (render) {
    return (
      <Popup message={"Listing created!"} buttonMessage={"Close"} onClick={redirect} />
    )
  }
}

function ErrorPopup({render, setErrorPopup}) {
  if (render) {
    return (
      <Popup message={"There was an error."} buttonMessage={"Close"} onClick={() => setErrorPopup(false)} />
    )
  }
}

function Selection({ options, selected, setSelected }) {
  function handleClick(e, option) {
    setSelected(option);
    e.preventDefault();
  }

  const chips = [];
  for (let option of options) {
    if (option == selected) {
      chips.push(<button key={option} className="selected button selection-chip" onClick={(e) => e.preventDefault()}>{option}</button>);
    } else {
      chips.push(<button key={option} className="button selection-chip" onClick={(e) => handleClick(e, option)}>{option}</button>);
    }
  }

  return (
    <div className="selection-container">{chips}</div>
  )
}

export default function CreateListing() {  
  const { user, loading } = useAuth();
  /**
 * onPublish(formValues, fileList)
 * Backend bridge: accepts form data + images, sends to Firestore/Storage
 * @param {object} formValues - All text and number inputs from the form.
 * @param {FileList|File[]} fileList - The image files selected by the user.
 * @returns {Promise<string>} - The new Firestore document ID for the listing.
 */
  
  console.log("[auth check]", { uid: user?.uid });
  async function onPublish(formValues, fileList) {    
    if (!user) throw new Error("You must be signed in to create a listing.");
    try {
      const id = await createListing(formValues, Array.from(fileList || []));
      console.log("New listing created:", id);
      setSuccessPopup(true);
      return id;
    } catch (err) {
      console.error("Failed to create listing:", err);
      setErrorPopup(true);
      throw err; 
    }
  }

  const [error, setError] = useState('');

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0.00);
  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();
    if ((selectedCategory == "") || (selectedCondition == "")) {
      setError('Select a category and a condition.');
      return;
    } else {
      setError('');
    }

    const data = {
      title: title,
      price: Number(price),
      description: desc,
      category: selectedCategory,
      condition: selectedCondition
    }

    console.log('[CreateListing] submit', { data, hasFile: !!file });

    try {
      if (file) {
        await onPublish(data, [file]);
      } else {
        await onPublish(data);
      }
    } catch (err) {
      // onPublish already sets the popup; keep a console for debugging
      console.error('[CreateListing] submit error', err);
    }
  }

  const listingForm = (
    <form id="listing-form" onSubmit={handleSubmit}>
      <div>
        <input type="file" accept="image/*" onChange={(e) => { setFile((e.target.files && e.target.files[0]) || null); }}></input>
      </div>
      <div>
        <label htmlFor="listing-title">Listing Title</label>
        <input id="listing-title" name="title" className="textbox" type="text" 
               onChange={(e) => {setTitle(e.target.value)}} required></input>
        <br></br>
        <label htmlFor="listing-price">Price</label>
        <input id="listing-price" name="price" className="textbox" type="number" 
               onChange={(e) => {setPrice(e.target.value)}} required 
               step=".01" min="0.00" placeholder="0.00"></input>
        <br></br>
        <label htmlFor="listing-desc">Description</label>
        <textarea id="listing-desc" name="desc" className="textbox" 
                  onChange={(e) => {setDesc(e.target.value)}} required></textarea>
      </div>
      <div>
        <label htmlFor="listing-category">Category</label>
        <Selection options={categories} selected={selectedCategory} setSelected={setSelectedCategory} />
      </div>
      <div>
        <label htmlFor="listing-condition">Condition</label>
        <Selection options={conditions} selected={selectedCondition} setSelected={setSelectedCondition} />
      </div>
      <div className="grid-item-wide">
        {error && <p id="error-msg">{error}</p>}
        <input id="submit" className="button red" type="submit" value="List Item"></input>
      </div>
      </form>
  );
    
  if (loading) {
    return (
      <div id="content">
        <h1>Create Listing</h1>
        <p>Checking login...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div id="content">
        <h1>Create Listing</h1>
        <p>Please sign in to create a listing.</p>
      </div>
    );
  }

  return (
    <div id="content">
      <SuccessPopup render={successPopup} />
      <ErrorPopup render={errorPopup} setErrorPopup={setErrorPopup} />
      <h1>Create Listing</h1>
      {listingForm}
    </div>
  );
}