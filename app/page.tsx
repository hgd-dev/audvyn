import Link from "next/link";
import {
  AudioLines,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Music,
  PenLine,
} from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    title: "Ear Training Gym",
    description:
      "Practice intervals, chords, cadences, scales, and rhythm with instant explanations after every answer.",
    href: "/practice/ear-training",
    icon: <AudioLines className="h-6 w-6" />,
  },
  {
    title: "Theory Tester",
    description:
      "Build fluency with notes, key signatures, intervals, triads, Roman numerals, rhythm values, and more.",
    href: "/practice/theory",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    title: "Sight-Reading Coach",
    description:
      "Read short melodies, hear a starting pitch, practice with playback, and prepare for singing-based musicianship.",
    href: "/practice/sight-reading",
    icon: <Music className="h-6 w-6" />,
  },
  {
    title: "OTLab",
    description:
      "Use simple staff-based templates for scales, intervals, chords, cadences, rhythm, and classroom demonstrations.",
    href: "/staff-lab",
    icon: <PenLine className="h-6 w-6" />,
  },
  {
    title: "Teacher Dashboard",
    description:
      "Create classes, assign practice, and track student progress without expensive classroom software.",
    href: "/teacher",
    icon: <LayoutDashboard className="h-6 w-6" />,
  },
  {
    title: "Student Dashboard",
    description:
      "Join classes, complete assignments, and see your own progress across theory and aural skills.",
    href: "/student",
    icon: <GraduationCap className="h-6 w-6" />,
  },
];

export default function Home() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
            Built by a national competition winner:
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white md:text-7xl">
            Music theory and practice — together, for every student.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
            OpenTutti is a completely free, rigorously designed platform covering ear training, theory, sight-reading, and teaching tools for every K12 classroom.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}