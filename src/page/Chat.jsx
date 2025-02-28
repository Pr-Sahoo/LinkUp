// import React, { useState, useEffect } from 'react';
// import { db, auth } from '../firebase';
// import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, updateDoc, doc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// const Chat = () => {

//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!auth.currentUser) {
//             navigate("/login")
//             return;
//         }

//         const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         });

//         return () => unsubscribe();
//     }, [auth, navigate]);

//     // const sendMessage = async (e) => {
//     //     e.preventDefault();
//     //     const {uid, photoURL} = auth.currentUser;
//     //     await addDoc(collection(db, "messages"), {
//     //         text: message,
//     //         photoURL,
//     //         uid,
//     //         timestamp: serverTimestamp()
//     //     });
//     //     setMessage("");
//     // }
//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (message.trim() === "") return;

//         await addDoc(collection(db, "messages"), {
//             text: message,
//             user: auth.currentUser.email,
//             timestamp: serverTimestamp()
//         });
//         setMessage("");
//     };

//     const deleteMessage = async (id, userEmail) => {
//         if (userEmail !== auth.currentUser.email) {
//             alert("you can delete only your own messages");
//             return;
//         }

//         if (window.confirm("Are you sure you want to delete this message?")) {
//             await deleteDoc(doc(db, "messages", id));
//         }
//     };

//     const editMessage = async (id, userEmail, oldText) => {
//         if (userEmail !== auth.currentUser.email) {
//             alert("You can edit only your own messages");
//             return;
//         }

//         const newText = prompt("Enter new message", oldText);
//         if (newText && newText.trim() !== "") {
//             await updateDoc(doc(db, "messages", id), {
//                 text: newText,
//                 timestamp: serverTimestamp()
//             });
//         }
//     };

//     return (
//         <div className="min-h-screen w-full flex flex-col justify-center items-center px-4"
//          style={{ backgroundImage: "url('https://wallpapers.com/images/featured/beautiful-night-i9neq2ed7blcu74r.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
//             {/* <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"> */}
//             <div className='bg-white bg-opacity-80 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg'>
//                 <h2 className='text-lg font-bold text-center mb-4'>Live chat</h2>
//                 <div className='h-80 overflow-y-auto p-2 border rounded bg-purple-300'>
//                     {messages.map((msg) => (
//                         <div key={msg.id} className={`p-2 my-1 rounded ${msg.user === auth.currentUser.email ? "bg-blue-200 self-end text-right" : "bg-rose-200 self-start"}`}>
//                             <span className='text-sm font-bold text-gray-700'>{msg.user}</span>
//                             <p className='text-sm'>{msg.text}</p>

//                             {msg.user === auth.currentUser.email && (
//                                 <div className="flex gap-2 justify-end">
//                                     <button onClick={() => editMessage(msg.id, msg.user, msg.text)} className='text-sm text-yellow-600 hover:underline'>Edit</button>
//                                     <button onClick={() => deleteMessage(msg.id, msg.user)} className='text-sm text-red-500 hover:underline'>Delete</button>
//                                 </div>
//                             )}
//                         </div>

//                     ))}
//                 </div>
//                 <form onSubmit={sendMessage} className='flex mt-3 rounded overflow-hidden'>
//                     <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type a message...' className='w-full p-2 border border-gray-300 outline-none rounded-1' />
//                     <button type='submit' className='bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600'>Send</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Chat;

import React, {useState, useEffect} from "react";
import {db , auth} from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    // const [selecteduser, setSelecteduser] = useState(null);  // for private chat
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.currentUser) {
            navigate("/login");
            return;
        }

        //fetch messages 
        const q = query(collection(db, "messages"), orderBy("timestamp", "asc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });

        // fetch user
        const usersref = collection(db, "users");
        const unsubscribeUsers = onSnapshot(usersref, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
        });

        return () => {
            unsubscribe();
            unsubscribeUsers();
        }
    }, [navigate]);

    // send messages 
    const sendMessage = async (e) => {
        e.preventDefault();
        if(message.trim() === "") return;

        await addDoc(collection(db, "messages"), {
            text: message,
            user: auth.currentUser.displayName || auth.currentUser.email,
            email: auth.currentUser.email,
            timestamp: serverTimestamp()
        });
        setMessage("");
    };


  return (
    <div className="flex h-screen w-full">
        {/* left user list  */}
        <div className="w-1/4 bg-gray-900 mt-3 text-white p-4 hidden md:block">
        <h2 className="text-lg font-semibold border-b pb-2">Members</h2>
        {users.map((user, index) => (
            <div key={index} className="p-2 border-b border-gray-700">
                {/* <p className="text-sm">{user.name || user.email}</p> */}
                {/* <p className="text-sm">{user.name || "No Name"}</p> */}
                <p className="text-sm">{user.username || "user"}</p>
                {/* <p>{username}</p> */}
                <p className="text-xs text-gray-400">{user.email}</p>
            </div>
        ))}
        </div>

        {/* right chat box  */}
        <div className="w-full md:w-3/4 flex flex-col justify-end bg-cover bg-center p-4"
        style={{backgroundImage: "url('https://w0.peakpx.com/wallpaper/391/899/HD-wallpaper-batman-logo-darkness-creative.jpg')"}}>
            {/* chat messages  */}
            <div className="flex-1 overflow-y-auto p-4 bg-opacity-50 backdroup-blur-lg">
                {Array.isArray(messages) && messages.map((msg) => (
                    <div key={msg.id} className={`mb-4 p-2 rounded-lg max-w-lg ${msg.email === auth.currentUser.email ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-900 self-start mr-auto"}`}>
                        <p className="text-xs font-medium">{msg.user}</p>
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