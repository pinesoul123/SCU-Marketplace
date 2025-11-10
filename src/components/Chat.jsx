import { useEffect, useState} from "react";
import { listenToMessages, sendMessage } from "../api/chat.js";
import { auth } from "../lib/firebase";
import "../styles/Chat.css"

function Messages({ chatId, selfId }) {
		const ids = chatId.split("__");
		const sellerId = (ids[1] == selfId) ? ids[2] : ids[1];

		const [messages, setMessages] = useState([]);

		// Using useEffect to hopefully prevent memory being eaten (leakage)
		useEffect(() => {
				if (!chatId || !selfId) return;

				// Subscribes to Firestore messages
				const unsubscribe = listenToMessages(chatId, (msgs) => setMessages(msgs));

				// If chat isn't active or IDs change, unsubscribe
				return () => {
					if (unsubscribe) unsubscribe();
				};
		}, [chatId, selfId]); // Rerun if IDs change

		const renderedMessages = [];
		messages.forEach((message) => {
				if (message.senderId == selfId) {
						renderedMessages.push(<p className="sent">{message.text}</p>)
				} else if (message.senderId == sellerId) {
						renderedMessages.push(<p className="recieved">{message.text}</p>)
				}
		})

		return (
				<div id="messages-container">
						<div id="messages-content">
								{renderedMessages}
						</div>
				</div>
		)
}

export default function Chat({ chatId, chatActive }) {
		const selfId = auth.currentUser?.uid;

		if (chatActive && chatId) {
            const handleSubmit = (e) =>{
                    e.preventDefault();
                    const message = e.target[0].value;
                    e.target[0].value = "";
                    sendMessage(chatId, message);
            }

            return (
                <div id="chat-container">
                    <Messages chatId={chatId} selfId={selfId} />
                    <form id="input-container" onSubmit={handleSubmit}>
                            <input id="chat-input" type="text" placeholder="Message..."></input>
                    </form>
                </div>
            )
		}

}