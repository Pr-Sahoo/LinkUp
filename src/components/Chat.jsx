import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// import React from 'react'

const Chat = () => {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch messages in real time 
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    // Send message to firestore
    const sendMessage = async (e) => {
        e.preventDefault();
        if(!message.trim()) return;

        await addDoc(collection(db, "messages"), {
            text: message,
            sender: auth.currentUser.email,
            timestamp: serverTimestamp()
        });
        setMessage("");
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
        <div className="w-full max-w-lg p-4 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Live Chat</h2>
            <div className="h-80 overflow-y-scroll p-2 border rounded">
                {messages.map((msg) => (
                    <div key={msg.id} className={`p-2 ${message.sender === auth.currentUser.email ? "text-blue-400" : "text-green-400"}`}>
                        <strong>{msg.sender}: </strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-4">
                <input type="text" className="p-2 border rounded text-black w-full" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="p-2 bg-blue-500 rounded">Send</button>
            </form>
        </div>
    </div>
  );
};

export default Chat;