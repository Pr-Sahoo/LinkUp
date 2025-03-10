import React from 'react';
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import Particles from '../components/Particles';

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // await createUserWithEmailAndPassword(auth, email, password);
            // navigate("/chat");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //store user info in firebase 
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: username, 
            })
            navigate("/chat");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (

        <div className="flex items-center justify-center w-full min-h-screen px-4 ">
            <Particles 
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
            />
            {/* Container with two sections */}
            <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg" style={{background: "#CADCFC"}}>
                {/* Left side image (Hidden on small screens) */}
                <div
                    className="hidden bg-cover lg:block lg:w-1/2"
                    style={{
                        backgroundImage:
                        "url('https://images.unsplash.com/photo-1738597967526-fca7534cdd5c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDkxfGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D')",    
                        // "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
                    }}
                ></div>

                {/* Right side - Registration Form */}
                <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
                    {/* Logo */}
                    <div className="flex justify-center mx-auto">
                        <img
                            className="w-auto h-7 sm:h-8"
                            src="https://merakiui.com/images/logo.svg"
                            alt="Logo"
                        />
                    </div>

                    <h2 className="mt-3 text-xl font-bold text-center text-gray-600">
                        Register to Chat
                    </h2>

                    {/* Google Sign-In Button (Future implementation) */}
                    <button className="flex items-center justify-center w-full mt-4 text-gray-600 transition duration-300 transform border rounded-lg hover:bg-gray-50">
                        <div className="px-4 py-2">
                            <svg className="w-6 h-6" viewBox="0 0 40 40">
                                <path
                                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                    fill="#FFC107"
                                />
                            </svg>
                        </div>
                        <span className="w-5/6 px-4 py-3 font-bold text-center">
                            Sign up with Google
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                        <span className="text-xs text-gray-500 uppercase">or register with email</span>
                        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="mt-4">
                        {/* name  */}
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                            User Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring focus:ring-opacity-40"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        {/* Email */}
                        {/* <label className="block mb-2 text-sm font-medium text-gray-600"> */}
                        <label  className='block mt-4 mb-2 text-sm font-medium text-gray-600'>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring focus:ring-opacity-40"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Password */}
                        <label className="block mt-4 mb-2 text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring focus:ring-opacity-40"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Register Button */}
                        <button className="w-full px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                            Register
                        </button>
                    </form>

                    {/* Already have an account? */}
                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                        <a href="/login" className="text-xs text-gray-500 uppercase hover:underline">
                            {/* Already have an account? Sign In */}
                            OR Login
                        </a>
                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;