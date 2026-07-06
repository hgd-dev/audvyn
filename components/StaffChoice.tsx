"use client";

import { useEffect, useRef } from "react";
import {
  Accidental,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  Voice,
} from "vexflow";
import type { EarClef } from "@/lib/music/earTraining";

type StaffChoiceProps = {
  notes: string[];
  clef?: EarClef;
  width?: number;
  height?: number;
};

function pitchToVexKey(pitch: string) {
  const match = pitch.match(/^([A-G])([#b]?)(\d)$/);

  if (!match) {
    return "c/4";
  }

  const [, letter, accidental, octave] = match;
  return `${letter.toLowerCase()}${accidental}/${octave}`;
}

function createStaveNote(pitch: string) {
  const match = pitch.match(/^([A-G])([#b]?)(\d)$/);
  const accidental = match?.[2];

  const note = new StaveNote({
    keys: [pitchToVexKey(pitch)],
    duration: "q",
  });

  if (accidental) {
    try {
      note.addModifier(new Accidental(accidental), 0);
    } catch {
      note.addModifier(new Accidental(accidental));
    }
  }

  return note;
}

export default function StaffChoice({
  notes,
  clef = "treble",
  width = 300,
  height = 125,
}: StaffChoiceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);

    const context = renderer.getContext();

    const stave = new Stave(8, 8, width - 16);
    stave.addClef(clef).setContext(context).draw();

    const staveNotes = notes.map((pitch) => createStaveNote(pitch));

    const voice = new Voice({
      numBeats: Math.max(staveNotes.length, 1),
      beatValue: 4,
    });

    voice.setStrict(false);
    voice.addTickables(staveNotes);

    new Formatter().joinVoices([voice]).format([voice], width - 85);
    voice.draw(context, stave);

    const svg = containerRef.current.querySelector("svg");

    if (svg) {
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", `${width}`);
      svg.setAttribute("height", `${height}`);
      svg.style.display = "block";
      svg.style.overflow = "visible";
    }
  }, [notes, clef, width, height]);

  return (
    <div
      className="inline-flex rounded-2xl bg-white"
      style={{ width, height, overflow: "hidden" }}
    >
      <div ref={containerRef} style={{ width, height }} />
    </div>
  );
}