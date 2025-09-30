"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type NoteInput = { title: string; content: string };
export type Note = { id?: string; title: string; content: string };

export function NoteDialog({
  mode,
  initial,
  onSubmit,
  triggerClassName,
  children,
}: {
  mode: "create" | "edit";
  initial?: Note;
  onSubmit: (input: NoteInput) => Promise<void>;
  triggerClassName?: string;
  children?: React.ReactNode; // optional custom trigger
}) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setContent(initial?.content ?? "");
      setErr(null);
    }
  }, [open, initial?.title, initial?.content]);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      setOpen(false);
    } catch (e) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <button
            className={cn(
              "rounded-2xl border px-4 py-2 hover:shadow",
              triggerClassName
            )}
          >
            {mode === "create" ? "Add note" : "Edit"}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add a new note" : "Edit note"}
          </DialogTitle>
          <DialogDescription>
            Give it a clear title and write the content below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border px-3 py-2 outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <Textarea
            placeholder="Write your note…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[160px]"
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <button className="rounded-xl border px-4 py-2">Cancel</button>
          </DialogClose>
          <button
            className={cn(
              "rounded-xl border px-4 py-2",
              busy && "opacity-50 cursor-not-allowed"
            )}
            onClick={submit}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}