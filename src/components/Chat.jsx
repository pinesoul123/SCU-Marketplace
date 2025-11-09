import { useEffect, useState } from "react";
import { listenToMessages, sendMessage, chatService } from "../api/chat.js";
import { auth } from "../lib/firebase";
import "../styles/Chat.css"

function Messages({ chatId, selfId }) {
    const ids = chatId.split("_");
    const sellerId = (ids[1] == selfId) ? ids[2] : ids[1];

    const testMessages = [
        {
            senderId: 1,
            text: "wahwah1",
            sentAt: "time"
        },
        {
            senderId: 1,
            text: "wahwah2",
            sentAt: "time"
        },
        {
            senderId: 2,
            text: "wahwah3",
            sentAt: "time"
        },
        {
            senderId: 1,
            text: "wahwah4",
            sentAt: "time"
        },
        {
            senderId: 2,
            text: "wahwah5",
            sentAt: "time"
        },
        {
            senderId: 2,
            text: "wahwah6",
            sentAt: "time"
        },
        {
            senderId: 1,
            text: "Hi! Just saw your post about the new Namesake cover, would you explain what’s up with using red and blue pencil?",
            sentAt: "time"
        },
        {
            senderId: 2,
            text: "For sure! I draw everything on paper and then color it digitally. I use col-erase pencils",
            sentAt: "time"
        },
        {
            senderId: 2,
            text: "which is basically just color pencils you can erase - to sketch the art, and then I ink on top. Then I scan it, and remove the colors using the black and white function in Photoshop",
            sentAt: "time"
        }
    ]

    // listenToMessages(chatId, )

    const messages = [];
    testMessages.forEach((message) => {
        if (message.senderId == selfId) {
            messages.push(<p className="sent">{message.text}</p>)
        } else if (message.senderId == sellerId) {
            messages.push(<p className="recieved">{message.text}</p>)
        }
    })

    return (
        <div id="messages-container">
            <div id="messages-content">
                {messages}
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

        return (
            <div id="chat-container">
                <div id="chat-heading-container">
                    <button id="chat-close-button" className="button" onClick={closeChat}>X</button>
                    <div>Message</div>
                </div>
                <Messages chatId={chatId} selfId={selfId} />
                <div id="input-container">
                    <input id="chat-input" type="text" placeholder="Message..."></input>
                </div>
            </div>
        )
    }
    
}