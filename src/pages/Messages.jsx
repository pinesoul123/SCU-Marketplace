import { useEffect, useState} from "react";
import { fetchMyChats } from "../api/chat.js";
import { Link } from "react-router-dom";
import { listings } from "../api/listings";
import { auth } from "../lib/firebase";
import Chat from "../components/Chat";
import "../styles/Messages.css";

async function getChats() {
    return (await fetchMyChats());
}

async function getChatsInfo(myChats) {
    const chatInfo = new Map();
    for (let chat of myChats) {
        const listingId = chat.id.split("__")[0];
        const listingInfo = await listings.get(listingId)
            .catch((error) => {
            console.log("Listing not found");
        });
        
        if (listingInfo != null) {
            chatInfo.set(chat.id, listingInfo);
        } 
    }
    return chatInfo;
}

function ChatButton({ chat, listingTitle, isCurrentChat, setCurrentChat = {}}) {

    let button = <button className="chat-list-item button active">
                    {listingTitle}
                </button>
    
    if (chat.closedFor.includes(auth.currentUser?.uid)) {
        button = <button className="chat-list-item button closed"
                    onClick={() => setCurrentChat({id: chat.id, title: listingTitle})}>
                    {listingTitle}
                </button>
    } else if (!isCurrentChat) {
        button = <button className="chat-list-item button" 
            onClick={() => setCurrentChat({id: chat.id, title: listingTitle})}>
                {listingTitle}
            </button>
    }
    return (
        (button)
    )
}

function ChatList({ myChats, currentChat, setCurrentChat }) {
    const [myChatsInfo, setMyChatsInfo] = useState();
    const getMyChatsInfo = getChatsInfo(myChats);

    useEffect(() => {
        getMyChatsInfo
        .then(myChatsInfo => {
            setMyChatsInfo(myChatsInfo);
        })
        .catch((error) => {
            console.log("something went wrong");
            console.log(error);
        });
    }, [])

    if (myChatsInfo == null) {
        return;
    }

    const chatList = [];

    for (let chat of myChats) {
        if (myChatsInfo.get(chat.id) != null) {
            chatList.push(<ChatButton chat={chat} listingTitle={myChatsInfo.get(chat.id).listing.title} isCurrentChat={currentChat.id == chat.id} setCurrentChat={setCurrentChat}/>)
        }
        
    }

    return (
        <div id="chat-list">{chatList}</div>
    )
}

export default function Messages() {
    const [currentChat, setCurrentChat] = useState({id: null, title: null});

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

    if (myChats == null) {
        return;
    }


    return (
        <div id="content">
            <h1>Messages</h1>
            <div id="messages-page-container">
                <ChatList myChats={myChats} currentChat={currentChat} setCurrentChat={setCurrentChat} />
                <div id="wide-chat-container">
                    <Chat chatId={currentChat.id} chatTitle={currentChat.title} chatActive={true} />
                </div>
            </div>
        </div>
    )
}