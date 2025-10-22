import { createListing } from "../api/listings";

export default function CreateListing() {
  
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

  return (
    <div id="content">
      <h1>Create Listing</h1>
      {/* build the form here, and call onPublish(values, files) on submit */}
    </div>
  );
}