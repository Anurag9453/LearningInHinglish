'use client'

import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Start learning in simple Hinglish
        </p>

        <input
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Email"
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-6"
          placeholder="Password"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded mb-4">
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
