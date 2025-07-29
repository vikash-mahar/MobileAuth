'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [phone, setPhone] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedPhone = localStorage.getItem('phone')

    if (token && storedPhone) {
      setIsLoggedIn(true)
      setPhone(storedPhone)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
    setIsLoggedIn(false)
    setPhone('')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">{isLoggedIn ? `Welcome ${phone}` : 'Welcome to Mobile Auth App 📱'}</h1>
        <p className="text-gray-600 mb-8">
          Secure authentication using your mobile number and OTP. Join our trusted platform and keep your data safe.
        </p>

        {!isLoggedIn ? (
          <div className="flex justify-center gap-6">
            <button onClick={() => router.push('/login')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
            <button onClick={() => router.push('/signup')} className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Signup
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Logout
          </button> )}
      </div>
    </div>
  )
}
