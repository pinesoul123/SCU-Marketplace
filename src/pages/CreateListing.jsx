import { createListing } from "../api/listings";

export default function CreateListing() {
  async function onPublish(formValues, fileList) {
    const id = await createListing(formValues, Array.from(fileList || []));
    console.log("New listing created:", id);
  }

  return (
    <div id="content">
      <h1>Create Listing</h1>
      {/* add here */}
    </div>
  );
}