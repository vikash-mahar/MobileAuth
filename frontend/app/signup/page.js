'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../utils/axios.helper.js'

const SignupForm = () => {
  const router = useRouter()
  const { register, handleSubmit,formState: { errors } } = useForm()
  const [step, setStep] = useState(1)

  const onSendOtp = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/send-otp",{phone:data.phone})
      alert('OTP sent successfully')
      setStep(2)

    } catch (error) {
        if (error.response?.status === 401) {
          console.log("phone number already registered")
          alert("phone number already registered")
        }
        else if (error.response?.status === 403) {
          console.log("enter valid 10 digit mobile number")
          alert("enter valid 10 digit mobile number")
        }
        else{
          console.log("The number +91909090XXXX is unverified. Trial accounts cannot send messages to unverified numbers; verify +91909090XXXX at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers")
          alert("The number +91909090XXXX is unverified. Trial accounts cannot send messages to unverified numbers; verify +91909090XXXX at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers")
        }
      // console.log(error.response?.data)
      // alert(error.response?.data?.message || "User already registered")
    }
  }

  const onVerifyOtp = async (data) => {
    try {
        const res = await axiosInstance.post("/auth/verify-otp", {
        phone: data.phone,
        password: data.password,
        otp: data.otp
      })
      router.push('/login')
      // localStorage.setItem("token", data.data); // data = token

      alert("User registered!")
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed")
    }
  }

  return (
    <div className='w-screen sm:flex bg-blue-50 h-[700px]' >        
      <div className='sm:w-1/2'></div>

      <div className='sm:w-1/2'>
        <div className='w-full h-full pl-[14%] pr-[20%]'>
          <div className='my-[5%]'>
            <p className='text-4xl py-[20px] text-gray-700'>Welcome! We'd Love to Know You Better 😊</p>
            <p className='text-lg text-gray-500 px-[5px] pb-[20px]'>Your presence matters — help us keep our community connected and safe.</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md w-[350px] ">
          <form onSubmit={handleSubmit(step === 1 ? onSendOtp : onVerifyOtp)} className="space-y-4 text-black">
            <div className='flex items-center gap-2'>
              <h2 className="text-2xl font-bold">Signup?</h2>
              <h4 onClick={()=>router.push('/login')}  className='text-sky-600 hover:text-sky-800 cursor-pointer'>Already have Account?</h4>
            </div>
            
            <input type="text" placeholder="Enter mobile number" maxLength={10} className="w-full border p-2 rounded" 
            {...register("phone", {
              required: "Mobile number is required",
              pattern: {
                value: /^\d{10}$/, message: "Mobile number must be exactly 10 digits",
              }
            })}/>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

            <input type="password" placeholder="Enter password" className="w-full border p-2 rounded"
            {...register("password", {
              required: "Password is required", 
              minLength: {
                value: 6, message: "Password must be at least 6 characters",
              }
            })}/>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            {step === 2 && (
              <input type="text" placeholder="Enter OTP" className="w-full border p-2 rounded"
              {...register("otp", { required: true })}/>
            )}

            <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
              {step === 1 ? "Send OTP" : "Verify OTP & Signup"}
            </button>

          </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
