import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/features/portfolio/page-forms/HeroForm";
import { getServerSession } from "next-auth";
import Header from "@/components/layout/Header"
import ParticleNetwork from "@/components/animations/ParticleNetwork";
import Typewriter from "@/components/animations/Typewriter";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <Header />
      <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <ParticleNetwork className="opacity-40 dark:opacity-60" />
        </div>

        <section className="px-6 max-w-3xl mx-auto text-center py-20">
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Your one <span className="inline-block text-left w-[140px] md:w-[270px]"><Typewriter words={['link', 'portfolio', 'page']} speed={120} delay={2000} className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent" /></span><br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                for everything
              </span>
            </h1>
            <h2 className="text-gray-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Share your links, social profiles, contact info and more on one page
            </h2>
          </div>
          <HeroForm user={session?.user} />
        </section>
      </div>
    </main>
  )
}
