"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import { useEffect } from "react";
import { markUnitCompleted } from "@/app/lib/backend";

export default function Unit3() {
  useEffect(() => {
    markUnitCompleted("polynomials", "unit-3");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <li className="text-gray-900 font-medium">Types of Polynomials</li>
          </ol>
        </nav>

        {/* Unit Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-2xl">
              📈
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Types of Polynomials
              </h1>
              <p className="text-gray-600">Unit 3 of 3</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Polynomials ko unki degree ke basis par classify kiya jata hai.
            </p>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Linear Polynomial
                    </h3>
                    <p className="text-sm text-gray-600">Degree 1</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-5 rounded-r-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Quadratic Polynomial
                    </h3>
                    <p className="text-sm text-gray-600">Degree 2</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-5 rounded-r-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Cubic Polynomial
                    </h3>
                    <p className="text-sm text-gray-600">Degree 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/modules/polynomials/unit-2"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            ← Previous Unit
          </Link>
          <Link
            href="/modules/polynomials/quiz"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-md"
          >
            Take Quiz →
          </Link>
        </div>
      </main>
    </div>
  );
}
