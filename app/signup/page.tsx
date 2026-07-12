"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<"student" | "teacher">("student");
  const [displayName, setDisplayName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createProfile(userId: string) {
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      display_name: displayName || email.split("@")[0],
      role,
      school_name: schoolName || null,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        setMessage("Account created. Check your email to confirm your account, then log in.");
        return;
      }

      await createProfile(data.user.id);

      router.push(role === "teacher" ? "/teacher" : "/student");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Account</p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Create your OpenTutti account</h1>

      <p className="mt-4 leading-8 text-zinc-400">
        Sign up as a student or teacher to access OpenTutti classroom tools.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm text-zinc-400">I am a</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "student" | "teacher")}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Display name</span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">School name optional</span>
          <input
            value={schoolName}
            onChange={(event) => setSchoolName(event.target.value)}
            placeholder="School or studio"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
          />
        </label>

        {message && (
          <div className="rounded-2xl border border-yellow-400/40 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-violet-500 px-5 py-3 font-medium text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-violet-300 hover:text-violet-200">
          Log In
        </Link>
      </p>
    </section>
  );
}
