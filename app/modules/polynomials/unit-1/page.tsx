'use client'

import Link from 'next/link'
import Header from '../../../components/Header'

export default function Unit1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/modules/polynomials" className="hover:text-blue-600 transition-colors">
                Polynomials
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">What is a Polynomial?</li>
          </ol>
        </nav>

        {/* Unit Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-2xl">
              📘
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                What is a Polynomial?
              </h1>
              <p className="text-gray-600">Unit 1 of 3</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Polynomial ek mathematical expression hota hai jisme variables aur
              constants hote hain.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Example:</h3>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-2xl font-mono text-center text-blue-700 font-bold">
                  2x² + 3x + 1
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Yahan <span className="font-semibold text-gray-900">x</span> ek variable hai aur{' '}
              <span className="font-semibold text-gray-900">2, 3, 1</span> constants hain.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/modules/polynomials"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            ← Back to Module
          </Link>
          <Link 
            href="/modules/polynomials/unit-2"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md"
          >
            Next Unit →
          </Link>
        </div>
      </main>
    </div>
  )
}
