"use client";

import React from "react";

interface ExportPanelProps {
  clients: Record<string, unknown>[];
  workers: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  rules: Record<string, unknown>[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ clients, workers, tasks, rules }) => {
  const downloadJSON = (filename: string, data: object) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">📦 Export Processed Data</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          onClick={() => downloadJSON("clients.json", clients)}
          className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
        >
          Download Clients
        </button>
        <button
          onClick={() => downloadJSON("workers.json", workers)}
          className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
        >
          Download Workers
        </button>
        <button
          onClick={() => downloadJSON("tasks.json", tasks)}
          className="bg-yellow-500 hover:bg-yellow-400 text-white py-2 px-4 rounded"
        >
          Download Tasks
        </button>
        <button
          onClick={() => downloadJSON("rules.json", rules)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded"
        >
          Download Rules
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
