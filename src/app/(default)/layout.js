import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import {getServerSession} from "next-auth";

export default async function DefaultLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}

