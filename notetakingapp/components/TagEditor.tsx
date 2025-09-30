"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TagEditorProps {
  tags: string[];
  topics: string[];
  onTagsChange: (tags: string[]) => void;
  onTopicsChange: (topics: string[]) => void;
  onSave: () => Promise<void>;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export function TagEditor({
  tags,
  topics,
  onTagsChange,
  onTopicsChange,
  onSave,
  isEditing = false,
  onToggleEdit
}: TagEditorProps) {
  const [newTag, setNewTag] = useState("");
  const [newTopic, setNewTopic] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      onTopicsChange([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    onTopicsChange(topics.filter(topic => topic !== topicToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'tag' | 'topic') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag') addTag();
      if (type === 'topic') addTopic();
    }
  };

  return (
    <div className="mt-2 space-y-3">
      {/* Topics Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Topics</h4>
          {onToggleEdit && (
            <button
              onClick={onToggleEdit}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {topics.map((topic, index) => (
            <span
              key={index}
              className={cn(
                "px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1",
                isEditing && "cursor-pointer hover:bg-blue-200"
              )}
              onClick={isEditing ? () => removeTopic(topic) : undefined}
            >
              {topic}
              {isEditing && <span className="text-blue-500">×</span>}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'topic')}
              placeholder="Add topic..."
              className="flex-1 px-2 py-1 text-xs border rounded"
            />
            <button
              onClick={addTopic}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                "px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1",
                isEditing && "cursor-pointer hover:bg-purple-200"
              )}
              onClick={isEditing ? () => removeTag(tag) : undefined}
            >
              #{tag}
              {isEditing && <span className="text-purple-500">×</span>}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'tag')}
              placeholder="Add tag..."
              className="flex-1 px-2 py-1 text-xs border rounded"
            />
            <button
              onClick={addTag}
              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
