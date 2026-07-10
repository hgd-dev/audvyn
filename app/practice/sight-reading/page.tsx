import SightReadingCoach from "@/components/SightReadingCoach";

export default function SightReadingPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10">
        <p className="text-sm font-medium text-violet-300">Practice</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Sightreading
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
          Generate staff-reading drills with clef, key, rhythm, range, and
          playback tools for focused sightreading practice.
        </p>
      </div>

      <SightReadingCoach />
    </section>
  );
}
