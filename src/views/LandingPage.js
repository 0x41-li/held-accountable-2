"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TrustedIcon from "@/assets/icons/trusted.svg";
import Footer from "@/components/common/Footer";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const informedRef = useRef(null);
    const [informedVisible, setInformedVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState("/images/viralslide.png");

    useEffect(() => {
        const node = informedRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setInformedVisible(true);
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen relative bg-[#EAECFB] overflow-auto'>
            <div className="absolute top-0 left-0 right-0 bottom-0">
                <img src="/images/grid.png" />
            </div>
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
                        {/* <img src="/images/trusted.png" className="mb-[23px]" /> */}
                        <div className="rounded-full flex gap-2 mb-[23px] bg-[#F8F9FD] px-4 py-2 items-center justify-center font-[500] text-[12px] text-[#2B425B]">
                            <TrustedIcon width={10} height={10} />
                            Trusted
                        </div>
                        <div className="text-[48px] leading-[50px] md:text-[90px] md:leading-[90px] font-bold text-center text-[#2B425B]">
                            <span className="text-[#3d83ff]">A holistic</span> perspective
                            <br /> on news
                        </div>
                        <div className="text-[15px] leading-[28px] md:text-[18px] md:leading-[32px] text-[#2B425B80] font-medium mt-[23px]">
                            Everyone can make opinions and decisions, whether that is financial, political, regardless of their background.
                        </div>
                        <button className="w-[140px] h-[54px] text-center justify-center items-center flex gradient-button text-white text-[13px] mt-[23px] px-6 py-4 rounded-[24px] z-[100]">Get Started</button>
                    </div>
                    <div className="relative w-full">
                        <img src="/images/hero_effect.png" className="absolute md:top-[-300px] left-0 w-full" />
                        <div className="w-full flex items-center justify-center">
                            <img src="/images/hero.png" className="z-10" />
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <div className="w-full">
                            <div
                                ref={informedRef}
                                className="flex flex-col flex-col-reverse md:flex-row items-center justify-center md:pr-[100px]"
                            >
                                <div className="flex-1 relative">
                                    <img src="/images/informed_bg.png" className="w-full" />
                                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col">
                                        <img
                                            src="/images/informed1.png"
                                            className={`mb-[-8%] transition-all duration-700 ease-out ${
                                                informedVisible
                                                    ? "opacity-100 translate-y-0 float-y-up"
                                                    : "opacity-0 -translate-y-6"
                                            }`}
                                            alt="Informed top"
                                        />
                                        <img
                                            src="/images/informed2.png"
                                            className={`mt-[-8%] transition-all duration-700 ease-out delay-150 ${
                                                informedVisible
                                                    ? "opacity-100 translate-y-0 float-y-down"
                                                    : "opacity-0 translate-y-6"
                                            }`}
                                            alt="Informed bottom"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col items-start justify-center">
                                    <div className="text-[30px] leading-[36px] md:text-[56px] md:leading-[64px] font-[600] text-[#2B425B]">
                                        <span className="text-[#3D83FF]">Make informed</span> <br/>
                                        opinions & decisions
                                    </div>

                                    <div className="text-[13px] leading-[26px] md:text-[14px] md:leading-[28px] text-[#2b425b] font-[500] mt-[48px]">
                                    To democratize wealth building by giving every person tools, education, and access to information on finance, politics, economics, and technology that empowers them to make their own choices and shape economics, and technology that empowers them to make their own choices and shape
                                    </div>
                                    <button className="gradient-button text-white text-[13px] mt-[48px] px-6 py-4 rounded-[24px] w-[140px] h-[54px]">
                                        More
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-center md:pl-[100px]">
                                <div className="flex-1 flex flex-col md:flex-row gap-[36px] items-center justify-center w-full">
                                    <div className="flex-1 flex flex-col items-start justify-center">
                                        <div className="text-[24px] leading-[30px] md:text-[56px] md:leading-[64px] font-[600] text-[#2B425B]">
                                            <span className="text-[#3D83FF]">Dashboard</span> <br/>
                                            Options
                                        </div>

                                        <div className="text-[13px] leading-[26px] md:text-[14px] md:leading-[28px] text-[#2b425b] font-[500] mt-[48px]">
                                        To democratize wealth building by giving every person tools, education, and access to information on finance, politics, economics, and technology that empowers them to make their own choices and shape
                                        </div>
                                        <button className="gradient-button text-white text-[13px] mt-[48px] px-6 py-4 rounded-[24px]">
                                            Get Started
                                        </button>
                                    </div>
                                    <div className="flex overflow-x-auto md:overflow-x-visible min-w-0 w-full md:w-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                                        <div className="flex flex-row md:flex-col items-start text-[18px] leading-[24px]">
                                            <div
                                                onMouseMove={() => setCurrentSlide("/images/viralslide.png")}
                                                className={`cursor-pointer flex-shrink-0 whitespace-nowrap border-b md:border-l md:border-b-0 border-[#2B425B20] pl-[40px] pr-[20px] md:pr-[40px] py-[10px] ${currentSlide == "/images/viralslide.png" ? "border-[#3D83FF]" : ""}`}
                                            >
                                                Viral Detection
                                            </div>
                                            <div onMouseMove={() => setCurrentSlide("/images/snapshotslide.png")} className={`cursor-pointer flex-shrink-0 whitespace-nowrap border-b md:border-l md:border-b-0 border-[#2B425B20] pl-[40px] pr-[20px] md:pr-[40px] py-[10px] ${currentSlide == "/images/snapshotslide.png" ? "border-[#3D83FF]" : ""}`}>
                                                Snapshots
                                            </div>
                                            <div onMouseMove={() => setCurrentSlide("/images/careerslide.png")} className={`cursor-pointer flex-shrink-0 whitespace-nowrap border-b md:border-l md:border-b-0 border-[#2B425B20] pl-[40px] pr-[20px] md:pr-[40px] py-[10px] ${currentSlide == "/images/careerslide.png" ? "border-[#3D83FF]" : ""}`}>
                                                Careers
                                            </div>
                                            <div onMouseMove={() => setCurrentSlide("/images/supportslide.png")} className={`cursor-pointer flex-shrink-0 whitespace-nowrap border-b md:border-l md:border-b-0 border-[#2B425B20] pl-[40px] pr-[20px] md:pr-[40px] py-[10px] ${currentSlide == "/images/supportslide.png" ? "border-[#3D83FF]" : ""}`}>
                                                Support
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 items-center justify-center">
                                    <div className="hidden md:block relative">
                                        <img src="/images/dashboard_bg.png" alt="Dashboard background" />
                                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col">
                                            <img
                                                key={currentSlide}
                                                src={currentSlide}
                                                alt="Dashboard slide"
                                                className="fade-in"
                                            />
                                        </div>
                                    </div>
                                    <img src="/images/mobile-dashboard.png" className="block md:hidden" alt="Mobile dashboard" />
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

