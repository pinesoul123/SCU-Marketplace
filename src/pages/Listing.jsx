import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { listings } from "../api/listings";
import { saveListing, isSaved } from "../api/saved";
import '../styles/Listing.css'


async function getListing(id) {
    return (await listings.get(id));
}

async function save(id) {
  return (await saveListing(id));
}

async function saved(id) {
  return (await isSaved(id));
}

/* Step: the increment or decrement */
function GalleryButton({step, content, images, activeImage, setActiveImage}) {
    function handleClick() {
        setActiveImage(activeImage + step);
    }
    const button = <button className={"gallery-pg-button"} onClick={handleClick}>{content}</button>
    // Back button, only renders if active image is not first image
    if (step < 0) {
        if (activeImage !== 0) {
            return (button);
        }
    }
    // Next button, only renders if active image is not last image
    if (step > 0) {
        if (activeImage !== images.length - 1) {
            return (button);
        }
    }
    return (<button className={"gallery-pg-button-inactive"}>{content}</button>);
}

function GalleryThumbnails({imageURLs, activeImage, setActiveImage}) {
    const images = [];
    for (let i = 0; i < imageURLs.length; i++) {
        if (i === activeImage) {
            images.push(<img className="gallery-thumbnail" src={imageURLs[i]} />)
        } else {
            images.push(
                <button onClick={() => setActiveImage(i)}>
                    <img className="gallery-thumbnail inactive" src={imageURLs[i]} />
                </button>
            )
        }
    }

    return (
        <div id="gallery-thumbnail-container">
            {images}
        </div>
    )
}

function ImageGallery({imageURLs}) {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div id="listing-gallery-container">
            <GalleryThumbnails imageURLs={imageURLs} activeImage={activeImage} setActiveImage={setActiveImage} />
            <div className="gallery-pg-container">
                <GalleryButton step={-1} content={"<"} images={imageURLs} activeImage={activeImage} setActiveImage={setActiveImage} />
            </div>
            <div id="gallery-image-container">
                <img className="gallery-image" src={imageURLs[activeImage]} />
            </div>
            <div className="gallery-pg-container">
                <GalleryButton step={1} content={">"} images={imageURLs} activeImage={activeImage} setActiveImage={setActiveImage} />
            </div>
        </div>
    )
}


export default function Listing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const listingId = searchParams.get("id");

    const navigate = useNavigate();
    const [listingDoc, setListingDoc] = useState();
    const getListingDoc = getListing(listingId);
    
    useEffect(() => {
        getListingDoc
        .then(listingDoc => {
            setListingDoc(listingDoc); 
        })
        .catch((error) => {
            console.log("something went wrong");
            console.log(error);
        });
    }, [])
    console.log("wah4");
    const listingData = listingDoc.listing;

    let savedButton = <button className="button">Save</button>;
    // if (!listingSaved) {
    //     savedButton = <button className="button" disabled >Saved</button>;
    // }

    // Test images
    const imageURLs = [
        "https://64.media.tumblr.com/ba526c636108f3b2df589bf44032fde3/ec9f3ab8fe0dd7d3-01/s2048x3072/bbeac1c26482b94c41c540fafce6629fe6e53483.png",
        "https://64.media.tumblr.com/742d481df09a99e6f90473f8117740c3/4c0c86c3b89ad6a1-52/s2048x3072/4dd160e094669754ed6be8b13c1c90429f726e9a.png",
        "https://64.media.tumblr.com/8bba5c35ddc0a53b61ed9224798169af/9d8b05082cc9b969-43/s2048x3072/17506cc221aba28a14fa3cec28929f788aba3d7a.png"
    ]

    return (
        <div id="content">
            <div id="listing-container">
                <ImageGallery imageURLs={imageURLs} />
                <div id="listing-info">
                    <p>${listingData.price}</p>
                    <h2>{listingData.title}</h2>
                    <p>Seller</p>
                    <p>{listingData.desc}</p>
                    <button className="button red">Message</button>
                    <br></br>
                    {savedButton}
                </div>
            </div>
        </div>
    )
}