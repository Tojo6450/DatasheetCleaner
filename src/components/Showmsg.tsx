"use client";

import React from "react";

interface ShowMessagesProps {
  messages?: string[];
}

const ShowMessages: React.FC<ShowMessagesProps> = ({ messages = [] }) => {
  if (!messages.length) return null;

  return (
    <div className="my-6 space-y-2" role="status" aria-live="polite">
      {messages.map((msg, idx) => (
        <p
          key={`${msg}-${idx}`}
          className="text-sm text-gray-700 border-l-4 border-blue-400 pl-2 py-1 rounded"
        >
          {msg}
        </p>
      ))}
    </div>
  );
};

export default ShowMessages;
