import { Link } from "react-router-dom";
import "./ListingCard.css"

export default function ListingCard({id, listingData}) {
    let image = <></>;
    if (listingData.photoURLs != null) {
        image = <img className="listing-card-image" src={listingData.photoURLs[0]}></img>
    }

    return (
        <Link to={"/listing?id=" + id} className="listing-card button">
            <div className="listing-card-image-container">
                {image}
            </div>
            <div className="listing-card-info">
                {listingData.title}
                <br></br>
                <span style={{ fontSize: "1.5em" }}><b>${listingData.price}</b></span>
            </div>
        </Link>
    )
}