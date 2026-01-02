"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app, auth } from "../../lib/firebase";
import { getUserById } from "@/services/polls/polls";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && pathname.indexOf("/auth") == -1 && pathname !== "/") {
        router.push("/auth/signin");
        return;
      }
      if (currentUser) {
        getUserById(auth.currentUser.uid).then((u) => setUser(u));
      }
    });

    return () => unsubscribe();
  }, []);

  if (pathname.indexOf("/auth") > -1) {
    return <></>;
  }

  return (
    <div className="hidden lg:flex flex-col justify-between w-[230px] max-h-screen">
      <div className="flex flex-col gap-[24px] pt-[32px] ">
        <Link href="/" className="flex items-center pl-[23px]">
          <img src="/images/logo.png" width={50} />
          <span className="text-[18px] leading-[24px] font-bold text-[#2B425B]">
            Held Accountable
          </span>
        </Link>
        <div className="flex flex-col px-[16px] gap-[4px]">
          <Link
            href="/app/home"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/app/home" || pathname == "/" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/home.png" />
            <span>Home</span>
          </Link>
          <Link
            href="/app/viral-detection"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/app/viral-detection" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/viral.png" />
            <span>Viral Detection</span>
          </Link>
          <Link
            href="/app/snapshots"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/app/snapshots" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/snapshots.png" />
            <span>Snapshots</span>
          </Link>

          <Link
            href="/app/profile"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/app/profile" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/user-regular-full.svg" width={24} height={24} className="text-[#2B425B]" />
            <span>Profile</span>
          </Link>

          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                auth.signOut();
                router.push("/auth/signin");
              }}
              className="rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px]"
            >
              <Icon icon="material-symbols:logout-rounded" fill="#2B425B" className="w-6 h-6 text-[#2B425B]" />
              <span className="">Logout</span>
            </button>
          </div>

          {user && user.role == "admin" &&
            <Link
              href="/app/admin/users"
              className={
                "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
                (pathname == "/app/admin/users" ? "bg-[#F8F9FDaa]  text-black" : "")
              }
            >
              <Icon icon="mdi:users" />
              <span>User Management</span>
            </Link>
          }
        </div>
      </div>
      {user && (
        <div className="flex flex-col gap-[20px]">
          {(!user.subscripted_at || user.subscripted_at < Date.now()) && (
            <div className="p-[12px] w-full">
              <div className="rounded-[12px] p-[16px] w-full gap-[8px] flex flex-col">
                <div className="flex w-full justify-between">
                  <div className="flex gap-[8px] items-center">
                    {/* <Link
                      href="/subscription"
                      className="w-[24px] h-[24px] rounded-full border border-primary bg-[#FAFAFA] flex items-center justify-center text-[#717680]"
                    >
                      <Icon icon="ic:baseline-plus" />
                    </Link> */}
                  </div>
                  {/* <div className="text-xl">
                    <Icon icon="material-symbols:close" />
                  </div> */}
                </div>
                {/* <p className="">Join our community</p> */}
                {/* <p>
                  Upgrade your plan to leverage your abilities with Held
                  Accountable’s premium features.
                </p> */}
                {/* <Link
                  href="/subscription"
                  className=" w-full text-center rounded-[8px] bg-[#F8F9FDaa] text-white w-full p-[8px]"
                >
                  Upgrade Now
                </Link> */}
              </div>
            </div>
          )}
          <div className="flex items-center gap-[10px] justify-center px-[20px] py-[10px] mx-[10px] border border-[#2B425B54] border-dashed rounded-full">
            <div className="rounded-full overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-[32px] h-[32px]" />
              ) : (
                <Icon icon="mynaui:user-solid" className="text-[32px]" />
              )}
            </div>
            <Link
              href="/app/profile"
              className="flex flex-1 flex-col px-[14px] justify-center items-center"
            >
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {user.fullname}
              </span>
              {/* <span className="text-tertiary-600">@{user.username}</span> */}
            </Link>
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  auth.signOut();
                  router.push("/auth/signin");
                }}
              >
                <Icon icon="material-symbols:logout-rounded" />
              </button>
            </div>
          </div>
          <div className="text-md leading-md h-[34px] w-full text-[#A7A7A7] text-center">
            © 2025 Held Accountable
          </div>
        </div>
      )}
    </div>
  );
}
