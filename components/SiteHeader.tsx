"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Music2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import Image from "next/image";
const navItems = [
  { href: "/about", label: "About Us" },
  { href: "/practice/ear-training", label: "Ear Training" },
  { href: "/practice/theory", label: "Music Theory" },
  { href: "/practice/sight-reading", label: "Sight-Reading" },
  { href: "/staff-lab", label: "OpenTuttiLab" },
  { href: "/student-guide", label: "Student Guide" },
  { href: "/teacher-guide", label: "Teacher Guide" },
];

export default function SiteHeader() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    window.location.href = "/";
  }

  useEffect(() => {
    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashboardHref =
    profile?.role === "teacher"
      ? "/teacher"
      : profile?.role === "student"
        ? "/student"
        : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500">
            <Image
              src="/opentutti-logo.png"
              alt="OpenTutti logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-semibold tracking-tight">OpenTutti</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-32 rounded-full border border-white/10 bg-white/[0.03]" />
          ) : profile ? (
            <>
              <Link
                href={dashboardHref}
                className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10 sm:inline-flex"
              >
                Dashboard
              </Link>

              <button
                onClick={signOut}
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
