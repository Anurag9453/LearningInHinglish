"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "../lib/supabase";
import { getRedirectUrl } from "../lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              HinglishLearn
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="ui-card p-8">
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
              className="ui-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="ui-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full ui-btn-primary py-3 text-base mb-4 disabled:opacity-70"
          >
            {loading ? "Logging in…" : "Login"}
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
              const supabase = getSupabase();
              if (!supabase) {
                setError("Supabase is not configured");
                return;
              }

              setError(null);

              const { error: oauthError } = await supabase.auth.signInWithOAuth(
                {
                  provider: "google",
                  options: {
                    redirectTo: getRedirectUrl("/dashboard"),
                  },
                }
              );

              if (oauthError) {
                setError(oauthError.message);
              }
            }}
            className="w-full ui-btn-outline py-3 flex items-center justify-center gap-3 font-semibold"
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
