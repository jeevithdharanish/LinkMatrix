"use client"; 

import { faChartLine, faFileLines, faRightFromBracket,faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
    const path = usePathname();

    return (
        <nav className="inline-flex flex-col text-left mt-8 gap-6 w-full">
            <Link 
                href={'/account'}
                className={"flex gap-4 items-center p-2 rounded-md transition-colors " + (path.includes('/account') ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-100')}
            >
                <FontAwesomeIcon icon={faFileLines} className="w-6 h-6" />
                <span>My Page</span>
            </Link>

            <Link 
                href={'/analytics'}
                className={"flex gap-4 items-center p-2 rounded-md transition-colors " + (path.includes('/analytics') ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-100')}
            >
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />
                <span>Analytics</span>
            </Link>

            <button
                onClick={() => signOut()}
                className="flex gap-4 items-center p-2 rounded-md text-gray-600 hover:bg-gray-100 mt-auto"
            >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-6 h-6" />
                <span>Logout</span>
            </button>
            <Link 
        href={'/main'} 
        className="flex items-center gap-4 text-sm text-gray-500 p-3 rounded-lg hover:bg-gray-100 transition-colors mt-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className={'w-4 h-4'} />
        <span>Back to website</span>
      </Link>
        </nav>
    );
}