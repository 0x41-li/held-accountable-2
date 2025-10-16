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
import AuthSlider from "@/components/common/AuthSlider";
import Image from "next/image";

const slides = [
  {
    img: "/images/authSlider/1.png",
    title: "Held-Accountable",
    desc: "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.",
  },
  {
    img: "/images/authSlider/2.png",
    title: "Work Smarter",
    desc: "Understand user behavior and make data-driven decisions with ease.",
  },
  {
    img: "/images/authSlider/1.png",
    title: "Scale Faster",
    desc: "Grow your business with insights and automation that drive results.",
  },
  {
    img: "/images/authSlider/2.png",
    title: "Scale Faster",
    desc: "Grow your business with insights and automation that drive results.",
  },
];

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      router.push("/");
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
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 md:grid-reverse h-[100dvh]">
      <div className="md:p-4 pl-0 order-1 md:order-2 w-full">
        <AuthSlider slides={slides} />
      </div>

      <div className="order-2 md:order-1 relative mt-4 md:mt-0 flex flex-col items-center justify-center">
        <div className="hidden md:flex absolute w-full left-0 right-0 top-0 items-start justify-center overflow-hidden">
          <Image
            src="/images/auth_bg.png"
            width={1920}
            height={1080}
            className="w-[100%] max-w-none z-0"
            alt="Background Image"
            unoptimized
            loading="eager"
          />
          
        </div>
        <div className="flex items-start justify-center m-auto z-10">
          <div className="flex flex-col gap-3 md:gap-8 w-[360px]">
            <div className="text-[30px] leading-[38px] font-bold">Login</div>
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col w-full gap-[20px]">
                <div className="w-full flex flex-col gap-[6px]">
                  <p className="leading-[20px] text-[14px] font-medium">
                    Username
                  </p>
                  <input
                    className="rounded-[8px] text-[16px] leading-[24px] h-[44px] outline-none border border-primary w-full p-2"
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col gap-[6px]">
                  <p className="leading-[20px] text-[14px] font-medium">
                    Password
                  </p>
                  <input
                    className="rounded-[8px] text-[16px] leading-[24px] h-[44px] outline-none border border-primary w-full p-2"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <a
                    href="/auth/password-reset"
                    className="outline-none text-tertiary-600 text-[14px] leading-[20px]"
                  >
                    Forgot Password
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-[20px]">
                <button
                  className="rounded-[8px] bg-blue text-white h-[44px] leading-[24px] text-[16px] hover:bg-sky-600"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="rounded-[8px] flex items-center justify-center border border-primary bg-white hover:bg-neutral-100 gap-[12px] text-black h-[44px] leading-[24px] text-[16px]"
                  onClick={handleGoogleLogin}
                >
                  <Icon icon="devicon:google" />
                  Login in with Google
                </button>
              </div>
            </div>
            <p className="text-tertiary-600 leading-[20px] text-[14px] text-center">
              Don{"'"}t have an account?{" "}
              <a href="/auth/signup" className="outline-none text-blue">
                Sign Up
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-between w-full pb-[12px] md:pb-[32px] px-[30px] text-[#A4A7AE] text-[14px]">
          <p className="mt-[24px] md:mt-0">© 2025 Held-Accountable</p>
          <a
            href="mailto:contact@held-accountable.com"
            className="hidden md:flex items-center gap-[4px] hover:opacity-80"
          >
            <Icon icon="tabler:mail" className="w-[16px] h-[16px]" />
            <p>contact@held-accountable.com</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
