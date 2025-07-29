import React from 'react'

export default function Loader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
