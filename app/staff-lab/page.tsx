import StaffTemplatePlayer from "@/components/StaffTemplatePlayer";

export default function StaffLabPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10">
        <p className="text-sm font-medium text-violet-300">Create</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">OTLab</h1>
        <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
          Compose, teach, and build short staff-based ideas in a modern OpenTutti workspace with templates,
          multi-staff editing, click-to-add notes, clef/key/time controls, playback sounds, and a scrubber.
        </p>
      </div>

      <StaffTemplatePlayer />
    </section>
  );
}
