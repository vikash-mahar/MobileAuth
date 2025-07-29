'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


export default function page() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleSendOtp = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/login/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await res.json()
      if (res.ok) {
        alert('OTP sent successfully')
        setStep(2)
      } else {
        alert(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      alert('Something went wrong')
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })

      const data = await res.json()
      if (res.ok) {
        alert('Login successful!')
        console.log("login successfully")
        
        console.log("token", data.data)
        localStorage.setItem("token", data.data)
        localStorage.setItem("phone", phone);
        router.push('/')
      } else {
        alert(data.message || 'OTP verification failed')
      }
    } catch (err) {
      alert('Something went wrong')
    }
  }

  return (
    <div className='w-screen sm:flex bg-blue-50 h-[700px]'>        
      <div className='sm:w-1/2'>
        <div className='w-full h-full pl-[14%] pr-[20%]'>
          <div className='my-[5%]'>
            <p className='text-4xl py-[20px] text-gray-700'>Welcome! We'd Love to Know You Better 😊</p>
            <p className='text-lg text-gray-500 px-[5px] pb-[20px]'>Your presence matters — help us keep our community connected and safe.</p>
          </div>

          <div className="bg-white p-4 rounded shadow-md w-[350px] ">
            <div className='flex items-center gap-2 mb-4'>
              <h2 className="text-2xl font-semibold text-center text-black">Login?</h2>
              <h4 onClick={()=>router.push('/signup')}  className='text-sky-600 hover:text-sky-800 cursor-pointer'>Create a New Account?</h4>
            </div>
        <input type="text" placeholder="Enter mobile number" className="w-full p-2 border rounded mb-4 text-gray-800 "
          value={phone} onChange={(e) => setPhone(e.target.value)}/>

        {step === 2 && (
          <input type="text" placeholder="Enter OTP " className="w-full p-2 border rounded mb-4 text-gray-800 "
          value={otp} onChange={(e) => setOtp(e.target.value)}/>)}

        <button onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {step === 1 ? 'Send OTP' : 'Verify & Login'}
        </button>
        </div>
        </div>
      </div>
    </div>
  )
}
