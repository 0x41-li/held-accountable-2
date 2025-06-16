import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { AuthProvider } from "@/providers/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Held Accountable",
  description: "Held Accountable",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthProvider>
          <ToastContainer />
          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col md:flex-row">
              <div className="flex">
                <Sidebar />
                <Navbar />
              </div>
              <div className='flex-1 md:pt-[12px] overflow-auto h-full'>
                {children}
              </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
