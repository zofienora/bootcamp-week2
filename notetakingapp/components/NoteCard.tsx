"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

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

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <div className="text-xs text-gray-500">
          {new Date(note.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* AI Tags and Topics */}
      {(() => {
        // Parse JSON strings to arrays safely
        const parseArray = (value: string | string[] | undefined): string[] => {
          if (!value) return [];
          if (Array.isArray(value)) return value;
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        };
        
        const topics = parseArray(note.topics);
        const tags = parseArray(note.tags);
        
        return (topics.length > 0 || tags.length > 0) && (
          <div className="mt-2 space-y-2">
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {topics.slice(0, 3).map((topic: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 4).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}

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