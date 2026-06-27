import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HeroForm from "@/components/features/portfolio/page-forms/HeroForm";
import Header from "@/components/layout/Header";
import ParticleNetwork from "@/components/animations/ParticleNetwork";
import Typewriter from "@/components/animations/Typewriter";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect('/account');
  }

  return (
    <>
      <Header />
      <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <ParticleNetwork className="opacity-40 dark:opacity-60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 dark:bg-indigo-950/20 rounded-full blur-3xl" />
        </div>

        <section className="px-6 max-w-3xl mx-auto text-center py-20">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Build your digital identity
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              One <span className="inline-block text-left w-[140px] md:w-[270px]"><Typewriter words={['page', 'portfolio', 'link']} speed={120} delay={2000} className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent" /></span><br />
              to show who you are
            </h1>
            <h2 className="text-gray-500 dark:text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Showcase your projects, skills, experience, and links — all on a single, stunning portfolio page
            </h2>
          </div>
          <HeroForm />
        </section>
      </div>
    </>
  );
}
