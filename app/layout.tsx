import './globals.css'
import { XpProvider } from './context/xp-context'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <XpProvider>
          {children}
        </XpProvider>
      </body>
    </html>
  )
}
