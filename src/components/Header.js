import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getServerSession} from "next-auth";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="bg-white border-b shadow-lg py-4">
  <div className="max-w-4xl flex justify-between mx-auto px-6">
    <div className="flex items-center gap-6">
      <Link href={'/'} className="flex items-center gap-2 text-blue-500">
        <FontAwesomeIcon icon={faLink} className="text-blue-500 text-xl" />
        <span className="font-bold">LinkList</span>
      </Link>
      {/* <nav className="flex items-center gap-6 text-slate-500 text-sm">
        <Link href={'/about'} className="hover:text-blue-500 transition duration-200 font-medium">About</Link>
        <Link href={'/pricing'} className="hover:text-blue-500 transition duration-200 font-medium">Pricing</Link>
        <Link href={'/contact'} className="hover:text-blue-500 transition duration-200 font-medium">Contact</Link>
      </nav> */}
    </div>
    <nav className="flex items-center gap-6 text-sm text-slate-500">
      {!!session ? (
        <>
          <Link href={'/account'} className="hover:text-blue-500 transition duration-200 font-medium">
            Hello, {session?.user?.name}
          </Link>
          <LogoutButton  />
        </>
      ) : (
        <>
          <Link href={'/login'} className="hover:text-blue-500 transition duration-200 font-medium">Sign In</Link>
          <Link href={'/register'} className="hover:text-blue-500 transition duration-200 font-medium">
            <span className="bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 font-semibold">Create Account</span>
          </Link>
        </>
      )}
    </nav>
  </div>
</header>

  );
}