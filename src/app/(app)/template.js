import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSideBar";
import { Page } from "@/models/Page";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connectToDatabase } from "@/lib/mongoClient";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function AppTemplate({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }

  let page = null;
  try {
    await connectToDatabase();
    page = await Page.findOne({ owner: session.user.email });
  } catch (error) {
    console.error('Error loading page data:', error);
  }

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '14px',
          },
        }}
      />
      <main className="md:flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Mobile Navigation Toggle */}
        <label
          htmlFor="navCb"
          className="md:hidden fixed top-4 left-4 p-2.5 rounded-xl bg-slate-900 shadow-lg inline-flex items-center gap-2 cursor-pointer z-50 hover:bg-slate-800 transition-colors">
          <FontAwesomeIcon icon={faBars} className="text-white text-sm" />
          <span className="text-xs font-medium text-slate-300">Menu</span>
        </label>

        <input type="checkbox" id="navCb" className="hidden peer" />

        {/* Backdrop */}
        <label
          htmlFor="navCb"
          aria-label="Close navigation"
          className="backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300"
        ></label>

        {/* Sidebar */}
        <aside className="bg-slate-900 peer-checked:left-0 w-64 p-5 pt-6 shadow-2xl fixed md:sticky md:top-0 md:h-screen -left-64 md:left-0 top-0 bottom-0 z-50 transition-all duration-300 ease-in-out flex flex-col sidebar-scroll overflow-y-auto">
          {/* Close button for mobile */}
          <label
            htmlFor="navCb"
            aria-label="Close navigation"
            className="md:hidden absolute top-4 right-4 p-2 cursor-pointer hover:bg-white/10 rounded-lg transition-colors z-50"
          >
            <svg aria-hidden="true" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close navigation</span>
          </label>

          {/* User Section */}
          <div className="pt-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-slate-900 overflow-hidden shadow-lg mb-3">
                {session.user?.image ? (
                  <Image
                    className="w-full h-full object-cover"
                    src={session.user.image}
                    alt="avatar"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {session.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
              {page && (
                <div className="text-center">
                  <h3 className="font-semibold text-white text-sm">{session.user.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">{session.user.email}</p>
                </div>
              )}
            </div>

            <AppSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="relative z-0 grow p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </>
  );
}