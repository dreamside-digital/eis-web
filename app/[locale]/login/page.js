import LoginForm from "@/components/LoginForm"

export default async function LoginPage({params}) {
  const { locale } = await params

  return (
    <section className="text-dark p-6 py-12 pt-20 relative flex-1">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-full w-full">
      </div>
      <div className="container max-w-screen-xl mx-auto relative flex justify-center pt-6">
        <div className="p-6 w-full max-w-xl bg-beige text-dark ">
          <LoginForm locale={locale} />
        </div>
      </div>
    </section>
  )
}