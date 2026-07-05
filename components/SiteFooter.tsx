import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p>© {new Date().getFullYear()} Audvyn. Free classroom music tools.</p>
          <p className="mt-2 max-w-xl leading-6 text-zinc-500">
            Audvyn is a student-built beta platform for music classrooms.
            Features may change as teachers and students test the app.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/teacher-guide" className="hover:text-white">
            Teacher Guide
          </Link>
          <Link href="/student-guide" className="hover:text-white">
            Student Guide
          </Link>
          <a
            href={siteConfig.feedbackUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            Feedback
          </a>
        </div>
      </div>
    </footer>
  );
}