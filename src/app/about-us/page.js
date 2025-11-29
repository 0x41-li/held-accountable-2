"use client";
import CustomPlayer from "@/components/common/CustomPlayer";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AboutUsPage() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen relative bg-[#EAECFB] overflow-auto'>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
                {/* Main Content */}
                <div className='flex-1 flex flex-col items-center p-6 md:p-8 py-8 md:py-8'>
                    <div className='w-full max-w-7xl'>
                        <div className='flex justify-between items-center relative'>
                            <div className='flex items-center justify-center'>
                                <img src="/images/logo.png" alt="Logo" width={50} height={50} />
                                <h1 className='text-[18px] font-extrabold text-[#2B425B]'>Held Accountable</h1>
                            </div>
                            {/* Hamburger Menu Button - Mobile Only */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className='md:hidden flex items-center justify-center w-10 h-10 text-[#2B425B]'
                                aria-label="Toggle menu"
                            >
                                <Icon 
                                    icon={isMenuOpen ? "mdi:close" : "mdi:menu"} 
                                    width="28" 
                                    height="28" 
                                />
                            </button>
                            {/* Desktop Navigation */}
                            <div className='hidden md:flex items-center justify-center gap-[32px] font-medium'>
                                <Link href="/about-us" className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px]'>
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
                                <Link href="/auth/signin" className='inline-flex items-center justify-center gap-2 rounded-full bg-white text-[14px] leading-[30px] text-[#3d83ff] w-[120px] h-[45px]'>
                                    <Icon icon="majesticons:lock" width="24" height="24" />
                                    Sign In
                                </Link>
                            </div>
                            {/* Mobile Navigation Menu */}
                            <div className={`absolute top-full left-0 right-0 mt-4 bg-white rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
                                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                            } md:hidden`}>
                                <div className='flex flex-col p-4 gap-4 font-medium'>
                                    <Link 
                                        href="/about-us" 
                                        className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px] py-2 px-4 hover:bg-[#EAECFB] rounded-md transition-colors'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link 
                                        href="/app/support" 
                                        className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px] py-2 px-4 hover:bg-[#EAECFB] rounded-md transition-colors'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Services
                                    </Link>
                                    <Link 
                                        href="/app/careers" 
                                        className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px] py-2 px-4 hover:bg-[#EAECFB] rounded-md transition-colors'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Careers
                                    </Link>
                                    <Link 
                                        href="#blog" 
                                        className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px] py-2 px-4 hover:bg-[#EAECFB] rounded-md transition-colors'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Blog
                                    </Link>
                                    <Link 
                                        href="/auth/signin" 
                                        className='inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-[#3d83ff] text-[14px] leading-[30px] text-[#3d83ff] w-full h-[45px] hover:bg-[#3d83ff] hover:text-white transition-colors'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Icon icon="majesticons:lock" width="24" height="24" />
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center mt-[50px]">
                        <img src="/images/AboutUs.png" className="mb-[23px]" />
                        <div className="text-[48px] leading-[50px] md:text-[90px] md:leading-[90px] font-bold text-center text-[#2B425B]">
                            We’re <span className="text-[#3d83ff]">spread all</span> <br/>
                            across the world
                        </div>
                        <div className="text-[15px] leading-[28px] md:text-[18px] md:leading-[32px] text-[#2B425B80] font-medium mt-[23px]">
                            Everyone can make opinions and decisions, whether that is financial, political, regardless of their background.
                        </div>
                        <button className="w-[140px] h-[54px] text-center justify-center items-center flex gradient-button text-white text-[13px] mt-[23px] px-6 py-4 rounded-[24px]">Get Started</button>
                    </div>
                    <div className="w-full">
                        <div className="max-w-7xl mx-auto flex items-center justify-center mt-16">
                            <CustomPlayer video="https://player.vimeo.com/video/1120069891?autoplay=1&loop=1&muted=0&controls=0" />
                        </div>
                    </div>
                    <div className="w-full mt-32 flex flex-col items-center justify-center">
                        <div className="max-w-7xl">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                                <div className="flex-1 flex-col flex gap-[32px]">
                                    <div className="text-[30px] leading-[36px] md:text-[56px] md:leading-[64px] font-[600] text-[#2B425B]">
                                        Our Mission
                                    </div>
                                    <div className="text-[24px] leading-[32px] md:text-[36px] md:leading-[52px] font-[600] text-[#2B425B] md:pr-[100px]">
                                        Holistic perspective on news and public information
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col items-start justify-center gap-10">
                                    <img src="/images/arrown_down_right.png" className="hidden md:block" />
                                    <div className="text-[14px] leading-[28px] font-[500] text-[#2b425b80]">
                                    Held Accountable’s mission is to provide a holistic perspective on news and public information, so that everyone can make informed opinions and decisions, whether that is financial, political, or personal, regardless of their background or knowledge.cal, or personal, regardless of their background or knowledge.Held Accountable’s mission is to provide a holistic perspective on news and public information, so that
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full relative mt-10">
                            <img src="/images/join-us-bg.png" className="w-full mt-10" />
                            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center gap-10 flex-col">
                                <div className="text-[24px] leading-[32px] md:text-[170px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">
                                    Join <span className="text-[#3d83ff]">Us</span>
                                </div>
                                <div className="text-[18px] text-[#2b425b80] mt-[20px]">
                                    We’re a 100% remote team spread all across the world.
                                </div>
                                <button className="w-[140px] h-[54px] text-center justify-center items-center flex gradient-button text-white text-[13px] mt-[23px] px-6 py-4 rounded-[24px]">Get Started</button>
                            </div>
                        </div>
                        <div className="max-w-7xl my-32">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                                <div className="flex-1 flex flex-col items-start justify-center gap-10 md:pr-[100px]">
                                    <img src="/images/arrown_down_right.png" className="hidden md:block" />
                                    <div className="text-[14px] leading-[28px] font-[500] text-[#2b425b80]">
                                    To democratize wealth building by giving every person tools, education, and access to information on finance, politics, economics, and technology that empowers them to make their own choices and shape their future.To democratize wealth building by giving every person tools, education, and access to information on finance, politics, economics, and technology that empowers them to make their own choices and shape their future.
                                    </div>
                                </div>
                                <div className="flex-1 flex-col flex gap-[32px]">
                                    <div className="text-[30px] leading-[36px] md:text-[56px] md:leading-[64px] font-[600] text-[#2B425B]">
                                        Our Vision
                                    </div>
                                    <div className="text-[24px] leading-[32px] md:text-[36px] md:leading-[52px] font-[600] text-[#2B425B]">
                                    Democratize wealth building by giving every person tools
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full relative mt-10">
                            <img src="/images/stats-bg.png" className="w-full mt-10" />
                            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-between px-32">
                                <div className="flex flex-col items-center justify-center gap-10">
                                    <div className="text-[48px] leading-[32px] md:text-[170px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">
                                        95<span className="text-[#3d83ff] text-[34px] md:text-[100px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">%</span>
                                    </div>
                                    <div className="text-[18px] text-[#2b425b80] mt-[20px]">
                                        Effective work
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-10">
                                    <div className="text-[24px] leading-[32px] md:text-[170px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">
                                        7<span className="text-[#3d83ff] text-[34px] md:text-[100px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">Y+</span>
                                    </div>
                                    <div className="text-[18px] text-[#2b425b80] mt-[20px]">
                                        Years Experience
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-10">
                                    <div className="text-[24px] leading-[32px] md:text-[170px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">
                                        110<span className="text-[#3d83ff] text-[34px] md:text-[100px] md:leading-[90px] font-[600] text-[#2B425B] mt-10">k</span>
                                    </div>
                                    <div className="text-[18px] text-[#2b425b80] mt-[20px]">
                                        Clients and readers
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-7xl flex flex-col items-center justify-center gap-10 my-32">
                            <div className="text-[56px] leading-[64px] font-[600] text-[#2B425B]">
                                Core Values
                            </div>
                            <div className="flex text-[#2b425b80] gap-10">
                                <div className="flex-1">
                                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md bg-white">
                                        <img src="/images/aboutPage/ChartLineUp.png" />
                                    </div>
                                    <p className="mt-10">
                                        We relentlessly pursue excellence by holding ourselves and our work to the highest standards, never settling for 'good enough'.
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md bg-white">
                                        <img src="/images/aboutPage/ChartDonut.png" />
                                    </div>
                                    <p className="mt-10">
                                    We approach every challenge with curiosity and rigor, digging beneath the surface to fully understand the details
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md bg-white">
                                        <img src="/images/aboutPage/Lightbulb.png" />
                                    </div>
                                    <p className="mt-10">
                                    We move quickly and decisively, taking initiative to turn ideas into results and solve problems without waiting for perfect conditions.
                                    </p>
                                </div>
                            </div>
                            <div className="flex text-[#2b425b80] gap-10">
                                <div className="flex-1">
                                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md bg-white">
                                        <img src="/images/aboutPage/Swap.png" />
                                    </div>
                                    <p className="mt-10">
                                    We empower ourselves to take initiative and drive change without hesitation
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md bg-white">
                                        <img src="/images/aboutPage/UsersFour.png" />
                                    </div>
                                    <p className="mt-10">
                                    We empower ourselves to take initiative and drive change without hesitation
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-md bg-white">
                                        <img src="/images/aboutPage/RocketLaunch.png" />
                                    </div>
                                    <p className="mt-10">
                                    We act like owners—taking responsibility, making decisions with care, and holding ourselves accountable for results
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className='w-full border-t border-[#E9EAEB] bg-[#f7f8ff80] py-8 px-6 md:px-12 z-[1]'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-6 w-full'>
                            {/* Logo */}
                            <div className='flex items-center justify-center'>
                                <img src="/images/logo.png" alt="Logo" width={50} height={50} />
                                <h1 className='text-[18px] font-extrabold text-[#2B425B]'>Held Accountable</h1>
                            </div>

                            {/* Navigation Links */}
                            <div className='flex flex-wrap gap-6 md:gap-[100px] items-start justify-center w-full md:w-auto'>
                                <div className="flex-1 flex flex-col items-start gap-4">
                                    <p className="font-[700] text-[14px] leading-[30px] text-[#2b425b])]">Sections</p>
                                    <Link href="/app/support" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Services
                                    </Link>
                                    <Link href="/app/support" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Careers
                                    </Link>
                                    <Link href="/app/support" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Blog
                                    </Link>
                                </div>
                                <div className="flex-1 flex flex-col items-start gap-4">
                                    <p className="font-[700] text-[14px] leading-[30px] text-[#2b425b])]">Help</p>
                                    <Link href="/about-us" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        About
                                    </Link>
                                    <Link href="/app/" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Privacy Policy
                                    </Link>
                                    <Link href="/app/" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Terms & Conditions
                                    </Link>
                                </div>
                                <div className="flex-1 flex flex-col items-start gap-4">
                                    <p className="font-[700] text-[14px] leading-[30px] text-[#2b425b])]">Dashboard</p>
                                    <Link href="/app/" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Get Started
                                    </Link>
                                    <Link href="/app/" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Services
                                    </Link>
                                    <Link href="/app/" className='text-sm text-[#475467] hover:text-[#101828] transition-colors'>
                                        Team
                                    </Link>
                                </div>
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
        </div>
    );
}

