import { Poppins } from "next/font/google";
import localFont from 'next/font/local';
import Navigation from '@/components/Navigation'
import { getLayoutContent } from '@/utils/directus'
import Image from 'next/image'

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

export default async function RootLayout({ children }) {
  const content = await getLayoutContent()
  const { translations } = content;
  const lang = "en"
  const translation = translations.find(t => t.languages_code === lang)
  const logoImg = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${content.logo}`
  const ccaImg = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${content.CCA_logo}`
  const footerCol1Parts = translation.footer_column_1_title.split(" ")
  const footerCol2Parts = translation.footer_column_2_title.split(" ")
  const footerCol1LastWord = footerCol1Parts.splice(-1).join(" ")
  const footerCol2LastWord = footerCol2Parts.splice(-1).join(" ")

  return (
    <html lang="en" className="scroll-smooth" id="root">
      <body className={`${poppins.className} ${monarque.variable} font-light leading-normal flex min-h-screen flex-col relative`}>
        <Navigation logo={logoImg} />
        <main className="grow">
          {children}
        </main>
        <footer className="bg-dark">
          <div className="container max-w-screen-xl mx-auto px-4 py-12 md:py-20 text-light">
            <div className="lg:grid grid-cols-3 gap-24">
              <div className="mb-8">
                <div className="text-2xl lg:text-3xl mb-4">{footerCol1Parts.join(" ")} <span className="font-title italic tracking-wide">{footerCol1LastWord}</span></div>
                <div>
                  <a href={translation.footer_column_1_link} className="underline lg:text-lg hover:text-white">
                    {translation.footer_column_1_link_text}
                  </a>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-2xl lg:text-3xl mb-4">{footerCol2Parts.join(" ")} <span className="font-title italic tracking-wide">{footerCol2LastWord}</span></div>
                <div>
                  <p><a href={translation.footer_column_2_link} className="underline lg:text-lg hover:text-white">
                    {translation.footer_column_2_link_text}
                  </a></p>
                  <p>
                  <a href="https://www.instagram.com/editionsinspace/" target="_blank" className="underline lg:text-lg hover:text-white">Follow on Instagram</a>
                  </p>
                </div>
              </div>

              <div className="mb-8 ">
                <div className="lg:text-lg mb-4">{translation.funding_credit}</div>
                <div>
                  <Image
                    src={ccaImg}
                    height={60}
                    width={280}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-between">
              <p>{translation.copyright}</p>
            </div>
            
          </div>
        </footer>
      </body>
    </html>
  );
}
