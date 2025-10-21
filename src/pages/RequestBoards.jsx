
const boards = ["Graham", "Scipi"]

function Board({ name }) {
    return (
        <a class="request-board-button" href="">
            <h2>{name}</h2>
        </a>
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