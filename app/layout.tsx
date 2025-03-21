import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2D Portfolio Website',
  description: 'Portfolio',
  generator: 'version1.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
