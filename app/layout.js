import { Poppins } from "next/font/google";
import localFont from 'next/font/local';
import Navigation from '@/components/Navigation'

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
    <html lang="en" className="scroll-smooth" id="root">
      <body className={`${poppins.className} ${monarque.variable} font-light leading-normal`}>
        <main className="flex min-h-screen flex-col">
          <Navigation />
          <div className="grow">
            {children}
          </div>
          <section className="bg-navy">
            <div className="container mx-auto px-4 py-12 md:py-24 text-beige">
              <div className="md:flex mb-12 md:mb-4">
                <div className="flex-1 mb-8">
                  <div className="text-4xl">To <span className="font-title italic">collaborate</span></div>
                  <div><a href="mailto:info@editionsinspace.com" className="underline text-2xl hover:text-white">Contact us</a></div>
                </div>

                <div className="flex-1 mb-8">
                  <div className="text-4xl">For <span className="font-title italic">updates</span></div>
                  <div><a href="#subscribe" className="underline text-2xl hover:text-white">Subscribe</a></div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-between">
                <div className="flex gap-4 uppercase text-xl">
                  <a href="#" className="underline hover:text-white">FAQ</a>
                  <a href="https://www.instagram.com/editionsinspace/" target="_blank" className="underline hover:text-white">Instagram</a>
                </div>

                <div>
                  <p>© 2024, Project by Prachi Khandekar</p>
                </div>
              </div>
              
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
