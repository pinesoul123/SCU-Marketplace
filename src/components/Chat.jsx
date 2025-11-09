import { useEffect, useState } from "react";
import { listenToMessages, sendMessage, chatService } from "../api/chat.js";
import { auth } from "../lib/firebase";
import "../styles/Chat.css"

function Messages({ chatId, selfId }) {
    const ids = chatId.split("_");
    const sellerId = (ids[1] == selfId) ? ids[2] : ids[1];

    const [messages, setMessages] = useState([]);

    listenToMessages(chatId, (msgs) => setMessages(msgs));


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

export default function Chat({ chatId, chatActive, setChatActive }) {
    const selfId = auth.currentUser?.uid;

    function closeChat() {
        setChatActive(false);
    }

    if (chatActive) {
        const handleSubmit = (e) =>{ 
            e.preventDefault();
            const message = e.target[0].value;
            e.target[0].value = "";
            sendMessage(chatId, message);
        }

        return (
            <div id="chat-container">
                <div id="chat-heading-container">
                    <button id="chat-close-button" className="button" onClick={closeChat}>X</button>
                    <div>Message</div>
                </div>
                <Messages chatId={chatId} selfId={selfId} />
                <form id="input-container" onSubmit={handleSubmit}>
                    <input id="chat-input" type="text" placeholder="Message..."></input>
                </form>
            </div>
        )
    }
    
}