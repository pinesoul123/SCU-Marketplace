import '../styles/Listing.css'



function ImageGallery({imageURLs}) {
    const images = imageURLs.map((image) => <img className="listing-image" src={image} />)

    return (
        <div id="listing-gallery-container">

        </div>
    )
}

export default function Listing({listingId}) {

    return (
        <div id="content">
            <div id="listing-container">
                <ImageGallery imageURLs={null} />
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