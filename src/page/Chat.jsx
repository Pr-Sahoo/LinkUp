
import React, { useState, useEffect, use } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, where, deleteDoc, updateDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
// import Threads from "../components/Threads";
import Hyperspeed from "../components/Hyperspeed";
import Fileupload from "../components/Fileupload";





const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  // for private chat
    const [isPrivateChat, setIsPrivateChat] = useState(false);   //toggle between group and private chat
    // const [showModal, setShowModal] = useState(false);
    // const [editingMessage, setEditingMessage] = useState(null);
    // const [editingMsgText, setEditingMsgText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            navigate("/login");
            return;
        }

        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("chatId", "==", "group_chat"), orderBy("timestamp", 'asc'));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // fetch user
        const usersref = collection(db, "users");
        const unsubscribeUsers = onSnapshot(usersref, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        if (!auth.currentUser || !selectedUser || !isPrivateChat) return;

        //get chatId
        const chatId = getChatId(auth.currentUser.email, selectedUser.email);
        if (!chatId) return; // avoid fetching if chat id is null
        const q = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        // if(message.trim() === "" && !file) return;
        if (message.trim() === "") return;

        let chatId = "group_chat";
        let receiver = null;

        if (isPrivateChat && selectedUser) {
            chatId = getChatId(auth.currentUser.email, selectedUser.email);
            receiver = selectedUser.email;
        }

        // let fileUrl = null;
        // if(file) {
        //     fileUrl = await uploadFile(file);
        //     setFile(null);
        // }

        await addDoc(collection(db, "messages"), {
            text: message,
            user: auth.currentUser.email,          // can use the display "name" if available
            receiver: receiver,
            chatId: chatId,
            timestamp: serverTimestamp(),
            // file: fileUrl,
            // fileType: file ? file.type : null,
        });
        setMessage("");
    };

    //function to delete messages
    const deleteMsg = async (id) => {
        if (!id) return;
        const confirmDel = window.confirm("Are you sure you want to delete this message?");
        if (confirmDel) {
            try {
                await deleteDoc(doc(db, "messages", id));
            } catch (error) {
                console.log("Error deleting message: ", error);
            }
        }
    };

    // const handleUpload = async (url, filetype) => {
    //     await addDoc(collection(db, "messages"), {
    //         text: url,
    //         sender: auth.currentUser.uid,
    //         type: filetype.includes("image") ? "image" : filetype.includes("video") ? "video" : "file",
    //         timestamp: serverTimestamp(),
    //     });
    // };

    //new handleUpload for manage of the file metadata
    const handleUpload = async (url, filetype, fileName) => {
        let chatId = "group_chat";
        let receiver = null;

        if (isPrivateChat && selectedUser) {
            chatId = getChatId(auth.currentUser.email, selectedUser.email);
            receiver = selectedUser.email;
        }

        await addDoc(collection(db, "messages"), {
            text: fileName,
            fileUrl: url,
            fileType: filetype,
            user: auth.currentUser.email,
            receiver: receiver,
            chatId: chatId,
            timestamp: serverTimestamp(),
        });
    };

    // const handleEdit = (message) => {
    //     setShowModal(true);
    //     setEditingMessage(message);
    //     setEditingMsgText(message.text || "");
    // };

    // const saveEdit = async () => {
    //     if (!editingMessage || editingMsgText.trim() === "") return;

    //     try {
    //         await updateDoc(doc(db, "messages", editingMessage.id), {
    //             text: editingMsgText,
    //             timestamp: serverTimestamp(),
    //         });
    //         setShowModal(false);
    //         setEditingMessage(null);
    //         setEditingMsgText("");
    //     } catch (error) {
    //         console.error("Error Updating message: ", error);
    //     }
    // };

    // function to handle file selection
    // const handleFileChange = (e) => {
    //     if(e.target.files.length > 0 ) {
    //         setFile(e.target.files[0]);
    //     }
    // };

    // function to upload file to firebase storage
    // const uploadFile = async (file) => {
    //     setUploading(true);
    //     const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${file.name}`);
    //     const uploadTask = uploadBytesResumable(fileRef, file);

    //     return new Promise((res, rej) => {
    //         uploadTask.on("state_changed", null,
    //             (error) => {
    //                 console.error("Upload Failed: ", error);
    //                 setUploading(false);
    //                 rej(error);
    //             }, async () => {
    //                 const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
    //                 setUploading(false);
    //                 res(downloadUrl);
    //             }
    //         );
    //     });
    // };

    return (
        <div className="flex h-screen w-full">
            {/* left user list  */}
            <div className="w-1/4 bg-gray-900 mt-3 text-white p-4 hidden md:block">
                <h2 className="text-lg font-semibold border-b pb-2">Members</h2>
                <button className={`p-2 my-2 w-full text-white ${isPrivateChat ? "bg-gray-700" : "bg-blue-600"}`} onClick={toggleChat}>{isPrivateChat ? "Switch to Group chat" : "switch to Private chat"}</button>
                {isPrivateChat && users.map((user, index) => (
                    <div key={user.id} className={`p-2 border-b border-gray-700 cursor-pointer ${selectedUser?.email === user.email ? "bg-blue-600" : ""}`} onClick={() => handleUserSelect(user)} >
                        <p className="text-sm font-medium">{user.username || "User"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                ))}
            </div>

            {/* right chat box  */}
            <div className="w-full md:w-3/4 flex flex-col justify-end bg-cover bg-center p-4 relative">
                {/* <div className="absolute inset-0 w-full h-full z-0 md:w-3/4 flex flex-col justify-end bg-cover bg-center p-4"> */}
                {/* <Threads
                    amplitude={1}
                    distance={0}
                    enableMouseInteraction={true}
                    className="absolute inset-0 w-full h-full z-0"
                /> */}
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

                {/* this below div is for the  smooth background effect */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* chat header  */}
                    <div className="bg-gray-800 text-gray-800 p-2 text-center">{isPrivateChat ? selectedUser ? `Chatting with ${selectedUser.username || selectedUser.email}` : "Select a user to chat privately" : "Group chat"}</div>

                    {/* chat messages  */}
                    {/* <div className="flex-1 overflow-y-auto p-2 bg-opacity-50 sm-p-4">
                        {Array.isArray(messages) && messages.map((msg) => (
                            <div key={msg.id} className={`mb-4 p-2 rounded-lg max-w-lg ${msg.user === auth.currentUser.email ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-900 self-start mr-auto"}`}> */}
                    {/* <p className="text-xs font-medium">{msg.user}</p>    prev comment */}
                    {/* <p>{msg.user === auth.currentUser.email ? "You" : msg.user}</p>
                                <p className="text-lg font-bold">{msg.text}</p>
                                {msg.user === auth.currentUser.email && (
                                    <div className="relative inline-block group float-right ml-auto mr-2 mb-4">
                                        <span className="text-black hover:text-gray-900 cursor-pointer">:</span>
                                        <div className="absolute right-0 mt-2 w-32  rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div>
                                                <button onClick={() => deleteMsg(msg.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700">Delete</button> */}
                    {/* prev commented */}         {/* <button onClick={() => handleEdit(message)} className="block w-full text-left px-4 py-2 mt-1 text-sm text-orange-500 hover:bg-gray-100 hover:text-yellow-400">Edit</button> */}
                    {/* </div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs font-light">{msg.timestamp ? msg.timestamp.toDate().toLocaleString() : "Loading..."}</p>
                            </div>
                        ))}
                    </div> */}

                    <div className="flex-1 overflow-y-auto p-2 bg-opacity-50 sm-p-4">
                        {Array.isArray(messages) && messages.map((msg) => (
                            <div key={msg.id} className={`mb-4 p-2 rounded-lg max-w-lg ${msg.user === auth.currentUser.email ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-900 self-start mr-auto"}`}>
                                <p>{msg.user === auth.currentUser.email ? "You" : msg.user}</p>
                                {msg.fileUrl ? (
                                    <div>
                                        {msg.fileType.includes("image") ? (
                                            <img src={msg.fileUrl} alt={msg.text} className="max-w-full h-auto rounded-lg" />
                                        ) : (
                                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                                                Download {msg.text}
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg font-bold">{msg.text}</p>
                                )}
                                <p className="text-xs font-light">{msg.timestamp ? msg.timestamp.toDate().toLocaleString() : "Loading..."}</p>
                            </div>
                        ))}
                    </div>

                    {/* show modal for editing message  */}
                    {/* {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="rounded-lg shadow-lg p-6 w-96 bg-white animate-slide-down">
                                <h2 className="text-lg font-bold mb-2">Edit Message</h2>
                                <input type="text" value={editingMsgText} onChange={(e) => setEditingMsgText(e.target.value)} className="w-full text-black border p-2 rounded-lg focus:outline-none" />
                                <div className="flex mt-4 justify-between">
                                    <button onClick={() => setEditingMsgText("")} className="text-gray-500 text-sm">Clear Text</button>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                                    <button onClick={saveEdit} disabled={editingMsgText.trim() === ""} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">Save</button>
                                </div>
                            </div>
                        </div>
                    )} */}

                    <Fileupload onFileUpload={handleUpload} />


                    {/* input field  */}
                    <form onSubmit={sendMessage} className="flex bg-white p-2 border-none rounded-lg">
                        {/* <input type="file" onChange={handleFileChange} className="p-1 mr-2" /> */}
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message.." className="flex-1 p-2 border-none text-black outline-none border rounded-1-lg" />
                        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-lg">Send</button>
                    </form>
                </div>
            </div>


        </div>
    );
};
export default Chat;