# OpenTutti

OpenTutti is a modern, classroom-focused music education platform for ear training, theory practice, sight-reading, staff-based composition, and teacher-managed assignments. It is built to give students fast, clear practice tools while giving teachers a lightweight way to create classes, assign drills, and track progress.

The project was originally developed as **Audvyn** and has been renamed to **OpenTutti** for release preparation. The staff composition workspace has likewise been renamed from **AudvynLab** to **OTLab**.

## Core Features

### Ear Training Gym

OpenTutti includes a full ear-training practice environment with multiple drill modes and immediate feedback.

Supported modes include:

- Pitch identification
- Pitch reference training
- Intervals
- Scales
- Chords
- Cadences

Recent improvements include:

- Pitch Perfect and Pitch Reference modes
- Choice-button and keyboard-style answer formats
- Enharmonic flat buttons beneath sharp choices
- Enharmonic answers accepted in ear-training pitch mode
- Keyboard labels such as `C#/Db`, `D#/Eb`, `F#/Gb`, `G#/Ab`, and `A#/Bb`
- Treble, bass, alto, and tenor clef support
- Custom range settings
- Ascending, descending, and harmonic interval playback
- Scale groups: common scales, special scales, and modes
- Chord groups: triads and seventh chords
- Chord inversions
- Blocked and arpeggiated chord playback
- Drill breakdowns and review/summary flow

### Theory Tester

The Theory Tester mirrors many of the ear-training options, but uses staff-based visual questions instead of audio-only prompts.

Supported modes include:

- Pitch
- Intervals
- Scales
- Chords
- Cadences
- Key signatures

Recent improvements include:

- Staff-based pitch identification
- Choice-button and keyboard-style answer formats
- Enharmonic flat buttons beneath sharp choices
- Optional “Allow enharmonics” setting for theory pitch questions
- Exact written spelling required when enharmonics are disabled
- Enharmonic answers accepted when enabled
- Treble, bass, alto, and tenor clef support
- Custom range settings
- Interval display options
- Scale and chord answer groups
- Inversions for chord identification
- Relative minor option for key-signature identification

### Sight-reading Coach

The Sight-reading Coach generates short, configurable staff-reading drills for classroom projection or individual practice.

Supported controls include:

- Clef selection
- Key signature
- Time signature
- Measure count
- Tempo
- Low and high pitch range
- Auto range by clef
- Rhythm difficulty
- Pitch difficulty
- Rests
- Accidentals
- Starting-pitch playback
- Full-melody playback
- Note-name, solfege, and count reveals

Recent improvements include:

- Public-facing spelling standardized to **Sight-reading**
- Full-width score display for classroom use
- Clef-aware recommended ranges
- Better handling of rhythm, triplets, beams, tuplets, and dotted durations through the shared staff renderer

### OTLab

OTLab is OpenTutti’s staff-based creative workspace. It is a MuseScore-inspired lightweight staff DAW for creating, teaching, demonstrating, and prototyping short musical examples.

Current capabilities include:

- Multi-staff score editing
- Connected staff display
- Clef selection per staff
- Key signature and time signature controls
- Tempo control
- Staff renaming
- Per-staff playback sound modes
- Mute and solo per staff
- Playback slider and scrubber
- Add, insert, erase, and clear editing modes
- Add/remove measures
- Add/remove staves
- Empty visible measures for blank-score creation
- Click-to-add notes directly on the score
- Ghost-note hover preview
- Selectable notes
- Dragging notes vertically to change pitch
- Triplet insertion for 16th, 8th, and quarter triplets
- Template sidebar with starter scores
- Blank Score template for scratch creation

OTLab remains intentionally lightweight compared with a full notation program, but it is structured to support future additions such as export, saving, keyboard shortcuts, chord input, MusicXML, MIDI, and deeper hit-testing.

### Teacher Dashboard

The Teacher Dashboard provides a Google-Classroom-style workflow for music teachers.

Current capabilities include:

- Class creation
- Join-code generation
- Class roster view
- Discussion tab
- Assignment tab
- Roster tab
- Student visibility controls
- Assignment creation directly inside the class workspace
- Due date and due time support
- Assignment status tracking
- Student score summaries
- Class average aggregates
- Per-student assignment details
- Saved assignment settings display

Assignment creation supports advanced settings from the Ear Training Gym and Theory Tester, including clefs, ranges, interval options, scale groups, chord groups, inversions, playback/display settings, and theory enharmonic settings.

Assignment statuses include:

- Assigned; Not started
- Assigned; Unfinished
- Assigned; Completed
- Missing

### Student Dashboard

The Student Dashboard gives learners a simple class-and-assignment workspace.

Current capabilities include:

- Join class by code
- View class assignments
- View assignment details
- Start, continue, review, or retake assignments
- See completion status
- See scores and averages
- Return to class from assignment details
- Chronological assignment rows from newest to oldest

### Authentication and Accounts

OpenTutti uses Supabase Authentication and separates user access into student and teacher roles.

Recent release-prep improvements include:

- Separate **Sign up** and **Log in** entry points
- Dedicated `/signup` page
- Dedicated `/login` page
- Role selection during signup
- Teacher/student dashboard redirect after authentication
- Removal of public debug/test login UI

## Branding and Navigation Updates

Release-prep branding changes:

- `Audvyn` renamed to `OpenTutti`
- `AudvynLab` renamed to `OTLab`
- `Staff Lab` renamed to `OTLab`
- `Sightreading` standardized to `Sight-reading`
- “About” moved from the footer to the header as **About Us**
- Teacher and Student Guides moved into a header hover dropdown
- Footer simplified to Privacy and Feedback links
- Public-facing beta, draft, and unfinished language removed from release pages

Routes currently remain stable to avoid breaking internal links:

- `/practice/ear-training`
- `/practice/theory`
- `/practice/sight-reading`
- `/staff-lab`
- `/teacher`
- `/student`
- `/login`
- `/signup`
- `/about`
- `/teacher-guide`
- `/student-guide`
- `/privacy`

## Tech Stack

OpenTutti is built with:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth and database
- Tone.js for browser playback
- VexFlow for staff rendering
- lucide-react icons

## Local Development

Project folder:

```powershell
C:\Users\dongh\Documents\Programming\audvyn
```

Start the development server:

```powershell
cd C:\Users\dongh\Documents\Programming\audvyn
npm run dev
```

Build for production:

```powershell
npm run build
```

Run production server after build:

```powershell
npm run start
```

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rgobztvbizttnwvwaiey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key_here
```

Use the base Supabase project URL only. Do not include `/rest/v1` in `NEXT_PUBLIC_SUPABASE_URL`.

## Important Project Structure

```text
app/
  about/
  login/
  signup/
  privacy/
  practice/
    ear-training/
    theory/
    sight-reading/
  staff-lab/
  student/
  teacher/
  teacher-guide/
  student-guide/

components/
  EarTrainingGym.tsx
  FeatureCard.tsx
  SightReadingCoach.tsx
  SiteFooter.tsx
  SiteHeader.tsx
  StaffChoice.tsx
  StaffDisplay.tsx
  StaffTemplatePlayer.tsx
  TheoryTester.tsx

lib/
  music/
    earTraining.ts
    sightReading.ts
    staffTemplates.ts
    theoryTraining.ts
  siteConfig.ts
  supabase/
    client.ts

types/
  database.ts
```

## Supabase Data Model

Primary tables:

- `profiles`
- `classes`
- `class_members`
- `assignments`
- `attempts`
- `class_posts`
- `class_post_comments`
- `assignment_comments`

Important fields include:

- `profiles.role`: `student` or `teacher`
- `classes.join_code`
- `classes.students_can_post_discussion`
- `classes.students_can_see_roster`
- `assignments.assignment_type`: `ear_training` or `theory`
- `assignments.mode`
- `assignments.question_count`
- `assignments.due_at`
- `assignments.settings_json`
- `attempts.status`: `in_progress` or `completed`
- `attempts.score`
- `attempts.correct_count`
- `attempts.total_questions`
- `attempts.details_json`

## Release Notes

### Release Prep Branding Pass

- Renamed the product from Audvyn to OpenTutti.
- Renamed AudvynLab to OTLab.
- Updated public navigation labels.
- Moved About Us into the header.
- Added guide dropdown in the header.
- Split account entry into Sign up and Log in.
- Removed beta/draft/unfinished language from public-facing pages.
- Standardized Sight-reading spelling.

### Classroom Dashboard Revamp

- Rebuilt teacher dashboard around class workspaces.
- Added discussion, assignments, and roster tabs.
- Added class-level settings for discussion and roster visibility.
- Added assignment detail view with return-to-class flow.
- Added aggregate statistics and average score summaries.
- Added student-level status tracking.
- Added due date and due time support.
- Added missing, unfinished, not-started, and completed logic.
- Added advanced assignment settings directly into the teacher dashboard.
- Saved full settings into `settings_json`.

### Student Dashboard Revamp

- Reworked student dashboard around selected class workspace.
- Added assignment detail screens.
- Added start, continue, review, and retake flow.
- Added return-to-class button.
- Displayed assignments as chronological rows from newest to oldest.
- Added average score aggregates.

### Ear Training Improvements

- Expanded pitch, interval, chord, scale, and cadence modes.
- Added clef and range support.
- Added interval playback modes.
- Added scale and chord answer groups.
- Added seventh chords and inversions.
- Added enharmonic flat pitch buttons.
- Accepted enharmonic answers in ear-training pitch mode.
- Improved keyboard display labels.

### Theory Tester Improvements

- Added staff-based modes for pitch, intervals, scales, chords, cadences, and key signatures.
- Added clef and range controls.
- Added keyboard and choice answer formats.
- Added scale/chord groups and inversions.
- Added key-signature relative minor option.
- Added enharmonic flat pitch buttons.
- Added optional theory pitch enharmonic grading.

### Sight-reading Improvements

- Added configurable generator controls.
- Added clef-aware ranges.
- Added classroom-friendly score display.
- Added playback tools.
- Added reveal panels for notes, solfege, and counts.
- Improved shared staff renderer support for rhythms, beams, tuplets, rests, and dotted durations.

### OTLab Revamp

- Replaced simple staff templates with a multi-staff editor.
- Added connected score rendering.
- Added visible empty measures.
- Added score click input.
- Added ghost-note hover preview.
- Added note selection and pitch dragging.
- Added insert and erase modes.
- Added triplet insertion.
- Added measure controls.
- Added multi-staff playback and scrubber.
- Added templates and a blank-score starter.

## Deployment Notes

Before deploying, run:

```powershell
npm run build
```

To catch remaining old branding or release-prep language:

```powershell
Select-String -Path .\**\*.* -Pattern "Audvyn","AudvynLab","Staff Lab","Sightreading","beta","draft","unfinished" -CaseSensitive:$false
```

A clean release-prep pass should avoid public instances of the old product name, old lab name, and beta/draft wording, except in internal notes or migration history.

## Roadmap

High-value next steps:

- Save OTLab projects to user accounts
- Export OTLab scores to MusicXML or MIDI
- Add keyboard shortcuts and undo/redo
- Add real note hit-testing from VexFlow SVG geometry
- Add drag-left/right rhythm editing
- Add chord and multi-voice input
- Add teacher assignment exports
- Add more robust class analytics
- Add onboarding pages for teachers and students
- Add production privacy and terms pages
- Add accessibility review and keyboard navigation polish

## License

License has not been finalized. Before public release, choose a license that matches the intended use of the code and educational content.

Common options:

- MIT License for broad open-source code reuse
- Apache 2.0 for open source with explicit patent language
- All Rights Reserved for private controlled release

## Credits

OpenTutti is a student-built music education platform created to make music theory, ear training, sight-reading, and classroom practice more accessible for students and teachers.
