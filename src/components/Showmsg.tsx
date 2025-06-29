"use client";

import React from "react";

interface ShowMessagesProps {
  messages?: string[];
}

const ShowMessages: React.FC<ShowMessagesProps> = ({ messages = [] }) => {
  if (!messages.length) return null;

  return (
    <div className="my-6 space-y-3">
      {messages.map((msg, idx) => (
        <p key={idx} className="text-sm text-gray-700">
          {msg}
        </p>
      ))}
    </div>
  );
};

export default ShowMessages;
