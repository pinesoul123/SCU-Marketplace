import "./Listing.css"

export default function Listing({ name, price }) {
    return (
        <a href={"/"} className="listing">
            <img className="listing-image" src="/"></img>
            {name}
            <br></br>
            {price}
        </a>
    )
}