import { createListing } from "../api/listings";
import { useState } from 'react';
import "../styles/CreateListing.css"

const categories = ["Furniture", "Appliances", "Books", "Clothes", "Other"];
const conditions = ["New", "Used - Very Good", "Used - Moderate"];

function Selection({ options, selected, setSelected }) {
  function handleClick(e, option) {
    setSelected(option);
    e.preventDefault();
  }

  const chips = [];
  for (let option of options) {
    if (option == selected) {
      chips.push(<button key={option} class="selected selection-chip" onClick={(e) => e.preventDefault()}>{option}</button>);
    } else {
      chips.push(<button key={option} class="selection-chip" onClick={(e) => handleClick(e, option)}>{option}</button>);
    }
  }

  return (
    <div class="selection-container">{chips}</div>
  )
}

export default function CreateListing() {
  async function onPublish(formValues, fileList) {
    const id = await createListing(formValues, Array.from(fileList || []));
    console.log("New listing created:", id);
  }

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const listingForm = (
    <form id="listing-form">
      <div>
        <input type="file"></input>
      </div>
      <div>
        <label for="listing-name">Listing Name</label>
        <br></br>
        <input id="listing-name" class="textbox" type="text"></input>
        <br></br><br></br>
        <label for="listing-price">Price</label>
        <br></br>
        <input id="listing-price" class="textbox" type="number" step=".01" min="0.00" placeholder="0.00"></input>
        <br></br><br></br>
        <label for="listing-desc">Description</label>
        <br></br>
        <textarea id="listing-desc" class="textbox" ></textarea>
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
        <input class="button-red" type="submit" value="Submit"></input>
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