import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'OrderFlow CRM',
  description: 'Corporate Gifting CRM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="flex h-full flex-col antialiased md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
