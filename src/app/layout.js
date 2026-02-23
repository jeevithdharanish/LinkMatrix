import SessionWrapper from "@/components/SessionWrapper";
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata = {
  title: 'LinkMate - Your one link for everything',
  description: 'Share your profiles, contact info and more on one page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionWrapper>
          <main className="w-full">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  )
}
