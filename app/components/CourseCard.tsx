'use client'

import Link from 'next/link'

interface CourseCardProps {
  title: string
  description: string
  href: string
  imageUrl?: string
  gradient?: string
}

export default function CourseCard({ 
  title, 
  description, 
  href,
  imageUrl,
  gradient = 'from-blue-500 to-indigo-600'
}: CourseCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image Section - Top Half */}
        <div className={`relative h-48 overflow-hidden ${!imageUrl ? `bg-gradient-to-br ${gradient}` : ''}`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-80">
                {title.includes('Mathematics') ? '📘' :
                 title.includes('Android') ? '📱' :
                 title.includes('Docker') ? '🐳' :
                 title.includes('Linear') ? '📊' :
                 title.includes('Numpy') ? '🐍' : '📚'}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Description Section - Bottom Half */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Start Learning
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
