// 'use client';

// import LogoutButton from "@/components/buttons/LogoutButton";
// import {faLink} from "@fortawesome/free-solid-svg-icons";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {useSession} from "next-auth/react";
// import Link from "next/link";

// export default function Header() {
//   const {data: session, status} = useSession();
  
//   return (
//     <header className="bg-white border-b shadow-lg py-4 ">
//       <div className="max-w-4xl flex justify-between mx-auto mt-8 px-6">
//         <div className="flex items-center gap-6">
//           <Link href={'/'} className="flex items-center gap-2 text-blue-500">
//             <FontAwesomeIcon icon={faLink} className="text-blue-500 text-xl" />
//             <span className="font-bold">LinkMatrix</span>
//           </Link>
//         </div>
//         <nav className="flex items-center gap-6 text-sm text-slate-500">
//           {status === 'loading' ? (
//             <div>Loading...</div>
//           ) : session ? (
//             <>
//               <Link href={'/account'} className="hover:text-blue-500 transition duration-200 font-medium">
//                 Hello, {session?.user?.name}
//               </Link>
//               <LogoutButton />
//             </>
//           ) : (
//             <>
//               <Link href={'/login'} className="hover:text-blue-500 transition duration-200 font-medium">Sign In</Link>
//               <Link href={'/register'} className="hover:text-blue-500 transition duration-200 font-medium">
//                 <span className="bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 font-semibold">Create Account</span>
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }

'use client';
import LogoutButton from "@/components/buttons/LogoutButton";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSession} from "next-auth/react";
import Link from "next/link";

export default function Header() {
   const {data: session, status} = useSession();

  return (
    <header className="bg-white border-b shadow-lg py-4 ">
      <div className="max-w-4xl flex justify-between mx-auto px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-blue-500">
            <FontAwesomeIcon icon={faLink} className="text-blue-500 text-xl" />
            <span className="font-bold">LinkMatrix</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-500">
          {!!session && (
            <>
              <Link
                href="/account"
                className="cursor-pointer hover:scale-110 transition-transform duration-200">
                Hello, {session?.user?.name || session?.user?.email || 'Guest'}
              </Link>
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              <Link href="/main/login" className="hover:text-blue-500 transition-colors hover:scale-110 transition-transform duration-200">
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}