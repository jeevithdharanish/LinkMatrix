"use client";

import { faChartLine, faFileLines, faRightFromBracket, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AppSidebar() {
    const path = usePathname();

    const navItems = [
        { href: '/account', icon: faFileLines, label: 'My Page', match: '/account' },
        { href: '/analytics', icon: faChartLine, label: 'Analytics', match: '/analytics' },
    ];

    return (
        <nav className="flex flex-col h-full mt-6">
            <div className="space-y-1.5">
                {navItems.map((item) => {
                    const isActive = path.includes(item.match);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-indigo-600/20 text-white border border-indigo-500/30 shadow-sm font-semibold'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                }`}
                        >
                            {isActive && (
                                <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-full" />
                            )}
                            <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 space-y-1.5 border-t border-zinc-800/80">
                <ThemeToggle variant="sidebar" />
                <Link
                    href="/main"
                    className="flex items-center gap-3 text-sm text-zinc-400 px-3 py-2.5 rounded-xl hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
                    <span>Back to website</span>
                </Link>

                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 w-full text-left text-sm text-zinc-400 px-3 py-2.5 rounded-xl hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}