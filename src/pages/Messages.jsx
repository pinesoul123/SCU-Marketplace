import { useEffect, useState} from "react";
import { fetchMyChats } from "../api/chat.js";
import { listings } from "../api/listings";
import Chat from "../components/Chat";
import "../styles/Messages.css";

async function getChats() {
    return (await fetchMyChats());
}

async function getListing(id) {
    return (await listings.get(id));
}

export default function Messages() {
    const [currentChat, setCurrentChat] = useState("");

    const [myChats, setMyChats] = useState();
    const [myChatList, setMyChatList] = useState([]);
    const getMyChats = getChats();        
    
    const chatList = [];

    useEffect(() => {
        getMyChats
        .then(myChats => {
            setMyChats(myChats);
            console.log(myChats); 
        })
        .catch((error) => {
            console.log("something went wrong");
            console.log(error);
        });
    }, [])

    if (myChats == null) {
        return;
    }

    
    // for (let chat of myChats) {
    //     const listingId = chat.id.split("__")[0];
    //     getListing(listingId).then(data => {
    //         chatList.push(<button className="chat-list-item button" onClick={() => setCurrentChat(chat.id)}>
    //             {data.listing.title}
    //             </button>);
    //         // setMyChatList(chatList);
    //     });
    //     // console.log(listing);
    //     // chatList.push(<button className="chat-list-item button" onClick={() => setCurrentChat(chat.id)}>Chat</button>)
    // }

    return (
        <div id="content">
            <h1>Messages</h1>
            <div id="messages-page-container">
                <div id="chat-list">{myChatList}</div>
                <div id="wide-chat-container">
                    <Chat chatId={currentChat} chatActive={true} />
                </div>
            </div>
        </div>
    )
}