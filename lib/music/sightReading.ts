import type { StaffTemplate, StaffNote } from "@/lib/music/staffTemplates";

export type SightReadingLevel = "level-1" | "level-2" | "level-3";
export type SightReadingClef = "treble" | "bass" | "alto" | "tenor";
export type SightReadingTimeSignature = "2/4" | "3/4" | "4/4" | "6/8";
export type SightReadingRhythmDifficulty = "simple" | "mixed" | "syncopated";
export type SightReadingPitchDifficulty = "stepwise" | "small-leaps" | "wide-leaps";
export type StaffDuration = "16" | "8" | "8d" | "q" | "qd" | "h" | "hd" | "w";
export type TupletKind = "eighth-triplet" | "sixteenth-triplet" | "quarter-triplet";

export type SightReadingNote = Omit<StaffNote, "duration"> & {
  duration: StaffDuration;
  isRest?: boolean;
  measureNumber?: number;
  countLabel?: string;
  actualBeats?: number;
  tupletGroup?: string;
  tupletKind?: TupletKind;
  tupletIndex?: number;
  tupletTotal?: number;
  tupletNotesOccupied?: number;
};

export type SightReadingSettings = {
  clef: SightReadingClef;
  keySignature: string;
  timeSignature: SightReadingTimeSignature;
  rangeLow: string;
  rangeHigh: string;
  measures: number;
  tempo: number;
  rhythmDifficulty: SightReadingRhythmDifficulty;
  pitchDifficulty: SightReadingPitchDifficulty;
  allowRests: boolean;
  allowAccidentals: boolean;
};

export type SightReadingMelody = Omit<StaffTemplate, "notes"> & {
  level: SightReadingLevel;
  notes: SightReadingNote[];
  noteNames: string[];
  solfege: string[];
  counts: string[];
  tips: string[];
  targetAreas: string[];
  settings: SightReadingSettings;
};

type LevelPreset = {
  title: string;
  description: string;
  settings: SightReadingSettings;
};

type RhythmEvent = {
  duration: StaffDuration;
  actualBeats?: number;
  tupletKind?: TupletKind;
  tupletIndex?: number;
  tupletTotal?: number;
  tupletNotesOccupied?: number;
};

const rangeNotes = [
  "C2", "D2", "E2", "F2", "G2", "A2", "B2",
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6",
];

export const sightReadingClefRanges: Record<SightReadingClef, { low: string; high: string }> = {
  treble: { low: "C4", high: "A5" },
  bass: { low: "E2", high: "C4" },
  alto: { low: "G3", high: "E5" },
  tenor: { low: "C3", high: "A4" },
};

export function recommendedSightReadingRange(clef: SightReadingClef) {
  return sightReadingClefRanges[clef];
}

export const sightReadingOptionLists = {
  clefs: ["treble", "bass", "alto", "tenor"] as SightReadingClef[],
  keySignatures: [
    "C", "G", "D", "A", "E", "B", "F#", "C#",
    "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb",
  ],
  timeSignatures: ["2/4", "3/4", "4/4", "6/8"] as SightReadingTimeSignature[],
  rangeNotes,
  rhythmDifficulties: ["simple", "mixed", "syncopated"] as SightReadingRhythmDifficulty[],
  pitchDifficulties: ["stepwise", "small-leaps", "wide-leaps"] as SightReadingPitchDifficulty[],
};

const levelSettings: Record<SightReadingLevel, LevelPreset> = {
  "level-1": {
    title: "Level 1",
    description: "Stepwise reading in a comfortable clef-aware range with mostly quarter notes.",
    settings: {
      clef: "treble",
      keySignature: "C",
      timeSignature: "4/4",
      rangeLow: "C4",
      rangeHigh: "G4",
      measures: 4,
      tempo: 84,
      rhythmDifficulty: "simple",
      pitchDifficulty: "stepwise",
      allowRests: false,
      allowAccidentals: false,
    },
  },
  "level-2": {
    title: "Level 2",
    description: "Steps, small skips, rests, mixed rhythms, and basic subdivisions in a staff-friendly range.",
    settings: {
      clef: "treble",
      keySignature: "C",
      timeSignature: "4/4",
      rangeLow: "C4",
      rangeHigh: "A4",
      measures: 6,
      tempo: 76,
      rhythmDifficulty: "mixed",
      pitchDifficulty: "small-leaps",
      allowRests: true,
      allowAccidentals: false,
    },
  },
  "level-3": {
    title: "Level 3",
    description: "Wider motion, dotted rhythms, sixteenths, triplets, and accidentals while staying readable on the selected clef.",
    settings: {
      clef: "treble",
      keySignature: "G",
      timeSignature: "4/4",
      rangeLow: "B3",
      rangeHigh: "C5",
      measures: 8,
      tempo: 72,
      rhythmDifficulty: "syncopated",
      pitchDifficulty: "wide-leaps",
      allowRests: true,
      allowAccidentals: true,
    },
  },
};

const solfegeByLetter: Record<string, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Ti",
};

const chromaticOffsets: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function chance(probability: number) {
  return Math.random() < probability;
}

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) < 0.001;
}

function startsOnBeat(value: number) {
  return nearlyEqual(value, Math.round(value));
}

function startsOnCompoundBeat(value: number) {
  return nearlyEqual(value % 1.5, 0) || nearlyEqual(value % 1.5, 1.5);
}

function noteToMidi(note: string) {
  const match = note.match(/^([A-G](?:#|b)?)(\d)$/);
  if (!match) return 60;
  const [, pitchClass, octaveText] = match;
  return (Number(octaveText) + 1) * 12 + (chromaticOffsets[pitchClass] ?? 0);
}

function notesInRange(low: string, high: string) {
  const lowMidi = noteToMidi(low);
  const highMidi = noteToMidi(high);
  const min = Math.min(lowMidi, highMidi);
  const max = Math.max(lowMidi, highMidi);

  const notes = rangeNotes.filter((note) => {
    const midi = noteToMidi(note);
    return midi >= min && midi <= max;
  });

  return notes.length > 0 ? notes : ["C4", "D4", "E4", "F4", "G4"];
}

function clefSafeNotes(settings: SightReadingSettings) {
  const selected = notesInRange(settings.rangeLow, settings.rangeHigh);
  const recommended = recommendedSightReadingRange(settings.clef);
  const safeLow = noteToMidi(recommended.low);
  const safeHigh = noteToMidi(recommended.high);
  const safeSelected = selected.filter((note) => {
    const midi = noteToMidi(note);
    return midi >= safeLow && midi <= safeHigh;
  });

  if (safeSelected.length >= 3) return safeSelected;
  return notesInRange(recommended.low, recommended.high);
}


function durationBeats(duration: StaffDuration) {
  if (duration === "w") return 4;
  if (duration === "hd") return 3;
  if (duration === "h") return 2;
  if (duration === "qd") return 1.5;
  if (duration === "q") return 1;
  if (duration === "8d") return 0.75;
  if (duration === "8") return 0.5;
  return 0.25;
}

function eventBeats(event: RhythmEvent) {
  return event.actualBeats ?? durationBeats(event.duration);
}

function patternBeats(pattern: RhythmEvent[]) {
  return pattern.reduce((sum, event) => sum + eventBeats(event), 0);
}

function measureBeats(timeSignature: SightReadingTimeSignature) {
  if (timeSignature === "2/4") return 2;
  if (timeSignature === "3/4") return 3;
  if (timeSignature === "6/8") return 3;
  return 4;
}

function simpleMeterLongPatterns(
  settings: SightReadingSettings,
  remaining: number,
  used: number,
): RhythmEvent[][] {
  const patterns: RhythmEvent[][] = [];

  if (!startsOnBeat(used)) return patterns;

  if (remaining >= 4 && settings.timeSignature === "4/4") {
    patterns.push([{ duration: "w" }]);
  }

  if (remaining >= 3 && (settings.timeSignature === "3/4" || settings.timeSignature === "4/4")) {
    patterns.push([{ duration: "hd" }]);
  }

  if (remaining >= 2) {
    patterns.push([{ duration: "h" }]);
  }

  return patterns;
}

function simpleBeatPatterns(settings: SightReadingSettings): RhythmEvent[][] {
  const patterns: RhythmEvent[][] = [
    [{ duration: "q" }],
    [{ duration: "8" }, { duration: "8" }],
  ];

  if (settings.rhythmDifficulty === "simple") {
    patterns.push([{ duration: "q" }]);
    return patterns;
  }

  patterns.push(
    [{ duration: "16" }, { duration: "16" }, { duration: "16" }, { duration: "16" }],
    [{ duration: "8d" }, { duration: "16" }],
    [{ duration: "16" }, { duration: "8d" }],
  );

  if (settings.rhythmDifficulty === "syncopated") {
    patterns.push(
      [
        { duration: "8", actualBeats: 1 / 3, tupletKind: "eighth-triplet", tupletIndex: 0, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "8", actualBeats: 1 / 3, tupletKind: "eighth-triplet", tupletIndex: 1, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "8", actualBeats: 1 / 3, tupletKind: "eighth-triplet", tupletIndex: 2, tupletTotal: 3, tupletNotesOccupied: 2 },
      ],
      [
        { duration: "16", actualBeats: 1 / 6, tupletKind: "sixteenth-triplet", tupletIndex: 0, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "16", actualBeats: 1 / 6, tupletKind: "sixteenth-triplet", tupletIndex: 1, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "16", actualBeats: 1 / 6, tupletKind: "sixteenth-triplet", tupletIndex: 2, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "8" },
      ],
    );
  }

  return patterns;
}

function compoundBeatPatterns(
  settings: SightReadingSettings,
  remaining: number,
  used: number,
): RhythmEvent[][] {
  const patterns: RhythmEvent[][] = [];

  if (startsOnCompoundBeat(used) && remaining >= 3) {
    patterns.push([{ duration: "hd" }]);
  }

  if (startsOnCompoundBeat(used) && remaining >= 1.5) {
    patterns.push(
      [{ duration: "qd" }],
      [{ duration: "q" }, { duration: "8" }],
      [{ duration: "8" }, { duration: "q" }],
      [{ duration: "8" }, { duration: "8" }, { duration: "8" }],
    );
  }

  if (settings.rhythmDifficulty !== "simple" && startsOnCompoundBeat(used) && remaining >= 1.5) {
    patterns.push(
      [{ duration: "8d" }, { duration: "16" }, { duration: "8" }],
      [{ duration: "16" }, { duration: "8d" }, { duration: "8" }],
      [{ duration: "16" }, { duration: "16" }, { duration: "16" }, { duration: "16" }, { duration: "8" }],
    );
  }

  if (settings.rhythmDifficulty === "syncopated" && startsOnCompoundBeat(used) && remaining >= 1.5) {
    patterns.push(
      [
        { duration: "8", actualBeats: 0.5, tupletKind: "eighth-triplet", tupletIndex: 0, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "8", actualBeats: 0.5, tupletKind: "eighth-triplet", tupletIndex: 1, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "8", actualBeats: 0.5, tupletKind: "eighth-triplet", tupletIndex: 2, tupletTotal: 3, tupletNotesOccupied: 2 },
      ],
      [
        { duration: "16", actualBeats: 0.25, tupletKind: "sixteenth-triplet", tupletIndex: 0, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "16", actualBeats: 0.25, tupletKind: "sixteenth-triplet", tupletIndex: 1, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "16", actualBeats: 0.25, tupletKind: "sixteenth-triplet", tupletIndex: 2, tupletTotal: 3, tupletNotesOccupied: 2 },
        { duration: "8" },
      ],
    );
  }

  return patterns.filter((pattern) => patternBeats(pattern) <= remaining + 0.001);
}

function chooseRhythmPattern(settings: SightReadingSettings, remaining: number, used: number): RhythmEvent[] {
  if (settings.timeSignature === "6/8") {
    const patterns = compoundBeatPatterns(settings, remaining, used);
    if (patterns.length > 0) return randomItem(patterns);
    return [{ duration: remaining >= 0.5 ? "8" : "16" }];
  }

  const patterns: RhythmEvent[][] = [];

  if (settings.rhythmDifficulty !== "simple") {
    patterns.push(...simpleMeterLongPatterns(settings, remaining, used));
  } else if (startsOnBeat(used) && remaining >= 2 && chance(0.28)) {
    patterns.push([{ duration: "h" }]);
  }

  if (settings.rhythmDifficulty === "syncopated" && startsOnBeat(used) && remaining >= 2) {
    patterns.push([
      { duration: "q", actualBeats: 2 / 3, tupletKind: "quarter-triplet", tupletIndex: 0, tupletTotal: 3, tupletNotesOccupied: 2 },
      { duration: "q", actualBeats: 2 / 3, tupletKind: "quarter-triplet", tupletIndex: 1, tupletTotal: 3, tupletNotesOccupied: 2 },
      { duration: "q", actualBeats: 2 / 3, tupletKind: "quarter-triplet", tupletIndex: 2, tupletTotal: 3, tupletNotesOccupied: 2 },
    ]);

    if (remaining >= 2) {
      patterns.push([{ duration: "qd" }, { duration: "8" }]);
      patterns.push([{ duration: "8" }, { duration: "qd" }]);
    }
  }

  if (startsOnBeat(used) && remaining >= 1) {
    patterns.push(...simpleBeatPatterns(settings));
  }

  const fitting = patterns.filter((pattern) => patternBeats(pattern) <= remaining + 0.001);
  if (fitting.length > 0) return randomItem(fitting);

  if (remaining >= 0.5) return [{ duration: "8" }];
  return [{ duration: "16" }];
}
function chooseNearestIndex(
  candidates: number[],
  currentIndex: number,
  maxDistance: number,
) {
  const nearby = candidates
    .filter((index) => Math.abs(index - currentIndex) <= maxDistance)
    .sort(
      (a, b) =>
        Math.abs(a - currentIndex) - Math.abs(b - currentIndex),
    );

  return nearby[0] ?? null;
}
function chooseNextPitch(
  available: string[],
  lastIndex: number,
  settings: SightReadingSettings,
  isFinalNote: boolean,
) {
  const maxFinalDistance =
    settings.pitchDifficulty === "stepwise"
      ? 1
      : settings.pitchDifficulty === "small-leaps"
        ? 2
        : 4;

  if (isFinalNote) {
    const tonicLetter = settings.keySignature.replace(/[#b]/g, "").charAt(0) || "C";
    const tonicCandidateIndexes = available
      .map((note, index) => (note.startsWith(tonicLetter) ? index : -1))
      .filter((index) => index >= 0);

    const nearestTonicIndex = chooseNearestIndex(
      tonicCandidateIndexes,
      lastIndex,
      maxFinalDistance,
    );

    if (nearestTonicIndex !== null) {
      return nearestTonicIndex;
    }
  }

  const movementPool =
    settings.pitchDifficulty === "stepwise"
      ? [-1, 0, 1]
      : settings.pitchDifficulty === "small-leaps"
        ? [-2, -1, 0, 1, 2]
        : [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  const movement = randomItem(movementPool);
  return Math.max(0, Math.min(available.length - 1, lastIndex + movement));
}

function maybeAccidental(note: string, allowAccidentals: boolean) {
  if (!allowAccidentals || Math.random() > 0.18) return note;
  const match = note.match(/^([A-G])(\d)$/);
  if (!match) return note;
  const [, letter, octave] = match;
  if (letter === "E" || letter === "B") return note;
  return `${letter}#${octave}`;
}

function noteName(pitch: string, isRest?: boolean) {
  if (isRest) return "Rest";
  return pitch.replace(/\d/g, "");
}

function solfegeName(pitch: string, isRest?: boolean) {
  if (isRest) return "Rest";
  const letter = pitch.charAt(0);
  return solfegeByLetter[letter] ?? letter;
}

function formatCount(value: number) {
  const rounded = Math.round(value * 1000) / 1000;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) return String(Math.round(rounded));
  return String(rounded);
}

function countLabel(event: RhythmEvent, beatStart: number, isRest?: boolean) {
  const base = event.tupletKind
    ? `${formatCount(beatStart)} triplet ${Number(event.tupletIndex ?? 0) + 1}`
    : event.duration === "16"
      ? `${formatCount(beatStart)} sixteenth`
      : event.duration === "8d"
        ? `${formatCount(beatStart)} dotted eighth`
        : event.duration === "8"
          ? `${formatCount(beatStart)} &`
          : formatCount(beatStart);

  return isRest ? `${base} rest` : base;
}

export function generateSightReadingMelody(
  level: SightReadingLevel,
  overrideSettings?: SightReadingSettings,
): SightReadingMelody {
  const preset = levelSettings[level];
  const settings = overrideSettings ?? preset.settings;
  const available = clefSafeNotes(settings);

  const notes: SightReadingNote[] = [];
  let lastIndex = Math.floor(available.length / 2);
  const beatsPerMeasure = measureBeats(settings.timeSignature);

  for (let measure = 1; measure <= settings.measures; measure += 1) {
    let used = 0;

    while (used < beatsPerMeasure - 0.001) {
      const remaining = beatsPerMeasure - used;
      const pattern = chooseRhythmPattern(settings, remaining, used);
      const tupletGroup = pattern.some((event) => event.tupletKind)
        ? `m${measure}-t${used}-${Math.random().toString(16).slice(2)}`
        : undefined;

      for (const event of pattern) {
        const beats = eventBeats(event);
        const isFinalNote =
          measure === settings.measures && used + beats >= beatsPerMeasure - 0.001;
        const shouldRest =
          settings.allowRests &&
          !isFinalNote &&
          notes.length > 0 &&
          !event.tupletKind &&
          Math.random() < 0.1;

        let pitch = available[lastIndex] ?? "C4";

        if (!shouldRest) {
          lastIndex = chooseNextPitch(available, lastIndex, settings, isFinalNote);
          pitch = maybeAccidental(available[lastIndex] ?? "C4", settings.allowAccidentals);
        }

        notes.push({
          pitch,
          duration: event.duration,
          actualBeats: beats,
          isRest: shouldRest,
          measureNumber: measure,
          countLabel: countLabel(event, used + 1, shouldRest),
          tupletGroup,
          tupletKind: event.tupletKind,
          tupletIndex: event.tupletIndex,
          tupletTotal: event.tupletTotal,
          tupletNotesOccupied: event.tupletNotesOccupied,
        });

        used += beats;
      }
    }
  }

  const targetAreas = [
    `${settings.clef} clef`,
    `${settings.keySignature} key signature`,
    `${settings.timeSignature} meter`,
    `${settings.pitchDifficulty} pitch motion`,
    `${settings.rhythmDifficulty} rhythm`,
  ];

  if (settings.allowRests) targetAreas.push("rests");
  if (settings.allowAccidentals) targetAreas.push("accidentals");
  if (settings.rhythmDifficulty !== "simple") targetAreas.push("sixteenths and dotted rhythms");
  if (settings.rhythmDifficulty === "syncopated") targetAreas.push("triplets");

  const tips = [
    "Scan the clef, key signature, and time signature before starting.",
    "Find the highest and lowest notes before you sing or play.",
    "Count through the rhythm once before using playback.",
  ];

  if (settings.rhythmDifficulty !== "simple") {
    tips.push("Check beamed groups first: they show where the beat subdivisions belong.");
  }

  if (settings.rhythmDifficulty === "syncopated") {
    tips.push("For triplets, keep the beat steady while fitting three equal notes into the marked space.");
  }

  if (settings.pitchDifficulty === "wide-leaps") {
    tips.push("Circle or mentally mark larger leaps before beginning.");
  }

  if (settings.allowRests) {
    tips.push("Keep counting through rests instead of pausing your pulse.");
  }

  return {
    id: `sight-${level}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: preset.title,
    description: preset.description,
    clef: settings.clef,
    timeSignature: settings.timeSignature,
    keySignature: settings.keySignature,
    tempo: settings.tempo,
    notes,
    level,
    noteNames: notes.map((note) => noteName(note.pitch, note.isRest)),
    solfege: notes.map((note) => solfegeName(note.pitch, note.isRest)),
    counts: notes.map((note) => note.countLabel ?? ""),
    tips,
    targetAreas,
    settings,
  };
}

export const sightReadingLevels: {
  value: SightReadingLevel;
  label: string;
  description: string;
  settings: SightReadingSettings;
}[] = [
  {
    value: "level-1",
    label: "Level 1",
    description: levelSettings["level-1"].description,
    settings: levelSettings["level-1"].settings,
  },
  {
    value: "level-2",
    label: "Level 2",
    description: levelSettings["level-2"].description,
    settings: levelSettings["level-2"].settings,
  },
  {
    value: "level-3",
    label: "Level 3",
    description: levelSettings["level-3"].description,
    settings: levelSettings["level-3"].settings,
  },
];
