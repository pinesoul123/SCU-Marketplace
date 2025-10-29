import { createListing } from "../api/listings";
import { analyzeImage } from "../api/imageAnalysis";
import { createListing, unpublishListing, removeListing } from "../api/listings";
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0.00);
  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  // local state for remove/unpublish (keeps UI unchanged)
  const [unpubLoading, setUnpubLoading] = useState(false);
  const [unpubError, setUnpubError] = useState(null);
  const [delLoading, setDelLoading]   = useState(false);
  const [delError, setDelError]       = useState(null);

  // minimal test UI state (listing id to target for remove/unpublish)
  const [testListingId, setTestListingId] = useState("");

  // Handles image upload and AI analysis
  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      console.log('Starting image analysis...');
      const analysis = await analyzeImage(file);
      
      console.log('Analysis result:', analysis);
      
      // Updates fields
      if (analysis.title) {
        setTitle(analysis.title);
      }
      if (analysis.price) {
        setPrice(analysis.price);
      }
      if (analysis.description) {
        setDesc(analysis.description);
      }
      if (analysis.category && categories.includes(analysis.category)) {
        setSelectedCategory(analysis.category);
      }
      if (analysis.condition && conditions.includes(analysis.condition)) {
        setSelectedCondition(analysis.condition);
      }

      console.log(`Analysis completed using ${analysis.method}`);
      
    } catch (error) {
      console.error('Image analysis failed:', error);
      setAnalysisError(`Failed to analyze image: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }

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

// Call this to soft-remove — seller or admin
async function onUnpublish(listingId) {
  if (!user) { console.warn("Not signed in"); setErrorPopup(true); return; }
  try {
    await unpublishListing(listingId);
    console.log("[unpublish] OK", listingId);
    //trigger a refetch here if this page ever lists items
  } catch (e) {
    console.error("[unpublish] failed", e);
    setErrorPopup(true);
  }
}

// Call this to hard-delete — seller or admin
async function onDelete(listingId, { deletePhotos = true } = {}) {
  if (!user) { console.warn("Not signed in"); setErrorPopup(true); return; }
  try {
    await removeListing(listingId, { deletePhotos });
    console.log("[delete] OK", listingId);
    //trigger a refetch here if this page ever lists items
  } catch (e) {
    console.error("[delete] failed", e);
    setErrorPopup(true);
  }
}
  
  const listingForm = (
    <form id="listing-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="listing-image">Product Image</label>
        <input 
          id="listing-image" 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          required
        ></input>
        {isAnalyzing && (
          <div style={{color: '#007bff', fontSize: '14px', marginTop: '5px'}}>
            Analyzing image. This may take a few seconds...
          </div>
        )}
        {analysisError && (
          <div style={{color: '#dc3545', fontSize: '14px', marginTop: '5px'}}>
            {analysisError}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="listing-title">Listing Title</label>
        <input 
          id="listing-title" 
          name="title" 
          className="textbox" 
          type="text" 
          value={title}
          onChange={(e) => {setTitle(e.target.value)}} 
          required
        ></input>
        <br></br>
        <label htmlFor="listing-price">Price</label>
        <input id="listing-price" name="price" className="textbox" type="number" 
               value={price}
               onChange={(e) => {setPrice(e.target.value)}} required 
               step=".01" min="0.00" placeholder="0.00"></input>
        <br></br>
        <label htmlFor="listing-desc">Description</label>
        <textarea id="listing-desc" name="desc" className="textbox" 
                  value={desc}
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

      {/* --- Minimal test UI for remove/unpublish (seller/admin) --- */}
      <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px dashed #ccc" }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Remove/Unpublish (Test)</h3>
        <p style={{ marginTop: 6, fontSize: 12 }}>
          Enter a listing ID you own (or use an admin account), then try unpublish or delete.
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="test-listing-id" style={{ fontSize: 12 }}>Listing ID</label>
          <input
            id="test-listing-id"
            type="text"
            value={testListingId}
            onChange={(e) => setTestListingId(e.target.value)}
            placeholder="e.g. abc123..."
            style={{ padding: "6px 8px", minWidth: 260 }}
          />
          <button
            type="button"
            onClick={() => onUnpublish(testListingId)}
            disabled={!testListingId || unpubLoading}
            className="button"
          >
            {unpubLoading ? "Unpublishing..." : "Unpublish"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(testListingId, { deletePhotos: true })}
            disabled={!testListingId || delLoading}
            className="button red"
          >
            {delLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
        {(unpubError || delError) && (
          <p style={{ color: "#b00020", marginTop: 8, fontSize: 12 }}>
            Action failed. Check console for details.
          </p>
        )}
      </div>
    </div>
  );
}