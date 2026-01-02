"use client";
import { getUserById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import HomeIcon from "@/assets/icons/home.svg";
import ViralIcon from "@/assets/icons/viral.svg";
import SnapshotIcon from "@/assets/icons/snapshots.svg";
import SupportIcon from "@/assets/icons/support.svg";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  if (pathname.indexOf("/auth") > -1) {
    return <></>;
  }

  return (
    <div className={
      `flex px-[20px] py-[10px] lg:hidden items-center w-full ${show ? "fixed top-0 right-0 left-0 bottom-0 bg-[#dbe7f8] z-[999] !pt-[30px] h-[90px]" : " h-[60px]"}`
    }>
      <Link href="/" className="flex flex-1 items-center gap-[16px]">
        <img src="/images/logo.png" className="w-[40px]" />
        <span className="text-[16px] font-extrabold text-[#2B425B] leading-[24px]">
          Held Accountable
        </span>
      </Link>
      <NotificationDropdown />
      <button
        className="rounded-[8px] w-[40px] h-[40px] flex items-center justify-center text-[20px]"
        onClick={() => setShow(!show)}
      >
        {!show ? <Icon icon="mingcute:menu-fill" /> : <Icon icon="mdi:close" />}
      </button>
      {show && (
        <div className="fixed left-0 top-[90px] bottom-0 right-0 bg-[#dbe7f8] flex border-t z-[999]">
          {/* <div className="w-1/3" onClick={() => setShow(false)}></div> */}
          <div className="w-full pt-[20px]">
            <div className="flex flex-col items-end justify-end px-[16px] gap-[24px] h-full overflow-scroll">
              <Link
                href="/app/home"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex justify-end items-center w-full gap-[36px] text-[16px]  " +
                  (pathname == "/app/home" || pathname == "/" ? "font-bold" : "")
                }
              >
                <span>Home</span>
                <HomeIcon />
              </Link>
              <Link
                href="/app/viral-detection"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex justify-end items-center w-full gap-[36px] text-[16px]  " +
                  (pathname == "/app/viral-detection" ? "font-bold" : "")
                }
              >
                <span>Viral Detection</span>
                <ViralIcon className="stroke-[#000]" />
              </Link>
              <Link
                href="/app/snapshots"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex justify-end items-center w-full gap-[36px] text-[16px]  " +
                  (pathname == "/app/snapshots" ? "font-bold" : "")
                }
              >
                <span>Snapshots</span>
                <SnapshotIcon className="stroke-[#000]" />
              </Link>
              <Link
                href="/app/support"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex justify-end items-center w-full gap-[36px] text-[16px]  " +
                  (pathname == "/app/support" ? "font-bold" : "")
                }
              >
                <span>Support</span>
                <SupportIcon className="stroke-[#000]" />
              </Link>
              <Link
                href="/app/profile"
                className={
                  "rounded-[12px] py-[8px] px-[16px] flex justify-end items-center w-full gap-[36px] text-[16px] " +
                  (pathname == "/app/profile" ? "bg-[#F8F9FDaa]  text-black" : "")
                }
              >
                <span>Profile</span>
                <img src="/images/user-regular-full.svg" width={24} height={24} className="text-[#2B425B]" />
              </Link>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => {
                    auth.signOut();
                    router.push("/auth/signin");
                  }}
                  className="rounded-[12px] py-[8px] px-[16px] flex justify-end items-center w-full gap-[36px] text-[16px]"
                >
                  <span className="">Logout</span>
                  <Icon icon="material-symbols:logout-rounded" className="w-6 h-6 text-[#2B425B]" />
                </button>
              </div>

              <div className="flex-1"></div>
              {user && (
                <div className="flex flex-col gap-[10px] w-full">
                  <div className="w-full">
                    <div className="rounded-[12px] pb-[16px] border border-secondary w-full gap-[8px] flex">
                      <div className="flex w-full justify-between">
                        <div className="flex gap-[8px] items-center">
                          <img src="/images/sub_avatars.png" />
                        </div>
                      </div>
                      <Link href="/app/subscription" className="gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all">
                        Subscribe
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
