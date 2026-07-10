export type InputReadingClef = "treble" | "bass" | "alto" | "tenor" | "percussion" | "unknown";

export type InputReadingSymbol = {
  id: string;
  type: "note" | "rest";
  measureNumber: number;
  partId: string;
  staffNumber: number;
  voice?: string;
  pitch?: string;
  pitchClass?: string;
  octave?: number;
  midi?: number;
  duration?: string;
  rawDuration?: number;
};

export type InputReadingPart = {
  id: string;
  name: string;
  abbreviation?: string;
  clef: InputReadingClef;
  instrumentFamily: string;
  measureCount: number;
};

export type InputReadingStaff = {
  id: string;
  partId: string;
  label: string;
  clef: InputReadingClef;
  keySignature: string;
  timeSignature: string;
  symbols: InputReadingSymbol[];
};

export type InputReadingSystem = {
  id: string;
  pageNumber: number;
  systemNumber: number;
  staves: InputReadingStaff[];
  measures: number[];
};

export type InputReadingAnalysis = {
  id: string;
  sourceFileName: string;
  sourceType: "musicxml";
  summary: string;
  pageCount: number;
  parts: InputReadingPart[];
  systems: InputReadingSystem[];
  warnings: string[];
  createdAt: string;
};

export function createEmptyInputReadingAnalysis(
  sourceFileName: string,
  warning = "No readable MusicXML notes were found yet.",
): InputReadingAnalysis {
  return {
    id: `input-${Date.now()}`,
    sourceFileName,
    sourceType: "musicxml",
    summary: "Audvyn created an empty Input Reading workspace for this MusicXML file.",
    pageCount: 1,
    parts: [],
    systems: [],
    warnings: [warning],
    createdAt: new Date().toISOString(),
  };
}
