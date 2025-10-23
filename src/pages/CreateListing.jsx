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
            {/* TEMP: Debug button to test backend without UI form */}
      <div style={{ marginTop: 16, padding: 12, border: "1px dashed #ccc", borderRadius: 8 }}>
        <button
          onClick={async () => {
            try {
              const id = await onPublish(
                {
                  title: "Debug Item",
                  price: 1,
                  category: "debug",
                  condition: "good",
                  description: "temporary test",
                  locationTag: "test",
                },
                [] // no files for this smoke test
              );
              alert("Created listing id: " + id);
            } catch (e) {
              alert("Create failed: " + (e?.message || String(e)));
            }
          }}
        >
          Run createListing() test
        </button>
        <small style={{ display: "block", marginTop: 8 }}>
          Remove this block after testing.
        </small>
      </div>
    </div>
  );
}