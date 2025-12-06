"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CAREERS_DATA } from "@/services/const";
import CareersCard from "@/components/common/CareersCard";

export default function CareersPage() {
    const router = useRouter();
    const filters = [
      "All",
      "AI/ML",
      "Marketing",
      "Engineering",
    ];
    const [activeFilter, setActiveFilter] = useState("All");
    const [page, setPage] = useState(1);
    const itmsToShow = 6;
  
    const filteredData =
      activeFilter === "All"
        ? CAREERS_DATA
        : CAREERS_DATA.filter((item) => item.industry === activeFilter);
    const totalPages = Math.ceil(filteredData.length / itmsToShow);
    const paginatedData = filteredData.slice(
      (page - 1) * itmsToShow,
      page * itmsToShow
    );
  
    const handleFilterChange = (filter) => {
      setActiveFilter(filter);
      setPage(1);
    };
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
                                <Link href="/careers" className='text-[rgba(43, 66, 91, 1)] text-[14px] leading-[30px]'>
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
                                        href="/careers" 
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
                        <img src="/images/careers_badge.png" className="mb-[23px]" />
                        <div className="text-[48px] leading-[50px] md:text-[90px] md:leading-[90px] font-bold text-center text-[#2B425B]">
                            <span className="text-[#3d83ff]">Be a part</span> of our<br/>
                            mission
                        </div>
                        <div className="text-[15px] leading-[28px] md:text-[18px] md:leading-[32px] text-[#2B425B80] font-medium mt-[23px]">
                            Everyone can make opinions and decisions, whether that is financial, political, regardless of their background.
                        </div>
                    </div>
                    <div className="w-full mt-32 flex flex-col items-center justify-center">
                        <div className="max-w-7xl">
                            <div className="flex gap-10">
                                    <div className="flex overflow-x-auto md:overflow-x-visible min-w-0 w-full md:w-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                                        <div className="flex flex-row md:flex-col items-start text-[18px] leading-[24px]">
                                            {filters.map((filter) => (
                                                <button
                                                    onClick={() => handleFilterChange(filter)}
                                                    className={`flex-shrink-0 whitespace-nowrap border-b md:border-l md:border-b-0 border-[#2B425B20] pl-[40px] pr-[20px] md:pr-[40px] py-[10px] ${activeFilter === filter ? "border-[#3D83FF] text-[#3D83FF]" : "text-[#2B425B]"}`}
                                                    key={filter}
                                                >
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex flex-col items-start text-[18px] leading-[24px] gap-8">
                                            {paginatedData.map((item) => (
                                                <CareersCard key={item.short_description} data={item} />
                                            ))}
                                        </div>
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

