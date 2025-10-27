import { Link, useSearchParams, useLocation, Navigate, redirect, useNavigate } from "react-router-dom";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  function handleSubmit(event) {
    redirect("/market");
    event.preventDefault();
    // The serialize function here would be responsible for
    // creating an object of { key: value } pairs from the
    // fields in the form that make up the query.
    // let params = serializeFormQuery(event.target);
    console.log("search");
    setSearchParams({ search: event.target[0].value });

  }

  const routeChange = () =>{ 
    let path = `/market`; 
    navigate(path);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* <Navigate to="/market" replace={false} state={0} /> */}
      <input id="searchbar" type="text" placeholder="Search items"></input>
      <button onClick={routeChange}>Wah</button>
      <input id="searchbar-submit" type="submit"></input>
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