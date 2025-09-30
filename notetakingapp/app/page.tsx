"use client";

import { useEffect, useMemo, useState } from "react";
import { NoteCard } from "@/components/NoteCard";
import { AINoteDialog } from "@/components/AINoteDialog"; // ← AI-powered dialog
import { cn } from "@/lib/utils";

type NoteDTO = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Dashboard() {
  const [notes, setNotes] = useState<NoteDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<NoteDTO | null>(null); // ← single, consistent state

  // load notes
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        const res = await fetch("/api/notes", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load notes");
        const data = await res.json();
        if (alive) setNotes(data.notes as NoteDTO[]);
      } catch {
        if (alive) setError("Could not load notes.");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const sorted = useMemo(
    () =>
      (notes ?? [])
        .slice()
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [notes]
  );

  async function createNote(input: { title: string; content: string }) {
    setPending(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error();
      const { note } = await res.json();
      setNotes((prev) => (prev ? [note, ...prev] : [note]));
    } finally {
      setPending(false);
    }
  }

  async function updateNote(id: string, input: { title: string; content: string }) {
    setPending(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error();
      const { note } = await res.json();
      setNotes((prev) => prev?.map((n) => (n.id === id ? note : n)) ?? [note]);
    } finally {
      setPending(false);
    }
  }

  async function deleteNote(id: string) {
    const prev = notes;
    setNotes((p) => p?.filter((n) => n.id !== id) ?? null); // optimistic
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setNotes(prev ?? null); // rollback
      alert("Failed to delete note.");
    }
  }

  async function updateNoteTags(id: string, tags: string[], topics: string[]) {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags, topics }),
    });
    if (!res.ok) {
      throw new Error("Failed to update tags");
    }
    const data = await res.json();
    setNotes((prev) =>
      prev?.map((note) => (note.id === id ? { ...note, tags: data.note.tags, topics: data.note.topics } : note)) ?? null
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">Notes</h1>

        <AINoteDialog
          mode="create"
          onSubmit={async (i) => createNote(i)}
          triggerClassName="ml-auto"
        />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {notes === null ? (
        <div className="text-gray-500">Loading notes…</div>
      ) : notes.length === 0 ? (
        <div className="text-gray-500">No notes yet. Add your first one!</div>
      ) : (
        <div className={cn("grid gap-4", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {sorted.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              pending={pending}
              onEdit={(note /* NoteDTO */) => setEditing( note)}
              onDelete={deleteNote}
              onUpdateTags={updateNoteTags}
            />
          ))}
        </div>
      )}

      {/* Edit dialog */}
      {editing && (
        <AINoteDialog
          mode="edit"
          // AINoteDialog expects { id?: string; title; content }
          initial={{ id: editing.id, title: editing.title, content: editing.content }}
          onSubmit={async (i) => {
            await updateNote(editing.id, i);
            setEditing(null);
          }}
          open={!!editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        >
          <button className="hidden" />
        </AINoteDialog>
      )}
    </main>
  );
}