import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="container mx-auto p-6 flex justify-between">
        <div><h1 className="font-title text-navy text-2xl max-w-sm">éditions in space</h1></div>
        <div className="flex gap-6 items-center justify-end">
          <a href="#subscribe" className="text-navy text-lg uppercase">Join our artist network</a>
          <a href="https://www.instagram.com">
            <Image
                  className="relative"
                  src="/images/instagram.svg"
                  alt="Instagram"
                  width={30}
                  height={30}
                  priority
                />
          </a>
        </div>
      </nav>

      <section className="bg-beige h-[80vh] bg-[url('/images/Asset-6.png')] bg-no-repeat bg-right-bottom bg-[length:60%]">
        <div className="container mx-auto py-24 flex gap-8 lg:gap-12 h-full items-center">
          <div className="flex-1">
            <h2 className="font-title text-center text-6xl text-navy">Discover culture based on proximity</h2>
          </div>
          <div className="flex-1">
            <div className="flex justify-center">
              <Image
                className="h-[75vh] w-auto object-fit translate-y-28"
                src="/images/phone-mockup.png"
                alt="GIF of website"
                width={444}
                height={884}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy text-beige">
        <div className="container mx-auto py-24">
          <h2 className="uppercase text-5xl font-medium mb-8">Vision</h2>
          <div className="flex gap-8 lg:gap-12">
            <div className="flex-1">
              <p className="text-3xl">We dream of closer ties between art and communities that surround its production.</p>
            </div>
            <div className="flex-1">
              <p className="text-lg">Editions in Space is a mapping initiative. It enables location-based discovery of artist profiles, events, and other creative content. Join our growing artist network to be visible at the neighbourhood scale!</p>
            </div>
          </div>
        </div>
        
      </section>

      <section className="bg-white text-navy">
        <div className="container mx-auto py-24">
          <p className="max-w-md mx-auto text-3xl text-center mb-12">Find artists and events in your community</p>
          <div className="relative max-w-3xl mx-auto">
            <Image
              className="w-full h-auto"
              src="/images/laptop-mockup.png"
              alt="laptop"
              width={1800}
              height={1043}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center font-title font-medium text-4xl text-navy">
              <div>Music</div>
              <div>Visual</div>
              <div>Performance</div>
              <div>Experimental</div>
              <div>Literary</div>
              <div>Media</div>
            </div>
          </div>
        
          <div className="mt-24">
            <h2 className="uppercase text-5xl mb-8 text-center font-medium">Key features</h2>
            <ul className="flex gap-8 lg:gap-12">
              <li className="flex-1 flex flex-col items-center">
                <p className="uppercase text-2xl text-center mb-4">Artist<br/>profiles</p>
                <Image
                  className="relative"
                  src="/images/Asset-7.png"
                  alt="Collage"
                  width={220}
                  height={220}
                />
              </li>

              <li className="flex-1 flex flex-col items-center">
                <p className="uppercase text-2xl text-center mb-4">Event<br/>listings</p>
                <Image
                  className="relative"
                  src="/images/Asset-8.png"
                  alt="Berries"
                  width={220}
                  height={220}
                />
              </li>

              <li className="flex-1 flex flex-col items-center">
                <p className="uppercase text-2xl text-center mb-4">Special<br/>editions</p>
                <Image
                  className="relative"
                  src="/images/Asset-1.png"
                  alt="Flower"
                  width={220}
                  height={220}
                />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="subscribe" className="bg-white text-aubergine">
        <div className="container mx-auto pb-24">
          <div className="bg-lavendar rounded-xl p-16 container mx-auto">
            <div className="flex gap-8 lg:gap-12">
              <div className="flex-1">
                <h2 className="uppercase text-5xl mb-8 mt-8 font-medium">Join our network</h2>
              </div>
              <div className="flex-1 min-h-[734px]">
                <iframe className="h-full w-full" src="https://cdn.forms-content-1.sg-form.com/8a1a9e4a-2f29-11ef-b521-e2837eaeccec"/>
              </div>
{/*              <form action="" className="flex-1">
                <div className="mb-4">
                  <label htmlFor="first-name" className="block text-sm leading-6 text-aubergine">First name</label>
                  <div className="mt-1">
                    <input type="text" name="first-name" id="first-name" autocomplete="given-name" className="block w-full rounded-md border-0 py-1.5 text-aubergine shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="last-name" className="block text-sm leading-6 text-aubergine">Last name</label>
                  <div className="mt-1">
                    <input type="text" name="last-name" id="last-name" autocomplete="family-name" className="block w-full rounded-md border-0 py-1.5 text-aubergine shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="pronouns" className="block text-sm leading-6 text-aubergine">Pronouns</label>
                  <div className="mt-1">
                    <input type="text" name="pronouns" id="pronouns" className="block w-full rounded-md border-0 py-1.5 text-aubergine shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm leading-6 text-aubergine">Email address</label>
                  <div className="mt-1">
                    <input id="email" name="email" type="email" autocomplete="email" className="block w-full rounded-md border-0 py-1.5 text-aubergine shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="country" className="block text-sm leading-6 text-aubergine">Your artistic discipline</label>
                  <div className="mt-1">
                    <select id="country" name="country" autocomplete="country-name" className="block w-full rounded-md border-0 py-1.5 text-aubergine shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                      <option>Visual art</option>
                      <option>Performance art</option>
                      <option>Writing</option>
                      <option>Digital media</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                  <button type="submit" className="rounded-md bg-aubergine px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send</button>
                </div>
              </form>*/}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige">
        <div className="container mx-auto py-24">
          <h2 className="font-title text-6xl text-aubergine mb-10">Origin Story</h2>
          <div className="flex gap-12">
            <div className="flex-1">
              <div>
                <Image
                  className="relative w-full h-full object-cover rounded-xl"
                  src="/images/Asset-9.png"
                  alt="Prachi Khandekar, founder of Editions in Space"
                  width={800}
                  height={800}
                />
              </div>
            </div>
            <div className="flex-1 text-aubergine">
              <p className="text-3xl mb-8 leading-relaxed">“As an independent artist and curator, I have experienced the limitations of the established channels for art promotion first-hand. My practice has evolved largely by presenting projects at unconventional venues and in novel formats and this platform was born out of me realizing the lack of location-based solutions for connecting audiences to art.”</p>
              <div>
                <p className="font-title text-4xl text-right mb-2">- Prachi Khandekar</p>
                <p className="text-right text-xl">Founder, Editions in Space</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white bg-[url('/images/Asset-12.png')] bg-no-repeat bg-cover bg-center">
        <div className="container mx-auto py-24 text-navy">
            <h2 className="font-title text-center text-6xl text-white max-w-lg mx-auto mb-48">Explore culture in your vicinity</h2>
            <ul className="flex gap-8 lg:gap-12">
              <li className="flex-1">
                <Image
                  className=""
                  src="/images/Asset-1.png"
                  alt="flower"
                  width={180}
                  height={180}
                />
                <p className="text-2xl mt-4">Residents can browse ephemeral and permanent art nearby</p>
              </li>

              <li className="flex-1">
                <Image
                  className=""
                  src="/images/Asset-1.png"
                  alt="flower"
                  width={180}
                  height={180}
                />
                <p className="text-2xl mt-4">Artists can post once and focus on art production</p>
              </li>

              <li className="flex-1">
                <Image
                  className=""
                  src="/images/Asset-1.png"
                  alt="flower"
                  width={180}
                  height={180}
                />
                <p className="text-2xl mt-4">Promoters can access relevant and invested audiences</p>
              </li>
            </ul>
        </div>
      </section>

      <section className="bg-navy">
        <div className="container mx-auto py-24 text-beige">
          <div className="flex mb-12">
            <div className="flex-1">
              <div className="text-4xl">To <span className="font-title italic">collaborate</span></div>
              <div><a href="mailto:info@editionsinspace.com" className="underline text-2xl">Contact us</a></div>
            </div>

            <div className="flex-1">
              <div className="text-4xl">For <span className="font-title italic">updates</span></div>
              <div><a href="#subscribe" className="underline text-2xl">Subscribe</a></div>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12 justify-between">
            <div className="flex gap-4 uppercase text-xl">
              <a href="#" className="underline">FAQ</a>
              <a href="https://www.instagram.com" target="_blank" className="underline">Instagram</a>
            </div>

            <div>
              <p>© 2024, Project by Prachi Khandekar</p>
            </div>
          </div>
          
        </div>
      </section>

    </main>
  );
}
