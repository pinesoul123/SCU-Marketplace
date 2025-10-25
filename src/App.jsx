import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Market from "./pages/Market";
import CreateListing from "./pages/CreateListing";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import RequestBoards from "./pages/RequestBoards";
import Saved from "./pages/Saved";
import ImageAnalysisTest from "./pages/ImageAnalysisTest";

function App() {
  return (
    <BrowserRouter>
      <nav id="navbar">
        <div className="navbar-left">
          <Link to="/">
            <div id="logo-container">
              <img src="./src/assets/scu-logo.png"></img>
              <p><b>SCU<br />Marketplace</b></p>
            </div>
          </Link>
          <input id="searchbar" type="text" placeholder="Search items"></input>
        </div>

        <div className="navbar-right">
          <Link to="/requestboards" className="navlink">Request Boards</Link>
          <Link to="/saved" className="navlink">Saved</Link>
          <Link to="/account" className="navlink">My Account</Link>
          <Link to="/new" className="navlink">New Listing</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Market />} />
        <Route path="/market" element={<Market />} />
        <Route path="/new" element={<CreateListing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/requestboards" element={<RequestBoards />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/test-image-analysis" element={<ImageAnalysisTest />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;




