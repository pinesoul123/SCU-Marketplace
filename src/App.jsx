//import logo from './logo.svg';
//import './App.css';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/


import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import CreateListing from "./pages/CreateListing";
import Auth from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <nav style={{display:"flex",gap:12,padding:12}}>
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




