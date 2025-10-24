import "./ListingCard.css"

export default function ListingCard({ name, price }) {
    return (
        <a href={"/"} className="listing-card">
            <img className="listing-card-image" src="/"></img>
            {name}
            <br></br>
            {price}
        </a>
    )
}