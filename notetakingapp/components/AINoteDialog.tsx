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
import { AIAnalysis } from "./AIAnalysis";

export type NoteInput = { title: string; content: string; tags?: string[] };
export type Note = { id?: string; title: string; content: string; tags?: string[] };

interface AINoteDialogProps {
  mode: "create" | "edit";
  initial?: Note;
  onSubmit: (input: NoteInput) => Promise<void>;
  triggerClassName?: string;
  children?: React.ReactNode;
  open?: boolean; // Add open prop for programmatic control
  onOpenChange?: (open: boolean) => void; // Add onOpenChange prop
}

export function AINoteDialog({
  mode,
  initial,
  onSubmit,
  triggerClassName,
  children,
  open: controlledOpen,
  onOpenChange,
}: AINoteDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [tags, setTags] = React.useState<string[]>(initial?.tags ?? []);
  const [newTag, setNewTag] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  
  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setContent(initial?.content ?? "");
      setTags(initial?.tags ?? []);
      setErr(null);
      setAiAnalysis(null);
      setShowAIAnalysis(false);
    }
  }, [open, initial?.title, initial?.content, initial?.tags]);

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis);
        setShowAIAnalysis(true);
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSmartSuggestions = async () => {
    if (!content.trim()) return;
    
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(prev => ({ ...prev, suggestions: data.suggestions }));
        setShowAIAnalysis(true);
      }
    } catch (error) {
      console.error('Smart suggestions failed:', error);
    }
  };

  const improveContent = async () => {
    if (!content.trim()) return;
    
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.improvedContent);
      }
    } catch (error) {
      console.error('Content improvement failed:', error);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setContent(prev => prev + " " + suggestion);
  };

  const applyImprovement = (improvement: string) => {
    setContent(improvement);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), tags });
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? "Add a new note" : "Edit note"}
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </DialogTitle>
          <DialogDescription>
            Write your note and let AI help you improve it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <div className="space-y-4">
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
                className="min-h-[200px]"
              />
              
              {/* Hashtags */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add hashtag..."
                    className="flex-1 px-2 py-1 text-sm border rounded"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {err && <p className="text-sm text-red-600">{err}</p>}
            </div>

            {/* AI Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={analyzeContent}
                disabled={!content.trim() || isAnalyzing}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? "Analyzing..." : "🤖 Analyze"}
              </button>
              <button
                onClick={getSmartSuggestions}
                disabled={!content.trim()}
                className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
              >
                💡 Get Suggestions
              </button>
              <button
                onClick={improveContent}
                disabled={!content.trim()}
                className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
              >
                ✨ Improve Style
              </button>
            </div>
          </div>

          {/* AI Analysis Panel */}
          {showAIAnalysis && aiAnalysis && (
            <div className="lg:max-h-[500px] overflow-y-auto">
              <AIAnalysis
                tags={aiAnalysis.tags}
                topics={aiAnalysis.topics}
                suggestions={aiAnalysis.suggestions}
                improvements={aiAnalysis.improvements}
                relatedTopics={aiAnalysis.relatedTopics}
                onApplySuggestion={applySuggestion}
                onApplyImprovement={applyImprovement}
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
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
