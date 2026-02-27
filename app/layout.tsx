import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './components/Providers'

const jioTypeVar = localFont({
  src: [
    { path: '../public/fonts/JioTypeVarW05-Regular.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/JioTypeVarW05-Italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-jiotype',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jioTypeVar.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
