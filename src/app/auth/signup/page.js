'use client';
import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, db, googleProvider } from "../../../../lib/firebase";

const SignUp = () => {

    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const router = useRouter();

    // Check if username exists
    const isUsernameTaken = async (username) => {
        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // True if username exists
    };
    const handleSignup = async () => {
        if (!username || !email || !password) {
            toast.error("All fields are required!");
            return;
        }

        if (await isUsernameTaken(username)) {
            toast.error("Username is already taken. Try another.");
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;

            // Store username in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                fullname: fullname,
                email: email,
                uid: user.uid,
            });

            toast.success("Sign up succeed!");
            router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;

            // Check if user exists in Firestore, if not, create one
            const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
            if (userDoc.empty) {
                await setDoc(doc(db, "users", user.uid), {
                    username: user.displayName.replace(/\s+/g, "").toLowerCase(),
                    fullname: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    uid: user.uid,
                });
            }
            
            toast.success("Sign up succeed!");
            router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    return <div className="absolute top-0 left-0 right-0 bottom-0">
        <div className="absolute w-full left-0 right-0 top-0 flex items-start justify-center overflow-hidden">
            <img src="/images/auth_bg.png" className="w-[910px] max-w-none" />
        </div>
        <div className="absolute top-[250px] left-0 right-0 bottom-0 flex items-start justify-center">
            <div className="flex flex-col gap-[32px] w-[360px]">
                <div className="text-[30px] leading-[38px] font-bold">Sign Up</div>
                <div className="flex flex-col gap-[24px]">
                    <div className="flex flex-col w-full gap-[20px]">
                        <div className="w-full flex flex-col gap-[6px]">
                            <p className="leading-[20px] text-[14px] font-medium">Email</p>
                            <input className="rounded-[8px] text-[16px] leading-[24px] h-[44px] outline-none border border-primary w-full p-2" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="w-full flex flex-col gap-[6px]">
                            <p className="leading-[20px] text-[14px] font-medium">Full Name</p>
                            <input className="rounded-[8px] text-[16px] leading-[24px] h-[44px] outline-none border border-primary w-full p-2" placeholder="Enter your full name" type="text" value={fullname} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="w-full flex flex-col gap-[6px]">
                            <p className="leading-[20px] text-[14px] font-medium">Username</p>
                            <input className="rounded-[8px] text-[16px] leading-[24px] h-[44px] outline-none border border-primary w-full p-2" placeholder="Choose a username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="w-full flex flex-col gap-[6px]">
                            <p className="leading-[20px] text-[14px] font-medium">Password</p>
                            <input className="rounded-[8px] text-[16px] leading-[24px] h-[44px] outline-none border border-primary w-full p-2" placeholder="Create a password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <p className="outline-none text-tertiary-600 text-[14px] leading-[20px]">Must be at least 8 characters.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[20px]">
                        <button className="rounded-[8px] bg-blue text-white h-[44px] leading-[24px] text-[16px] hover:bg-sky-600" onClick={handleSignup}>Create My Account</button>
                        <button className="rounded-[8px] flex items-center justify-center border border-primary bg-white hover:bg-neutral-100 gap-[12px] text-black h-[44px] leading-[24px] text-[16px]" onClick={handleGoogleLogin}>
                            <Icon icon="devicon:google" />
                            Sign up with Google
                        </button>
                    </div>
                </div>
                <p className="text-tertiary-600 leading-[20px] text-[14px] text-center">
                Already have an account? <a href="/auth/signin" className="outline-none text-blue">Login</a>
                </p>
            </div>
        </div>
    </div>
};

export default SignUp;