import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Head from "next/head";
import { AuthProvider } from "@/providers/authProvider";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata = {
  title: "Held Accountable",
  description: "Held Accountable",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
<html lang="en">
  <Script
    strategy="afterInteractive"
    src="https://www.googletagmanager.com/gtag/js?id=G-8EGYR63CEH"
  />
  <Script
    id="gtag-init"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-8EGYR63CEH');
      `,
    }}
  />
  <body
    className={`antialiased`}
  >
    <AuthProvider>
      <ToastContainer />
      {/* Gradient Ellipses Background */}
      <div className="fixed top-0 left-0 right-0 bottom-0 inset-0 overflow-hidden pointer-events-none mainbg">
        <img src="/images/tl.png" className="absolute top-0 left-0" />
        <img src="/images/tr.png" className="absolute top-0 right-0" />
        <img src="/images/br.png" className="absolute bottom-0 right-0" />
      </div>
      {children}
    </AuthProvider>
  </body>
</html>
  );
}
