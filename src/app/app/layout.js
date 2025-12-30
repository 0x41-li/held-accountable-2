'use client';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import TrendingEventsBar from "@/components/common/TrendingEventsBar";

export default function AppLayout({ children }) {
  return <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
    <TrendingEventsBar />
    <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex">
        <Sidebar />
        <Navbar />
        </div>
        <div className='flex-1 h-full flex flex-col'>
        <div className='flex-1'>
            {children}
        </div>
        </div>
    </div>
    </div>;
}