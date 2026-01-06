"use client";

import "./globals.css";
import { XpProvider } from "./context/xp-context";
import { useEffect } from "react";
import { getSupabase } from "./lib/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    // 🔑 This restores session after Google redirect
    supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (process.env.NODE_ENV === "development") {
          console.log("Auth state changed:", _event, session);
        }
      }
    );
  }, []);

  return (
    <html lang="en">
      <head>
        <title>HinglishLearn - Learn in Simple Hinglish</title>
        <meta
          name="description"
          content="Learn school subjects in Hinglish - easy to understand, step by step"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body>
        <XpProvider>{children}</XpProvider>
      </body>
    </html>
  );
}
