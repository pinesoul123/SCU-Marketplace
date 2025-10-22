import { createListing } from "../api/listings";
import "../styles/CreateListing.css"

export default function CreateListing() {
  async function onPublish(formValues, fileList) {
    const id = await createListing(formValues, Array.from(fileList || []));
    console.log("New listing created:", id);
  }

  const listingForm = (
    <form id="listing-form">
      <div id="form-left">
        <input type="file"></input>
      </div>
      <div id="form-right">
        <label for="listing-name">Listing Name</label>
        <br></br>
        <input id="listing-name" class="textbox" type="text"></input>
        <br></br><br></br>
        <label for="listing-price">Price</label>
        <br></br>
        <input id="listing-price" class="textbox" type="text"></input>
        <br></br><br></br>
        <label for="listing-desc">Description</label>
        <br></br>
        <textarea id="listing-desc" class="textbox" ></textarea>
      </div>
      <div id="form-bottom">
        <label for="listing-category">Category</label>
        <label for="listing-condition">Condition</label>
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