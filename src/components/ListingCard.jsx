import "./ListingCard.css"

const testImage = "https://64.media.tumblr.com/742d481df09a99e6f90473f8117740c3/4c0c86c3b89ad6a1-52/s2048x3072/4dd160e094669754ed6be8b13c1c90429f726e9a.png";

export default function Listing({listingData}) {
    let image = <></>;
    if (listingData.photoPaths != null) {
        image = <img className="listing-image" src={listingData.photoPaths[0]}></img>
    }

    return (
        <a href={"/"} className="listing button">
            <div className="listing-image-container">
                {image}
            </div>
            <div className="listing-info">
                {listingData.title}
                <br></br>
                <span style={{ fontSize: "1.5em" }}><b>${listingData.price}</b></span>
            </div>
        </a>
    )
}