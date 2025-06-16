'use client';
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
            if (!currentUser && pathname.indexOf("/auth") == -1) {
                router.push("/auth/signin");
                return;
            }
            if (currentUser) {
                getUserById(auth.currentUser.uid).then(u => setUser(u));
            }
        });

        return () => unsubscribe();
    }, []);

    if (pathname.indexOf("/auth") > -1) {
        return <></>;
    }

    return <div className="hidden md:flex flex-col justify-between w-[312px]">
        <div className="flex flex-col gap-[24px] pt-[32px] ">
            <div className="flex items-center pl-[23px]">
                <img src="/images/logo.png" />
                <span className="text-[24px] leading-[38px] font-medium">Held Accountable</span>
            </div>
            <div className="flex flex-col px-[16px] gap-[4px]">
                <Link href="/" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/' ? "bg-blue  text-white": "")}>
                    <Icon icon="typcn:home" />
                    <span>Home</span>
                </Link>
                <Link href="/trending" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/trending' ? "bg-blue  text-white": "")}>
                    <Icon icon="mingcute:fire-line" />
                    <span>Trending</span>
                </Link>
                <Link href="/manage" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/manage' ? "bg-blue  text-white": "")}>
                    <Icon icon="gravity-ui:square-list-ul" />
                    <span>Poll Management</span>
                </Link>
                <Link href="/profile" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/profile' ? "bg-blue  text-white": "")}>
                    <Icon icon="mingcute:user-4-line" />
                    <span>Profile</span>
                </Link>
                <Link href="/support" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/support' ? "bg-blue  text-white": "")}>
                    <Icon icon="ix:support" />
                    <span>Support</span>
                </Link>
                {/* <Link href="/blog" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/blog' ? "bg-blue  text-white": "")}>
                    <Icon icon="mi:document" />
                    <span>Blog</span>
                </Link> */}
                <Link href="/blog" className={"rounded-[12px] py-[8px] px-[12px] flex items-center w-full gap-[12px] " + (pathname == '/blog' ? "bg-blue  text-white": "")}>
                    <Icon icon="mi:document" />
                    <span>Through my Eyes</span>
                </Link>
            </div>
        </div>
        {user && <div className="flex flex-col gap-[20px]">
            {(!user.subscripted_at || user.subscripted_at < Date.now())  && <div className="p-[12px] w-full">
                <div className="rounded-[12px] p-[16px] border border-secondary w-full gap-[8px] flex flex-col">
                    <div className="flex w-full justify-between">
                        <div className="flex gap-[8px] items-center">
                            <img src="/images/sub_avatars.png" />
                            <Link href="/subscription" className="w-[24px] h-[24px] rounded-full border border-primary bg-[#FAFAFA] flex items-center justify-center text-[#717680]">
                                <Icon icon="ic:baseline-plus" />
                            </Link>
                        </div>
                        <div className="text-xl">
                            <Icon icon="material-symbols:close" />
                        </div>
                    </div>
                    <p className="font-semibold">Join our brilliant community</p>
                    <p>Upgrade your plan to leverage your abilities with Poll Mania’s premium features.</p>
                    <Link href="/subscription" className=" w-full text-center rounded-[8px] bg-blue text-white w-full p-[8px]">Upgrade Now</Link>
                </div>
            </div>}
            <div className="flex items-center gap-[10px] justify-center px-[20px] mx-[10px] border rounded-full">
                <div className="rounded-full overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-[32px] h-[32px]" />:<Icon icon="mynaui:user-solid" className="text-[32px]" />}
                </div>
                <Link href="/profile" className="flex flex-1 flex-col border-x px-[14px] justify-center items-center">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{user.fullname}</span>
                    <span className="text-tertiary-600">@{user.username}</span>
                </Link>
                <div className="flex items-center justify-center">
                    <button onClick={() => {auth.signOut(); router.push("/auth/signin");}}><Icon icon="material-symbols:logout-rounded" /></button>
                </div>
            </div>
            <div className="text-md leading-md h-[34px] w-full text-[#A7A7A7] text-center">© 2025 Held Accountable</div>
        </div> }
    </div>;
}