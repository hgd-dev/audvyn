import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p>© {new Date().getFullYear()} OpenTutti. Free classroom music tools.</p>
          <p className="mt-2 max-w-xl leading-6 text-zinc-500">
            OpenTutti provides accessible music theory, ear training, sight-reading,
            and classroom practice tools for students and teachers.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
          <Link href="/privacy" className="hover:text-white">
            Privacy
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
