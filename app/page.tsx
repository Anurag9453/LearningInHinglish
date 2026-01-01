'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-xl font-bold">HinglishLearn</h1>
        <Link href="/login">
          <button className="border px-4 py-2 rounded">
            Login
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="px-8 py-20 text-center bg-gray-50">
        <h2 className="text-4xl font-bold mb-4">
          Learn School Subjects in Hinglish
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Ab complex concepts ko samajhna hoga easy.
          Class 10 Mathematics jaise subjects seekho
          simple Hinglish language mein — step by step.
        </p>

        <div className="mt-6">
          <Link href="/login">
            <button className="bg-blue-600 text-white px-6 py-3 rounded text-lg">
              Start Learning
            </button>
          </Link>
        </div>
      </div>

      {/* Why Hinglish */}
      <div className="px-8 py-16">
        <h3 className="text-2xl font-bold text-center mb-10">
          Why Hinglish Learning?
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 border rounded">
            <h4 className="font-semibold mb-2">🧠 Easy to Understand</h4>
            <p className="text-gray-600">
              Jaise teacher class mein explain karta hai,
              waise hi content — no heavy English.
            </p>
          </div>

          <div className="p-6 border rounded">
            <h4 className="font-semibold mb-2">🎯 Structured Learning</h4>
            <p className="text-gray-600">
              Trail → Module → Unit → Quiz.
              Exactly pata hota hai next kya padhna hai.
            </p>
          </div>

          <div className="p-6 border rounded">
            <h4 className="font-semibold mb-2">🏆 Learn with Motivation</h4>
            <p className="text-gray-600">
              Quizzes, XP points aur progress —
              padhai boring nahi lagegi.
            </p>
          </div>
        </div>
      </div>

      {/* Current Offering */}
      <div className="px-8 py-16 bg-gray-50 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Currently Available
        </h3>
        <p className="text-gray-600 mb-6">
          We are starting with one subject and doing it really well.
        </p>

        <div className="inline-block border rounded px-6 py-4">
          📘 Class 10 Mathematics
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 text-center text-gray-500 border-t">
        © 2026 HinglishLearn. Built for Indian learners 🇮🇳
      </div>
    </div>
  )
}
