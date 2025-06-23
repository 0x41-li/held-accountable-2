import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATV6S3Z8d3lLj1zYyV-2pDaVU2InM4-hw",
    authDomain: "heldaccount.firebaseapp.com",
    projectId: "heldaccount",
    storageBucket: "heldaccount.firebasestorage.app",
    messagingSenderId: "73469665381",
    appId: "1:73469665381:web:18dc51fa0e618f92aaa68c",
    measurementId: "G-2YBLY7L2ZK"
};

// const firebaseConfig = {
//     apiKey: "AIzaSyBhBNhM6K1_sYQqb50o8SW3kUVgFzurqt0",
//     authDomain: "poll-mania-97db5.firebaseapp.com",
//     projectId: "poll-mania-97db5",
//     storageBucket: "poll-mania-97db5.firebasestorage.app",
//     messagingSenderId: "342322845971",
//     appId: "1:342322845971:web:e711835bf5f58912ad62e6",
//     measurementId: "G-FLTYT6KB7J"
// };
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
