"use client";

import Link from "next/link";
import CourseCard from "./components/CourseCard";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "./lib/supabase";
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
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchHomePayload()
      .then((payload) => {
        if (cancelled) return;
        setContent(payload.content);
        setHeader(payload.header);
        setModules(payload.modules);
      })
      .catch(() => {
        if (cancelled) return;
        setContent(null);
        setHeader(null);
        setModules([]);
      });

    (async () => {
      const supabase = getSupabase();
      if (!supabase) {
        if (!cancelled) setIsAuthed(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        setIsAuthed(false);
        return;
      }

      setIsAuthed(Boolean(data.session));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const courses = useMemo(() => {
    return modules.map((m) => ({
      title: m.title,
      description: m.description,
      href: m.slug === "polynomials" ? "/modules/polynomials" : "/dashboard",
      gradient: m.gradient ?? "from-blue-500 to-indigo-600",
      imageUrl: m.image_url ?? undefined,
    }));
  }, [modules]);

  const brandName = header?.brandName ?? content?.brandName ?? "";
  const heroTitle = content?.heroTitle ?? "";
  const heroHighlightWord = content?.heroHighlightWord ?? "";
  const heroSubtitle = content?.heroSubtitle ?? "";
  const primaryCtaText = content?.primaryCtaText ?? "";
  const secondaryCtaText = content?.secondaryCtaText ?? "";
  const coursesHeading = content?.coursesHeading ?? "";
  const coursesDescription = content?.coursesDescription ?? "";
  const footerText = content?.footerText ?? "";

  const navLogoLetter =
    header?.logoLetter?.trim()?.slice(0, 1).toUpperCase() ||
    brandName.trim().slice(0, 1).toUpperCase();

  const navAction =
    isAuthed === true
      ? { href: "/dashboard", label: header?.dashboardLabel ?? "Dashboard" }
      : { href: "/login", label: content?.navLoginText ?? "Login" };

  const isReady =
    content !== null && header !== null && isAuthed !== null && navLogoLetter;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        Loading…
      </div>
    );
  }

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
            <Link href={navAction.href}>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                {navAction.label}
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
            <Link href="#courses">
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
      <section
        id="courses"
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30"
      >
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
          {courses.length ? (
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
          ) : (
            <div className="text-center text-gray-600">No courses found.</div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 border-t border-gray-200 bg-white">
        <p>{footerText}</p>
      </footer>
    </div>
  );
}
