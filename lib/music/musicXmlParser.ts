import {
  createEmptyInputReadingAnalysis,
  InputReadingAnalysis,
  InputReadingClef,
  InputReadingPart,
  InputReadingStaff,
  InputReadingSymbol,
  InputReadingSystem,
} from "@/lib/music/inputReading";

type ParseState = {
  divisions: number;
  keySignature: string;
  timeSignature: string;
  clef: InputReadingClef;
  staffClefs: Record<number, InputReadingClef>;
};

const keyByFifths: Record<number, string> = {
  [-7]: "Cb",
  [-6]: "Gb",
  [-5]: "Db",
  [-4]: "Ab",
  [-3]: "Eb",
  [-2]: "Bb",
  [-1]: "F",
  0: "C",
  1: "G",
  2: "D",
  3: "A",
  4: "E",
  5: "B",
  6: "F#",
  7: "C#",
};

const semitoneByStep: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

function decodeXmlEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function tagText(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXmlEntities(match[1].trim()) : "";
}

function allTagBlocks(xml: string, tag: string) {
  return Array.from(
    xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, "gi")),
  ).map((match) => match[0]);
}

function getAttribute(xml: string, name: string) {
  const match = xml.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match ? decodeXmlEntities(match[1]) : "";
}

function clefFromSign(sign: string, line?: string): InputReadingClef {
  if (sign === "F") return "bass";
  if (sign === "C") return line === "4" ? "tenor" : "alto";
  if (sign.toLowerCase() === "percussion") return "percussion";
  return "treble";
}

function pitchToMidi(step: string, alter: number, octave: number) {
  return (octave + 1) * 12 + (semitoneByStep[step] ?? 0) + alter;
}

function accidentalText(alter: number) {
  if (alter === 2) return "##";
  if (alter === 1) return "#";
  if (alter === -1) return "b";
  if (alter === -2) return "bb";
  return "";
}

function durationFromXml(rawDuration: number, divisions: number) {
  if (!rawDuration || !divisions) return "q";

  const quarterLength = rawDuration / divisions;

  if (quarterLength >= 3.75) return "w";
  if (quarterLength >= 2.75) return "hd";
  if (quarterLength >= 1.75) return "h";
  if (quarterLength >= 1.35) return "qd";
  if (quarterLength >= 0.9) return "q";
  if (quarterLength >= 0.65) return "8d";
  if (quarterLength >= 0.38) return "8";
  return "16";
}

function parseScoreParts(xml: string) {
  const partList = tagText(xml, "part-list")
    ? allTagBlocks(tagText(xml, "part-list"), "score-part")
    : allTagBlocks(xml, "score-part");
  const names = new Map<string, { name: string; abbreviation?: string }>();

  for (const block of partList) {
    const id = getAttribute(block, "id");
    if (!id) continue;

    names.set(id, {
      name: tagText(block, "part-name") || id,
      abbreviation: tagText(block, "part-abbreviation") || undefined,
    });
  }

  return names;
}

function parseAttributes(measureBlock: string, state: ParseState) {
  const attributes = tagText(measureBlock, "attributes");
  if (!attributes) return state;

  const divisionsText = tagText(attributes, "divisions");
  const fifthsText = tagText(attributes, "fifths");
  const beatsText = tagText(attributes, "beats");
  const beatTypeText = tagText(attributes, "beat-type");
  const clefBlocks = allTagBlocks(attributes, "clef");
  const nextStaffClefs: Record<number, InputReadingClef> = {
    ...state.staffClefs,
  };
  let fallbackClef = state.clef;

  for (const clefBlock of clefBlocks) {
    const clefSign = tagText(clefBlock, "sign");
    const clefLine = tagText(clefBlock, "line");
    const staffNumber = Number(getAttribute(clefBlock, "number")) || 1;
    if (!clefSign) continue;

    const clef = clefFromSign(clefSign, clefLine);
    nextStaffClefs[staffNumber] = clef;
    if (staffNumber === 1) fallbackClef = clef;
  }

  return {
    divisions: divisionsText ? Number(divisionsText) || state.divisions : state.divisions,
    keySignature: fifthsText
      ? keyByFifths[Number(fifthsText)] ?? state.keySignature
      : state.keySignature,
    timeSignature:
      beatsText && beatTypeText
        ? `${beatsText}/${beatTypeText}`
        : state.timeSignature,
    clef: fallbackClef,
    staffClefs: nextStaffClefs,
  };
}

function parseNoteBlock(
  noteBlock: string,
  partId: string,
  measureNumber: number,
  state: ParseState,
  symbolIndex: number,
): InputReadingSymbol {
  const isRest = /<rest(?:\s[^>]*)?\/>|<rest(?:\s[^>]*)?>/i.test(noteBlock);
  const rawDuration = Number(tagText(noteBlock, "duration")) || state.divisions;
  const staffNumber = Number(tagText(noteBlock, "staff")) || 1;
  const voice = tagText(noteBlock, "voice") || undefined;
  const duration = durationFromXml(rawDuration, state.divisions);

  if (isRest) {
    return {
      id: `${partId}-m${measureNumber}-s${symbolIndex}`,
      type: "rest",
      partId,
      measureNumber,
      staffNumber,
      voice,
      duration,
      rawDuration,
    };
  }

  const pitchBlock = tagText(noteBlock, "pitch");
  const step = tagText(pitchBlock, "step") || "C";
  const alter = Number(tagText(pitchBlock, "alter")) || 0;
  const octave = Number(tagText(pitchBlock, "octave")) || 4;
  const pitchClass = `${step}${accidentalText(alter)}`;
  const pitch = `${pitchClass}${octave}`;

  return {
    id: `${partId}-m${measureNumber}-s${symbolIndex}`,
    type: "note",
    partId,
    measureNumber,
    staffNumber,
    voice,
    pitch,
    pitchClass,
    octave,
    midi: pitchToMidi(step, alter, octave),
    duration,
    rawDuration,
  };
}

export function parseMusicXmlToInputReading(
  xml: string,
  sourceFileName: string,
): InputReadingAnalysis {
  if (!xml.includes("<score-partwise") && !xml.includes("<score-timewise")) {
    return createEmptyInputReadingAnalysis(
      sourceFileName,
      "This file does not look like a MusicXML score-partwise or score-timewise document.",
    );
  }

  const scorePartNames = parseScoreParts(xml);
  const partBlocks = allTagBlocks(xml, "part");

  if (partBlocks.length === 0) {
    return createEmptyInputReadingAnalysis(
      sourceFileName,
      "No <part> elements were found in this MusicXML file.",
    );
  }

  const parts: InputReadingPart[] = [];
  const staves: InputReadingStaff[] = [];
  const warnings: string[] = [];
  const allMeasureNumbers = new Set<number>();

  for (const partBlock of partBlocks) {
    const partId = getAttribute(partBlock, "id") || `P${parts.length + 1}`;
    const partMeta = scorePartNames.get(partId);
    const measures = allTagBlocks(partBlock, "measure");

    let state: ParseState = {
      divisions: 1,
      keySignature: "C",
      timeSignature: "4/4",
      clef: "treble",
      staffClefs: {
        1: "treble",
      },
    };

    const symbols: InputReadingSymbol[] = [];
    let symbolIndex = 0;

    for (let measureIndex = 0; measureIndex < measures.length; measureIndex += 1) {
      const measureBlock = measures[measureIndex];
      const measureNumber =
        Number(getAttribute(measureBlock, "number")) || measureIndex + 1;
      allMeasureNumbers.add(measureNumber);
      state = parseAttributes(measureBlock, state);

      const noteBlocks = allTagBlocks(measureBlock, "note");

      for (const noteBlock of noteBlocks) {
        if (/<grace(?:\s[^>]*)?\/>|<grace(?:\s[^>]*)?>/i.test(noteBlock)) {
          continue;
        }

        symbols.push(
          parseNoteBlock(noteBlock, partId, measureNumber, state, symbolIndex),
        );
        symbolIndex += 1;
      }
    }

    const partName = partMeta?.name ?? partId;
    const staffNumbers = Array.from(
      new Set([
        ...symbols.map((symbol) => symbol.staffNumber),
        ...Object.keys(state.staffClefs).map(Number),
      ]),
    )
      .filter((staffNumber) => Number.isFinite(staffNumber) && staffNumber > 0)
      .sort((a, b) => a - b);

    parts.push({
      id: partId,
      name: partName,
      abbreviation: partMeta?.abbreviation,
      clef: state.staffClefs[staffNumbers[0] ?? 1] ?? state.clef,
      instrumentFamily: "MusicXML part",
      measureCount: measures.length,
    });

    for (const staffNumber of staffNumbers.length > 0 ? staffNumbers : [1]) {
      const staffSymbols = symbols.filter(
        (symbol) => symbol.staffNumber === staffNumber,
      );
      const clef = state.staffClefs[staffNumber] ?? state.clef;
      const suffix = staffNumbers.length > 1 ? ` staff ${staffNumber}` : "";

      staves.push({
        id: `${partId}-staff-${staffNumber}`,
        partId,
        label: `${partName}${suffix}`,
        clef,
        keySignature: state.keySignature,
        timeSignature: state.timeSignature,
        symbols: staffSymbols,
      });
    }

    if (symbols.length === 0) {
      warnings.push(`${partName} did not contain readable note or rest symbols.`);
    }
  }

  const measures = Array.from(allMeasureNumbers).sort((a, b) => a - b);
  const systems: InputReadingSystem[] = [
    {
      id: "page-1-system-1",
      pageNumber: 1,
      systemNumber: 1,
      staves,
      measures,
    },
  ];

  const totalSymbols = staves.reduce((sum, staff) => sum + staff.symbols.length, 0);

  return {
    id: `input-${Date.now()}`,
    sourceFileName,
    sourceType: "musicxml",
    summary: `Imported ${parts.length} part${parts.length === 1 ? "" : "s"}, ${staves.length} staff${staves.length === 1 ? "" : "s"}, ${measures.length} measure${measures.length === 1 ? "" : "s"}, and ${totalSymbols} symbol${totalSymbols === 1 ? "" : "s"} from MusicXML.`,
    pageCount: 1,
    parts,
    systems,
    warnings,
    createdAt: new Date().toISOString(),
  };
}
