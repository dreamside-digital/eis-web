import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import Image from "next/image";
import Link from "next/link";


export default function Footer({ logo }) {
  
  return (
    <section className="bg-dark">
      <div className="container max-w-screen-xl mx-auto px-4 py-12 md:py-20 text-light">
        <div className="md:flex mb-12 md:mb-4">
          <div className="flex-1 mb-8">
            <div className="text-3xl mb-2">{footerCol1Parts.join(" ")} <span className="font-title italic tracking-wide">{footerCol1LastWord}</span></div>
            <div>
              <a href={translation.footer_column_1_link} className="underline text-xl hover:text-highlight">
                {translation.footer_column_1_link_text}
              </a>
            </div>
          </div>

          <div className="flex-1 mb-8 text-right">
            <div className="text-3xl mb-2">{footerCol2Parts.join(" ")} <span className="font-title italic tracking-wide">{footerCol2LastWord}</span></div>
            <div>
              <a href={translation.footer_column_2_link} className="underline text-xl hover:text-highlight">
                {translation.footer_column_2_link_text}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-between">
          <div className="flex gap-4 uppercase text-lg">
            <a href="https://www.instagram.com/editionsinspace/" target="_blank" className="underline hover:text-highlight">Instagram</a>
          </div>

          <div>
            <p>{translation.copyright}</p>
          </div>
        </div>
        
      </div>
    </section>
  )
}
