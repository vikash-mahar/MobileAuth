'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../utils/axios.helper.js'

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()

  const onSendOtp = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login/send-otp", {
        phone: data.phone
      });
      alert("OTP sent successfully");
      setStep(2);
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const onVerifyOtp = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login/verify-otp", {
        phone: data.phone,
        otp: data.otp
      });

      alert("Login successful");
      localStorage.setItem("token", response.data.data);
      localStorage.setItem("phone", data.phone);
      router.push("/");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className='w-screen sm:flex bg-blue-50 h-[700px]'>
      <div className='sm:w-1/2'>
      
        <div className='w-full h-full pl-[14%] pr-[20%]'>
          <div className='my-[5%]'>
            <p className='text-4xl py-[20px] text-gray-700'>Welcome! We'd Love to Know You Better 😊</p>
            <p className='text-lg text-gray-500 px-[5px] pb-[20px]'>Your presence matters — help us keep our community connected and safe.</p>
          </div>

          <div className="bg-white p-4 rounded shadow-md w-[350px]">
            <div className='flex items-center gap-2 mb-4'>
              <h2 className="text-2xl font-semibold text-black">Login?</h2>
              <h4 onClick={() => router.push('/signup')} className='text-sky-600 hover:text-sky-800 cursor-pointer'>Create a New Account?</h4>
            </div>

            <form
              onSubmit={handleSubmit(step === 1 ? onSendOtp : onVerifyOtp)}
              className="space-y-4 text-black"
            >
              <input
                type="text"
                placeholder="Enter mobile number"
                className="w-full p-2 border rounded mb-1 text-gray-800"
                {...register("phone", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Mobile number must be exactly 10 digits",
                  }
                })}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

              {step === 2 && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full border p-2 rounded"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "OTP must be 6 digits"
                      }
                    })}
                  />
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {step === 1 ? "Send OTP" : "Verify & Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
