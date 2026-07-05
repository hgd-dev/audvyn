export default function StudentGuidePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Guide</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Student Guide
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        Audvyn helps you practice music theory, ear training, sight-reading, and
        staff-based music skills. You can practice freely or complete
        assignments from a teacher.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">1. Create a student account</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Go to the login page, choose “Sign up,” select “Student,” and create
            your account. You can use your first name, initials, or a classroom
            nickname if your teacher allows it.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">2. Join your class</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Enter the class code your teacher gives you from the Student
            Dashboard. After joining, your class and assignments will appear on
            your dashboard.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">3. Complete assignments</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Click Start on an assignment, answer each question, review the
            explanation, and finish to save your score.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">4. Practice freely</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            You can also use the Ear Training Gym, Theory Tester, Sight-Reading
            Coach, and Staff Lab outside of assignments.
          </p>
        </section>

        <section className="rounded-3xl border border-violet-400/30 bg-violet-500/10 p-6">
          <h2 className="text-2xl font-semibold text-violet-100">
            Practice tip
          </h2>
          <p className="mt-3 leading-8 text-violet-50/90">
            Don’t just memorize answers. Read the explanation after every
            question. The goal is to connect what you hear, what you see, and
            what the theory means.
          </p>
        </section>
      </div>
    </section>
  );
}