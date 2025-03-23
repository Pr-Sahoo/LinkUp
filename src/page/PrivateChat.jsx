import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import Fileupload from '../components/Fileupload';
import Hyperspeed from '../components/Hyperspeed';

const PrivateChat = () => {
    const { userId: selectedUserId } = useParams();      //get selected user chatId by url
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);        // store selected user details
    const [activeMessageId, setActiveMessageId] = useState(null);
    const navigate = useNavigate();

    // generate unique chat id for private chat
    const getChatId = (user1, user2) => {
        return [user1, user2].sort().join("_");
    };

    // fetch selected user details 
    useEffect(() => {
        if (!selectedUserId) return;

        const fetchUser = async () => {
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", selectedUserId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setSelectedUser(querySnapshot.docs[0].data());
            }
        };
        fetchUser();
    }, [selectedUserId]);

    // fetch messages in real time 
    useEffect(() => {
        if (!auth.currentUser || !selectedUserId) return;

        const chatId = getChatId(auth.currentUser.uid, selectedUserId);
        // const chatId = getChatId(auth.currentUser.email, selectedUserId) // new added the user email id new one
        const messageRef = collection(db, "messages");
        const q = query(messageRef, where("chatId", "==", chatId), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [selectedUserId]);

    //send a new message 
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() === "") return;

        const chatId = getChatId(auth.currentUser.uid, selectedUserId);
        // const chatId = getChatId(auth.currentUser.email, selectedUserId); // added new user email id
        await addDoc(collection(db, "messages"), {
            text: newMessage,
            user: auth.currentUser.email,
            userId: auth.currentUser.uid,
            receiver: selectedUser.email,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
    };

    // Handle Message hold (long press or click and hold)
    const handleMessageHold = (messageId) => {
        const timeoutId = setTimeout(() => {
            setActiveMessageId(messageId)
        }, 1500);                             // show delete button after 2 secs
        return timeoutId;
    };

    // clear timeout if message released (clear timeout if release early)
    // const handleMessageRelease = (messageId) => {
    //     clearTimeout(messageId);
    // };
    const handleMessageRelease = (timeoutId) => {
        clearTimeout(timeoutId);
    }

    // delete a message
    const deleteMessage = async (messageId) => {
        console.log("Deleting message with id: ", messageId);   // debugging
        console.log("Current user UID: ", auth.currentUser.uid);  // debugging
        try {
            await deleteDoc(doc(db, "messages", messageId))   // delete message from firestore
            setActiveMessageId(null);         // hide the delete button after deletion 
            console.log("message deleted successfully");
        } catch (error) {
            console.error("Error in deleting message: ", error);
        };
    };

    // handle click outside the message to hide the delete button
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeMessageId && !e.target.closest(".message-container")) {
                setActiveMessageId(null);                   // hide the delete button
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [activeMessageId]);

    // Handle file upload
    // const handleUpload = async (url, filetype, filename) => {
    //     const chatId = getChatId(auth.currentUser.uid, selectedUserId);
    //     await addDoc(collection(db, "messages"), {
    //         text: filename,
    //         fileUrl: url,
    //         fileType: filetype,
    //         user: auth.currentUser.email,
    //         receiver: selectedUser.email,
    //         chatId: chatId,
    //         timestamp: serverTimestamp(),
    //     });
    // };

    // Leave chat and navigate back to the userlist
    const leaveChat = () => {
        navigate("/private-chat");
    };

    return (
        // <div className='flex h-full w-full'>
        // <div className='flex flex-col h-screen justify-center bg-gray-900 text-white p-4 w-full'>
        //     {/* Chat Header  */}
        //     <div className='bg-gray-800 text-white p-10 mt-2 flex justify-between items-center md:text-sm'>
        //         <h1 className='text-lg font-semibold'>Chatting with {selectedUser?.username || selectedUser?.email}</h1>
        //         <button onClick={leaveChat} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>Leave chat</button>
        //     </div>

        //     {/* Chat messages */}
        //     <div className='flex-1 overflow-y-auto p-4 bg-gray-800'>
        //         {messages.map((msg) => (
        //             <div key={msg.id} className={`mb-4 p-2 rounded-lg max-w-lg ${
        //                 msg.user === auth.currentUser.email ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-700 text-gray-200 self-start mr-auto"
        //             }`}>
        //                 <p>{msg.user === auth.currentUser.email ? "You" : msg.user}</p>
        //                 {msg.fileUrl ? (
        //                     <div>
        //                         {msg.fileType.includes("image") ? (
        //                             <img src={msg.fileUrl} alt={msg.text} className='max-w-full h-auto rounded-lg' />
        //                         ) : (
        //                             <a href={msg.fileUrl} target='_blank' rel='noopener noreferrer' className='text-blue-300 underline'>Download {msg.text}</a>
        //                         )}
        //                     </div>
        //                 ) : (
        //                     <p className='text-lg font-bold'>{msg.text}</p>
        //                 )}
        //                 <p className='text-xs font-light'>{msg.timestamp ? msg.timestamp.toDate().toLocaleString() : "Loading..."}</p>
        //             </div>
        //         ))}
        //     </div>

        //     {/* Input field */}
        //     <form onSubmit={sendMessage} className='flex bg-gray-800 p-4'>
        //         <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='flex-1  bg-gray-700 text-white p-2 outline-none rounded-l-lg' />
        //         <button type='submit' className='bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600'>Send</button>
        //     </form>

        //     {/* file upload component */}
        //     <Fileupload onFileUpload={handleUpload}/>
        // </div>
        // </div>






        <div className="flex h-screen w-full">
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
            {/* Chat Container */}
            <div className="flex flex-col flex-1 h-full w-full justify-between z-10">    {/* removed the justify-between */}
                {/* Chat Header */}

                {/* <div className="flex items-center justify-between p-1 bg-white border-b-2 border-gray-200 md:p-4"> */}
                {/* <div className="flex items-center space-x-4 sm:text-sm md:text-sm">  old line */}
                {/* <div className='flex items-center space-x-2 md:space-x-4'>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                                alt="User Avatar"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                            />
                            <span className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3  bg-green-500 rounded-full"></span>
                        </div>
                        <div className="flex text-black flex-col"> */}
                {/* <h1 className="text-lg md:text-xl lg:text-2xl font-semibold"> */}
                {/* <h1 className='font-semibold text-sm md:text-base lg:text-lg'>
                                Chatting with {selectedUser?.username || selectedUser?.email}
                            </h1> */}
                {/* <span className="text-sm text-gray-500">Online</span> old line */}
                {/* </div> */}
                {/* </div> */}
                {/* <button
                        onClick={leaveChat}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm md:text-base"
                    >
                        Leave Chat
                    </button> old button */}

                {/*new chat header  */}
                <div className='flex items-center justify-between p-3 md:p-4 border-b shadow-md' style={{backgroundColor: "#408EC6"}}>
                    <div className='flex items-center space-x-3 md:space-x-4'>
                        <img
                            // src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                            src='https://static.vecteezy.com/system/resources/previews/022/715/778/non_2x/cute-cool-boy-dabbing-pose-cartoon-icon-illustration-people-fashion-icon-concept-isolated-generat-ai-free-photo.jpg'
                            alt="User Avatar"
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                        <h1 className='font-semibold text-sm md:text-base lg:text-lg truncate text-black'>{selectedUser?.username || selectedUser?.email}</h1>
                    </div>
                    <button onClick={leaveChat} className='bg-red-500 text-white text-xs md:text-sm lg:text-base px-3 md:px-4 py-1 md:py-2 rounded hover:bg-red-700 transition'>Leave Chat</button>
                </div>

                {/* Chat Messages */}
                <div
                    id="messages"
                    className="flex flex-col space-y-4 p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end ${msg.user === auth.currentUser.email ? "justify-end" : ""
                                }`}
                            onMouseDown={(e) => {
                                if (msg.user === auth.currentUser.email) {
                                    const timeoutId = handleMessageHold(msg.id);   //start hold timer
                                    e.currentTarget.timeoutId = timeoutId;       //store timeout id   
                                }
                            }}
                            onMouseUp={(e) => {
                                if (msg.user === auth.currentUser.email) {
                                    handleMessageRelease(e.currentTarget.timeoutId);   // clear timeout
                                }
                            }
                            }
                            onTouchStart={(e) => {
                                if (msg.user === auth.currentUser.email) {
                                    const timeoutId = handleMessageHold(msg.id);  // start hold timer
                                    e.currentTarget.timeoutId = timeoutId;        //store timeout id
                                }
                            }}
                            onTouchEnd={(e) => {
                                if (msg.user === auth.currentUser.email) {
                                    handleMessageRelease(e.currentTarget.timeoutId);      // clear timeout id
                                }
                            }}
                        >
                            <div
                                className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${msg.user === auth.currentUser.email
                                    ? "order-1 items-end"
                                    : "order-2 items-start"
                                    }`}
                            >
                                <div>
                                    {/* <span
                                        className={`px-4 py-2 rounded-lg inline-block ${msg.user === auth.currentUser.email
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-gray-300 text-gray-600 rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </span> */}
                                    <span className={`px-4 py-2 rounded-lg inline-block text-sm md:text-base lg:text-lg ${msg.user === auth.currentUser.email ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-300 text-gray-600 rounded-bl-none"}`}>{msg.text}</span>
                                    {/* delete button only show to the active messages */}
                                    {activeMessageId === msg.id && msg.user === auth.currentUser.email && (
                                        <button onClick={() => deleteMessage(msg.id)} className='mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600'>Delete</button>
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
                                className={`w-6 h-6 rounded-full ${msg.user === auth.currentUser.email ? "order-2" : "order-1"
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Input Field */}
                <div className="border-rounded p-1 pt-4 mb-2 sm:mb-0">
                    <form onSubmit={sendMessage} className="relative flex items-center w-full p-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Write your message!"
                            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-300 rounded-md py-3 mr-2"
                        />
                        {/* <div className="absolute right-0 items-center inset-y-0 hidden sm:flex"> */}
                        <button
                            type="submit"
                            className="sm:text-sm inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                        >
                            <span className="font-bold">Send</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-6 w-6 ml-2 transform rotate-90"
                            >
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                        </button>
                        {/* </div> */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PrivateChat;