import { siteConfig } from "@/lib/siteConfig";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">About Us</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        About OpenTutti
      </h1>

      <p className="mt-5 max-w-3xl leading-8 text-zinc-300">
        OpenTutti is a free music education platform built to connect written theory with real listening and practice.
        We believe music theory should not be memorized in isolation. Students should be able to hear it, recognize it, and use it in the music they perform.
        <br />
        Our mission is to make that kind of practical music learning accessible to every student.
        <br />
        <br />
        Founded by a Musician and Student
        <br />
        Hudson Dong, Founder of OpenTutti, is a pianist, composer, and member of Stuyvesant High School's Class of 2027. He created OpenTutti after seeing how often music theory, ear training, and performance are taught as separate subjects.
        Hudson is a 2026 YoungArts Winner in Classical Solo Piano and earned second place in the 2026 MTNA Eastern Division Senior Piano Competition. In 2025, he placed second nationally in the MTNA Junior Piano Competition and received the MTNA Ebony Award. He is also a multi-year winner in the New York MTNA Composition Competition and serves as Stuyvesant’s choral accompanist.
        His work also extends into mathematics and computer science, with first-place finishes in New York City mathematics competitions, recognition in the MCM and M3 modeling competitions, and achievement in the USACO Gold division.
      </p>
    </section>
  );
}
