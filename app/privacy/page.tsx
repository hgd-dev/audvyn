export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Privacy</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Privacy Notice
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        OpenTutti is designed to collect only the information needed to make
        classroom practice, assignments, and progress tracking work.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Information OpenTutti stores</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-zinc-400">
            <li>Account email used for login</li>
            <li>Display name</li>
            <li>Account role: student or teacher</li>
            <li>Optional school name</li>
            <li>Class membership</li>
            <li>Assignments created by teachers</li>
            <li>Assignment attempts, scores, and completion times</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Information OpenTutti does not need</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            OpenTutti does not require full legal names, student ID numbers,
            addresses, phone numbers, grades, birthdays, or other unnecessary
            student information. Students can use first names, initials, or
            classroom nicknames when appropriate.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Audio and microphone use</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            OpenTutti does not require storing student audio recordings for its
            current classroom tools. Future microphone-based feedback should be
            designed to analyze audio in the browser whenever possible and avoid
            storing recordings by default.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Classroom visibility</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Teachers can see students who join their classes and can view
            assignment completion and scores for those students. Students should
            only see their own classes, assignments, and results.
          </p>
        </section>
      </div>
    </section>
  );
}
