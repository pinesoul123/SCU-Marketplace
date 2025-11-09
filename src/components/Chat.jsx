import { useEffect, useState } from "react";
import { startChat, listenToMessages, sendMessage, chatService } from "../api/chat.js";
import { auth } from "../lib/firebase";
import "../styles/Chat.css"

function Messages() {
    return (
        <div id="messages-container">
            <div id="messages-content">
                <p className="recieved">this is a recieved message</p>
                <p className="sent">this is a sent message</p>
                <p className="sent"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisi turpis, laoreet ut nunc aliquet, venenatis dignissim mauris. Duis ut tortor at elit cursus rhoncus aliquam ac felis. Sed ac enim quam. Phasellus arcu ipsum, ultrices non dolor non, vehicula ullamcorper orci. Nam rutrum imperdiet vestibulum. Nullam blandit euismod sollicitudin. Pellentesque lobortis vehicula ante, id egestas metus elementum ut. Aliquam augue nulla, semper vitae neque a, pulvinar ornare tellus. Curabitur venenatis cursus odio, sed consectetur libero posuere vel. Aenean commodo felis sem, a egestas nunc pretium eget. Curabitur non neque non urna aliquam porttitor. Vivamus molestie erat at nulla elementum, quis consequat nibh sollicitudin. </p>
                <p className="recieved"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisi turpis, laoreet ut nunc aliquet, venenatis dignissim mauris. Duis ut tortor at elit cursus rhoncus aliquam ac felis. Sed ac enim quam. Phasellus arcu ipsum, ultrices non dolor non, vehicula ullamcorper orci. Nam rutrum imperdiet vestibulum. Nullam blandit euismod sollicitudin. Pellentesque lobortis vehicula ante, id egestas metus elementum ut. Aliquam augue nulla, semper vitae neque a, pulvinar ornare tellus. Curabitur venenatis cursus odio, sed consectetur libero posuere vel. Aenean commodo felis sem, a egestas nunc pretium eget. Curabitur non neque non urna aliquam porttitor. Vivamus molestie erat at nulla elementum, quis consequat nibh sollicitudin. </p>
            </div>
        </div>
    )
}

export default function Chat({ chatId, chatActive, setChatActive }) {
    // const [chatActive, setChatActive] = useState(listChatActive);
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
                <Messages chatId={chatId} />
                <div id="input-container">
                    <input id="chat-input" type="text" placeholder="Message..."></input>
                </div>
            </div>
        )
    }
    
}