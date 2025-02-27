import React from 'react';
import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/chat");
        } catch (error) {
            console.error(error.message);
        }
    }
  return (
    <div className='flex justify-center text-black items-center min-h-screen w-full px-4 bg-blue-300'>
        <div className="bg-green-300 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-sm lg:max-w-lg">
            <h2 className='text-xl font-bold text-center mb-4'>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder='Email' className='w-full p-2 mb-2 border rounded' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder='Password' className='w-ful p-2 mb-2 border rounded' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className='w-full bg-green-400 text-white p-2 rounded'>Login</button>
            </form>
        </div>
    </div>
  );
};

export default Login;