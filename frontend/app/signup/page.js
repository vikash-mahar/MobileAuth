'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../utils/axios.helper.js'

export default function SignupForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [step, setStep] = useState(1)

  const onSendOtp = async (data) => {
    try {
      await axiosInstance.post("/auth/send-otp", { phone: data.phone })
      alert("OTP sent successfully")
      setStep(2)

    } catch (error) {
      console.log("error",error)
      const status = error.response?.status

      console.log("Status",status)

      if (status === 401) {
        alert("Phone number already registered")
      } else if (status === 403) {
        alert("Enter a valid 10-digit mobile number")
      } else {
        alert("Your number is unverified with Twilio trial account. Verify it or use paid number.")
      }
    }
  }

  const onVerifyOtp = async (data) => {
    try {
      await axiosInstance.post("/auth/verify-otp", {
        phone: data.phone,
        password: data.password,
        otp: data.otp
      })
      alert("User registered!")
      router.push('/login')

    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed")
    }
  }

  return (
    <div className="w-screen h-screen bg-blue-50 flex flex-col sm:flex-row items-center justify-center px-4 py-10">
      <div className="sm:w-1/2 w-full max-w-md border-gray-400 bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Signup</h2>
        <form onSubmit={handleSubmit(step === 1 ? onSendOtp : onVerifyOtp)} className="space-y-4">

          <input type="text" placeholder="Enter mobile number" maxLength={10}className="w-full text-gray-900 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("phone", {
              required: "Mobile number is required",
              pattern: { value: /^\d{10}$/, message: "Must be exactly 10 digits" }
            })}/>
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

          <input type="password" placeholder="Enter password" className="w-full p-3 border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" }
            })}/>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {step === 2 && (
            <div>
              <input type="text" placeholder="Enter OTP" className="w-full border p-3  text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("otp", {
                  required: "OTP is required",
                  pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" }
                })}/>
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
            </div>)}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
            {step === 1 ? "Send OTP" : "Verify OTP & Signup"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-4">Already have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push('/login')} >Login here </span>
        </p>
      </div>

      <div className="sm:w-1/2 w-full h-full flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl text-blue-700 font-bold">Join Our Community 🚀</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Sign up with your mobile number and verify your identity instantly with OTP.
          </p>
        </div>
      </div>
    </div>
  )
}
