import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Filter.css";

const categories = ["Furniture", "Appliances", "Books", "Clothes", "Other"];
const conditions = ["New", "Used - Very Good", "Used - Moderate"];
const locations = [
  "Graham",
  "Finn",
  "Swig",
  "Dunne",
  "Campisi",
  "Sanfilippo",
  "Casa Italiana",
  "Sobrato",
  "McWalsh",
  "Nobili",
  "Off Campus",
];

export default function FilterPopup({ show, onClose }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Categories
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cats = searchParams.get("category");
    return cats ? cats.split(",") : [];
  });
  
  // Conditions
  const [selectedConditions, setSelectedConditions] = useState(() => {
    const conds = searchParams.get("condition");
    return conds ? conds.split(",") : [];
  });
  
  // Minimum Price
  const [minPrice, setMinPrice] = useState(() => searchParams.get("minPrice") || "");

  // Maximum Price
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get("maxPrice") || "");

  // Locations
  // const [selectedLocations, setSelectedLocations] = useState(() => {
  //   const locs = searchParams.get("location");
  //   return locs ? locs.split(",") : [];
  // });



  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category): [...prev, category]);
  };

  const handleConditionToggle = (condition) => {
    setSelectedConditions(prev => prev.includes(condition) ? prev.filter(c => c !== condition): [...prev, condition]);
  };

  // const handleLocationToggle = (location) => {
  //   setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location): [...prev, location]);
  // };



	// Applies filters
  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    
    // Updates category filter
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }
    
    // Updates condition filter
    if (selectedConditions.length > 0) {
      params.set("condition", selectedConditions.join(","));
    } else {
      params.delete("condition");
    }
    
    // Updates minimum price filter
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    
    // Updates maximum price filter
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    
    // Updates location filter
    // if (selectedLocations.length > 0) {
    //   params.set("location", selectedLocations.join(","));
    // } else {
    //   params.delete("location");
    // }
    
    navigate(`/market?${params.toString()}`);
    onClose();
  };

	// Clears all filters
  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setMinPrice("");
    setMaxPrice("");
    // setSelectedLocations([]);
    
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("condition");
    params.delete("minPrice");
    params.delete("maxPrice");
    // params.delete("location");
    
    navigate(`/market?${params.toString()}`);
  };

  if (!show) return null;

  return (
    <div id="filter-container">
      <div id="popup-container" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <div id="popup-bg" onClick={onClose}></div>
        <div id="popup" style={{ maxWidth: "800px", minHeight: "600px", maxHeight: "80vh", overflowY: "auto", textAlign: "left" }}>
          <h2>Filters</h2>
          
          <div id="filter-buttons-container">
            <button type="button" className="button red" onClick={handleApply}>
              Apply Filters
            </button>
            <button type="button" className="button" onClick={handleClear}>
              Clear All
            </button>
            <button type="button" className="button" onClick={onClose}>
              Cancel
            </button>
          </div>

          <div id="filter-select">
            <div>
              <h3>Category</h3>
              {categories.map(cat => (
                <label key={cat} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <div>
              <h3>Price</h3>
              <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="textbox"
                  style={{ width: "80px" }}
                  min="0"
                  step="0.01"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="textbox"
                  style={{ width: "80px" }}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* <div>
              <h3>Location</h3>
              <div id="location-options">
                {locations.map(loc => (
                  <label key={loc} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => handleLocationToggle(loc)}
                    />
                    {loc}
                  </label>
                ))}
              </div>
            </div> */}

            <div>
              <h3>Condition</h3>
              {conditions.map(cond => (
                <label key={cond} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => handleConditionToggle(cond)}
                  />
                  {cond}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

