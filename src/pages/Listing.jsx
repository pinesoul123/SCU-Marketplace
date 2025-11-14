import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { listings } from "../api/listings";
import { useAuth } from "../lib/AuthProvider";
import { isAdmin } from "../api/account.js";
import { saveListing, unsaveListing, isSaved } from "../api/saved";
import { chatService } from "../api/chat.js";
import Chat from "../components/Chat.jsx";
import Popup from "../components/Popup";
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

async function removeListing(id) {
    return (await listings.remove(id));
}

function RemovePopup() {
    const navigate = useNavigate();

    return (
        <Popup message={"Listing removed."} buttonMessage={"Done"} 
            onClick={() => {
                navigate("/account");
            }}/>
    )
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

function SideChatContainer({ chatId, chatActive, setChatActive }) {
    function closeChat() {
        setChatActive(false);
    }

    if (chatActive) {
        return (
            <div id="side-chat-container">
                <button id="chat-close-button" className="button" onClick={closeChat}>X</button>
                <Chat chatId={chatId} chatTitle={"Message"} chatActive={chatActive} />
            </div>
        )
    }
}

export default function Listing() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const listingId = searchParams.get("id");

    const [chatActive, setChatActive] = useState(false);

    const [listingDoc, setListingDoc] = useState();
    const getListingDoc = getListing(listingId);

    const [chatId, setChatId] = useState();
    
    const [removePopupActive, setRemovePopupActive] = useState(false);

    
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

    function handleRemove() {
        setRemovePopupActive(true);
        removeListing(listingId);
    }

    if (listingDoc == null) {
        return;
    }
    const listingData = listingDoc.listing;
    const isMyListing = (user.uid == listingDoc.listing.sellerID);
    const admin = isAdmin(user.uid);

   async function handleMessage() {
        try {
            const id = await chatService.startChat({
                listingId: listingDoc.id,
                sellerId: listingData.sellerID || listingData.sellerId
            });
            setChatId(id);
            setChatActive(true);
        } catch (e) {
            console.error(e);
            alert(e.message || "Failed to start chat");
        }
    }

    return (
        <div id="content">
            { removePopupActive && <RemovePopup /> }
            <SideChatContainer chatId={chatId} chatActive={chatActive} setChatActive={setChatActive}/>
            <div id="listing-container" className={chatActive ? "chat-active" : ""}>
                <ImageGallery imageURLs={listingData.photoURLs} />
                <div id="listing-info">
                    <p id="listing-price">${(Math.round(listingData.price * 100) / 100).toFixed(2)}</p>
                    <h2>{listingData.title}</h2>
                    <p>{listingData.description}</p>
                    { !isMyListing && 
                        <>
                            <button className="button red" onClick={handleMessage}>Message</button>
                            <br></br>
                            <SaveButton listingId={listingId} />
                        </>
                    }
                    { (isMyListing || admin) && <button className="button" onClick={handleRemove}>Remove</button>}
                </div>
            </div>
        </div>
    )
}