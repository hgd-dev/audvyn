export default function DemoPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm font-medium text-violet-300">Demo</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        OpenTutti Demo
      </h1>
      <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
        Watch a walkthrough of OpenTutti&apos;s classroom practice tools, teacher
        and student workflows, sight-reading generator, and OTLab workspace.
      </p>

      <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/30">
        <video
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black"
        >
          <source src="/OpenTuttiDemoFinal.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-zinc-400">
        <p>
          The video is embedded directly from the project&apos;s public folder, so it
          will be served at <span className="text-zinc-200">/OpenTuttiDemoFinal.mp4</span> after deployment.
        </p>
      </div>
    </section>
  );
}
