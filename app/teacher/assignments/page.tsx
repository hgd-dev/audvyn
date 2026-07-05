"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Assignment,
  AssignmentType,
  ClassRecord,
  Profile,
} from "@/types/database";

const assignmentTypes: {
  value: AssignmentType;
  label: string;
  description: string;
}[] = [
  {
    value: "ear_training",
    label: "Ear Training",
    description: "Intervals, chords, and cadences.",
  },
  {
    value: "theory",
    label: "Theory Tester",
    description: "Notes, keys, intervals, triads, Roman numerals, and rhythm.",
  },
];

const modesByType: Record<
  AssignmentType,
  { value: string; label: string }[]
> = {
  ear_training: [
    { value: "interval", label: "Intervals" },
    { value: "chord", label: "Chords" },
    { value: "cadence", label: "Cadences" },
  ],
  theory: [
    { value: "notes", label: "Notes" },
    { value: "keys", label: "Key Signatures" },
    { value: "intervals", label: "Written Intervals" },
    { value: "triads", label: "Triads" },
    { value: "roman", label: "Roman Numerals" },
    { value: "rhythm", label: "Rhythm" },
  ],
};

type AssignmentWithClass = Assignment & {
  classes?: ClassRecord | ClassRecord[] | null;
};

export default function TeacherAssignmentsPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [assignments, setAssignments] = useState<AssignmentWithClass[]>([]);

  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [assignmentType, setAssignmentType] =
    useState<AssignmentType>("ear_training");
  const [mode, setMode] = useState("interval");
  const [questionCount, setQuestionCount] = useState(10);
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const modeOptions = useMemo(
    () => modesByType[assignmentType],
    [assignmentType]
  );

  function getClassName(assignment: AssignmentWithClass) {
    const classData = Array.isArray(assignment.classes)
      ? assignment.classes[0]
      : assignment.classes;

    return classData?.name ?? "Class";
  }

  function getAssignmentTypeLabel(type: AssignmentType) {
    return assignmentTypes.find((item) => item.value === type)?.label ?? type;
  }

  function getModeLabel(type: AssignmentType, assignmentMode: string) {
    return (
      modesByType[type].find((item) => item.value === assignmentMode)?.label ??
      assignmentMode
    );
  }

  async function loadTeacherData() {
    setLoading(true);
    setMessage(null);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    setProfile(profileData);

    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", authData.user.id)
      .order("created_at", { ascending: false });

    if (classError) {
      setMessage(classError.message);
      setLoading(false);
      return;
    }

    setClasses(classData ?? []);

    if (classData && classData.length > 0) {
      setClassId((current) => current || classData[0].id);
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from("assignments")
      .select("*, classes(*)")
      .eq("teacher_id", authData.user.id)
      .order("created_at", { ascending: false });

    if (assignmentError) {
      setMessage(assignmentError.message);
      setLoading(false);
      return;
    }

    setAssignments((assignmentData as AssignmentWithClass[]) ?? []);
    setLoading(false);
  }

  async function createAssignment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) return;

    if (!classId) {
      setMessage("Create a class before making assignments.");
      return;
    }

    setCreating(true);
    setMessage(null);

    const finalTitle =
      title.trim() ||
      `${getAssignmentTypeLabel(assignmentType)}: ${getModeLabel(
        assignmentType,
        mode
      )}`;

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        class_id: classId,
        teacher_id: profile.id,
        title: finalTitle,
        assignment_type: assignmentType,
        mode,
        question_count: questionCount,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      })
      .select("*, classes(*)")
      .single();

    if (error) {
      setMessage(error.message);
      setCreating(false);
      return;
    }

    setAssignments((current) => [data as AssignmentWithClass, ...current]);
    setTitle("");
    setDueDate("");
    setMessage("Assignment created.");
    setCreating(false);
  }

  function handleTypeChange(nextType: AssignmentType) {
    setAssignmentType(nextType);
    setMode(modesByType[nextType][0].value);
  }

  useEffect(() => {
    loadTeacherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-zinc-400">Loading assignments...</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Log in needed</h1>
        <p className="mt-4 text-zinc-400">
          Please log in as a teacher to create assignments.
        </p>
      </section>
    );
  }

  if (profile.role !== "teacher") {
    return (
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Teacher access only
        </h1>
        <p className="mt-4 text-zinc-400">
          This page is only available for teacher accounts.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10">
        <p className="text-sm font-medium text-violet-300">Teacher</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Assignments
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
          Create ear training and theory practice sets for your classes. Student
          completion and scores will be connected next.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl border border-yellow-400/40 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
          {message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <aside>
          <form
            onSubmit={createAssignment}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-lg font-semibold">Create assignment</h2>

            {classes.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-yellow-400/40 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100">
                You need to create a class first before assigning practice.
              </div>
            ) : (
              <>
                <label className="mt-5 block">
                  <span className="text-sm text-zinc-400">Class</span>
                  <select
                    required
                    value={classId}
                    onChange={(event) => setClassId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    {classes.map((classRecord) => (
                      <option key={classRecord.id} value={classRecord.id}>
                        {classRecord.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="text-sm text-zinc-400">
                    Assignment title optional
                  </span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Interval Basics"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="text-sm text-zinc-400">
                    Assignment type
                  </span>
                  <select
                    value={assignmentType}
                    onChange={(event) =>
                      handleTypeChange(event.target.value as AssignmentType)
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    {assignmentTypes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="text-sm text-zinc-400">Mode</span>
                  <select
                    value={mode}
                    onChange={(event) => setMode(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    {modeOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="text-sm text-zinc-400">
                    Number of questions
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={questionCount}
                    onChange={(event) =>
                      setQuestionCount(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="text-sm text-zinc-400">
                    Due date optional
                  </span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-400"
                  />
                </label>

                <button
                  type="submit"
                  disabled={creating}
                  className="mt-5 w-full rounded-full bg-violet-500 px-5 py-3 font-medium text-white hover:bg-violet-400 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create assignment"}
                </button>
              </>
            )}
          </form>
        </aside>

        <main className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Existing assignments</h2>

          {assignments.length === 0 ? (
            <p className="mt-4 leading-7 text-zinc-400">
              No assignments yet. Create one from the form on the left.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-3xl border border-white/10 bg-zinc-950 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {assignment.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {getClassName(assignment)} ·{" "}
                        {getAssignmentTypeLabel(assignment.assignment_type)} ·{" "}
                        {getModeLabel(
                          assignment.assignment_type,
                          assignment.mode
                        )}{" "}
                        · {assignment.question_count} questions
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300">
                      {assignment.due_date
                        ? `Due ${new Date(
                            assignment.due_date
                          ).toLocaleDateString()}`
                        : "No due date"}
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zinc-500">
                    Student completion data will appear after the assignment
                    runner is connected.
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}