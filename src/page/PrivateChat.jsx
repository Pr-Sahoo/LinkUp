import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';
import Fileupload from '../components/Fileupload';

const PrivateChat = () => {
    const {userId: selectedUserId} = useParams();      //get selected user chatId by url
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);        // store selected user details
    const navigate = useNavigate();

    // generate unique chat id for private chat
    const getChatId = (user1, user2) => {
        return [user1, user2].sort().join("_");
    };

    // fetch selected user details 
    useEffect(() => {
        if(!selectedUserId) return;

        const fetchUser = async () => {
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", selectedUserId));
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty) {
                setSelectedUser(querySnapshot.docs[0].data());
            }
        };
        fetchUser();
    }, [selectedUserId]);

    // fetch messages in real time 
    useEffect(() => {
        if(!auth.currentUser || !selectedUserId) return;

        const chatId = getChatId(auth.currentUser.uid, selectedUserId);
        const messageRef = collection(db, "messages");
        const q = query(messageRef, where("chatId", "==", chatId), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
        });
        return () => unsubscribe();
    }, [selectedUserId]);

    //send a new message 
    const sendMessage = async (e) => {
        e.preventDefault();
        if(!newMessage.trim() === "") return;

        const chatId = getChatId(auth.currentUser.uid, selectedUserId);
        await addDoc(collection(db, "messages"), {
            text: newMessage,
            user: auth.currentUser.email,
            receiver: selectedUser.email,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
    };

    // Handle file upload
    const handleUpload = async (url, filetype , filename) => {
        const chatId = getChatId(auth.currentUser.uid, selectedUserId);
        await addDoc(collection(db, "messages"), {
            text: filename,
            fileUrl: url,
            fileType: filetype,
            user: auth.currentUser.email,
            receiver: selectedUser.email,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
    };

    // Leave chat and navigate back to the userlist
    const leaveChat = () => {
        navigate("/private-chat");
    };

  return (
    <div className='flex flex-col h-screen justify-center bg-gray-900 text-white p-4 w-full'>
        {/* Chat Header  */}
        <div className='bg-gray-800 text-white p-10 flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Chatting with {selectedUser?.username || selectedUser?.email}</h1>
            <button onClick={leaveChat} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>Leave chat</button>
        </div>

        {/* Chat messages */}
        <div className='flex-1 overflow-y-auto p-4 bg-gray-800'>
            {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 p-2 rounded-lg max-w-lg ${
                    msg.user === auth.currentUser.email ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-700 text-gray-200 self-start mr-auto"
                }`}>
                    <p>{msg.user === auth.currentUser.email ? "You" : msg.user}</p>
                    {msg.fileUrl ? (
                        <div>
                            {msg.fileType.includes("image") ? (
                                <img src={msg.fileUrl} alt={msg.text} className='max-w-full h-auto rounded-lg' />
                            ) : (
                                <a href={msg.fileUrl} target='_blank' rel='noopener noreferrer' className='text-blue-300 underline'>Download {msg.text}</a>
                            )}
                        </div>
                    ) : (
                        <p className='text-lg font-bold'>{msg.text}</p>
                    )}
                    <p className='text-xs font-light'>{msg.timestamp ? msg.timestamp.toDate().toLocaleString() : "Loading..."}</p>
                </div>
            ))}
        </div>

        {/* Input field */}
        <form onSubmit={sendMessage} className='flex bg-gray-800 p-4'>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='flex-1  bg-gray-700 text-white p-2 outline-none rounded-l-lg' />
            <button type='submit' className='bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600'>Send</button>
        </form>

        {/* file upload component */}
        <Fileupload onFileUpload={handleUpload}/>
    </div>
  )
}

export default PrivateChat;