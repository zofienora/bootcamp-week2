"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string | string[]; // Can be JSON string or array
  topics?: string | string[]; // Can be JSON string or array
};

export function NoteCard({
  note,
  onEdit,
  onDelete,
  pending,
}: {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => Promise<void>;
  pending?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  // Parse tags from note data
  const parseArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };
  
  const tags = parseArray(note.tags);

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <div className="text-xs text-gray-500">
          {new Date(note.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Hashtags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap flex-1">
        {note.content}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          className={cn(
            "rounded-xl border px-3 py-1.5 text-sm hover:shadow",
            pending && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => onEdit(note)}
          disabled={pending}
        >
          Edit
        </button>

        <button
          className={cn(
            "rounded-xl border px-3 py-1.5 text-sm hover:shadow",
            (pending || busy) && "opacity-50 cursor-not-allowed"
          )}
          onClick={async () => {
            setBusy(true);
            await onDelete(note.id).finally(() => setBusy(false));
          }}
          disabled={pending || busy}
        >
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}