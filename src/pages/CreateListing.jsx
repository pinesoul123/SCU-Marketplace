/*
export default function CreateListing() {
  return <div style={{ padding: 24 }}>Create Listing page</div>;
}

*/

import { createListing } from "../api/listings";

export default function CreateListing() {
  // define the handler inside the component
  async function onPublish(formValues, fileList) {
    const id = await createListing(formValues, Array.from(fileList || []));
    // your friend can show a toast / navigate, etc.
    console.log("New listing created:", id);
  }

  return (
    <div style={{ padding: 24 }}>
      Create Listing page
      {/* your friend can wire their form's onSubmit to call onPublish() */}
    </div>
  );
}