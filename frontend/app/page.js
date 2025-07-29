'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const phone = localStorage.getItem('phone')
    if (token) {
      setIsLoggedIn(true)
      setPhone(phone || '')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
    setIsLoggedIn(false)
    router.push('/')
  }

  const handleNavigate = (path) => {
    setLoading(true)
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">📱 Mobile Auth App</h1>
        <p className="text-gray-600 text-sm mb-8">Secure authentication using your mobile number and OTP.</p>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-blue-600 font-semibold">Redirecting...</p>
          </div>
        ) : !isLoggedIn ? (
          <div className="space-y-4">
            <button onClick={() => handleNavigate('/login')} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"><FaSignInAlt /> Login</button>

            <button onClick={() => handleNavigate('/signup')} className="flex items-center justify-center gap-2 w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition" > <FaUserPlus /> Signup</button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 text-lg font-medium">Welcome, {phone}</p>
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"> <FaSignOutAlt /> Logout </button>
          </div>
        )}
      </div>
    </div>
  )
}
