export type StaffDuration = "16" | "8" | "8d" | "q" | "qd" | "h" | "hd" | "w";
export type StaffClef = "treble" | "bass" | "alto" | "tenor";

export type StaffNote = {
  pitch: string;
  duration: StaffDuration;
  isRest?: boolean;
  measureNumber?: number;
  actualBeats?: number;
  tupletGroup?: string;
  tupletKind?: "eighth-triplet" | "sixteenth-triplet" | "quarter-triplet";
  tupletIndex?: number;
  tupletTotal?: number;
  tupletNotesOccupied?: number;
};

export type StaffPart = {
  id: string;
  name: string;
  clef: StaffClef;
  instrument: "lead" | "piano" | "bass" | "strings" | "bell";
  muted?: boolean;
  solo?: boolean;
  notes: StaffNote[];
};

export type StaffTemplate = {
  id: string;
  title: string;
  description: string;
  clef: StaffClef;
  timeSignature: string;
  keySignature: string;
  tempo: number;
  notes: StaffNote[];
  staves?: StaffPart[];
  measureCount?: number;
};

export function createSingleStaffTemplate(template: Omit<StaffTemplate, "staves">): StaffTemplate {
  return {
    measureCount: template.measureCount ?? 4,
    ...template,
    staves: [
      {
        id: "staff-1",
        name: "Staff 1",
        clef: template.clef,
        instrument: "lead",
        notes: template.notes,
      },
    ],
  };
}

export const staffTemplates: StaffTemplate[] = [
  {
    id: "blank-score",
    title: "Blank Score",
    description: "Start from an empty single-staff workspace and build your own score from scratch.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 90,
    measureCount: 4,
    notes: [],
    staves: [
      {
        id: "staff-1",
        name: "Staff 1",
        clef: "treble",
        instrument: "lead",
        notes: [],
      },
    ],
  },
  createSingleStaffTemplate({
    id: "c-major-scale",
    title: "C Major Scale",
    description: "A simple one-octave C major scale in quarter notes.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 90,
    notes: [
      { pitch: "C4", duration: "q" },
      { pitch: "D4", duration: "q" },
      { pitch: "E4", duration: "q" },
      { pitch: "F4", duration: "q" },
      { pitch: "G4", duration: "q" },
      { pitch: "A4", duration: "q" },
      { pitch: "B4", duration: "q" },
      { pitch: "C5", duration: "q" },
    ],
  }),
  createSingleStaffTemplate({
    id: "minor-third-builder",
    title: "Minor Third Builder",
    description: "Hear and see minor thirds starting from C, D, E, and A.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 80,
    notes: [
      { pitch: "C4", duration: "q" },
      { pitch: "Eb4", duration: "q" },
      { pitch: "D4", duration: "q" },
      { pitch: "F4", duration: "q" },
      { pitch: "E4", duration: "q" },
      { pitch: "G4", duration: "q" },
      { pitch: "A4", duration: "q" },
      { pitch: "C5", duration: "q" },
    ],
  }),
  createSingleStaffTemplate({
    id: "major-triad-arpeggio",
    title: "Major Triad Arpeggio",
    description: "C major, F major, and G major triads as broken chords.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 90,
    notes: [
      { pitch: "C4", duration: "q" },
      { pitch: "E4", duration: "q" },
      { pitch: "G4", duration: "q" },
      { pitch: "C5", duration: "q" },
      { pitch: "F4", duration: "q" },
      { pitch: "A4", duration: "q" },
      { pitch: "C5", duration: "q" },
      { pitch: "F5", duration: "q" },
      { pitch: "G4", duration: "q" },
      { pitch: "B4", duration: "q" },
      { pitch: "D5", duration: "q" },
      { pitch: "G5", duration: "q" },
    ],
  }),
  createSingleStaffTemplate({
    id: "rhythm-quarter-half",
    title: "Quarter and Half Note Rhythm",
    description: "A beginner rhythm-reading template using quarters and halves.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 84,
    notes: [
      { pitch: "C4", duration: "q" },
      { pitch: "C4", duration: "q" },
      { pitch: "D4", duration: "h" },
      { pitch: "E4", duration: "q" },
      { pitch: "E4", duration: "q" },
      { pitch: "D4", duration: "h" },
    ],
  }),
  {
    id: "piano-two-staff-sketch",
    title: "Two-Staff Piano Sketch",
    description: "A grand-staff classroom sketch with right-hand melody and left-hand bass support.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 88,
    notes: [
      { pitch: "C4", duration: "q" },
      { pitch: "E4", duration: "q" },
      { pitch: "G4", duration: "q" },
      { pitch: "C5", duration: "q" },
    ],
    staves: [
      {
        id: "right-hand",
        name: "Right Hand",
        clef: "treble",
        instrument: "piano",
        notes: [
          { pitch: "C4", duration: "q" },
          { pitch: "E4", duration: "q" },
          { pitch: "G4", duration: "q" },
          { pitch: "C5", duration: "q" },
          { pitch: "B4", duration: "q" },
          { pitch: "G4", duration: "q" },
          { pitch: "E4", duration: "q" },
          { pitch: "C4", duration: "q" },
        ],
      },
      {
        id: "left-hand",
        name: "Left Hand",
        clef: "bass",
        instrument: "bass",
        notes: [
          { pitch: "C3", duration: "h" },
          { pitch: "G2", duration: "h" },
          { pitch: "A2", duration: "h" },
          { pitch: "F2", duration: "h" },
        ],
      },
    ],
  },
  {
    id: "four-part-chorale-start",
    title: "Four-Part Chorale Starter",
    description: "Soprano, alto, tenor, and bass staves for harmony teaching and simple voicing.",
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "C",
    tempo: 72,
    notes: [
      { pitch: "C5", duration: "h" },
      { pitch: "B4", duration: "h" },
    ],
    staves: [
      { id: "soprano", name: "Soprano", clef: "treble", instrument: "lead", notes: [{ pitch: "E5", duration: "h" }, { pitch: "D5", duration: "h" }, { pitch: "C5", duration: "w" }] },
      { id: "alto", name: "Alto", clef: "treble", instrument: "strings", notes: [{ pitch: "C5", duration: "h" }, { pitch: "B4", duration: "h" }, { pitch: "G4", duration: "w" }] },
      { id: "tenor", name: "Tenor", clef: "tenor", instrument: "strings", notes: [{ pitch: "G3", duration: "h" }, { pitch: "G3", duration: "h" }, { pitch: "E3", duration: "w" }] },
      { id: "bass", name: "Bass", clef: "bass", instrument: "bass", notes: [{ pitch: "C3", duration: "h" }, { pitch: "G2", duration: "h" }, { pitch: "C3", duration: "w" }] },
    ],
  },
];