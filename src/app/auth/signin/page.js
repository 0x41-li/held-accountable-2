"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../../../../lib/firebase";
import Image from "next/image";
import CustomPlayer from "@/components/common/CustomPlayer";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      let userCredential;
      if (username.includes("@")) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          username,
          password
        );
      } else {
        // Search for user by username
        const q = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error("Username not found!");
          return;
        }

        const userDoc = querySnapshot.docs[0].data();
        userCredential = await signInWithEmailAndPassword(
          auth,
          userDoc.email,
          password
        );
      }

      toast.success("Login succeed!");
      router.push("/app/home");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // Check if user exists in Firestore, if not, create one
      const userDoc = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      if (userDoc.empty) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName.replace(/\s+/g, "").toLowerCase(),
          fullname: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          uid: user.uid,
        });
      }

      toast.success("Login succeed!");
      router.push("/app/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 h-[100dvh]">
      {/* Left Sidebar - Promotional Area */}
      <div className="relative hidden md:flex flex-col justify-center items-center h-full overflow-hidden p-8 md:p-12">
        {/* Background Image with Padding */}
        <div className="absolute inset-0 m-4 md:m-12 rounded-3xl overflow-hidden" style={{ backgroundImage: 'url(/images/auth-side-bg.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
        
        <div className="absolute right-[-100px] top-0 bottom-[64px] z-10 flex flex-col items-center justify-center w-full max-w-2xl gap-6 md:gap-8">
          <div className="w-full">
            <CustomPlayer
              video="https://player.vimeo.com/video/1120069862?autoplay=1&loop=1&controls=0"
              className="!w-full"
              videoClass="absolute top-0 left-0 w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
        <div className="absolute bottom-24 left-32 right-16 z-10 flex flex-col gap-2">
            <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-[0.2em] font-normal">HELD ACCOUNTABLE</p>
            <p className="text-white text-[54px] font-bold leading-tight">
              We provide a holistic perspective on news and public information
            </p>
          </div>

        {/* Play Video Button - Bottom Right */}
        <button className="absolute bottom-16 right-24 z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#f7f8ff] flex items-center justify-center">
            <Icon icon="mdi:play" width={18} height={18} className="ml-0.5 text-[#3D83FF]" />
          </div>
          <span className="text-sm text-[#2b425b] font-medium">Play video about us</span>
        </button>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-12 relative min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              {/* Eagle head logo - using a placeholder icon, replace with actual logo */}
              <img src="/images/logo.png" alt="Logo" width={64} height={64} className="rounded-full" />
            </div>
          </div>

          {/* Sign In Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#101828] mb-6 md:mb-8 text-center">Sign In</h1>

          {/* Form */}
          <div className="flex flex-col gap-6">
            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344054]">Username</label>
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pl-11 rounded-lg border border-[#D0D5DD] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent"
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Icon 
                  icon="mdi:account-outline" 
                  width={20} 
                  height={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#344054]">Password</label>
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pl-11 pr-11 rounded-lg border border-[#D0D5DD] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#3D83FF] focus:border-transparent"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Icon 
                  icon="mdi:lock-outline" 
                  width={20} 
                  height={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#101828]"
                >
                  <Icon 
                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                    width={20} 
                    height={20} 
                  />
                </button>
              </div>
              <a
                href="/auth/password-reset"
                className="text-[#3D83FF] text-sm hover:underline self-start"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              className="gradient-button text-white h-12 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              onClick={handleLogin}
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-[#E4E7EC]"></div>
              <span className="text-sm text-[#98A2B3]">or</span>
              <div className="flex-1 h-px bg-[#E4E7EC]"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              className="flex items-center justify-center gap-3 h-12 rounded-lg border border-[#D0D5DD] bg-white text-[#344054] font-medium hover:bg-[#F9FAFB] transition-colors"
              onClick={handleGoogleLogin}
            >
              <Icon icon="devicon:google" width={20} height={20} />
              <span>Sign in with Google</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#475467] mt-4">
              Don{"'"}t have an account?{" "}
              <a href="/auth/signup" className="text-[#3D83FF] font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
