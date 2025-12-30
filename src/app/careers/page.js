"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CAREERS_DATA } from "@/services/const";
import CareersCard from "@/components/common/CareersCard";
import CareersIcon from "@/assets/icons/careers.svg";
import Footer from "@/components/common/Footer";
import Pagination from "@/components/common/Pagination";

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
                <div className='flex-1 flex flex-col items-center p-4 md:p-6 lg:p-8 py-6 md:py-8'>
                    <div className='w-full max-w-7xl'>
                        <div className='flex justify-between items-center relative'>
                            <Link href="/" className='flex items-center justify-center gap-[16px]'>
                                <img src="/images/logo.png" alt="Logo" className="w-[50px] h-[50px] md:w-[64px] md:h-[64px]" />
                                <h1 className='text-[18px] md:text-[24px] font-extrabold text-[#2B425B]'>Held Accountable</h1>
                            </Link>
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
                            <div className='hidden lg:flex items-center justify-center gap-6 xl:gap-[32px] font-medium'>
                                <Link href="/about-us" className='text-[rgba(43, 66, 91, 1)] text-sm xl:text-[14px] leading-[30px]'>
                                    About
                                </Link>
                                <Link href="/app/support" className='text-[rgba(43, 66, 91, 1)] text-sm xl:text-[14px] leading-[30px]'>
                                    Services
                                </Link>
                                <Link href="/careers" className='text-[rgba(43, 66, 91, 1)] text-sm xl:text-[14px] leading-[30px]'>
                                    Careers
                                </Link>
                                <Link href="/auth/signin" className='inline-flex items-center justify-center gap-2 rounded-full bg-white text-sm xl:text-[14px] leading-[30px] text-[#3d83ff] w-[100px] xl:w-[120px] h-[40px] xl:h-[45px]'>
                                    <Icon icon="majesticons:lock" width="20" height="20" className="xl:w-6 xl:h-6" />
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
                    <div className="w-full flex flex-col items-center justify-center mt-8 md:mt-[50px] px-4">
                        <div className="rounded-full flex gap-2 mb-[23px] bg-[#F8F9FD] px-4 py-2 items-center justify-center font-[500] text-[12px] text-[#2B425B]">
                            <CareersIcon width={10} height={10} />
                            Career
                        </div>
                        <div className="text-3xl md:text-[48px] lg:text-[90px] leading-[36px] md:leading-[50px] lg:leading-[90px] font-bold text-center text-[#2B425B]">
                            <span className="text-[#3d83ff]">Be a part</span> of our<br/>
                            mission
                        </div>
                        <div className="text-sm md:text-[15px] lg:text-[18px] leading-6 md:leading-[28px] lg:leading-[32px] text-[#2B425B80] font-medium mt-4 md:mt-[23px] text-center px-4">
                            Everyone can make opinions and decisions, whether that is financial, political, regardless of their background.
                        </div>
                    </div>
                    <div className="w-full mt-12 md:mt-20 lg:mt-32 flex flex-col items-center justify-center px-4 md:px-6 mb-[70px] md:mb-[180px]">
                        <div className="max-w-7xl w-full">
                            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                                {/* Left Sidebar - Filters */}
                                <div className="lg:w-auto flex-shrink-0">
                                    <div className="flex flex-row lg:flex-col items-start overflow-x-auto lg:overflow-x-visible -mx-4 md:mx-0 px-4 md:px-0 text-sm md:text-base lg:text-[18px] leading-[20px] md:leading-[24px]" style={{ WebkitOverflowScrolling: 'touch' }}>
                                        {filters.map((filter) => (
                                            <button
                                                onClick={() => handleFilterChange(filter)}
                                                className={`flex-shrink-0 whitespace-nowrap border-b lg:border-l lg:border-b-0 border-[#2B425B20] pl-4 md:pl-8 lg:pl-[40px] pr-4 md:pr-6 lg:pr-[40px] py-2 md:py-[10px] transition-colors ${activeFilter === filter ? "border-[#3D83FF] text-[#3D83FF]" : "text-[#2B425B]"}`}
                                                key={filter}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Right Content - Career Cards */}
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                                        {paginatedData.map((item) => (
                                            <CareersCard key={item.short_description} data={item} />
                                        ))}
                                    </div>
                                    {/* Pagination */}
                                    {totalPages >= 1 && (
                                        <Pagination
                                            totalPages={totalPages}
                                            page={page}
                                            setPage={setPage}
                                            className="mt-6 md:mt-[50px]"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}

