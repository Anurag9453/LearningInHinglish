"use client";

import Link from "next/link";
import CourseCard from "./components/CourseCard";
import { useEffect, useMemo, useState } from "react";
import {
  fetchHomePayload,
  type HomeContent,
  type HeaderContent,
  type ModuleRow,
} from "./lib/backend";

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [header, setHeader] = useState<HeaderContent | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchHomePayload().then((payload) => {
      if (cancelled) return;
      setContent(payload.content);
      setHeader(payload.header);
      setModules(payload.modules);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const courses = useMemo(() => {
    if (modules.length) {
      return modules.map((m) => ({
        title: m.title,
        description: m.description,
        href: m.slug === "polynomials" ? "/modules/polynomials" : "/dashboard",
        gradient: m.gradient ?? "from-blue-500 to-indigo-600",
        imageUrl: m.image_url ?? undefined,
      }));
    }

    // Fallback for first render/offline
    return [
      {
        title: "Mathematics Class 10",
        description:
          "Class 10 Mathematics ko step by step samjhein. Polynomials, linear equations, aur real numbers jaise topics ko Hinglish mein seekhein.",
        href: "/dashboard",
        gradient: "from-blue-500 to-indigo-600",
      },
      {
        title: "Learn Android",
        description:
          "Android app development seekhein from scratch. Java/Kotlin, UI design, aur app publishing tak - sab kuch Hinglish mein.",
        href: "/dashboard",
        gradient: "from-green-500 to-emerald-600",
      },
      {
        title: "Zero to Hero in Docker and Kubernetes",
        description:
          "Docker containers aur Kubernetes orchestration ko samjhein. DevOps concepts ko practical examples ke saath seekhein.",
        href: "/dashboard",
        gradient: "from-cyan-500 to-blue-600",
      },
      {
        title: "Linear Algebra",
        description:
          "Linear algebra ke fundamentals ko samjhein. Vectors, matrices, transformations - sab kuch easy Hinglish explanation ke saath.",
        href: "/dashboard",
        gradient: "from-purple-500 to-pink-600",
      },
      {
        title: "Numpy, Pandas",
        description:
          "Python data science libraries - NumPy aur Pandas ko seekhein. Data manipulation aur analysis ke liye complete guide.",
        href: "/dashboard",
        gradient: "from-orange-500 to-red-600",
      },
    ];
  }, [modules]);

  const brandName = content?.brandName ?? "HinglishLearn";
  const navLoginText = content?.navLoginText ?? "Login";
  const heroTitle = content?.heroTitle ?? "Learn School Subjects in Hinglish";
  const heroHighlightWord = content?.heroHighlightWord ?? "Hinglish";
  const heroSubtitle =
    content?.heroSubtitle ??
    "Ab complex concepts ko samajhna hoga easy. Class 10 Mathematics jaise subjects seekho simple Hinglish language mein — step by step.";
  const primaryCtaText = content?.primaryCtaText ?? "Start Learning";
  const secondaryCtaText = content?.secondaryCtaText ?? "Sign Up Free";
  const coursesHeading = content?.coursesHeading ?? "Available Courses";
  const coursesDescription =
    content?.coursesDescription ??
    "Choose from our collection of courses designed to help you learn in simple Hinglish";
  const footerText =
    content?.footerText ?? "© 2026 HinglishLearn. Built for Indian learners 🇮🇳";

  const navLogoLetter =
    header?.logoLetter?.trim()?.slice(0, 1).toUpperCase() ||
    brandName.trim().slice(0, 1).toUpperCase() ||
    "H";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {navLogoLetter}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {brandName}
              </span>
            </div>
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                {navLoginText}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {heroTitle}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {heroHighlightWord}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                {primaryCtaText}
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all">
                {secondaryCtaText}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              {coursesHeading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {coursesDescription}
            </p>
          </div>

          {/* Course Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course, idx) => (
              <CourseCard
                key={idx}
                title={course.title}
                description={course.description}
                href={course.href}
                gradient={course.gradient}
                imageUrl={(course as { imageUrl?: string }).imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 border-t border-gray-200 bg-white">
        <p>{footerText}</p>
      </footer>
    </div>
  );
}
