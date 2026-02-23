import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import { getServerSession } from "next-auth";
import Header from "@/components/Header"

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <Header />
      <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl animate-pulse-soft delay-1000" />
        </div>

        <section className="px-6 max-w-3xl mx-auto text-center py-20">
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Your one link<br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                for everything
              </span>
            </h1>
            <h2 className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Share your links, social profiles, contact info and more on one page
            </h2>
          </div>
          <HeroForm user={session?.user} />
        </section>
      </div>
    </main>
  )
}
