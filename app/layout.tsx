import './globals.css'
import { XpProvider } from './context/xp-context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <XpProvider>
          {children}
        </XpProvider>
      </body>
    </html>
  )
}
