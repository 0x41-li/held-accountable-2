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
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
