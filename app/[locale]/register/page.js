import RegistrationForm from "@/components/RegistrationForm"


export default async function RegistrationPage({params}) {
  const {locale} = await params;
  return (
    <section className="bg-white text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full">
      </div>
      <div className="container max-w-screen-xl mx-auto relative flex justify-center pt-6">
        <div className="p-6 w-full max-w-xl bg-beige text-dark ">
          <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">Registration</h1>
          <RegistrationForm locale={locale} />
        </div>
      </div>
    </section>
  )
}