import { siteConfig } from "@/lib/siteConfig";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">About Us</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        About OpenTutti
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        OpenTutti is a free music education platform for classrooms. It helps
        students practice ear training, music theory, sight-reading, and
        staff-based music skills through clear exercises, instant feedback, and
        teacher-guided assignments.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Why OpenTutti exists</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Music theory tools should be accessible, practical, and connected to
            the way students actually learn. OpenTutti focuses on short
            practice, immediate explanations, classroom workflows, and tools
            that connect written theory to sound.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Core tools</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-zinc-400">
            <li>Ear Training Gym</li>
            <li>Theory Tester</li>
            <li>Sight-Reading Coach</li>
            <li>OpenTuttiLab staff workspace</li>
            <li>Teacher classes and join codes</li>
            <li>Assignments and student results</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Who it is for</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            OpenTutti is built for music theory classes, choir, band, orchestra,
            private studios, ear training practice, and students preparing for
            more advanced theory work.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Feedback</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            OpenTutti improves through teacher and student feedback. If
            something is confusing, inaccurate, missing, or useful, please send
            feedback so the platform can continue to improve.
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
