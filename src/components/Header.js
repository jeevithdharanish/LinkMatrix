
'use client';
import LogoutButton from "@/components/buttons/LogoutButton";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-5xl flex justify-between items-center mx-auto px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faLink} className="text-white text-sm" />
          </div>
          <span className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
            LinkMate
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          {!!session && (
            <>
              <Link
                href="/account"
                className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium">
                Hello, {session?.user?.name || session?.user?.email || 'Guest'}
              </Link>
              <LogoutButton
                className="text-sm text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
                iconClasses="text-xs"
              />
            </>
          )}
          {!session && (
            <Link
              href="/main/login"
              className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}