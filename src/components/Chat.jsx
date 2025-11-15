import { useEffect, useState, useRef } from "react";
import { listenToMessages, sendMessage, fetchChat, closeChatForMe, reopenChatForMe } from "../api/chat.js";
import { Link } from "react-router-dom";
import { auth } from "../lib/firebase";
import "../styles/Chat.css"

function Messages({ chatId, selfId, closed }) {
		const ids = chatId.split("__");
		const sellerId = (ids[1] == selfId) ? ids[2] : ids[1];

        const messageBottom = useRef(null);

		const [messages, setMessages] = useState([]);

        function scrollToBottom() {
            // console.log("scroll");
            messageBottom.current.scrollIntoView({ 
                behavior: "smooth",
                block: 'nearest',
                inline: 'center'
            });
        }

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

        useEffect(() => {
            scrollToBottom();
        }, [messages])

		const renderedMessages = [];
		messages.forEach((message) => {
				if (message.senderId == selfId) {
						renderedMessages.push(<p className="sent">{message.text}</p>)
				} else if (message.senderId == sellerId) {
						renderedMessages.push(<p className="recieved">{message.text}</p>)
				}
		});

        

		return (
            <div id="messages-container">
                <div id="messages-content">
                    {renderedMessages}
                    {closed && <p id="chat-closed-message">This chat is closed</p>}
                    <span ref={messageBottom}></span>
                </div>
            </div>
		)
}

function ActiveChatButton({ chatId, closedForMe }) {      
    let button = <button id="close-button" className="button" onClick={() => closeChatForMe(chatId)}>Close Chat</button>;
    if (closedForMe) {
        button = <button id="reopen-button" className="button red" onClick={() => reopenChatForMe(chatId)}>Reopen Chat</button>;
    }
    return (
        <div>
            {button}
        </div>
    )
}

export default function Chat({ chatId, chatTitle, chatActive }) {
		const selfId = auth.currentUser?.uid;

		if (chatActive && chatId) {
            const [chatInfo, setChatInfo] = useState();

            const getChatInfo = fetchChat(chatId);


            useEffect(() => {
                console.log("useEffect");
                getChatInfo
                .then(chatInfo => {
                    setChatInfo(chatInfo);
                })
                .catch((error) => {
                    console.log("something went wrong");
                    console.log(error);
                });
            }, [chatId]);

            if (chatInfo == null) {
                return;
            }


            const handleSubmit = (e) =>{
                    e.preventDefault();
                    const message = e.target[0].value;
                    e.target[0].value = "";
                    sendMessage(chatId, message);
            }

            const closedForMe = chatInfo.closedFor.includes(selfId);


            const messageInput = (closedForMe) ? 
                    (<form id="input-container" onSubmit={handleSubmit} autocomplete="off">
                            <input id="chat-input" type="text" placeholder="Message..." disabled></input>
                    </form>) 
                    : 
                    (<form id="input-container" onSubmit={handleSubmit} autocomplete="off">
                            <input id="chat-input" type="text" placeholder="Message..."></input>
                    </form>); 

            return (
                <div id="chat-container">
                    <div id="messages-header">
                        <div></div>
                        <Link to={"/listing?id=" + chatId.split("__")[0]}>{chatTitle}</Link>
                        <ActiveChatButton chatId={chatId} closedForMe={closedForMe}/>
                    </div>
                    <Messages chatId={chatId} selfId={selfId} closed={closedForMe} />
                    {messageInput}
                </div>
            )
		}

}