import { Poppins } from "next/font/google";
import localFont from 'next/font/local';
import Navigation from '@/components/Navigation'
import { getLayoutContent } from '@/utils/directus'

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
  const footerCol1Parts = translation.footer_column_1_title.split(" ")
  const footerCol2Parts = translation.footer_column_2_title.split(" ")
  const footerCol1LastWord = footerCol1Parts.splice(-1).join(" ")
  const footerCol2LastWord = footerCol2Parts.splice(-1).join(" ")

  return (
    <html lang="en" className="scroll-smooth" id="root">
      <body className={`${poppins.className} ${monarque.variable} font-light leading-normal`}>
        <main className="flex min-h-screen flex-col">
          <Navigation logo={logoImg} />
          <div className="grow">
            {children}
          </div>
          <section className="bg-navy">
            <div className="container mx-auto px-4 py-12 md:py-24 text-beige">
              <div className="md:flex mb-12 md:mb-4">
                <div className="flex-1 mb-8">
                  <div className="text-4xl">{footerCol1Parts.join(" ")} <span className="font-title italic">{footerCol1LastWord}</span></div>
                  <div>
                    <a href={translation.footer_column_1_link} className="underline text-2xl hover:text-white">
                      {translation.footer_column_1_link_text}
                    </a>
                  </div>
                </div>

                <div className="flex-1 mb-8 text-right">
                  <div className="text-4xl">{footerCol2Parts.join(" ")} <span className="font-title italic">{footerCol2LastWord}</span></div>
                  <div>
                    <a href={translation.footer_column_2_link} className="underline text-2xl hover:text-white">
                      {translation.footer_column_2_link_text}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-between">
                <div className="flex gap-4 uppercase text-xl">
                  <a href="https://www.instagram.com/editionsinspace/" target="_blank" className="underline hover:text-white">Instagram</a>
                </div>

                <div>
                  <p>{translation.copyright}</p>
                </div>
              </div>
              
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
