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
    <div className="hidden md:flex flex-col justify-between w-[230px] max-h-screen">
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
          {/* <Link
            href="/trending"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/trending" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <Icon icon="mingcute:fire-line" />
            <span>Headlines</span>
          </Link> */}
          {/* <Link
            href="/enterprises"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/enterprises" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <Icon icon="carbon:satellite-radar" />
            <span>Enterprise Radar</span>
          </Link> */}
          {/* <Link
            href="/blog"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/blog" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <Icon icon="mi:document" />
            <span>Leadership</span>
          </Link> */}
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
          {/* <Link
            href="/app/about-us"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/app/about-us" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/about-us.png" />
            <span>About Us</span>
          </Link> */}
          {/* <Link href="/app/manage" className={"rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " + (pathname == '/app/manage' ? "bg-[#F8F9FDaa]  text-black": "")}>
                    <Icon icon="gravity-ui:square-list-ul" />
                    <span>Poll Management</span>
                </Link> */}
          {/* <Link
            href="/careers"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/careers" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/careers.png" />
            <span>Careers</span>
          </Link> */}
          {/* <Link
            href="/profile"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/profile" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <Icon icon="mingcute:user-4-line" />
            <span>Profile</span>
          </Link> */}
          <Link
            href="/app/support"
            className={
              "rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " +
              (pathname == "/app/support" ? "bg-[#F8F9FDaa]  text-black" : "")
            }
          >
            <img src="/images/support.png" />
            <span>Support</span>
          </Link>
          {/* <Link href="/blog" className={"rounded-[12px] py-[16px] px-[16px] flex items-center w-full gap-[12px] " + (pathname == '/blog' ? "bg-[#F8F9FDaa]  text-black": "")}>
                    <Icon icon="mi:document" />
                    <span>Blog</span>
                </Link> */}
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
                    <img src="/images/sub_avatars.png" />
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
