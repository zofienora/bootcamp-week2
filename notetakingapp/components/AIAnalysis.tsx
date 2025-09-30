"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AIAnalysisProps {
  tags?: string[];
  topics?: string[];
  suggestions?: string[];
  improvements?: string;
  relatedTopics?: string[];
  onApplySuggestion?: (suggestion: string) => void;
  onApplyImprovement?: (improvement: string) => void;
}

export function AIAnalysis({
  tags = [],
  topics = [],
  suggestions = [],
  improvements = "",
  relatedTopics = [],
  onApplySuggestion,
  onApplyImprovement
}: AIAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'tags' | 'suggestions' | 'improvements'>('tags');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold text-gray-800">AI Analysis</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('tags')}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg transition-colors",
            activeTab === 'tags' 
              ? "bg-blue-100 text-blue-700" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          Tags & Topics
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg transition-colors",
            activeTab === 'suggestions' 
              ? "bg-blue-100 text-blue-700" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab('improvements')}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg transition-colors",
            activeTab === 'improvements' 
              ? "bg-blue-100 text-blue-700" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          Improvements
        </button>
      </div>

      {/* Tags & Topics Tab */}
      {activeTab === 'tags' && (
        <div className="space-y-3">
          {topics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Topics</h4>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {relatedTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Related Topics</h4>
              <div className="flex flex-wrap gap-2">
                {relatedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === 'suggestions' && suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Smart Suggestions</h4>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <p className="text-sm text-gray-700 mb-2">{suggestion}</p>
              {onApplySuggestion && (
                <button
                  onClick={() => onApplySuggestion(suggestion)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Apply Suggestion
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Improvements Tab */}
      {activeTab === 'improvements' && improvements && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Grammar & Style</h4>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-3">{improvements}</p>
            {onApplyImprovement && (
              <button
                onClick={() => onApplyImprovement(improvements)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Apply Improvements
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && suggestions.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No suggestions available
        </div>
      )}

      {activeTab === 'improvements' && !improvements && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No improvements suggested
        </div>
      )}
    </div>
  );
}
