import { useEffect, useState} from "react";
import { fetchMyChats } from "../api/chat.js";
import Chat from "../components/Chat";
import "../styles/Messages.css";

async function getChats() {
    return (await fetchMyChats());
}

export default function Messages() {
    const [currentChat, setCurrentChat] = useState("");

    const [myChats, setMyChats] = useState();
    const getMyChats = getChats();        
    
    useEffect(() => {
        getMyChats
        .then(myChats => {
            setMyChats(myChats); 
        })
        .catch((error) => {
            console.log("something went wrong");
            console.log(error);
        });
    }, [])

    const chatList = [];
    myChats.forEach((chat) => {
        chatList.push(<button className="chat-list-item button" onClick={() => setCurrentChat(chat.id)}>Chat</button>)
    });

    return (
        <div id="content">
            <h1>Messages</h1>
            <div id="messages-page-container">
                <div id="chat-list">{chatList}</div>
                <div id="wide-chat-container">
                    <Chat chatId={currentChat} chatActive={true} />
                </div>
            </div>
        </div>
    )
}