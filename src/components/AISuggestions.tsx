"use client";
import React from "react";

type SuggestionItem = {
  index: number;
  issues?: string[];
  suggestions?: Record<string, any>;
};

type SuggestionsType = {
  client?: SuggestionItem[];
  worker?: SuggestionItem[];
  task?: SuggestionItem[];
};

interface AISuggestionsProps {
  suggestions?: SuggestionsType;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions = {} }) => {
  const { client = [], worker = [], task = [] } = suggestions;

  const renderBlock = (title: string, data: SuggestionItem[]) =>
    data.length ? (
      <div className="mb-6">
        <h4 className="text-lg font-bold mb-2">{title}</h4>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          {data.map((s, i) => (
            <li key={i}>
              <strong>Row {s.index}:</strong> {s.issues?.join("; ")}
              <br />
              <span className="text-sm text-gray-600">
                Suggestions: {JSON.stringify(s.suggestions)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="text-xl font-semibold mb-4 text-blue-800">💡 AI Suggestions</h3>
      {renderBlock("Clients", client)}
      {renderBlock("Workers", worker)}
      {renderBlock("Tasks", task)}
    </div>
  );
};

export default AISuggestions;
