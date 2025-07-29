'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Loader from '../app/components/Loader'
import '../app/globals.css'

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <html lang="en">
      <body>{loading ? <Loader /> : children}</body>
    </html>
  )
}
