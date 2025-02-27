import React from 'react';
import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ForgotPW = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset Email sent!");
            navigate("/login");
        } catch (error) {
            // console.error(error.message);
            switch (error.code) {
                case "auth/user-not-found": 
                    alert("No user found with that email");
                    break;
                case "auth/invalid-email": 
                    alert("Invalid email");
                    break;
                default: 
                    alert("An error occurred please try again later..😓");
                    console.error(error.message);
            }
        }
    };

  return (
    <div className='flex justify-center text-black items-center min-h-screen w-full px-4 bg-blue-500'>
        <div className="bg-rose-200 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <h2 className='text-center font-bold text-xl mb-4'>Reset Password</h2>
            <form onSubmit={handleReset}>
                <input type="email" placeholder='Enter your email' className='w-full p-2 mb-2 border rounded' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button className='w-full bg-yellow-500 p-2 rounded text-white'>Reset password</button>
            </form>
        </div>
    </div>
  );
};

export default ForgotPW