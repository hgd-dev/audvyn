import { NextResponse } from "next/server";
import { parseMusicXmlToInputReading } from "@/lib/music/musicXmlParser";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

function isMusicXmlFile(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".xml") || name.endsWith(".musicxml");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("score");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload a .xml or .musicxml score file." },
        { status: 400 },
      );
    }

    if (!isMusicXmlFile(file)) {
      return NextResponse.json(
        {
          error:
            "Input Reading currently accepts MusicXML only: .xml or .musicxml. PDF/scan recognition can be added later with a separate OMR service.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Please upload a MusicXML file smaller than 8 MB." },
        { status: 400 },
      );
    }

    const xml = await file.text();
    const analysis = parseMusicXmlToInputReading(xml, file.name);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The MusicXML file could not be analyzed.",
      },
      { status: 500 },
    );
  }
}
