export default function TeacherGuidePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Guide</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Teacher Guide
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        OpenTutti gives music teachers a simple way to create classes, assign
        ear training and theory work, and review student progress from one
        classroom dashboard.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">1. Create a teacher account</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Open the Sign up page, select “Teacher,” and create your account.
            After signing in, you will be sent to the Teacher Dashboard.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">2. Create a class</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            From the Teacher Dashboard, create a class name such as “Period 3
            Music Theory” or “Choir Ear Training.” OpenTutti will generate a
            class join code.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">3. Share the join code</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Give the join code to students. Students enter the code from their
            Student Dashboard to join your class.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">4. Create assignments</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Use the Assignments tab in your class dashboard to choose an
            assignment type, mode, number of questions, due time, and exercise
            settings.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">5. Review results</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            After students complete assignments, the dashboard shows completion
            status, scores, averages, and per-student progress.
          </p>
        </section>
      </div>
    </section>
  );
}
