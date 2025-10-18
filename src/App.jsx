import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import CreateListing from "./pages/CreateListing";
import Auth from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <nav id="navbar">
        <Link to="/">Feed</Link>
        <Link to="/new">New Listing</Link>
        <Link to="/auth">Auth</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/new" element={<CreateListing />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;




