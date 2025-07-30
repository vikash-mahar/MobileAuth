'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../utils/axios.helper.js'

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSendOtp = async (data) => {
    setLoading(true)
    try {
      await axiosInstance.post("/auth/login/send-otp", { phone: data.phone })
      alert("OTP sent successfully")
      setStep(2)

    } 
    catch (error) {
      console.log("error", error)
      alert(error.response?.data?.message || 'Refresh the page or Try again later')
    } finally {
      setLoading(false)
    }
  }

  const onVerifyOtp = async (data) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post("/auth/login/verify-otp", {
        phone: data.phone,
        otp: data.otp
      })

      alert("Login successful")
      localStorage.setItem("token", response.data.data)
      localStorage.setItem("phone", data.phone)
      router.push("/")
    } 
    catch (error) {
      console.log("error", error)
      alert(error.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-blue-50 flex flex-col sm:flex-row items-center justify-center px-4 py-10">
      <div className="sm:w-1/2 w-full h-full flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl text-blue-700 font-bold">Your Security, Our Priority 🔐</h2>
          <p className="text-gray-600 mt-2 text-sm">Login with your mobile number and OTP to access your account securely.</p>
        </div>
      </div>

      <div className="sm:w-1/2 w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit(step === 1 ? onSendOtp : onVerifyOtp)} className="space-y-4">

          <input
            type="text" placeholder="Enter Mobile Number" className="w-full p-3 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("phone", {required: "Mobile number is required",
              pattern: { value: /^\d{10}$/, message: "Enter valid 10-digit number" }
            })}/>
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}

          {step === 2 && (
            <div>
              <input type="text" placeholder="Enter OTP" className="w-full text-gray-900 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("otp", { required: "OTP is required",
                  pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" }
                })}/>
              {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
            </div>)}

          <button type="submit" disabled={loading} className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded transition ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}>

            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>)}

            {step === 1 ? "Send OTP" : "Verify & Login"}

          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-4">Don’t have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push('/signup')}>Signup now</span>
        </p>
        
      </div>
    </div>
  )
}
