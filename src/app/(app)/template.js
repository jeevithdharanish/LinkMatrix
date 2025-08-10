// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import AppSidebar from "@/components/layout/AppSideBar";
// import { Page } from "@/models/page";
// import { faBars, faLink } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import mongoose from "mongoose";
// import { getServerSession } from "next-auth";
// import Image from "next/image";
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import { Toaster } from "react-hot-toast";

// export default async function AppTemplate({ children, ...rest }) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return redirect('/');
//   }
  
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     const page = await Page.findOne({ owner: session.user.email });
    
//     return (
//       <>
//         <Toaster />
//         <main className="md:flex min-h-screen ">
//           {/* Mobile Navigation Toggle */}
//           {/* <label htmlFor="navCb" className="md:hidden fixed top-4 left-4 p-3 rounded-lg bg-white shadow-lg inline-flex items-center gap-2 cursor-pointer z-30 hover:bg-gray-50 transition-colors">
//             <FontAwesomeIcon icon={faBars} className="text-gray-700" />
//             <span className="text-sm font-medium text-gray-700">Menu</span>
//           </label> */}
          
//           {/* Hidden Checkbox */}
//           <input id="navCb" type="checkbox" className="hidden" />
          
//           {/* Backdrop */}
//           <label htmlFor="navCb" className="backdrop fixed inset-0 bg-black/50 z-20 md:hidden opacity-0 invisible transition-all duration-300"></label>
          
//           {/* Sidebar */}
//           <aside className="bg-white w-64 p-4 pt-6 shadow-xl fixed md:static -left-64 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out md:translate-x-0">
//             {/* Close button for mobile */}
//             <label htmlFor="navCb" className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
//               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </label>
            
//             <div className="sticky top-6 pt-6">
//               <div className="aspect-square w-24 h-24 mx-auto relative -top-8 -mb-10">
//                 <Image
//                   className="rounded-full w-full h-full object-cover border-4 border-gray-100"
//                   src={session.user.image}
//                   alt={'avatar'}
//                   width={256} height={256} />
//               </div>
//               <div className="text-center">
//                 <h3 className="font-semibold text-gray-800  mt-4">{session.user.name}</h3>
                
//                 <AppSidebar />
//               </div>
//             </div>
//           </aside>
          
//           {/* Main Content */}
//           <div className="grow md:ml-0 pt-16 md:pt-0">
//             {children}
//           </div>
//         </main>
//       </>
//     );
//   } catch (error) {
//     console.error('Database connection error:', error);
//     return redirect('/');
//   }
// }


import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSideBar";
import { Page } from "@/models/page";
import { faBars, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function AppTemplate({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({ owner: session.user.email });
  
  return (
    <>
      <Toaster />
      <main className="md:flex min-h-screen ">
        {/* Mobile Navigation Toggle */}
        <label 
          htmlFor="navCb" 
          className="md:hidden fixed top-4 left-4 p-3 rounded-lg bg-white shadow-lg inline-flex items-center gap-2 cursor-pointer z-50 hover:bg-gray-50 transition-colors">
          <FontAwesomeIcon icon={faBars} className="text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Menu</span>
        </label>
        
        <input type="checkbox" id="navCb" className="hidden peer" />

        
        <label htmlFor="navCb" className="backdrop fixed inset-0 bg-black/50 z-40 md:hidden opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300"></label>
        
        <aside className="bg-white peer-checked:left-0 w-64 p-4 pt-6 shadow-xl fixed md:static -left-64 top-0 bottom-0 z-50  transition-all duration-300 ease-in-out">
  {/* Close button for mobile */}
  <label
  htmlFor="navCb"
  className="md:hidden absolute top-4 right-4 p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors z-50 pointer-events-auto"
>
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</label>


  <div className="sticky top-6 pt-6">
    <div className="aspect-square w-24 h-24 mx-auto relative -top-8 -mb-10">
      <Image
        className="rounded-full w-full h-full object-cover border-4 border-gray-100"
        src={session.user.image}
        alt="avatar"
        width={256}
        height={256}
      />
    </div>

    {page && (
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 mt-4">{session.user.name}</h3>
      </div>
    )}

    <div className="text-center">
      <AppSidebar />
    </div>
  </div>
</aside>

        
        <div className="relative z-0 grow p-4 pt-20 md:p-8">
          {children}
        </div>
      </main>
    </>
  );
}