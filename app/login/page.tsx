'use client'

import Link from 'next/link'
import { getSupabase } from '../lib/supabase'
import { getRedirectUrl } from '../lib/utils'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">HinglishLearn</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Login to continue learning in Hinglish
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md mb-4">
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={async () => {
              const supabase = getSupabase()
              if (!supabase) return

              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: getRedirectUrl('/dashboard'),
                },
              })
            }}
            className="w-full border-2 border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              width="20" 
              height="20"
              alt="Google"
              className="w-5 h-5"
              loading="lazy"
            />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
