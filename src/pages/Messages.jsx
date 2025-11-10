import { useEffect, useState} from "react";
import Chat from "../components/Chat";

export default function Messages() {
    const [currentChat, setCurrentChat] = useState("");

    return (
        <div id="content">
            <h1>Messages</h1>
            <div id="chat-list"></div>
        </div>
    )
}