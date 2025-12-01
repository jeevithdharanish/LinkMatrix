
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
            <span className="font-bold">LinkMate</span>
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
              <Link href="/main/login" className="hover:text-blue-500 hover:scale-110 transition-all duration-200">
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}