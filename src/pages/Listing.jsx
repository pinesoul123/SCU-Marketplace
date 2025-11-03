import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { listings } from "../api/listings";
import { saveListing, unsaveListing, isSaved } from "../api/saved";
import '../styles/Listing.css'


async function getListing(id) {
    return (await listings.get(id));
}

async function save(id) {
  return (await saveListing(id));
}

async function unsave(id) {
  return (await unsaveListing(id));
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
        if ((activeImage !== images.length - 1) && (activeImage != 0)) {
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

function SaveButton({listingId}) {
    const [isDocSaved, setIsDocSaved] = useState(false);
    const getIsDocSaved = saved(listingId);

    useEffect(() => {
        getIsDocSaved
        .then(isDocSaved => {
            setIsDocSaved(isDocSaved); 
        })
        .catch((error) => {
            console.log("something went wrong");
            console.log(error);
        });
    }, [])

    if (isDocSaved == null) {
        return;
    }

    function handleSave() {
        save(listingId);
        setIsDocSaved(true);
    }
    function handleUnsave() {
        unsave(listingId);
        setIsDocSaved(false);
    }

    let savedButton = <button className="button" onClick={handleSave}>Save</button>;
    if (isDocSaved) {
        savedButton = <button className="button" onClick={handleUnsave}>Unsave</button>;
    }

    return savedButton;
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

    if (listingDoc == null) {
        return;
    }
    const listingData = listingDoc.listing;

    return (
        <div id="content">
            <div id="listing-container">
                <ImageGallery imageURLs={listingData.photoURLs} />
                <div id="listing-info">
                    <p>${listingData.price}</p>
                    <h2>{listingData.title}</h2>
                    <p>Seller</p>
                    <p>{listingData.desc}</p>
                    <button className="button red">Message</button>
                    <br></br>
                    <SaveButton listingId={listingId} />
                </div>
            </div>
        </div>
    )
}