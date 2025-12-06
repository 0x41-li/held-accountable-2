"use client";
import { getUserById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        return;
      }
      getUserById(auth.currentUser.uid).then((u) => setUser(u));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  if (pathname.indexOf("/auth") > -1) {
    return <></>;
  }

  return (
    <div className="flex p-4 md:hidden items-center h-[60px] w-full border-b border-[#E4E7EC]">
      <Link href="/" className="flex flex-1 items-center pl-[23px]">
        <img src="/images/logo.png" width={50} />
        <span className="text-[24px] leading-[38px] font-medium">
          Held Accountable
        </span>
      </Link>
      <button
        className="rounded-[8px] w-[40px] h-[40px] border border-primary flex items-center justify-center"
        onClick={() => setShow(!show)}
      >
        <Icon icon="mingcute:menu-fill" />
      </button>
      {show && (
        <div className="fixed left-0 top-[60px] bottom-0 right-0 bg-[#000000cc] flex border-t z-[999]">
          <div className="w-1/3" onClick={() => setShow(false)}></div>
          <div className="w-2/3 bg-white pt-[20px]">
            <div className="flex flex-col px-[16px] gap-[4px] h-full overflow-scroll">
              <Link
                href="/app/home"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/home" || pathname == "/" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="typcn:home" />
                <span>Home</span>
              </Link>
              <Link
                href="/app/viral-detection"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/viral-detection" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="solar:camera-outline" />
                <span>Viral Detection</span>
              </Link>
              <Link
                href="/app/enterprises"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/enterprises" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="carbon:satellite-radar" />
                <span>Enterprise Radar</span>
              </Link>
              <Link
                href="/app/blog"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/blog" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="mi:document" />
                <span>Thought Leadership</span>
              </Link>
              <Link
                href="/app/snapshots"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/snapshots" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="solar:camera-outline" />
                <span>Snapshots</span>
              </Link>
              {/* <Link href="/trending" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/trending' ? "bg-blue  text-white": "")}>
                        <Icon icon="mingcute:fire-line" />
                        <span>Headlines</span>
                    </Link> */}
              {/* <Link href="/manage" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/manage' ? "bg-blue  text-white": "")}>
                        <Icon icon="gravity-ui:square-list-ul" />
                        <span>Poll Management</span>
                    </Link> */}
              <Link
                href="/app/about-us"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/about-us" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="solar:info-square-linear" />
                <span>About Us</span>
              </Link>
              <Link
                href="/careers"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/careers" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="flowbite:briefcase-outline" />
                <span>Careers</span>
              </Link>
              <Link
                href="/app/profile"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/profile" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="mingcute:user-4-line" />
                <span>Profile</span>
              </Link>
              <Link
                href="/app/support"
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/app/support" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="ix:support" />
                <span>Support</span>
              </Link>
              {/* <Link href="/blog" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/blog' ? "bg-blue  text-white": "")}>
                        <Icon icon="mi:document" />
                        <span>Blog</span>
                    </Link> */}
              <button
                onClick={() => {
                  auth.signOut();
                  router.push("/auth/signin");
                }}
                className={
                  "rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " +
                  (pathname == "/logout" ? "bg-blue  text-white" : "")
                }
              >
                <Icon icon="material-symbols:logout-rounded" />
                <span>Logout</span>
              </button>
              <div className="flex-1"></div>
              {user && (
                <div className="flex flex-col gap-[10px]">
                  <div className="p-[10px] w-full">
                    <div className="rounded-[12px] p-[16px] border border-secondary w-full gap-[8px] flex flex-col">
                      <div className="flex w-full justify-between">
                        <div className="flex gap-[8px] items-center">
                          <img src="/images/sub_avatars.png" />
                          <button className="w-[24px] h-[24px] rounded-full border border-primary bg-[#FAFAFA] flex items-center justify-center text-[#717680]">
                            <Icon icon="ic:baseline-plus" />
                          </button>
                        </div>
                        <button className="text-xl">
                          <Icon icon="material-symbols:close" />
                        </button>
                      </div>
                      <Link href="/app/subscription" className="rounded-[8px] bg-blue text-white w-full p-[8px] text-center">
                        Upgrade Now
                      </Link>
                    </div>
                  </div>
                  <div className="text-md leading-md h-[34px] w-full text-[#A7A7A7] text-center">
                    © 2025 Held Accountable
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
