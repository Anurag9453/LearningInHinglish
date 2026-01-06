"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase";
import { getRedirectUrl } from "../lib/utils";
import {
  fetchSiteContent,
  type AuthContent,
  type HeaderContent,
} from "../lib/backend";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [header, setHeader] = useState<HeaderContent | null>(null);
  const [content, setContent] = useState<AuthContent | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSiteContent<HeaderContent>("header").then((data) => {
      if (cancelled) return;
      setHeader(data);
    });

    fetchSiteContent<AuthContent>("auth").then((data) => {
      if (cancelled) return;
      setContent(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const brandName = header?.brandName?.trim() || "HinglishLearn";
  const logoLetter = useMemo(() => {
    const explicit = header?.logoLetter?.trim();
    if (explicit) return explicit.slice(0, 1).toUpperCase();
    return brandName.trim().slice(0, 1).toUpperCase() || "H";
  }, [brandName, header?.logoLetter]);

  const signupTitle = content?.signupTitle?.trim() || "Create Account";
  const signupSubtitle =
    content?.signupSubtitle?.trim() || "Start learning in simple Hinglish";

  const handleSignup = async () => {
    setError(null);
    setInfo(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: getRedirectUrl("/dashboard"),
        data: {
          full_name: fullName || null,
          phone_number: phoneNumber || null,
        },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmations are enabled, session may be null.
    if (!data.session) {
      setInfo(
        "Account created. Please check your email to confirm your account, then log in."
      );
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div
              className="w-10 h-10 rounded-2xl grid place-items-center text-white shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary2))",
              }}
            >
              <span className="font-black text-xl">{logoLetter}</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              {brandName}
            </span>
          </Link>
        </div>

        <div className="ui-card p-8">
          <h1 className="text-2xl font-black text-center mb-2 text-gray-900">
            {signupTitle}
          </h1>
          <p className="text-center text-gray-600 mb-6">{signupSubtitle}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="ui-input"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="ui-input"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="ui-input"
              placeholder="+91 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="ui-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="ui-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              {info}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full ui-btn-primary py-3 text-base mb-4 disabled:opacity-70"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-xs text-gray-500 font-semibold">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

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
                  options: { redirectTo: getRedirectUrl("/dashboard") },
                }
              );

              if (oauthError) {
                setError(oauthError.message);
              }
            }}
            className="w-full ui-btn-outline py-3 flex items-center justify-center gap-3 font-semibold"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width={20}
              height={20}
              alt="Google"
              className="w-5 h-5"
              priority={false}
            />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
