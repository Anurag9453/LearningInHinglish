"use client";

import { useState } from "react";
import { useXp } from "@/app/context/xp-context";
import Link from "next/link";
import Header from "../../../components/Header";
import {
  awardXpOnce,
  fetchMyXp,
  markModuleQuizPassed,
} from "@/app/lib/backend";

export default function PolynomialQuiz() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctAnswer = "B";
  const xpEarned = 100;
  const { setXp } = useXp();

  const handleSubmit = async () => {
    if (selected === correctAnswer) {
      await markModuleQuizPassed("polynomials");

      // Award XP via server rules and then hydrate latest XP
      // (keeps UI consistent if XP values change in xp_rules)
      await awardXpOnce({
        eventKey: "quiz:polynomials:passed",
        delta: xpEarned,
        moduleSlug: "polynomials",
      });

      const latestXp = await fetchMyXp();
      setXp(latestXp);
    }

    setSubmitted(true);
  };

  const options = [
    { value: "A", label: "1" },
    { value: "B", label: "2" },
    { value: "C", label: "3" },
    { value: "D", label: "0" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link
                href="/dashboard"
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/modules/polynomials"
                className="hover:text-blue-600 transition-colors"
              >
                Polynomials
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Quiz</li>
          </ol>
        </nav>

        {!submitted && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-4">
                ✏️
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Polynomial Quiz
              </h1>
              <p className="text-gray-600">
                Test your knowledge and earn XP points
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Question:
              </h2>
              <p className="text-lg text-gray-700">
                Polynomial{" "}
                <span className="font-mono font-bold text-blue-700">
                  2x² + 3x + 1
                </span>{" "}
                ka degree kya hai?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selected === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="q1"
                    value={option.value}
                    checked={selected === option.value}
                    onChange={() => setSelected(option.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-900 font-medium">
                    {option.value}) {option.label}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Submit Quiz
            </button>
          </div>
        )}

        {submitted && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
            {selected === correctAnswer ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  🎉
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                  Module Completed!
                </h2>
                <p className="text-lg text-gray-700 mb-2">
                  Correct answer! Degree highest power hoti hai.
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6 inline-block">
                  <p className="text-sm text-gray-600 mb-1">XP Earned</p>
                  <p className="text-2xl font-bold text-green-700">
                    +{xpEarned} XP
                  </p>
                </div>
                <Link href="/dashboard">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  ❌
                </div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Quiz Failed
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Degree hamesha variable ki highest power hoti hai. Try again.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/modules/polynomials">
                    <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                      Review Module
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSelected(null);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
