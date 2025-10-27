import Listing from "./Listing.jsx"
import "../styles/Market.css"

const count = 10;

export default function Market() {
  const gallery = []
  for (let i = 0; i < count; i++) {
    // gallery.push(<Listing listingId={i}></Listing>)
  }

  return (
    <div id="content">
      <h1>Market</h1>
      <div id="market-container">
        {gallery}
      </div>
    </div>
  );
}