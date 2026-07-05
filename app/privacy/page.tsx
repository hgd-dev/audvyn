export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Privacy</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Privacy and Beta Data Notice
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        Audvyn is currently a beta music education platform. The goal is to
        collect only the minimum information needed to make classroom practice
        work.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Information Audvyn stores</h2>
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
          <h2 className="text-2xl font-semibold">
            Information Audvyn does not need
          </h2>
          <p className="mt-3 leading-8 text-zinc-400">
            Audvyn does not require full legal names, student ID numbers,
            addresses, phone numbers, grades, birthdays, or other unnecessary
            student information. For beta testing, students can use first names,
            initials, or classroom nicknames.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Audio and microphone use</h2>
          <p className="mt-3 leading-8 text-zinc-400">
            The current beta does not require storing student audio recordings.
            Any future microphone-based sight-singing feedback should be
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

        <section className="rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-6">
          <h2 className="text-2xl font-semibold text-yellow-100">
            Beta limitation
          </h2>
          <p className="mt-3 leading-8 text-yellow-50/90">
            Audvyn is an early beta project and should be tested with limited,
            non-sensitive classroom information first. A more formal privacy
            policy should be prepared before large-scale school or district use.
          </p>
        </section>
      </div>
    </section>
  );
}