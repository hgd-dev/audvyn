export default function TeacherGuidePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Guide</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Teacher Guide
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        Audvyn is a free beta platform for music theory, ear training,
        sight-reading, and classroom practice. The current version is designed
        for lightweight classroom testing, not district-wide deployment yet.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">1. Create a teacher account</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Go to the login page, choose “Sign up,” select “Teacher,” and create
            your account. After signing in, you will be sent to the Teacher
            Dashboard.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">2. Create a class</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Open the Classes page from the teacher dashboard. Create a class
            name such as “Period 3 Music Theory” or “Choir Ear Training.” Audvyn
            will generate a class join code.
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
            Open the Assignments page and choose an assignment type, mode, and
            number of questions. The current beta supports Ear Training and
            Theory assignments.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">5. Review results</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            After students complete assignments, the Assignments page shows
            completion status, score, and completion time for each student.
          </p>
        </section>

        <section className="rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-6">
          <h2 className="text-2xl font-semibold text-yellow-100">
            Beta note
          </h2>
          <p className="mt-3 leading-8 text-yellow-50/90">
            Audvyn is currently in beta. Please avoid entering sensitive student
            information. For testing, students can use first names, initials, or
            classroom nicknames.
          </p>
        </section>
      </div>
    </section>
  );
}