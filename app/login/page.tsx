'use client'

import Link from 'next/link'
import { getSupabase } from '../lib/supabase'




export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Login to continue learning in Hinglish
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••••"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded mb-4">
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t"></div>
          <span className="mx-2 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* Google Login (UI only for now) */}
       <button
          onClick={async () => {
            const supabase = getSupabase()
            if (!supabase) return

            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: 'https://learning-in-hinglish.vercel.app/dashboard',
              },
            })
          }}
          className="w-full border py-2 rounded flex items-center justify-center gap-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" />
          Continue with Google
        </button>


        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
