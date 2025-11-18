// Page for all request boards and to create new requests

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { addBoardRequest, getBoardRequests, removeBoardRequest } from "../api/requestBoard";
import { auth } from "../lib/firebase";
import "../styles/RequestBoard.css";

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
		<div id="popup-container" className="request-popup">
			<div id="popup-bg" onClick={onClose}></div>
			<div id="popup" className="request-popup">
				<h2>Create Request</h2>
				<form id="request-form" onSubmit={handleSubmit}>
					<div className="first-row">
						<span>
							<label htmlFor="request-board">Board: </label>
							<select id="request-board" value={board} onChange={(e) => setBoard(e.target.value)} className="textbox" required>
								<option value="" disabled selected>Select board...</option>
								{boards.map(b => <option key={b} value={b}>{b}</option>)}
							</select>
						</span>
						<span>
							<label htmlFor="request-title">Title: </label>
							<input id="request-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="textbox" required />
						</span>
					</div>
					<div>
						<label htmlFor="request-body">Description: </label>
						<br></br>
						<textarea id="request-body" value={body} onChange={(e) => setBody(e.target.value)} className="textbox" rows={4} required />
					</div>
					<div>
						<label htmlFor="request-category">Category: </label>
						<select id="request-category" value={category} onChange={(e) => setCategory(e.target.value)} className="textbox" required>
							<option value="" disabled selected>Select category...</option>
							{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
						</select>
					</div>
					<div id="control-buttons">
						<button type="button" className="button" onClick={onClose}>Cancel</button>
						<button type="submit" className="button red">Create</button>
					</div>

				</form>
			</div>
		</div>
	);
}

// Popup to delete user's requests
function DeleteRequestsForm({ show, onClose, requests, onDelete }) {
	const currentUserId = auth.currentUser?.uid;
	const [selectedIds, setSelectedIds] = useState(new Set());

	// Gets user's requests
	const myRequests = requests.filter(req => req.createdBy === currentUserId);

	// Toggles when requests are selected
	const handleToggle = (requestId) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(requestId)) {
				newSet.delete(requestId);
			} else {
				newSet.add(requestId);
			}
			return newSet;
		});
	};

	// Deletes selected requests
	const handleDelete = async () => {
		try {
			// Loop to delete requests
			for (const requestId of selectedIds) {
				const request = myRequests.find(r => `${r.boardName}-${r.id}` === requestId);
				if (request) {
					await removeBoardRequest(request.boardName, request.id);
				}
			}
			onDelete();		// Reloads requests
			onClose();
			setSelectedIds(new Set());	// Clears the selections
		} catch (err) {
			alert(err.message || "Failed to delete requests");
		}
	};

	if (!show) return null;

	return (
		<div id="popup-container" className="request-popup">
			<div id="popup-bg" onClick={onClose}></div>
			<div id="popup" className="request-popup">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
					<h2>My Requests</h2>
					<div style={{ display: "flex", gap: "10px" }}>
						<button type="button" className="button" onClick={onClose}>Cancel</button>
						<button className="button red" onClick={handleDelete}> Delete </button>
					</div>
				</div>
				{/* If user has no requests, don't show list */}
				{myRequests.length === 0 ? (
					<p>You have no requests</p>
				) : (
					// If user has requests, show list
					<div style={{ maxHeight: "400px", overflowY: "auto" }}>		{/* Scrollable list */}
						{myRequests.map((request) => {
							const requestId = `${request.boardName}-${request.id}`;
							return (
								<label 
									key={requestId} 
									style={{ 
										display: "block", 
										padding: "10px", 
										marginBottom: "10px",
										border: "1px solid grey",
										borderRadius: "5px",
										cursor: "pointer"
									}}
								>
									<input
										type="checkbox"
										checked={selectedIds.has(requestId)}
										onChange={() => handleToggle(requestId)}
										style={{ marginRight: "10px" }}
									/>
									<b>{request.title}</b>
									{request.category && ` (${request.category})`}
									<span style={{ color: "darkred", marginLeft: "8px" }}>
										- {request.boardName}
									</span>
									{request.body && (
										<p style={{ marginTop: "8px", fontSize: "14px" }}> 
											{request.body}
										</p>
									)}
								</label>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

// Renders page
export default function RequestBoards() {
	const [showForm, setShowForm] = useState(false);
	const [showDeleteForm, setShowDeleteForm] = useState(false);
	const [myRequests, setMyRequests] = useState([]);
	const [loading, setLoading] = useState(true);

	// Load all requests from all boards
	const loadAllRequests = async () => {
		setLoading(true);
		try {
			const allRequests = [];
			for (const board of boards) {
				try {
					const requests = await getBoardRequests(board);
					// Add board name to each request for reference
					const requestsWithBoard = requests.map(req => ({ ...req, boardName: board }));
					allRequests.push(...requestsWithBoard);
				} catch (err) {
					console.error(`Failed to load requests from ${board}:`, err);
				}
			}
			setMyRequests(allRequests);
		} catch (err) {
			console.error("Failed to load requests:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAllRequests();
	}, []);

	return (
		<div id="content">
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
				<h1 style={{ margin: 0 }}>Request Boards</h1>
				<div>
					<button className="button white" onClick={() => setShowDeleteForm(true)}>Delete Requests</button>
					<button className="button red create-request-button" onClick={() => setShowForm(true)}>Create Request</button>
				</div>
			</div>
			<CreateRequestForm show={showForm} onClose={() => {
				setShowForm(false);
				loadAllRequests(); // Reload requests after creating
			}} />
			<DeleteRequestsForm 
				show={showDeleteForm} 
				onClose={() => setShowDeleteForm(false)} 
				requests={myRequests}
				onDelete={loadAllRequests}
			/>
			<div id="request-boards-container">
				{boards.map(board => <Board key={board} name={board} />)}
			</div>
		</div>
	);
}