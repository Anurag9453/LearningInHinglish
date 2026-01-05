'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import UnitCard from '../../components/UnitCard'

export default function PolynomialsModule() {
  const units = [
    {
      title: 'What is a Polynomial?',
      description: 'Polynomial ek mathematical expression hota hai jisme variables aur constants hote hain',
      href: '/modules/polynomials/unit-1',
      icon: '📘',
      completed: false
    },
    {
      title: 'Degree of a Polynomial',
      description: 'Polynomial ki degree kaise find karte hain aur uska importance',
      href: '/modules/polynomials/unit-2',
      icon: '📊',
      completed: false
    },
    {
      title: 'Types of Polynomials',
      description: 'Different types of polynomials - linear, quadratic, cubic, aur unke examples',
      href: '/modules/polynomials/unit-3',
      icon: '📈',
      completed: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Polynomials</li>
          </ol>
        </nav>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-3xl">
              📊
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Polynomials
              </h1>
              <p className="text-lg text-gray-600">
                Is module me hum polynomial ka concept step by step samjhenge
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Module Progress</h3>
            <span className="text-sm font-semibold text-blue-600">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300" style={{ width: '0%' }} />
          </div>
          <p className="text-sm text-gray-600 mt-2">0 of 3 units completed</p>
        </div>

        {/* Units Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Units</h2>
          <p className="text-gray-600">Complete these units to master polynomials</p>
        </div>

        {/* Unit Cards */}
        <div className="space-y-4">
          {units.map((unit, index) => (
            <UnitCard
              key={unit.href}
              title={unit.title}
              description={unit.description}
              href={unit.href}
              icon={unit.icon}
              completed={unit.completed}
            />
          ))}
        </div>

        {/* Quiz Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Test Your Knowledge?</h3>
              <p className="text-blue-100">
                Complete all units and take the quiz to earn XP points
              </p>
            </div>
            <Link href="/modules/polynomials/quiz">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
                Take Quiz
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
