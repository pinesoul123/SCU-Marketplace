import "./Listing.css"

export default function Listing({ name, price }) {
    return (
        <a href={"/"} className="listing">
            <img className="listing-image" src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1746"></img>
            {name}
            <br></br>
            {price}
        </a>
    )
}