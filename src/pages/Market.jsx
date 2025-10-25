import ListingCard from "../components/ListingCard.jsx"

export default function Market() {
  return (
    <div id="content">
      <h1>Market</h1>
      <div>
        <ListingCard name="Item" price={23}></ListingCard>
      </div>
    </div>
  );
}