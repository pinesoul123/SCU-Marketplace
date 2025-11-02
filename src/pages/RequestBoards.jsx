// Page for all request boards and to create new requests

import { Link } from "react-router-dom";
import { useState } from "react";
import { addBoardRequest } from "../api/requestBoard";

const boards = [
	"Graham",
	"Finn",
	"Swig",
	"Dunne",
	"Campisi",
	"Sanfilippo",
	"Casa Italiana",
	"Sobrato",
	"McWalsh",
	"Nobili",
	"Off Campus",
  ]

const categories = ["Furniture", "Appliances", "Books", "Clothes", "Other"];

// Button for each request board
function Board({ name }) {
	return (
		<Link className="button request-board-button" to={`/requestboards/${encodeURIComponent(name)}`}>
			<h2>{name}</h2>
		</Link>
	)
}

// Form to create new requests
function CreateRequestForm({ show, onClose }) {
	const [board, setBoard] = useState("");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [category, setCategory] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();		// to stop page from refreshing
		try {
			await addBoardRequest(board, {
				title: title.trim(),
				body: body.trim(),
				category: category,
				locationTag: board,
			});
			onClose();
			window.location.reload(); 	// reload the page to show new request
		} catch (err) {
			alert(err.message || "Failed to create request");
		}
	};

	if (!show) return null;

	// Renders popup form to create new requests
	return (
		<div id="popup-container" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
			<div id="popup-bg" onClick={onClose}></div>
			<div id="popup">
				<h2>Create Request</h2>
				<form onSubmit={handleSubmit}>

					<label htmlFor="request-board">Board *</label>
					{/* Dropdown menu to select board name*/}
					<select id="request-board" value={board} onChange={(e) => setBoard(e.target.value)} className="textbox" required>
						<option value="">Select board...</option>
						{boards.map(b => <option key={b} value={b}>{b}</option>)}
					</select>

					<label htmlFor="request-title">Title *</label>
					{/* Text box for title */}
					<input id="request-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="textbox" required />
					
					<label htmlFor="request-body">Description *</label>
					{/* Text for body */}
					<textarea id="request-body" value={body} onChange={(e) => setBody(e.target.value)} className="textbox" rows={4} required />

					<label htmlFor="request-category">Category *</label>
					{/* Dropdown menu to select category */}
					<select id="request-category" value={category} onChange={(e) => setCategory(e.target.value)} className="textbox" required>
						<option value="">Select category...</option>
						{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
					</select>

					{/* Button to create request */}
					<button type="submit" className="button red">Create</button>

					{/* Button to cancel */}
					<button type="button" className="button" onClick={onClose}>Cancel</button>

				</form>
			</div>
		</div>
	);
}


// Renders page
export default function RequestBoards() {
	const [showForm, setShowForm] = useState(false);

	return (
		<div id="content">
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
				<h1 style={{ margin: 0 }}>Request Boards</h1>
				<button className="button red create-request-button" onClick={() => setShowForm(true)}>Create Request</button>
			</div>
			<CreateRequestForm show={showForm} onClose={() => setShowForm(false)} />
			<div id="request-boards-container">
				{boards.map(board => <Board key={board} name={board} />)}
			</div>
		</div>
	);
}