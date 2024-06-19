import { Poppins } from "next/font/google";
import localFont from 'next/font/local';

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });
const monarque = localFont({
  src: [
    {
      path: '../fonts/Monarque-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Monarque-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/Monarque-SemiBold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Monarque-SemiBoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: "--font-title"
})

import "./globals.css";

export const metadata = {
  title: "Editions in Space",
  description: "Discover culture based on proximity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} ${monarque.variable} font-light leading-normal`}>{children}</body>
    </html>
  );
}
