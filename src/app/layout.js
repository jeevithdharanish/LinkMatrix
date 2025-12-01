import SessionWrapper from "@/components/SessionWrapper";
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'LinkMate - Your one link for everything',
  description: 'Share your profiles, contact info and more on one page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <SessionWrapper>
          <main className="w-full">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  )
}






