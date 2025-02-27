// import { useState } from "react";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// // import React from 'react'

// const Auth = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLogin, setIsLogin] = useState(true);

//     const handleAuth = async (e) => {
//         e.preventDefault();
//         try {
//             if(isLogin) {
//                 await signInWithEmailAndPassword(auth, email, password);
//             } else {
//                 await createUserWithEmailAndPassword(auth, email, password);
//             }
//             alert("Authentication successfull");
//         } catch (error) {
//             alert(error.message);
//         }
//     }
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//         <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
//         <form onSubmit={handleAuth} className="flex flex-col gap-3">
//             <input type="email" placeholder="Email" className="p-2 border rounded text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" placeholder="Password" className="p-2 border rounderd text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button className="p-2 bg-blue-500 rounded">{isLogin ? "Login" : "Sign Up"}</button>
//         </form>
//         <button onClick={() => setIsLogin(!isLogin)} className="mt-3 text-sm underline">{isLogin ? "Need an Account? Sign up" : "Already have an Account? Login"}</button>
//     </div>
//   );
// };

// export default Auth;
