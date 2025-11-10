import { useEffect, useState} from "react";
import { fetchMyChats } from "../api/chat.js";
import { Link } from "react-router-dom";
import { listings } from "../api/listings";
import Chat from "../components/Chat";
import "../styles/Messages.css";

async function getChats() {
    return (await fetchMyChats());
}

async function getChatsInfo(myChats) {
    const chatInfo = new Map();
    for (let chat of myChats) {
        const listingId = chat.id.split("__")[0];
        chatInfo.set(chat.id, await listings.get(listingId));
    }
    return chatInfo;
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
        if (currentChat == chat.id) {
            chatList.push(<button className="chat-list-item button active">
                {myChatsInfo.get(chat.id).listing.title}
                </button>)
        } else {
            chatList.push(<button className="chat-list-item button" 
                onClick={() => setCurrentChat([chat.id, myChatsInfo.get(chat.id).listing.title])}>
                    {myChatsInfo.get(chat.id).listing.title}
                </button>)
        }
    }

    return (
        <div id="chat-list">{chatList}</div>
    )
}

export default function Messages() {
    const [currentChat, setCurrentChat] = useState(["", ""]);

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
                <ChatList myChats={myChats} currentChat={currentChat[0]} setCurrentChat={setCurrentChat} />
                <div id="wide-chat-container">
                    <div id="wide-chat-heading">
                        {currentChat && <Link to={"/listing?id=" + currentChat[0].split("__")[0]}>{currentChat[1]}</Link>}
                    </div>
                    <Chat chatId={currentChat[0]} chatActive={true} />
                </div>
            </div>
        </div>
    )
}