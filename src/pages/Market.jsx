import ListingCard from "../components/ListingCard.jsx"

export default function Market() {
  const gallery = []
  for (let i = 0; i < count; i++) {
    // gallery.push(<Listing listingId={i}></Listing>)
  }

  return (
    <div id="content">
      <h1>Market</h1>
      <div>
        <ListingCard name="Item" price={23}></ListingCard>
      </div>
    </div>
  );
}