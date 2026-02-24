import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HeroForm from "@/components/forms/HeroForm";
import Header from "@/components/Header";

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
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl animate-pulse-soft delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl" />
        </div>

        <section className="px-6 max-w-3xl mx-auto text-center py-20">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Build your digital identity
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
              One page to show<br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                who you are
              </span>
            </h1>
            <h2 className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Showcase your projects, skills, experience, and links — all on a single, stunning portfolio page
            </h2>
          </div>
          <HeroForm />
        </section>
      </div>
    </>
  );
}
