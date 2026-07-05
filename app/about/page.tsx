import { siteConfig } from "@/lib/siteConfig";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">About</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        About Audvyn
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        Audvyn is a free student-built music education platform for classrooms.
        It is designed to help students practice ear training, music theory,
        sight-reading, and staff-based music skills in a way that feels clear,
        fast, and connected to how students actually learn.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Why Audvyn exists</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Many music theory tools are useful, but they often feel either too
            expensive, too generic, or disconnected from the student experience.
            Audvyn focuses on short practice, immediate explanations, classroom
            assignments, and tools that connect written theory to sound.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Current beta features</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-zinc-400">
            <li>Ear Training Gym</li>
            <li>Basic Theory Tester</li>
            <li>Sight-Reading Coach</li>
            <li>Staff Lab templates</li>
            <li>Teacher classes and join codes</li>
            <li>Assignments and student results</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Who it is for</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Audvyn is intended for music theory classes, choir, band, orchestra,
            private studios, ear training practice, and students preparing for
            more advanced theory work.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Feedback</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Audvyn is being built around teacher and student feedback. If
            something is confusing, inaccurate, missing, or useful, please send
            feedback so the platform can improve.
          </p>
          <a
            href={siteConfig.feedbackUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-violet-500 px-5 py-3 font-medium text-white hover:bg-violet-400"
          >
            Send feedback
          </a>
        </section>
      </div>
    </section>
  );
}