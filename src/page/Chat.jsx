
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  // for private chat
    const [isPrivateChat, setIsPrivateChat] = useState(false);   //toggle between group and private chat
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.currentUser) {
            navigate("/login");
            return;
        }

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("chatId", "==", "group_chat"), orderBy("timestamp", 'asc'));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });

        // fetch user
        const usersref = collection(db, "users");
        const unsubscribeUsers = onSnapshot(usersref, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });

        return () => {
            unsubscribeMessages();
            unsubscribeUsers();
        }
    }, [navigate]);

    // function to generate unique chat id for private chat
    const getChatId = (user1, user2) => {
        return [user1, user2].sort().join("_");
    }

    // fetch messages for private chat when a user is selected
    useEffect(() => {
        if(!auth.currentUser || !selectedUser || !isPrivateChat) return;

        //get chatId
        const chatId = getChatId(auth.currentUser.email, selectedUser.email);
        if(!chatId) return; // avoid fetching if chat id is null
        const q = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });
        return () => unsubscribe();
    }, [selectedUser, isPrivateChat]);

    // Toggle between private chat and group chat
    const toggleChat = () => {
        setIsPrivateChat(!isPrivateChat);
        setSelectedUser(null);
    };

    //handle user selection for private chat
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setMessages([]);  // clear prev messages
    }

    // send messages group or private
    const sendMessage = async (e) => {
        e.preventDefault();
        if(message.trim() === "") return;

        let chatId = "group_chat";
        let receiver = null;

        if(isPrivateChat && selectedUser) {
            chatId = getChatId(auth.currentUser.email, selectedUser.email);
            receiver = selectedUser.email;
        }
        await addDoc(collection(db, "messages"), {
            text: message,
            user: auth.currentUser.email,          // can use the display "name" if available
            receiver: receiver,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
        setMessage("");
    };

    return (
        <div className="flex h-screen w-full">
            {/* left user list  */}
            <div className="w-1/4 bg-gray-900 mt-3 text-white p-4 hidden md:block">
                <h2 className="text-lg font-semibold border-b pb-2">Members</h2>
                <button className={`p-2 my-2 w-full text-white ${isPrivateChat ? "bg-gray-700" : "bg-blue-600"}`} onClick={toggleChat}>{isPrivateChat ? "Switch to Group chat": "switch to Private chat"}</button>
                {isPrivateChat && users.map((user, index) => (
                    <div key={user.id} className={`p-2 border-b border-gray-700 cursor-pointer ${selectedUser?.email === user.email ? "bg-blue-600" : ""}`} onClick={() => handleUserSelect(user)} >
                        <p className="text-sm font-medium">{user.username || "User"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                ))}
            </div>

            {/* right chat box  */}
            <div className="w-full md:w-3/4 flex flex-col justify-end bg-cover bg-center p-4"
                style={{ backgroundImage: "url('https://w0.peakpx.com/wallpaper/391/899/HD-wallpaper-batman-logo-darkness-creative.jpg')" }}>
                    {/* chat header  */}
                    <div className="bg-gray-800 text-gray-800 p-2 text-center">{isPrivateChat ? selectedUser ? `Chatting with ${selectedUser.username || selectedUser.email}` : "Select a user to chat privately" : "Group chat"}</div>
                    
                {/* chat messages  */}
                <div className="flex-1 overflow-y-auto p-2 bg-opacity-50 backdroup-blur-lg sm-p-4">
                    {Array.isArray(messages) && messages.map((msg) => (
                        <div key={msg.id} className={`mb-4 p-2 rounded-lg max-w-lg ${msg.user === auth.currentUser.email ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-900 self-start mr-auto"}`}>
                            {/* <p className="text-xs font-medium">{msg.user}</p> */}
                            <p>{msg.user === auth.currentUser.email ? "You" : msg.user }</p>
                            <p className="text-lg font-bold">{msg.text}</p>
                            {/* <p>{msg.timestamp?.todate().toLocaleString()}</p> */}
                            <p className="text-xs font-light">{msg.timestamp ? msg.timestamp.toDate().toLocaleString() : "Loading..."}</p>
                        </div>
                    ))}
                </div>

                {/* input field  */}
                <form onSubmit={sendMessage} className="flex bg-white p-2 border-none rounded-lg">
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message.." className="flex-1 p-2 border-none text-black outline-none border rounded-1-lg" />
                    <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-lg">Send</button>
                </form>
            </div>
        </div>
    );
};
export default Chat;