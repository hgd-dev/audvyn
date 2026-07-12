"use client";

import { useState } from "react";
import * as Tone from "tone";
import StaffDisplay from "@/components/StaffDisplay";
import {
  generateSightReadingMelody,
  recommendedSightReadingRange,
  sightReadingLevels,
  sightReadingOptionLists,
  SightReadingClef,
  SightReadingLevel,
  SightReadingMelody,
  SightReadingSettings,
} from "@/lib/music/sightReading";

type RevealPanel = "notes" | "solfege" | "counts" | null;

function durationToTone(duration: string) {
  if (duration === "w") return "1n";
  if (duration === "h" || duration === "hd") return "2n";
  if (duration === "8" || duration === "8d") return "8n";
  if (duration === "16") return "16n";
  return "4n";
}

function durationToSeconds(duration: string, tempo: number) {
  const quarter = 60 / tempo;

  if (duration === "w") return quarter * 4;
  if (duration === "hd") return quarter * 3;
  if (duration === "h") return quarter * 2;
  if (duration === "qd") return quarter * 1.5;
  if (duration === "q") return quarter;
  if (duration === "8d") return quarter * 0.75;
  if (duration === "8") return quarter / 2;
  return quarter / 4;
}

async function playStartingPitch(melody: SightReadingMelody) {
  const firstNote = melody.notes.find((note) => !note.isRest);
  if (!firstNote) return;

  await Tone.start();

  const synth = new Tone.Synth({
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.02,
      decay: 0.2,
      sustain: 0.6,
      release: 0.8,
    },
  }).toDestination();

  synth.triggerAttackRelease(firstNote.pitch, "2n");

  setTimeout(() => {
    synth.dispose();
  }, 1600);
}

async function playMelody(melody: SightReadingMelody) {
  await Tone.start();

  const synth = new Tone.Synth({
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.02,
      decay: 0.2,
      sustain: 0.55,
      release: 0.45,
    },
  }).toDestination();

  const now = Tone.now();
  let offset = 0;

  melody.notes.forEach((note) => {
    if (!note.isRest) {
      synth.triggerAttackRelease(
        note.pitch,
        durationToTone(note.duration),
        now + offset,
      );
    }

    offset += durationToSeconds(note.duration, melody.tempo);
  });

  setTimeout(() => {
    synth.dispose();
  }, offset * 1000 + 1000);
}

function getLevelPreset(level: SightReadingLevel) {
  return (
    sightReadingLevels.find((item) => item.value === level) ??
    sightReadingLevels[0]
  );
}

function settingLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function withRecommendedRange(settings: SightReadingSettings, clef: SightReadingClef) {
  const range = recommendedSightReadingRange(clef);
  return {
    ...settings,
    clef,
    rangeLow: range.low,
    rangeHigh: range.high,
  };
}

export default function SightReadingCoach() {
  const [level, setLevel] = useState<SightReadingLevel>("level-1");
  const [settings, setSettings] = useState<SightReadingSettings>(() => ({
    ...getLevelPreset("level-1").settings,
  }));
  const [melody, setMelody] = useState<SightReadingMelody>(() =>
    generateSightReadingMelody("level-1"),
  );
  const [revealPanel, setRevealPanel] = useState<RevealPanel>(null);
  const [rangeIsAuto, setRangeIsAuto] = useState(true);

  function updateSetting<K extends keyof SightReadingSettings>(
    key: K,
    value: SightReadingSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function changeClef(nextClef: SightReadingClef) {
    setSettings((current) =>
      rangeIsAuto ? withRecommendedRange(current, nextClef) : { ...current, clef: nextClef },
    );
  }

  function resetRecommendedRange() {
    setRangeIsAuto(true);
    setSettings((current) => withRecommendedRange(current, current.clef));
  }

  function changeLevel(nextLevel: SightReadingLevel) {
    const preset = getLevelPreset(nextLevel);
    const nextSettings = rangeIsAuto
      ? withRecommendedRange(preset.settings, preset.settings.clef)
      : { ...preset.settings };

    setLevel(nextLevel);
    setSettings(nextSettings);
    setMelody(generateSightReadingMelody(nextLevel, nextSettings));
    setRevealPanel(null);
  }

  function newMelody() {
    setMelody(generateSightReadingMelody(level, settings));
    setRevealPanel(null);
  }

  const revealValues =
    revealPanel === "notes"
      ? melody.noteNames
      : revealPanel === "solfege"
        ? melody.solfege
        : melody.counts;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-300">SIGHTREADING</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Generator controls
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base md:leading-7">
              Pick a level, set clef/range/rhythm options, and project the full-width score below for classroom reading.
            </p>
          </div>

        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {sightReadingLevels.map((item) => (
            <button
              key={item.value}
              onClick={() => changeLevel(item.value)}
              className={`rounded-2xl border p-4 text-left transition ${
                level === item.value
                  ? "border-violet-400/70 bg-violet-500/15"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06]"
              }`}
            >
              <p className="font-medium text-white">{item.label}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="text-sm text-zinc-400">Clef</span>
            <select
              value={settings.clef}
              onChange={(event) =>
                changeClef(event.target.value as SightReadingSettings["clef"])
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            >
              {sightReadingOptionLists.clefs.map((clef) => (
                <option key={clef} value={clef}>
                  {settingLabel(clef)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Key signature</span>
            <select
              value={settings.keySignature}
              onChange={(event) => updateSetting("keySignature", event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            >
              {sightReadingOptionLists.keySignatures.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Time signature</span>
            <select
              value={settings.timeSignature}
              onChange={(event) =>
                updateSetting(
                  "timeSignature",
                  event.target.value as SightReadingSettings["timeSignature"],
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            >
              {sightReadingOptionLists.timeSignatures.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Measures</span>
            <input
              type="number"
              min={2}
              max={16}
              value={settings.measures}
              onChange={(event) => updateSetting("measures", Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            />
          </label>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 md:col-span-2">
            <label className="block">
              <span className="text-sm text-zinc-400">Low</span>
              <select
                value={settings.rangeLow}
                onChange={(event) => {
                  setRangeIsAuto(false);
                  updateSetting("rangeLow", event.target.value);
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
              >
                {sightReadingOptionLists.rangeNotes.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-zinc-400">High</span>
              <select
                value={settings.rangeHigh}
                onChange={(event) => {
                  setRangeIsAuto(false);
                  updateSetting("rangeHigh", event.target.value);
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
              >
                {sightReadingOptionLists.rangeNotes.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={resetRecommendedRange}
              className="mt-7 rounded-xl border border-white/15 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10"
            >
              Auto range
            </button>
          </div>

          <label className="block">
            <span className="text-sm text-zinc-400">Tempo</span>
            <input
              type="number"
              min={40}
              max={160}
              value={settings.tempo}
              onChange={(event) => updateSetting("tempo", Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Rhythm difficulty</span>
            <select
              value={settings.rhythmDifficulty}
              onChange={(event) =>
                updateSetting(
                  "rhythmDifficulty",
                  event.target.value as SightReadingSettings["rhythmDifficulty"],
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            >
              {sightReadingOptionLists.rhythmDifficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {settingLabel(difficulty)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Pitch difficulty</span>
            <select
              value={settings.pitchDifficulty}
              onChange={(event) =>
                updateSetting(
                  "pitchDifficulty",
                  event.target.value as SightReadingSettings["pitchDifficulty"],
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            >
              {sightReadingOptionLists.pitchDifficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {settingLabel(difficulty)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-zinc-300">
              <input
                type="checkbox"
                checked={settings.allowRests}
                onChange={(event) => updateSetting("allowRests", event.target.checked)}
              />
              Allow rests
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-zinc-300">
              <input
                type="checkbox"
                checked={settings.allowAccidentals}
                onChange={(event) => updateSetting("allowAccidentals", event.target.checked)}
              />
              Allow accidentals
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={newMelody}
              className="rounded-full bg-violet-500 px-5 py-3 font-medium text-white hover:bg-violet-400"
            >
              Generate
            </button>
            <button
              onClick={() => playStartingPitch(melody)}
              className="rounded-full border border-white/15 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Play starting pitch
            </button>
            <button
              onClick={() => playMelody(melody)}
              className="rounded-full border border-white/15 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Play full melody
            </button>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <button
              onClick={() => setRevealPanel((current) => (current === "notes" ? null : "notes"))}
              className="rounded-full border border-white/15 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              {revealPanel === "notes" ? "Hide note names" : "Reveal note names"}
            </button>

            <button
              onClick={() => setRevealPanel((current) => (current === "solfege" ? null : "solfege"))}
              className="rounded-full border border-white/15 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              {revealPanel === "solfege" ? "Hide solfege" : "Reveal solfege"}
            </button>

            <button
              onClick={() => setRevealPanel((current) => (current === "counts" ? null : "counts"))}
              className="rounded-full border border-white/15 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              {revealPanel === "counts" ? "Hide counts" : "Reveal counts"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{melody.title}</h2>
            <p className="mt-2 max-w-4xl leading-7 text-zinc-400">{melody.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 px-3 py-1">Clef: {settingLabel(melody.clef)}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Key: {melody.keySignature}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Time: {melody.timeSignature}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Tempo: {melody.tempo}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Measures: {melody.settings.measures}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Range: {settings.rangeLow}–{settings.rangeHigh}</span>
            </div>
          </div>
        </div>

        <StaffDisplay template={melody} />

        {revealPanel && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <h3 className="font-semibold text-white">
              {revealPanel === "notes" && "Note names"}
              {revealPanel === "solfege" && "Solfege"}
              {revealPanel === "counts" && "Counts"}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {revealValues.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-zinc-200"
                >
                  {index + 1}. {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <h3 className="font-semibold text-white">Sight-reading tips</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-zinc-400">
            {melody.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <h3 className="font-semibold text-white">Target areas</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {melody.targetAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-zinc-300"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
