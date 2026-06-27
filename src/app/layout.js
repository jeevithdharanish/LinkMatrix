import SessionWrapper from "@/components/features/auth/SessionWrapper";
import ThemeProvider from "@/components/features/theme/ThemeProvider";
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'] 
})

export const metadata = {
  title: 'LinkMate - Your one link for everything',
  description: 'Share your profiles, contact info and more on one page',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme') || 'light';
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <ThemeProvider>
          <SessionWrapper>
            <main className="w-full">
              {children}
            </main>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

