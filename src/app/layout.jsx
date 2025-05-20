import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SupplementScribe',
  description: 'Your personal supplement tracking assistant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={cn(inter.className, "min-h-screen bg-gray-50")}>
        {children}
      </body>
    </html>
  )
} 