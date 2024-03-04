import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from '../components/NavBar'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mayorista el chino',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className='py-6'>
        <nav className='container flex items-center justify-between'>
          <NavBar />
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}
