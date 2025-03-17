import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';


const Userlist = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUser = async () => {
            const userRef = collection(db, "users");
            const q = query(userRef);
            const querrySnapshot = await getDocs(q);
            const userList = querrySnapshot.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })).filter((user) => user.id !== currentUser.uid)    // exclude the current user
            setUsers(userList);
        };
        fetchUser();
    },[currentUser.uid]);

    const handleUserClick = (userId) => {
        navigate(`/private-chat/${userId}`)     // navigate to the private chat
    };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 h-screen w-full'>
        <h1 className='text-2xl font-bold mb-4'>User List</h1>
        <ul className='w-full max-w-md'>
            {users.map((user) => (
                <li key={user.id} onClick={() => handleUserClick(user.id)} className='p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800'>
                    <p className='text-lg font-medium'>{user.username || "User"}</p>
                    <p className='text-sm text-gray-400'>{user.email}</p>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default Userlist