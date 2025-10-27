import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Market from "./pages/Market";
import CreateListing from "./pages/CreateListing";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import RequestBoards from "./pages/RequestBoards";
import Saved from "./pages/Saved";
import Navbar from "./components/Navbar.jsx"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Market />} />
        <Route path="/market" element={<Market />} />
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




