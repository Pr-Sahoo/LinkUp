
import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, where, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Hyperspeed from "../components/Hyperspeed";
import Fileupload from "../components/Fileupload";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isPrivateChat, setIsPrivateChat] = useState(false);
    const [activeMessageId, setActiveMessageId] = useState(null); // ADDED: For delete button visibility

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!auth.currentUser) {
            navigate("/login");
            return;
        }

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("chatId", "==", "group_chat"), orderBy("timestamp", "asc"));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Error fetching messages:", error); // ADDED: Catch snapshot errors
        });

        const usersRef = collection(db, "users");
        const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeMessages();
            unsubscribeUsers();
        };
    }, [navigate]);

    const getChatId = (user1, user2) => {
        return [user1, user2].sort().join("_");
    };

    useEffect(() => {
        if (!auth.currentUser || !selectedUser || !isPrivateChat) return;

        const chatId = getChatId(auth.currentUser.email, selectedUser.email);
        if (!chatId) return;
        const q = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Error fetching private chat messages:", error);
        });
        return () => unsubscribe();
    }, [selectedUser, isPrivateChat]);

    const toggleChat = () => {
        setIsPrivateChat(!isPrivateChat);
        setSelectedUser(null);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setMessages([]);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        let chatId = "group_chat";
        let receiver = null;

        if (isPrivateChat && selectedUser) {
            chatId = getChatId(auth.currentUser.email, selectedUser.email);
            receiver = selectedUser.email;
        }

        //CHANGED: Store userId as UID instead of email for rule compliance
        await addDoc(collection(db, "messages"), {
            text: message,
            user: auth.currentUser.email, // Keep this for display purposes
            userId: auth.currentUser.uid, // Add this for Firestore rule compliance
            receiver: receiver,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
        setMessage("");
    };

    //  CHANGED: Enhanced delete function with better feedback 
    // const deleteMsg = async (id) => {
    //     if (!id) return;
    //     const confirmDel = window.confirm("Are you sure you want to delete this message?");
    //     if (confirmDel) {
    //         try {
    //             await deleteDoc(doc(db, "messages", id));
    //             setActiveMessageId(null); // Hide delete button after deletion
    //             console.log("Message deleted successfully, ID:", id);
    //         } catch (error) {
    //             console.error("Error deleting message:", error);
    //             alert("Failed to delete message: " + error.message); // Notify user of failure
    //         }
    //     }
    // };
    const deleteMsg = async (id) => {
        if(!id) return;
        try {
            await deleteDoc(doc(db, "messages", id));
            setActiveMessageId(null);
            console.log("Message deleted successfully Id: ", id);
        } catch (error) {
            console.error("Error deleting message: ", error);
            alert("Failed to delete message: " + error.message);
        }
    }

    const handleUpload = async (url, filetype, fileName) => {
        let chatId = "group_chat";
        let receiver = null;

        if (isPrivateChat && selectedUser) {
            chatId = getChatId(auth.currentUser.email, selectedUser.email);
            receiver = selectedUser.email;
        }

        //CHANGED: Store userId as UID here too
        await addDoc(collection(db, "messages"), {
            text: fileName,
            fileUrl: url,
            fileType: filetype,
            user: auth.currentUser.email,
            userId: auth.currentUser.uid, // Add this for rule compliance
            receiver: receiver,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
    };

    //FIXED: Corrected useRef to useEffect
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex h-screen w-full">
            <div className="w-1/4 bg-gray-900 mt-5 text-white p-4 hidden md:block">
                <h2 className="text-lg font-semibold border-b pb-2">Members</h2>
                <button className={`p-2 my-2 w-full text-white ${isPrivateChat ? "bg-gray-700" : "bg-blue-600"}`} onClick={toggleChat}>
                    {isPrivateChat ? "Switch to Group Chat" : "Switch to Private Chat"}
                </button>
                {isPrivateChat && users.map((user) => (
                    <div key={user.id} className={`p-2 border-b border-gray-700 cursor-pointer ${selectedUser?.email === user.email ? "bg-blue-600" : ""}`} onClick={() => handleUserSelect(user)}>
                        <p className="text-sm font-medium">{user.username || "User"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                ))}
            </div>

            <div className="w-full md:w-3/4 flex flex-col justify-end bg-cover bg-center p-4 relative">
                <Hyperspeed
                    effectOptions={{
                        onSpeedUp: () => { },
                        onSlowDown: () => { },
                        distortion: 'turbulentDistortion',
                        length: 400,
                        roadWidth: 10,
                        islandWidth: 2,
                        lanesPerRoad: 4,
                        fov: 90,
                        fovSpeedUp: 150,
                        speedUp: 2,
                        carLightsFade: 0.4,
                        totalSideLightSticks: 20,
                        lightPairsPerRoadWay: 40,
                        shoulderLinesWidthPercentage: 0.05,
                        brokenLinesWidthPercentage: 0.1,
                        brokenLinesLengthPercentage: 0.5,
                        lightStickWidth: [0.12, 0.5],
                        lightStickHeight: [1.3, 1.7],
                        movingAwaySpeed: [60, 80],
                        movingCloserSpeed: [-120, -160],
                        carLightsLength: [400 * 0.03, 400 * 0.2],
                        carLightsRadius: [0.05, 0.14],
                        carWidthPercentage: [0.3, 0.5],
                        carShiftX: [-0.8, 0.8],
                        carFloorSeparation: [0, 5],
                        colors: {
                            roadColor: 0x080808,
                            islandColor: 0x0a0a0a,
                            background: 0x000000,
                            shoulderLines: 0xFFFFFF,
                            brokenLines: 0xFFFFFF,
                            leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                            rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                            sticks: 0x03B3C3,
                        }
                    }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="bg-gray-800 text-gray-800 p-2 text-center">
                        {isPrivateChat ? (selectedUser ? `Chatting with ${selectedUser.username || selectedUser.email}` : "Select a user to chat privately") : "Group Chat"}
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 bg-opacity-50 sm-p-4">
                        {Array.isArray(messages) && messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end mb-4 message-container ${msg.user === auth.currentUser.email ? "justify-end" : ""}`}
                                // ADDED: Click to show delete button
                                onClick={() => {
                                    if (msg.user === auth.currentUser.email) {
                                        setActiveMessageId(msg.id);
                                    }
                                }}
                            >
                                <div
                                    className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${msg.user === auth.currentUser.email ? "order-1 items-end" : "order-2 items-start"}`}
                                >
                                    <div>
                                        <span className={`px-4 py-2 rounded-lg inline-block text-sm md:text-base lg:text-lg ${msg.user === auth.currentUser.email ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-300 text-gray-600 rounded-bl-none"}`}>
                                            {msg.text}
                                        </span>
                                        <p className="text-xs opacity-50 mt-1">
                                            {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : "Loading..."}
                                        </p>
                                        {/*  ADDED: Delete button visibility logic */}
                                        {activeMessageId === msg.id && msg.user === auth.currentUser.email && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent click from bubbling up
                                                    deleteMsg(msg.id);
                                                }}
                                                className="mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <img
                                    src={
                                        msg.user === auth.currentUser.email
                                            ? "https://static.vecteezy.com/system/resources/previews/022/715/778/non_2x/cute-cool-boy-dabbing-pose-cartoon-icon-illustration-people-fashion-icon-concept-isolated-generat-ai-free-photo.jpg"
                                            : "https://i.pinimg.com/736x/aa/d0/6e/aad06ea779427e507017ffa808fb5a17.jpg"
                                    }
                                    alt="User Avatar"
                                    className={`w-6 h-6 rounded-full ${msg.user === auth.currentUser.email ? "order-2" : "order-1"}`}
                                />
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <Fileupload onFileUpload={handleUpload} />

                    <form onSubmit={sendMessage} className="flex bg-white p-2 border-none rounded-lg">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message.."
                            className="flex-1 p-2 border-none text-black outline-none border rounded-1-lg"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-lg">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;