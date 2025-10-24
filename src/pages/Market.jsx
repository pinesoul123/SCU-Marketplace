import Listing from "../components/ListingCard.jsx"

export default function Market() {
  return (
    <div id="content">
      <h1>Market</h1>
      <div>
        <Listing name="Item" price={23}></Listing>
      </div>
    </div>
  );
}