"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { fetchMyXp } from "../lib/backend";
import { getSupabase } from "../lib/supabase";

type XpContextValue = {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
};

const XpContext = createContext<XpContextValue | null>(null);

export function XpProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const savedXp = window.localStorage.getItem("xp");
    return savedXp ? Number(savedXp) : 0;
  });

  // 2) Then, if user is logged in, hydrate from Supabase backend
  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabase();
    if (!supabase) return;

    const run = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data?.user) return;

        const backendXp = await fetchMyXp();
        if (!cancelled) setXp(backendXp);
      } catch {
        // Keep localStorage value if backend is not ready
      }
    };

    run();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!session?.user) return;
        fetchMyXp().then((backendXp) => {
          if (!cancelled) setXp(backendXp);
        });
      }
    );

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // Persist to localStorage (offline cache)
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("xp", xp.toString());
  }, [xp]);

  const value = useMemo(() => ({ xp, setXp }), [xp]);

  return <XpContext.Provider value={value}>{children}</XpContext.Provider>;
}

export function useXp() {
  const ctx = useContext(XpContext);
  if (!ctx) {
    throw new Error("useXp must be used within XpProvider");
  }
  return ctx;
}
