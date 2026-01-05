'use client'

import { useEffect } from 'react'
import { useXp } from '@/app/context/xp-context'
import { getSupabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import CourseCard from '../components/CourseCard'

export default function DashboardPage() {
  const { xp } = useXp()
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) {
        router.push('/login')
      }
    })
  }, [router])

  // Available courses - in production, this would come from a database
  const courses = [
    {
      title: 'Mathematics Class 10',
      description: 'Class 10 Mathematics ko step by step samjhein. Polynomials, linear equations, aur real numbers jaise topics ko Hinglish mein seekhein.',
      href: '/modules/polynomials',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Learn Android',
      description: 'Android app development seekhein from scratch. Java/Kotlin, UI design, aur app publishing tak - sab kuch Hinglish mein.',
      href: '/dashboard',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Zero to Hero in Docker and Kubernetes',
      description: 'Docker containers aur Kubernetes orchestration ko samjhein. DevOps concepts ko practical examples ke saath seekhein.',
      href: '/dashboard',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Linear Algebra',
      description: 'Linear algebra ke fundamentals ko samjhein. Vectors, matrices, transformations - sab kuch easy Hinglish explanation ke saath.',
      href: '/dashboard',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Numpy, Pandas',
      description: 'Python data science libraries - NumPy aur Pandas ko seekhein. Data manipulation aur analysis ke liye complete guide.',
      href: '/dashboard',
      gradient: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Choose a course to start your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold text-gray-900">{xp}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Units Completed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Courses</h2>
          <p className="text-gray-600">Select a course to start learning</p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              href={course.href}
              gradient={course.gradient}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
