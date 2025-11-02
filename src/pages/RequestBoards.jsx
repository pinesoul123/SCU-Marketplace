// Displays all request boards

import { Link } from "react-router-dom";

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

function Board({ name }) {
	return (
		<Link className="button request-board-button" to={`/requestboards/${encodeURIComponent(name)}`}>
			<h2>{name}</h2>
		</Link>
	)
}

export default function RequestBoards() {
	const renderBoards = boards.map(board => <Board name={board}></Board>);

	return (
		<div id="content">
			<h1>Request Boards</h1>
			<div id="request-boards-container">
				{renderBoards}
			</div>
		</div>
	);
}