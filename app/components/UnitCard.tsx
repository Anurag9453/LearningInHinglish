'use client'

import Link from 'next/link'

interface UnitCardProps {
  title: string
  href: string
  description?: string
  completed?: boolean
  icon?: string
}

export default function UnitCard({ 
  title, 
  href, 
  description,
  completed = false,
  icon = '📖'
}: UnitCardProps) {
  return (
    <Link href={href}>
      <div className={`group bg-white rounded-lg border-2 transition-all duration-200 overflow-hidden ${
        completed 
          ? 'border-green-200 bg-green-50/30' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}>
        <div className="p-5">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              completed 
                ? 'bg-green-100' 
                : 'bg-blue-50 group-hover:bg-blue-100'
            }`}>
              <span className="text-xl">{icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`text-base font-semibold ${
                  completed ? 'text-green-700' : 'text-gray-900 group-hover:text-blue-600'
                } transition-colors`}>
                  {title}
                </h4>
                {completed && (
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            {/* Arrow */}
            <svg className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 ${
              completed ? 'text-green-600' : 'text-gray-400 group-hover:text-blue-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
