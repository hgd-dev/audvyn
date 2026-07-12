"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import * as Tone from "tone";
import StaffDisplay from "@/components/StaffDisplay";
import {
  staffTemplates,
  StaffClef,
  StaffDuration,
  StaffNote,
  StaffPart,
  StaffTemplate,
} from "@/lib/music/staffTemplates";

type EditMode = "note" | "insert" | "erase";
type TripletDuration = "16" | "8" | "q";
type GhostState = { x: number; y: number; pitch: string; insertIndex: number } | null;
type DragState = { staffId: string; noteIndex: number } | null;

const clefOptions: StaffClef[] = ["treble", "bass", "alto", "tenor"];
const timeSignatures = ["2/4", "3/4", "4/4", "6/8"];
const keySignatures = ["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
const soundModes: StaffPart["instrument"][] = ["lead", "piano", "bass", "strings", "bell"];
const accidentalOptions = ["", "#", "b"];
const pitchLanesByClef: Record<StaffClef, string[]> = {
  treble: ["G5", "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3"],
  bass: ["B3", "A3", "G3", "F3", "E3", "D3", "C3", "B2", "A2", "G2", "F2", "E2", "D2"],
  alto: ["D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3"],
  tenor: ["G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "D3", "C3", "B2"],
};

const keyAccidentals: Record<string, Record<string, string>> = {
  G: { F: "#" },
  D: { F: "#", C: "#" },
  A: { F: "#", C: "#", G: "#" },
  E: { F: "#", C: "#", G: "#", D: "#" },
  B: { F: "#", C: "#", G: "#", D: "#", A: "#" },
  "F#": { F: "#", C: "#", G: "#", D: "#", A: "#", E: "#" },
  "C#": { F: "#", C: "#", G: "#", D: "#", A: "#", E: "#", B: "#" },
  F: { B: "b" },
  Bb: { B: "b", E: "b" },
  Eb: { B: "b", E: "b", A: "b" },
  Ab: { B: "b", E: "b", A: "b", D: "b" },
  Db: { B: "b", E: "b", A: "b", D: "b", G: "b" },
  Gb: { B: "b", E: "b", A: "b", D: "b", G: "b", C: "b" },
  Cb: { B: "b", E: "b", A: "b", D: "b", G: "b", C: "b", F: "b" },
};

const durationOptions: { value: StaffDuration; label: string }[] = [
  { value: "16", label: "16th" },
  { value: "8", label: "8th" },
  { value: "8d", label: "Dotted 8th" },
  { value: "q", label: "Quarter" },
  { value: "qd", label: "Dotted quarter" },
  { value: "h", label: "Half" },
  { value: "hd", label: "Dotted half" },
  { value: "w", label: "Whole" },
];

const tripletOptions: { value: TripletDuration; label: string; kind: NonNullable<StaffNote["tupletKind"]>; actualBeats: number }[] = [
  { value: "16", label: "16th triplet", kind: "sixteenth-triplet", actualBeats: 1 / 6 },
  { value: "8", label: "8th triplet", kind: "eighth-triplet", actualBeats: 1 / 3 },
  { value: "q", label: "Quarter triplet", kind: "quarter-triplet", actualBeats: 2 / 3 },
];

function durationToTone(duration: StaffDuration | string) {
  if (duration === "w") return "1n";
  if (duration === "hd" || duration === "h") return "2n";
  if (duration === "8" || duration === "8d") return "8n";
  if (duration === "16") return "16n";
  return "4n";
}

function durationToSeconds(duration: StaffDuration | string, tempo: number) {
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

function noteBeats(duration: StaffDuration | string) {
  if (duration === "w") return 4;
  if (duration === "hd") return 3;
  if (duration === "h") return 2;
  if (duration === "qd") return 1.5;
  if (duration === "q") return 1;
  if (duration === "8d") return 0.75;
  if (duration === "8") return 0.5;
  return 0.25;
}

function staffNoteBeats(note: StaffNote) {
  return note.actualBeats ?? noteBeats(note.duration);
}

function timeSignatureBeats(timeSignature: string) {
  if (timeSignature === "2/4") return 2;
  if (timeSignature === "3/4") return 3;
  if (timeSignature === "6/8") return 3;
  return 4;
}

function cloneTemplate(template: StaffTemplate): StaffTemplate {
  const staves = (template.staves?.length
    ? template.staves
    : [{ id: "staff-1", name: "Staff 1", clef: template.clef, instrument: "lead", notes: template.notes } as StaffPart]
  ).map((staff) => ({ ...staff, notes: staff.notes.map((note) => ({ ...note })) }));

  const base = {
    ...template,
    notes: staves[0]?.notes.map((note) => ({ ...note })) ?? [],
    staves,
  };

  return {
    ...base,
    measureCount: Math.max(template.measureCount ?? 1, neededMeasuresForTemplate(base)),
  };
}

function normalizeTemplate(template: StaffTemplate): StaffTemplate {
  const cloned = cloneTemplate(template);
  return { ...cloned, notes: cloned.staves?.[0]?.notes ?? cloned.notes };
}

function displayDuration(duration: StaffDuration | string) {
  return durationOptions.find((item) => item.value === duration)?.label ?? duration;
}

function synthForMode(mode: StaffPart["instrument"]) {
  if (mode === "bass") return new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.02, decay: 0.12, sustain: 0.7, release: 0.45 } }).toDestination();
  if (mode === "strings") return new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.08, decay: 0.18, sustain: 0.72, release: 0.8 } }).toDestination();
  if (mode === "bell") return new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.45, sustain: 0.12, release: 1.1 } }).toDestination();
  if (mode === "piano") return new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.22, sustain: 0.22, release: 0.55 } }).toDestination();
  return new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.02, decay: 0.2, sustain: 0.5, release: 0.5 } }).toDestination();
}

function totalSecondsForTemplate(template: StaffTemplate) {
  const staves = template.staves?.length ? template.staves : [{ notes: template.notes } as StaffPart];
  return Math.max(0, ...staves.map((staff) => staff.notes.reduce((sum, note) => sum + durationToSeconds(note.duration, template.tempo), 0)));
}

function neededMeasuresForTemplate(template: StaffTemplate) {
  const beatsPerMeasure = timeSignatureBeats(template.timeSignature);
  const staves = template.staves?.length ? template.staves : [{ notes: template.notes } as StaffPart];
  const maxBeats = Math.max(0, ...staves.map((staff) => staff.notes.reduce((sum, note) => sum + staffNoteBeats(note), 0)));
  return Math.max(1, Math.ceil(maxBeats / beatsPerMeasure));
}

function staffTemplateForDisplay(template: StaffTemplate, staff: StaffPart) {
  return {
    id: `${template.id}-${staff.id}`,
    title: staff.name,
    description: template.description,
    clef: staff.clef,
    keySignature: template.keySignature,
    timeSignature: template.timeSignature,
    tempo: template.tempo,
    notes: staff.notes,
    settings: {
      measures: Math.max(template.measureCount ?? 1, neededMeasuresForTemplate(template)),
    },
  };
}

function pitchWithAccidental(basePitch: string, accidental: string) {
  return basePitch.replace(/^([A-G])/, `$1${accidental}`);
}

function eventPosition(event: MouseEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
    y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
    width: rect.width,
    height: rect.height,
  };
}

function editorStaffPosition(event: MouseEvent<HTMLDivElement>) {
  const raw = eventPosition(event);
  const staffTop = 34;
  const staffHeight = 72;
  const yOnStaff = Math.max(0, Math.min(staffHeight, raw.y - staffTop));
  return {
    ...raw,
    staffTop,
    staffHeight,
    yOnStaff,
  };
}

function pitchFromY(y: number, height: number, accidental: string, clef: StaffClef, keySignature: string) {
  const lane = pitchLanesByClef[clef] ?? pitchLanesByClef.treble;
  const index = Math.max(0, Math.min(lane.length - 1, Math.floor((y / Math.max(height, 1)) * lane.length)));
  const basePitch = lane[index];
  const keyAccidental = keyAccidentals[keySignature]?.[basePitch.charAt(0)] ?? "";
  return pitchWithAccidental(basePitch, accidental || keyAccidental);
}

function indexFromX(x: number, width: number, count: number) {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count, Math.round((x / Math.max(width, 1)) * count)));
}

function measureMessage(notes: StaffNote[], insertionIndex: number, duration: StaffDuration, timeSignature: string, autoJump: boolean) {
  const beatsPerMeasure = timeSignatureBeats(timeSignature);
  const beatsBefore = notes.slice(0, insertionIndex).reduce((sum, note) => sum + staffNoteBeats(note), 0);
  const usedInMeasure = beatsBefore % beatsPerMeasure;
  const nextBeats = noteBeats(duration);

  if (usedInMeasure + nextBeats > beatsPerMeasure + 0.001) {
    return autoJump
      ? "That note would overflow this measure, so AudvynLab will visually continue into the next measure."
      : "Heads up: that input overfills the current measure. Turn on auto-measure jumping or use a shorter duration.";
  }

  return "";
}

export default function StaffTemplatePlayer() {
  const [templatesOpen, setTemplatesOpen] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState(staffTemplates[0].id);
  const [score, setScore] = useState<StaffTemplate>(() => normalizeTemplate(staffTemplates[0]));
  const [selectedStaffId, setSelectedStaffId] = useState(score.staves?.[0]?.id ?? "staff-1");
  const [selectedDuration, setSelectedDuration] = useState<StaffDuration>("q");
  const [selectedAccidental, setSelectedAccidental] = useState("");
  const [isRestInput, setIsRestInput] = useState(false);
  const [autoMeasureJump, setAutoMeasureJump] = useState(true);
  const [editMode, setEditMode] = useState<EditMode>("note");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadSeconds, setPlayheadSeconds] = useState(0);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [draggingNote, setDraggingNote] = useState<DragState>(null);
  const [ghost, setGhost] = useState<GhostState>(null);
  const [labMessage, setLabMessage] = useState("Click directly on the score to add notes. Use Insert or Erase mode for faster editing.");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopHandles = useRef<ReturnType<typeof setTimeout>[]>([]);

  const staves = score.staves?.length ? score.staves : [];
  const selectedStaff = staves.find((staff) => staff.id === selectedStaffId) ?? staves[0];
  const totalSeconds = totalSecondsForTemplate(score);
  const progressPercent = totalSeconds > 0 ? Math.min(100, (playheadSeconds / totalSeconds) * 100) : 0;

  const selectedOriginal = useMemo(() => staffTemplates.find((template) => template.id === selectedTemplateId) ?? staffTemplates[0], [selectedTemplateId]);

  function stopPlayback() {
    stopHandles.current.forEach((handle) => clearTimeout(handle));
    stopHandles.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
  }

  useEffect(() => () => stopPlayback(), []);

  function chooseTemplate(template: StaffTemplate) {
    stopPlayback();
    const next = normalizeTemplate(template);
    setSelectedTemplateId(template.id);
    setScore(next);
    setSelectedStaffId(next.staves?.[0]?.id ?? "staff-1");
    setSelectedNoteIndex(null);
    setPlayheadSeconds(0);
    setLabMessage(template.id === "blank-score" ? "Blank score ready. Click the score to start writing." : `${template.title} loaded.`);
  }

  function updateScore(update: (current: StaffTemplate) => StaffTemplate) {
    setScore((current) => {
      const next = update(current);
      return { ...next, notes: next.staves?.[0]?.notes ?? next.notes };
    });
  }

  function updateSelectedStaff(update: (staff: StaffPart) => StaffPart) {
    updateScore((current) => ({
      ...current,
      staves: (current.staves ?? []).map((staff) => (staff.id === selectedStaffId ? update(staff) : staff)),
    }));
  }

  function setScoreField<K extends keyof Pick<StaffTemplate, "title" | "description" | "keySignature" | "timeSignature" | "tempo">>(key: K, value: StaffTemplate[K]) {
    updateScore((current) => ({ ...current, [key]: value }));
  }

  function addStaff(clef: StaffClef = "treble") {
    updateScore((current) => {
      const id = `staff-${Date.now()}`;
      const nextStaff: StaffPart = {
        id,
        name: `Staff ${(current.staves?.length ?? 0) + 1}`,
        clef,
        instrument: clef === "bass" ? "bass" : "lead",
        notes: [],
      };
      setSelectedStaffId(id);
      setSelectedNoteIndex(null);
      return { ...current, staves: [...(current.staves ?? []), nextStaff] };
    });
  }

  function removeSelectedStaff() {
    if (staves.length <= 1 || !selectedStaff) return;
    updateScore((current) => {
      const nextStaves = (current.staves ?? []).filter((staff) => staff.id !== selectedStaff.id);
      setSelectedStaffId(nextStaves[0]?.id ?? "staff-1");
      setSelectedNoteIndex(null);
      return { ...current, staves: nextStaves };
    });
  }

  function clearSelectedStaff() {
    updateSelectedStaff((staff) => ({ ...staff, notes: [] }));
    setSelectedNoteIndex(null);
    setLabMessage("Selected staff cleared.");
  }

  function clearAllStaves() {
    updateScore((current) => ({
      ...current,
      staves: (current.staves ?? []).map((staff) => ({ ...staff, notes: [] })),
    }));
    setSelectedNoteIndex(null);
    setLabMessage("All staves cleared.");
  }

  function addMeasure() {
    updateScore((current) => ({ ...current, measureCount: Math.max(1, (current.measureCount ?? 1) + 1) }));
    setLabMessage("Added one empty measure to the score layout.");
  }

  function removeMeasure() {
    updateScore((current) => {
      const required = neededMeasuresForTemplate(current);
      const nextCount = Math.max(1, (current.measureCount ?? required) - 1);
      if (nextCount < required) {
        setLabMessage("That measure contains or is needed by existing notes, so no note data was removed. Delete notes first to fully remove it.");
        return { ...current, measureCount: required };
      }
      setLabMessage("Removed one empty measure from the score layout.");
      return { ...current, measureCount: nextCount };
    });
  }

  function resetTemplate() {
    chooseTemplate(selectedOriginal);
  }

  function insertNote(staff: StaffPart, pitch: string, index: number) {
    const newNote: StaffNote = { pitch, duration: selectedDuration, isRest: isRestInput };
    const warning = measureMessage(staff.notes, index, selectedDuration, score.timeSignature, autoMeasureJump);
    updateScore((current) => {
      const nextStaves = (current.staves ?? []).map((currentStaff) =>
        currentStaff.id === staff.id
          ? { ...currentStaff, notes: [...currentStaff.notes.slice(0, index), newNote, ...currentStaff.notes.slice(index)] }
          : currentStaff,
      );
      const nextScore = { ...current, staves: nextStaves };
      const needed = neededMeasuresForTemplate(nextScore);
      return { ...nextScore, measureCount: autoMeasureJump ? Math.max(current.measureCount ?? 1, needed) : current.measureCount };
    });
    setSelectedNoteIndex(index);
    setLabMessage(warning || `Inserted ${isRestInput ? "rest" : pitch} at position ${index + 1}.`);
  }

  function removeNoteAt(index: number) {
    if (!selectedStaff || index < 0 || index >= selectedStaff.notes.length) return;
    const removed = selectedStaff.notes[index];
    updateSelectedStaff((staff) => ({ ...staff, notes: staff.notes.filter((_, noteIndex) => noteIndex !== index) }));
    setSelectedNoteIndex(null);
    setLabMessage(`Removed ${removed.isRest ? "rest" : removed.pitch}.`);
  }

  function updateNotePitch(staffId: string, noteIndex: number, pitch: string) {
    updateScore((current) => ({
      ...current,
      staves: (current.staves ?? []).map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              notes: staff.notes.map((note, index) =>
                index === noteIndex && !note.isRest ? { ...note, pitch } : note,
              ),
            }
          : staff,
      ),
    }));
  }

  function handleNotePointerDown(staff: StaffPart, noteIndex: number) {
    setSelectedStaffId(staff.id);
    setSelectedNoteIndex(noteIndex);
    setDraggingNote({ staffId: staff.id, noteIndex });
    setLabMessage("Drag up or down to change pitch. Release to keep the new note position.");
  }

  function stopNoteDrag() {
    if (draggingNote) setLabMessage("Note pitch updated.");
    setDraggingNote(null);
  }

  function addTriplet(duration: TripletDuration) {
    if (!selectedStaff) return;
    const option = tripletOptions.find((item) => item.value === duration) ?? tripletOptions[1];
    const group = `triplet-${Date.now()}`;
    const middle = Math.max(0, Math.floor(selectedStaff.notes.length / 2));
    const pitches = ["E4", "G4", "B4"].map((pitch) => pitchWithAccidental(pitch, selectedAccidental));
    const tripletNotes: StaffNote[] = pitches.map((pitch, index) => ({
      pitch,
      duration: option.value,
      actualBeats: option.actualBeats,
      tupletGroup: group,
      tupletKind: option.kind,
      tupletIndex: index,
      tupletTotal: 3,
      tupletNotesOccupied: 2,
    }));

    updateSelectedStaff((staff) => ({
      ...staff,
      notes: [...staff.notes.slice(0, middle), ...tripletNotes, ...staff.notes.slice(middle)],
    }));
    setSelectedNoteIndex(middle);
    setLabMessage(`Added a ${option.label} group. Select and drag each note to adjust its pitch.`);
  }

  function handleScoreMove(staff: StaffPart, event: MouseEvent<HTMLDivElement>) {
    const position = editorStaffPosition(event);
    const pitch = pitchFromY(position.yOnStaff, position.staffHeight, selectedAccidental, staff.clef, score.keySignature);
    const insertIndex = indexFromX(position.x, position.width, staff.notes.length);

    if (draggingNote && draggingNote.staffId === staff.id) {
      updateNotePitch(staff.id, draggingNote.noteIndex, pitch);
    }

    setGhost({ x: position.x, y: position.y, pitch, insertIndex });
  }

  function handleScoreClick(staff: StaffPart, event: MouseEvent<HTMLDivElement>) {
    if (draggingNote) return;
    setSelectedStaffId(staff.id);
    const position = editorStaffPosition(event);
    const pitch = pitchFromY(position.yOnStaff, position.staffHeight, selectedAccidental, staff.clef, score.keySignature);
    const clickedIndex = staff.notes.length === 0 ? 0 : Math.max(0, Math.min(staff.notes.length - 1, Math.floor((position.x / Math.max(position.width, 1)) * staff.notes.length)));
    const insertionIndex = indexFromX(position.x, position.width, staff.notes.length);

    if (editMode === "erase") {
      removeNoteAt(clickedIndex);
      return;
    }

    if (editMode === "insert") {
      insertNote(staff, pitch, insertionIndex);
      return;
    }

    insertNote(staff, pitch, staff.notes.length);
  }

  async function playScore(startAtSeconds = playheadSeconds) {
    if (totalSeconds <= 0) return;
    stopPlayback();
    await Tone.start();
    setIsPlaying(true);
    setPlayheadSeconds(startAtSeconds);

    const activeStaves = staves.filter((staff) => !staff.muted);
    const soloStaves = activeStaves.filter((staff) => staff.solo);
    const playbackStaves = soloStaves.length > 0 ? soloStaves : activeStaves;
    const startedAt = Date.now() - startAtSeconds * 1000;

    playbackStaves.forEach((staff) => {
      const synth = synthForMode(staff.instrument);
      let offset = 0;

      staff.notes.forEach((note) => {
        const noteStart = offset;
        const noteLength = durationToSeconds(note.duration, score.tempo);
        const delay = noteStart - startAtSeconds;

        if (delay >= -0.001 && !note.isRest) {
          const handle = setTimeout(() => synth.triggerAttackRelease(note.pitch, durationToTone(note.duration)), Math.max(0, delay * 1000));
          stopHandles.current.push(handle);
        }

        offset += noteLength;
      });

      const disposeHandle = setTimeout(() => synth.dispose(), Math.max(1000, (offset - startAtSeconds) * 1000 + 1200));
      stopHandles.current.push(disposeHandle);
    });

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      if (elapsed >= totalSeconds) {
        setPlayheadSeconds(totalSeconds);
        stopPlayback();
        return;
      }
      setPlayheadSeconds(elapsed);
    }, 80);
  }

  return (
    <div className="space-y-6">
      <details open={templatesOpen} onToggle={(event) => setTemplatesOpen(event.currentTarget.open)} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <summary className="cursor-pointer text-lg font-semibold text-white">Templates</summary>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Load a starter score, then edit it in AudvynLab. Descriptions appear only for the selected template.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {staffTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => chooseTemplate(template)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedTemplateId === template.id ? "border-violet-400/70 bg-violet-500/15" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06]"
              }`}
            >
              <p className="font-medium text-white">{template.title}</p>
              {selectedTemplateId === template.id && <p className="mt-2 text-sm leading-6 text-zinc-400">{template.description}</p>}
              <p className="mt-3 text-xs text-zinc-500">{template.staves?.length ?? 1} staff/staves · {template.timeSignature} · {template.keySignature}</p>
            </button>
          ))}
        </div>
      </details>

      <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-300">AUDVYNLAB</p>
            <input value={score.title} onChange={(event) => setScoreField("title", event.target.value)} className="mt-3 w-full max-w-2xl bg-transparent text-3xl font-semibold tracking-tight text-white outline-none focus:text-violet-100" />
            <textarea value={score.description} onChange={(event) => setScoreField("description", event.target.value)} rows={2} className="mt-3 w-full max-w-3xl resize-none bg-transparent leading-7 text-zinc-400 outline-none focus:text-zinc-200" />
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-950 p-4">
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            <label className="text-xs text-zinc-400">Key<select value={score.keySignature} onChange={(event) => setScoreField("keySignature", event.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white">{keySignatures.map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
            <label className="text-xs text-zinc-400">Time<select value={score.timeSignature} onChange={(event) => setScoreField("timeSignature", event.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white">{timeSignatures.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
            <label className="text-xs text-zinc-400">Tempo<input type="number" min={36} max={220} value={score.tempo} onChange={(event) => setScoreField("tempo", Number(event.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white" /></label>
            <label className="text-xs text-zinc-400">Duration<select value={selectedDuration} onChange={(event) => setSelectedDuration(event.target.value as StaffDuration)} className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white">{durationOptions.map((duration) => <option key={duration.value} value={duration.value}>{duration.label}</option>)}</select></label>
            <label className="text-xs text-zinc-400">Accidental<select value={selectedAccidental} onChange={(event) => setSelectedAccidental(event.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white">{accidentalOptions.map((accidental) => <option key={accidental || "natural"} value={accidental}>{accidental || "Natural"}</option>)}</select></label>
            <label className="flex items-end gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-300"><input type="checkbox" checked={isRestInput} onChange={(event) => setIsRestInput(event.target.checked)} /> Rest</label>
            <label className="flex items-end gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-300"><input type="checkbox" checked={autoMeasureJump} onChange={(event) => setAutoMeasureJump(event.target.checked)} /> Auto-measure jump</label>
            <div className="flex gap-2 md:col-span-2 xl:col-span-1">
              <button onClick={() => playScore()} disabled={isPlaying || totalSeconds <= 0} className="flex-1 rounded-full bg-violet-500 px-4 py-2 font-medium text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">Play</button>
              <button onClick={stopPlayback} disabled={!isPlaying} className="flex-1 rounded-full border border-white/15 px-4 py-2 font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">Stop</button>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-zinc-400"><span>Playback</span><span>{playheadSeconds.toFixed(1)}s / {totalSeconds.toFixed(1)}s</span></div>
            <input type="range" min={0} max={Math.max(totalSeconds, 0.1)} step={0.05} value={Math.min(playheadSeconds, Math.max(totalSeconds, 0.1))} onChange={(event) => { const next = Number(event.target.value); setPlayheadSeconds(next); if (isPlaying) playScore(next); }} className="w-full accent-violet-500" />
            <div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-1 rounded-full bg-violet-500" style={{ width: `${progressPercent}%` }} /></div>
            <p className="mt-2 text-xs text-zinc-500">{labMessage}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="mr-1 font-semibold uppercase tracking-[0.16em] text-zinc-500">Staves</span>
            {staves.map((staff) => (
              <button key={staff.id} onClick={() => { setSelectedStaffId(staff.id); setSelectedNoteIndex(null); }} className={`rounded-full border px-3 py-1 ${selectedStaffId === staff.id ? "border-violet-400 bg-violet-500/15 text-white" : "border-white/10 text-zinc-300 hover:bg-white/10"}`}>{staff.name}</button>
            ))}
            <button onClick={() => addStaff()} className="rounded-full border border-white/15 px-3 py-1 text-white hover:bg-white/10">Add staff</button>
            <button onClick={removeSelectedStaff} disabled={staves.length <= 1} className="rounded-full border border-red-400/40 px-3 py-1 text-red-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50">Remove staff</button>
            <span className="mx-1 h-5 w-px bg-white/10" />
            <button onClick={() => setEditMode("note")} className={`rounded-full border px-3 py-1 font-medium ${editMode === "note" ? "border-emerald-400 bg-emerald-500/15 text-emerald-100" : "border-white/15 text-white hover:bg-white/10"}`}>♪ Add note</button>
            <button onClick={() => setEditMode("insert")} className={`rounded-full border px-3 py-1 font-medium ${editMode === "insert" ? "border-violet-400 bg-violet-500/15 text-white" : "border-white/15 text-white hover:bg-white/10"}`}>↔ Insert</button>
            <button onClick={() => setEditMode("erase")} className={`rounded-full border px-3 py-1 font-medium ${editMode === "erase" ? "border-red-400 bg-red-500/15 text-red-100" : "border-white/15 text-white hover:bg-white/10"}`}>⌫ Erase</button>
            <button onClick={addMeasure} className="rounded-full border border-white/15 px-3 py-1 text-white hover:bg-white/10">+ Measure</button>
            <button onClick={removeMeasure} className="rounded-full border border-white/15 px-3 py-1 text-white hover:bg-white/10">- Measure</button>
            <span className="mx-1 h-5 w-px bg-white/10" />
            {tripletOptions.map((triplet) => (
              <button key={triplet.value} onClick={() => addTriplet(triplet.value)} className="rounded-full border border-sky-400/40 px-3 py-1 text-sky-100 hover:bg-sky-500/10">{triplet.label}</button>
            ))}
            <button onClick={clearSelectedStaff} disabled={!selectedStaff || selectedStaff.notes.length === 0} className="rounded-full border border-red-400/40 px-3 py-1 text-red-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50">Clear staff</button>
            <button onClick={clearAllStaves} className="rounded-full border border-red-400/40 px-3 py-1 text-red-200 hover:bg-red-500/10">Clear all</button>
          </div>

          {selectedStaff && (
            <div className="mt-2 grid gap-2 md:grid-cols-4">
              <input value={selectedStaff.name} onChange={(event) => updateSelectedStaff((staff) => ({ ...staff, name: event.target.value }))} className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white" />
              <select value={selectedStaff.clef} onChange={(event) => updateSelectedStaff((staff) => ({ ...staff, clef: event.target.value as StaffClef }))} className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white">{clefOptions.map((clef) => <option key={clef} value={clef}>{clef}</option>)}</select>
              <select value={selectedStaff.instrument} onChange={(event) => updateSelectedStaff((staff) => ({ ...staff, instrument: event.target.value as StaffPart["instrument"] }))} className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white">{soundModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}</select>
              <div className="flex gap-2"><button onClick={() => updateSelectedStaff((staff) => ({ ...staff, muted: !staff.muted }))} className={`flex-1 rounded-full border px-3 py-2 text-sm ${selectedStaff.muted ? "border-red-400/50 bg-red-500/10 text-red-100" : "border-white/15 text-white"}`}>{selectedStaff.muted ? "Muted" : "Mute"}</button><button onClick={() => updateSelectedStaff((staff) => ({ ...staff, solo: !staff.solo }))} className={`flex-1 rounded-full border px-3 py-2 text-sm ${selectedStaff.solo ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-100" : "border-white/15 text-white"}`}>{selectedStaff.solo ? "Solo on" : "Solo"}</button></div>
            </div>
          )}
        </div>

        <div className="mt-5 max-h-[720px] overflow-auto rounded-3xl border border-white/10 bg-white p-4">
          <div className="min-w-[980px] rounded-2xl bg-white px-4 py-3 text-zinc-900">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span>{score.title || "Untitled score"}</span>
              <span>{score.measureCount ?? 1} measure{(score.measureCount ?? 1) === 1 ? "" : "s"}</span>
            </div>
            <div className="relative border-l-2 border-zinc-950 pl-0">
              {staves.map((staff, staffIndex) => (
                <div key={staff.id} className={`relative ${staffIndex > 0 ? "-mt-2" : ""}`}>
                  <div className="mb-[-8px] flex items-center justify-between px-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    <button onClick={() => { setSelectedStaffId(staff.id); setSelectedNoteIndex(null); }} className={`rounded-full px-2 py-1 text-left ${selectedStaffId === staff.id ? "bg-violet-100 text-violet-700" : "hover:bg-zinc-100"}`}>{staff.name}</button>
                    <span>{staff.clef} · {staff.instrument}</span>
                  </div>
                  <div
                    onMouseMove={(event) => handleScoreMove(staff, event)}
                    onMouseUp={stopNoteDrag}
                    onMouseLeave={() => { setGhost(null); stopNoteDrag(); }}
                    onClick={(event) => handleScoreClick(staff, event)}
                    className="relative cursor-crosshair"
                  >
                    <div className="pointer-events-none absolute left-0 right-0 top-[34px] z-10 grid h-[72px]" style={{ gridTemplateColumns: `repeat(${Math.max(1, score.measureCount ?? 1)}, minmax(120px, 1fr))` }}>
                      {Array.from({ length: Math.max(1, score.measureCount ?? 1) }, (_, index) => (
                        <div key={index} className="border-r border-violet-400/0 hover:border-violet-400/50" />
                      ))}
                    </div>
                    <StaffDisplay compact template={staffTemplateForDisplay(score, staff)} />
                    <div className="absolute inset-x-0 top-[34px] h-[72px] z-20 pointer-events-none">
                      {staff.notes.map((note, noteIndex) => {
                        const left = `${((noteIndex + 0.5) / Math.max(staff.notes.length, 1)) * 100}%`;
                        return (
                          <button
                            key={`${staff.id}-${noteIndex}-${note.pitch}-${note.duration}`}
                            onMouseDown={(event) => { event.preventDefault(); event.stopPropagation(); handleNotePointerDown(staff, noteIndex); }}
                            onClick={(event) => { event.preventDefault(); event.stopPropagation(); setSelectedStaffId(staff.id); setSelectedNoteIndex(noteIndex); }}
                            className={`pointer-events-auto absolute top-1/2 h-12 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border text-[10px] font-semibold transition ${
                              selectedStaffId === staff.id && selectedNoteIndex === noteIndex
                                ? "border-violet-500 bg-violet-500/20 text-violet-700"
                                : "border-transparent bg-transparent text-transparent hover:border-violet-300 hover:bg-violet-100/60 hover:text-violet-700"
                            }`}
                            style={{ left }}
                            title={note.isRest ? `Rest ${noteIndex + 1}` : `${note.pitch} ${displayDuration(note.duration)}`}
                          >
                            {note.isRest ? "rest" : note.pitch.replace(/\d$/, "")}
                          </button>
                        );
                      })}
                    </div>
                    {selectedStaffId === staff.id && ghost && (
                      <div className="pointer-events-none absolute z-30" style={{ left: ghost.x, top: ghost.y }}>
                        <span className={`absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white ${editMode === "erase" ? "border-red-500" : editMode === "insert" ? "border-violet-500" : "border-emerald-500"}`} />
                        <span className={`absolute left-4 top-[-34px] whitespace-nowrap rounded-full border px-2 py-1 text-xs font-semibold shadow-lg ${editMode === "erase" ? "border-red-400 bg-red-500 text-white" : editMode === "insert" ? "border-violet-500 bg-violet-500 text-white" : "border-emerald-500 bg-emerald-500 text-white"}`}>
                          {editMode === "erase" ? "erase" : isRestInput ? "rest" : ghost.pitch}
                          <span className="absolute -bottom-1 left-2 h-2 w-2 rotate-45 bg-inherit" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedStaff && selectedStaff.notes.length > 0 && (
          <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <h3 className="font-semibold text-white">Selected staff sequence</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedStaff.notes.map((note, index) => (
                <button key={`${note.pitch}-${note.duration}-${index}`} onMouseDown={() => handleNotePointerDown(selectedStaff, index)} onClick={() => setSelectedNoteIndex(index)} className={`rounded-full border px-3 py-1 text-sm ${selectedNoteIndex === index ? "border-violet-400 bg-violet-500/20 text-white" : "border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07]"}`}>
                  {index + 1}. {note.isRest ? "Rest" : note.pitch} / {displayDuration(note.duration)}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
