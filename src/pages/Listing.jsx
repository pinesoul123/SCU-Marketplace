import { useState } from "react";
import '../styles/Listing.css'

/* Step: the increment or decrement */
function GalleryButton({step, content, images, activeImage, setActiveImage}) {
    function handleClick() {
        setActiveImage(activeImage + step);
    }
    const button = <button onClick={handleClick}>{content}</button>
    // Back button, only renders if active image is not first image
    if (step < 0) {
        if (activeImage != 0) {
            return (button);
        }
    }
    // Next button, only renders if active image is not last image
    if (step > 0) {
        if (activeImage != images.length - 1) {
            return (button);
        }
    }
}

function GalleryThumbnails({imageURLs, activeImage, setActiveImage}) {
    
}

function ImageGallery({imageURLs}) {
    const [activeImage, setActiveImage] = useState(0);
    //const images = imageURLs.map((image) => <img className="listing-image" src={image} />)
    function nextImage() {
        setActiveImage(activeImage + 1);
        console.log(activeImage);
    }

    return (
        <div id="listing-gallery-container">
            <GalleryButton step={-1} content={"Back"} images={imageURLs} activeImage={activeImage} setActiveImage={setActiveImage} />
            <img className="listing-image" src={imageURLs[activeImage]} />
            <GalleryButton step={1} content={"Next"} images={imageURLs} activeImage={activeImage} setActiveImage={setActiveImage} />
        </div>
    )
}

export default function Listing({listingId}) {
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
                    <p>Price</p>
                    <h2>Listing Title</h2>
                    <p>Seller</p>
                    <p>Listing desc</p>
                    <button className="button red">Message</button>
                    <br></br>
                    <button className="button">Save</button>
                </div>
            </div>
        </div>
    )
}