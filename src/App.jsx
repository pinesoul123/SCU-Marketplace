import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import CreateListing from "./pages/CreateListing";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import RequestBoards from "./pages/RequestBoards";
import Saved from "./pages/Saved";

function App() {
  return (
    <BrowserRouter>
      <nav id="navbar">
        <Link to="/">Feed</Link>
        <Link to="/requestboards">Request Boards</Link>
        <Link to="/saved">Saved</Link>
        <Link to="/account">Account</Link>
        <Link to="/new">New Listing</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/new" element={<CreateListing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/requestboards" element={<RequestBoards />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;




