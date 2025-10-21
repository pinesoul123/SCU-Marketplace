import { createListing } from "../api/listings";

export default function CreateListing() {
  // backend hook-up for this page
  // takes form data + images, sends to Firestore + Storage
  async function onPublish(formValues, fileList) {
    const id = await createListing(formValues, Array.from(fileList || []));
    console.log("New listing created:", id);
    //show a toast / navigate, etc.
  }

  return (
    <div style={{ padding: 24 }}>
      Create Listing page
      {/* once the form is done, connect its submit handler to onPublish() */}
    </div>
  );
}