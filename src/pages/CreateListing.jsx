import { createListing } from "../api/listings";

export default function CreateListing() {
  async function onPublish(formValues, fileList) {
    const id = await createListing(formValues, Array.from(fileList || []));
    console.log("New listing created:", id);
  }

  return (
    <div style={{ padding: 24 }}>
      Create Listing page
      {/* add here */}
    </div>
  );
}