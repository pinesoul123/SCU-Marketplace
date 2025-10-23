import { createListing } from "../api/listings";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/CreateListing.css"

const categories = ["Furniture", "Appliances", "Books", "Clothes", "Other"];
const conditions = ["New", "Used - Very Good", "Used - Moderate"];

function Required({render}) {
  return render ? <p>Required</p> : <></>
}

function Selection({ options, selected, setSelected }) {
  function handleClick(e, option) {
    setSelected(option);
    e.preventDefault();
  }

  const chips = [];
  for (let option of options) {
    if (option == selected) {
      chips.push(<button key={option} class="selected button selection-chip" onClick={(e) => e.preventDefault()}>{option}</button>);
    } else {
      chips.push(<button key={option} class="button selection-chip" onClick={(e) => handleClick(e, option)}>{option}</button>);
    }
  }

  return (
    <div class="selection-container">{chips}</div>
  )
}

export default function CreateListing() {
  let navigate = useNavigate();
  
  /**
 * onPublish(formValues, fileList)
 * Backend bridge: accepts form data + images, sends to Firestore/Storage
 * @param {object} formValues - All text and number inputs from the form.
 * @param {FileList|File[]} fileList - The image files selected by the user.
 * @returns {Promise<string>} - The new Firestore document ID for the listing.
 */
  
  async function onPublish(formValues, fileList) {    
    try {
      const id = await createListing(formValues, Array.from(fileList || []));
      console.log("New listing created:", id);
      //add a success pop up or smth
      return id;
    } catch (err) {
      console.error("Failed to create listing:", err);
      throw err; 
      // show error pop up
    }
  }

  const [error, setError] = useState('');

  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0.00);
  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");


  function handleSubmit(e) {
    e.preventDefault();
    if ((selectedCategory == "") || (selectedCondition == "")) {
      setError('Select a category and a condition.');
      return;
    } else {
      setError('');
    }

    const data = {
      title: title,
      price: price,
      description: desc,
      category: selectedCategory,
      condition: selectedCondition
    }

    console.log(onPublish(data, [file]));
    // navigate("/account");
  }

  const listingForm = (
    <form id="listing-form" onSubmit={handleSubmit}>
      <div>
        <input type="file" onChange={(e) => {setFile(e.target.value)}} required></input>
      </div>
      <div>
        <label for="listing-title">Listing Title</label>
        <input id="listing-title" name="title" class="textbox" type="text" 
               onChange={(e) => {setTitle(e.target.value)}} required></input>
        <br></br>
        <label for="listing-price">Price</label>
        <input id="listing-price" name="price" class="textbox" type="number" 
               onChange={(e) => {setPrice(e.target.value)}} required 
               step=".01" min="0.00" placeholder="0.00"></input>
        <br></br>
        <label for="listing-desc">Description</label>
        <textarea id="listing-desc" name="desc" class="textbox" 
                  onChange={(e) => {setDesc(e.target.value)}} required></textarea>
      </div>
      <div>
        <label for="listing-category">Category</label>
        <Selection options={categories} selected={selectedCategory} setSelected={setSelectedCategory} />
      </div>
      <div>
        <label for="listing-condition">Condition</label>
        <Selection options={conditions} selected={selectedCondition} setSelected={setSelectedCondition} />
      </div>
      <div class="grid-item-wide">
        {error && <p id="error-msg">{error}</p>}
        <input id="submit" class="button red" type="submit" value="List Item"></input>
      </div>
      </form>
  );

  return (
    <div id="content">
      <h1>Create Listing</h1>
      {listingForm}
    </div>
  );
}