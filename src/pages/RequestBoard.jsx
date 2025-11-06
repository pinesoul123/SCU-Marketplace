// Displays requests for each board

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardRequests } from "../api/requestBoard";

function Request({itemInfo}) {
  return (
    <div className="button request-board-button">
      <strong>{itemInfo.title}</strong>{itemInfo.category ? ` (${itemInfo.category})` : ""}
                  {itemInfo.body && <p style={{ marginTop: "8px", marginBottom: "8px" }}>{itemInfo.body}</p>}
    </div>
  )
}

export default function RequestBoard() {
  const { board } = useParams();  // board name
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches requests from the board
  useEffect(() => {
    let isActive = true;  // prevents updates
    setLoading(true);
    setError("");
    console.log(`[RequestBoard] Loading requests for board: ${board}`);
    getBoardRequests(board)
      .then((list) => { 
        console.log(`[RequestBoard] Loaded ${list?.length || 0} requests:`, list);
        if (isActive) setItems(list || []); 
      })
      .catch((e) => { 
        console.error(`[RequestBoard] Error loading requests:`, e);
        if (isActive) setError(e.message || "Failed to load requests"); 
      })
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, [board]);

  return (
    <div id="content">
      <h1>Request Board: {board}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div id="requests-container">
          {items.length === 0 ? (
            <p>No requests are posted</p>
          ) : (
            <>
              {items.map((it) => (
                <Request key={it.id} itemInfo={it} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}