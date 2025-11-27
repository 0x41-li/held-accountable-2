"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const features = [
    {
        "icon": "/images/subscription/share.png",
        "title": "Share narratives on headlines"
    },
    {
        "icon": "/images/subscription/earn.png",
        "title": "Earn money on your activity"
    },
    {
        "icon": "/images/subscription/fast.png",
        "title": "Get exclusive insights"
    },
    {
        "icon": "/images/subscription/earn2.png",
        "title": "Join the community"
    },
];

const subscriptionItems = [
    "Share narratives on polls",
    "Earn money with your engagement",
    "Get improved insights",
    "Withdraw with crypto",
    "Cancel anytime"
];

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className='w-full min-h-screen flex flex-col'>
            {/* Main Content */}
            <div className='flex-1 flex flex-col items-center p-6 md:p-8 py-12 md:py-16 z-[1]'>
                <div className='w-full max-w-7xl'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center justify-center'>
                            <img src="/images/logo.png" alt="Logo" width={50} height={50} />
                            <h1 className='text-xl font-bold text-black'>Held Accountable</h1>
                        </div>
                        <div className='flex items-center justify-center gap-[32px]'>
                            <Link href="/app/about-us" className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px]'>
                                About
                            </Link>
                            <Link href="/app/support" className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px]'>
                                Services
                            </Link>
                            <Link href="/app/careers" className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px]'>
                                Careers
                            </Link>
                            <Link href="#blog" className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px]'>
                                Blog
                            </Link>
                            <Link href="/auth/signin" className='flex items-center justify-center gap-2 py-1 px-4 rounded-full bg-white text-[14px] leading-[30px] text-[#3d83ff]'>
                                <Icon icon="majesticons:lock" width="24" height="24" />
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='w-full border-t border-[#E9EAEB] bg-white py-8 px-6 md:px-12 z-[1]'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
                        {/* Logo */}
                        <div className='flex items-center gap-3'>
                            <img src="/images/logo.png" alt="Logo" width={40} height={40} />
                            <span className='text-xl font-medium text-[#101828]'>Held Accountable</span>
                        </div>

                        {/* Navigation Links */}
                        <div className='flex flex-wrap gap-6 items-center justify-center'>
                            <Link href="/app/about-us" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                Info
                            </Link>
                            <Link href="/app/support" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                Help
                            </Link>
                            <Link href="/developers" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                Developers
                            </Link>
                        </div>

                        {/* Social Media Icons */}
                        <div className='flex gap-4 items-center'>
                            <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                                <Icon icon="mdi:twitter" className="text-[#475467]" width={18} height={18} />
                            </a>
                            <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                                <Icon icon="mdi:facebook" className="text-[#475467]" width={18} height={18} />
                            </a>
                            <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                                <Icon icon="mdi:linkedin" className="text-[#475467]" width={18} height={18} />
                            </a>
                            <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                                <Icon icon="mdi:instagram" className="text-[#475467]" width={18} height={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

