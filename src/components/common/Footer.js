"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Footer() {
    return (
        <div className='bg-[#f7f8ff80] rounded-xl py-6 md:py-8 px-4 md:px-6 lg:px-12 m-4 md:m-6 lg:m-8 z-[1]'>
            <div className='flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-8 w-full'>
                {/* Logo */}
                <div className='flex-1 flex items-center md:items-start justify-between self-stretch flex-col'>
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
                        <h1 className='text-base md:text-[18px] font-extrabold text-[#2B425B]'>Held Accountable</h1>
                    </div>
                    <p className="hidden md:block text-[13px] font-[500] text-[#2b425b60]">Copyright 2025</p>
                </div>

                {/* Navigation Links */}
                <div className='flex-[2] flex items-start justify-between w-full md:w-auto'>
                    <div className="flex-1 flex flex-col items-start gap-4">
                        <p className="hidden md:block font-[700] text-[14px] leading-[30px] text-[#2b425b])]">Sections</p>
                        <Link href="/app/support" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Services
                        </Link>
                        <Link href="/careers" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Careers
                        </Link>
                        <Link href="#blog" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Blog
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col items-start gap-4">
                        <p className="hidden md:block font-[700] text-[14px] leading-[30px] text-[#2b425b])]">Help</p>
                        <Link href="/about-us" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            About
                        </Link>
                        <Link href="/app/support" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Privacy Policy
                        </Link>
                        <Link href="/app/support" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Terms & Conditions
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col items-start gap-4">
                        <p className="hidden md:block font-[700] text-[14px] leading-[30px] text-[#2b425b])]">Dashboard</p>
                        <Link href="/app/home" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Get Started
                        </Link>
                        <Link href="/app/support" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Services
                        </Link>
                        <Link href="/app/support" className='text-[13px] font-[500] text-[#2B425B66] hover:text-[#101828] transition-colors'>
                            Team
                        </Link>
                    </div>
                </div>

                {/* Social Media Icons */}
                <div className='flex-1 flex gap-4 items-center'>
                    <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                        <Icon icon="mdi:twitter" className="text-[#2B425B66]" width={18} height={18} />
                    </a>
                    <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                        <Icon icon="mdi:facebook" className="text-[#2B425B66]" width={18} height={18} />
                    </a>
                    <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                        <Icon icon="mdi:linkedin" className="text-[#2B425B66]" width={18} height={18} />
                    </a>
                    <a href="#" className='w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F7] hover:bg-[#E9EAEB] transition-colors'>
                        <Icon icon="mdi:instagram" className="text-[#2B425B66]" width={18} height={18} />
                    </a>
                </div>
                <p className="md:hidden text-[13px] font-[500] text-[#2b425b60]">Copyright 2025</p>
            </div>
        </div>
    );
}

