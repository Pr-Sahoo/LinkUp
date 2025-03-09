// import { initializeApp } from "firebase/app";         //imported the firebase sdk
// import { getFirestore } from "firebase/firestore";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// //my firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCJBLRj78Df02RDfpA7Wi3tHu2MEaIlTy8",
//     authDomain: "live-chatting-5e613.firebaseapp.com",
//     projectId: "live-chatting-5e613",
//     storageBucket: "live-chatting-5e613.firebasestorage.app",
//     messagingSenderId: "179284833729",
//     appId: "1:179284833729:web:0a4b498c3d0081cb73ab40",
//     measurementId: "G-GV75H0RMHY"
//   };

// Initialize firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);


// export {auth, db};

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//my firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJBLRj78Df02RDfpA7Wi3tHu2MEaIlTy8",
  authDomain: "live-chatting-5e613.firebaseapp.com",
  projectId: "live-chatting-5e613",
  // storageBucket: "live-chatting-5e613.firebasestorage.app",
  storageBucket: "live-chatting-5e613.appspot.com",
  messagingSenderId: "179284833729",
  appId: "1:179284833729:web:0a4b498c3d0081cb73ab40",
  measurementId: "G-GV75H0RMHY"
};

// Initialize firebase 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};