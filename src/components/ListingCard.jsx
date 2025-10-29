import "./ListingCard.css"

export default function Listing({listingData}) {
    let image = <></>;
    if (listingData.photoPaths != null) {
        image = <img className="listing-card-image" src={listingData.photoPaths[0]}></img>
    }

    return (
        <a href={"/"} className="listing-card button">
            <div className="listing-card-image-container">
                {image}
            </div>
            <div className="listing-card-info">
                {listingData.title}
                <br></br>
                <span style={{ fontSize: "1.5em" }}><b>${listingData.price}</b></span>
            </div>
        </a>
    )
}