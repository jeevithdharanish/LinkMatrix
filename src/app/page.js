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
      <div className="mt-8 p-7 flex items-center justify-center overflow-hidden">
        <section className="px-6 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your one link<br />for everything
            </h1>
            <h2 className="text-gray-500 text-lg md:text-xl">
              Share your links, social profiles, contact info and more on one page
            </h2>
          </div>
          <HeroForm />
          
        </section>

      </div>
    </>
  );
}



