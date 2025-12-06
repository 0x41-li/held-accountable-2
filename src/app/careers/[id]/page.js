'use client';
import { CAREERS_DATA } from "@/services/const";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

export default function CareerDetailPage() {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const job = CAREERS_DATA.find(item => item.id === id);
  
  // Get sections first to determine initial state
  const getQualificationSections = () => {
    if (!job?.qualifications) return {};
    const parts = job.qualifications.split(/(?=## )/);
    const sections = {};
    parts.forEach(part => {
      if (part.trim() && part.startsWith('## ')) {
        const lines = part.split('\n');
        const titleLine = lines[0].replace(/^##\s+/, '').trim();
        const content = lines.slice(1).join('\n').trim();
        if (titleLine && content) {
          const key = titleLine.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          sections[key] = {
            title: titleLine,
            content: parseMarkdown(part)
          };
        }
      }
    });
    return sections;
  };

  const getAboutSections = () => {
    if (!job?.about) return {};
    const parts = job.about.split(/(?=## )/);
    const sections = {};
    parts.forEach(part => {
      if (part.trim() && part.startsWith('## ')) {
        const lines = part.split('\n');
        const titleLine = lines[0].replace(/^##\s+/, '').trim();
        const content = lines.slice(1).join('\n').trim();
        if (titleLine && content) {
          const key = titleLine.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          sections[key] = {
            title: titleLine,
            content: parseMarkdown(part)
          };
        }
      }
    });
    return sections;
  };

  const parseMarkdown = (text) => {
    if (!text) return "";
    return marked(text);
  };

  const qualificationSections = job ? getQualificationSections() : {};
  const aboutSections = job ? getAboutSections() : {};
  
  // Determine initial section
  const getInitialSection = () => {
    const qualKeys = Object.keys(qualificationSections);
    if (qualKeys.length > 0) return qualKeys[0];
    const aboutKeys = Object.keys(aboutSections);
    if (aboutKeys.length > 0) return aboutKeys[0];
    return "responsibilities";
  };
  
  const [activeSection, setActiveSection] = useState(getInitialSection());
  const sectionRefs = useRef({});
  
  if (!job) {
    return (
      <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#414651] mb-4">Job not found</h1>
          <Link href="/careers" className="text-[#1D74D6] hover:underline">
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }


  // Get category color (matching ViralCard style - text only, no background)
  const getCategoryColor = (industry) => {
    const colors = {
      "AI/ML": "text-[#3538cd]",
      "ENGINEERING": "text-[#026AA2]",
      "MARKETING": "text-[#C11574]",
    };
    const label = industry?.toUpperCase() || "";
    return colors[label] || "text-[#C11574]";
  };

  // Section icons mapping
  const sectionIcons = {
    "minimum-qualifications": "mdi:magnify",
    "preferred-qualifications": "mdi:plus-box",
    "about-the-role": "mdi:cog",
    "how-we-work": "mdi:chat-outline",
    "what-success-looks-like": "mdi:chart-line",
    "how-to-apply": "mdi:email-outline",
    "responsibilities": "mdi:clipboard-list-outline",
  };

  // Navigation items
  const navItems = [
    ...Object.keys(qualificationSections).map(key => ({
      id: key,
      label: qualificationSections[key].title,
      type: 'qualification'
    })),
    ...Object.keys(aboutSections).map(key => ({
      id: key,
      label: aboutSections[key].title,
      type: 'about'
    })),
    {
      id: "responsibilities",
      label: "Responsibilities",
      type: 'responsibility'
    }
  ];

  const scrollContainerRef = useRef(null);

  // Scroll to section handler
  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    const container = scrollContainerRef.current;
    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const targetScroll = scrollTop + elementRect.top - containerRect.top - 100; // 100px offset
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Track scroll position to highlight active section
  useEffect(() => {
    if (navItems.length === 0) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportOffset = 200; // Offset from top of viewport for detection
      const detectionPoint = scrollTop + viewportOffset;
      
      // Find the section that's currently in view
      let currentSection = navItems[0]?.id;
      
      // Check each section to see if it's in view (check from bottom to top)
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const element = sectionRefs.current[item.id];
        if (element) {
          // Get the container's bounding rect
          const containerRect = container.getBoundingClientRect();
          // Get the element's bounding rect
          const elementRect = element.getBoundingClientRect();
          
          // Calculate element's absolute position from top of scrollable content
          // elementRect.top is relative to viewport, containerRect.top is container's position in viewport
          // scrollTop is how much we've scrolled
          const elementAbsoluteTop = elementRect.top - containerRect.top + scrollTop;
          
          // Check if section has passed the detection point
          if (detectionPoint >= elementAbsoluteTop) {
            currentSection = item.id;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    // Initial check after a short delay to ensure refs are set
    const timeoutId = setTimeout(handleScroll, 300);
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [navItems.length]);

  // Get section content
  const getSectionContent = (sectionId) => {
    if (sectionId === "responsibilities") {
      return parseMarkdown(job.responsibilities || "");
    }
    if (qualificationSections[sectionId]) {
      return qualificationSections[sectionId].content;
    }
    if (aboutSections[sectionId]) {
      return aboutSections[sectionId].content;
    }
    return "";
  };

  // Extract job title and subtitle
  const getJobTitleParts = () => {
    const match = job.vacancy.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return { title: match[1], subtitle: match[2] };
    }
    return { title: job.vacancy, subtitle: null };
  };

  const { title: jobTitle, subtitle } = getJobTitleParts();

  return (
    <div 
      ref={scrollContainerRef}
      className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen relative bg-[#EAECFB] overflow-auto'
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
        {/* Main Content */}
        <div className='flex-1 flex flex-col items-center p-4 md:p-6 lg:p-8 py-6 md:py-8'>
          <div className='w-full max-w-7xl'>
            {/* Top Navbar */}
            <div className='flex justify-between items-center relative mb-6 md:mb-8'>
              <div className='flex items-center justify-center gap-2'>
                <img src="/images/logo.png" alt="Logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
                <h1 className='text-base md:text-[18px] font-extrabold text-[#2B425B]'>Held Accountable</h1>
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
                <Link href="#blog" className='text-[rgba(43, 66, 91, 1)] text-sm xl:text-[14px] leading-[30px]'>
                  Blog
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

            {/* Header Section */}
            <div className="mb-6 md:mb-8">
              <Link 
                href="/careers" 
                className="inline-flex items-center gap-2 text-[#414651] hover:text-[#1D74D6] mb-4 md:mb-6 transition-colors"
              >
                <Icon icon="mdi:arrow-left" width={18} height={18} className="md:w-5 md:h-5" />
                <span className="text-xs md:text-sm font-medium">Back</span>
              </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#414651] mb-2">
                {jobTitle}
              </h1>
              {subtitle && (
                <p className="text-base md:text-lg text-[#98A2B3] mb-3 md:mb-4">{subtitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-[10px] md:text-[11px] lg:text-sm font-medium ${getCategoryColor(job.industry)}`}>
                  {job.industry?.toUpperCase() || ""}
                </span>
                <span className="text-[10px] md:text-[11px] lg:text-sm text-[#98A2B3] hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5 text-[#98A2B3] text-[10px] md:text-[11px] lg:text-sm font-medium">
                  <Icon icon="tabler:briefcase" width={12} height={12} className="md:w-3.5 md:h-3.5" />
                  <span>{job.type?.toUpperCase() || ""}</span>
                </div>
                <span className="text-[10px] md:text-[11px] lg:text-sm text-[#98A2B3] hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5 text-[#98A2B3] text-[10px] md:text-[11px] lg:text-sm font-medium">
                  <Icon icon="mdi:account-outline" width={12} height={12} className="md:w-3.5 md:h-3.5" />
                  <span>{job.location?.toUpperCase() || ""}</span>
                </div>
              </div>
            </div>
            <button className="gradient-button text-white text-xs md:text-[13px] w-full md:w-auto mt-0 md:mt-[48px] px-4 md:px-6 py-3 md:py-4 rounded-[24px]">
              Contact Us
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* Left Sidebar - Navigation */}
          <div className="lg:w-auto flex-shrink-0">
            <nav className="sticky top-4 md:top-8">
              <div className="flex flex-row lg:flex-col items-start overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 md:mx-0 px-4 md:px-0 text-sm md:text-base lg:text-[18px] leading-[20px] md:leading-[24px]">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex-shrink-0 whitespace-nowrap border-b lg:border-l lg:border-b-0 border-[#2B425B20] pl-4 md:pl-8 lg:pl-[40px] pr-4 md:pr-6 lg:pr-[40px] py-2 md:py-[10px] transition-colors ${
                      activeSection === item.id
                        ? "border-[#3D83FF] text-[#3D83FF]"
                        : "text-[#2B425B]"
                    }`}
                  >
                    {item.label.replace(/:/g, '')}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="p-4 md:p-6 lg:p-8 space-y-8 md:space-y-10 lg:space-y-12">
              {/* Render all qualification sections */}
              {Object.keys(qualificationSections).map((key) => (
                <div
                  key={key}
                  id={key}
                  ref={(el) => (sectionRefs.current[key] = el)}
                  className="scroll-mt-8"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-[#F7F8FF] flex-shrink-0">
                      <Icon 
                        icon={sectionIcons[key] || "mdi:file-document-outline"} 
                        width={20} 
                        height={20} 
                        className="md:w-6 md:h-6 text-[#1D74D6]"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold text-[#414651] mb-3 md:mb-4">
                        {qualificationSections[key].title}
                      </h2>
                      <div 
                        className="prose prose-sm max-w-none text-[#535862] leading-relaxed career-detail-content"
                        dangerouslySetInnerHTML={{ __html: qualificationSections[key].content }}
                        style={{
                          lineHeight: '1.75'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Render all about sections */}
              {Object.keys(aboutSections).map((key) => (
                <div
                  key={key}
                  id={key}
                  ref={(el) => (sectionRefs.current[key] = el)}
                  className="scroll-mt-8"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-[#F7F8FF] flex-shrink-0">
                      <Icon 
                        icon={sectionIcons[key] || "mdi:file-document-outline"} 
                        width={20} 
                        height={20} 
                        className="md:w-6 md:h-6 text-[#1D74D6]"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold text-[#414651] mb-3 md:mb-4">
                        {aboutSections[key].title}
                      </h2>
                      <div 
                        className="prose prose-sm max-w-none text-[#535862] leading-relaxed career-detail-content"
                        dangerouslySetInnerHTML={{ __html: aboutSections[key].content }}
                        style={{
                          lineHeight: '1.75'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Render responsibilities section */}
              {job.responsibilities && (
                <div
                  id="responsibilities"
                  ref={(el) => (sectionRefs.current["responsibilities"] = el)}
                  className="scroll-mt-8"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-[#F7F8FF] flex-shrink-0">
                      <Icon 
                        icon={sectionIcons["responsibilities"] || "mdi:file-document-outline"} 
                        width={20} 
                        height={20} 
                        className="md:w-6 md:h-6 text-[#1D74D6]"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold text-[#414651] mb-3 md:mb-4">
                        Responsibilities
                      </h2>
                      <div 
                        className="prose prose-sm max-w-none text-[#535862] leading-relaxed career-detail-content"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(job.responsibilities) }}
                        style={{
                          lineHeight: '1.75'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* Footer */}
        <footer className='w-full border-t border-[#E9EAEB] bg-[#f7f8ff80] py-6 md:py-8 px-4 md:px-6 lg:px-12 z-[1]'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 w-full'>
            {/* Logo */}
            <div className='flex items-center justify-center gap-2'>
              <img src="/images/logo.png" alt="Logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
              <h1 className='text-base md:text-[18px] font-extrabold text-[#2B425B]'>Held Accountable</h1>
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

