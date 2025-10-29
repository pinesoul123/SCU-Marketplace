import { useEffect, useState } from "react"
import { listings } from "../api/listings";
import "./ListingCard.css"

const testImage = "https://64.media.tumblr.com/742d481df09a99e6f90473f8117740c3/4c0c86c3b89ad6a1-52/s2048x3072/4dd160e094669754ed6be8b13c1c90429f726e9a.png";

async function get(listingId) {
  return (await listings.get(listingId));
}

export default function Listing({listingId}) {
    const [listingInfo, setListingInfo] = useState();
    const getListing = get(listingId);
    
    useEffect(() => {
    getListing
    .then(listingInfo => {
        setListingInfo(listingInfo); 
    });
    }, [])

    if (listingInfo == null) {
        return (<></>);
    }

    let image = <></>;
    if (listingInfo.listing.photoPaths != null) {
        image = <img className="listing-image" src={listingInfo.listing.photoPaths[0]}></img>
    }

    return (
        <a href={"/"} className="listing button">
            <div className="listing-image-container">
                {image}
            </div>
            <div className="listing-info">
                {listingInfo.listing.title} 
                <br></br>
                <span style={{ fontSize: "1.5em" }}><b>${listingInfo.listing.price}</b></span>
            </div>
        </a>
    )
}