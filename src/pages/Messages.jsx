import { useEffect, useState} from "react";
import { fetchMyChats } from "../api/chat.js";
import Chat from "../components/Chat";

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

    console.log(myChats);

    const chatList = [];
    myChats.forEach((chat) => {
        chatList.push(<button className="chat-list-item" onClick={() => setCurrentChat(chat.id)}>Chat</button>)
    });

    return (
        <div id="content">
            <h1>Messages</h1>
            <div id="chat-list">{chatList}</div>
            <Chat chatId={currentChat} chatActive={true} />
        </div>
    )
}