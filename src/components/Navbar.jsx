import { Link, useSearchParams, useLocation, Navigate, redirect, useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const handleSubmit = (e) =>{ 
    e.preventDefault();
    let path = `/market?search=` + e.target[0].value;
    navigate(path);
  }

  return (
    <form id="searchbar-form" onSubmit={handleSubmit}>
      <input id="searchbar" type="text" placeholder="Search items"></input>
    </form>
  )
}

export default function Navbar() {
    return (
        <nav id="navbar">
        <div className="navbar-left">
          <Link to="/">
            <div id="logo-container">
              <img src="./src/assets/scu-logo.png"></img>
              <p><b>SCU<br />Marketplace</b></p>
            </div>
          </Link>
          <Search />
        </div>

        <div className="navbar-right">
          <Link to="/requestboards" className="navlink">Request Boards</Link>
          <Link to="/saved" className="navlink">Saved</Link>
          <Link to="/account" className="navlink">My Account</Link>
          <Link to="/new" className="navlink">New Listing</Link>
        </div>
      </nav>
    )
}