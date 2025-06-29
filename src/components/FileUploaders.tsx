"use client";

import React, { useRef } from "react";
import Papa from "papaparse";

// Define types for props and data structures
interface Props {
  onDataParsed: (data: {
    clients: any[];
    workers: any[];
    tasks: any[];
  }) => void;
  onMessage: (msg: string) => void;
}

const FileUploaders: React.FC<Props> = ({ onDataParsed, onMessage }) => {
  const rawClients = useRef<any[]>([]);
  const rawWorkers = useRef<any[]>([]);
  const rawTasks = useRef<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const baseName = file.name.toLowerCase();
      if (ext !== "csv") {
        onMessage(`❌ ${file.name} is not a CSV file.`);
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async ({ data }: Papa.ParseResult<any>) => {
          const sample = data.slice(0, 5);

          let type: "client" | "worker" | "task" | "" = "";
          if (baseName.includes("client")) type = "client";
          else if (baseName.includes("worker")) type = "worker";
          else if (baseName.includes("task")) type = "task";
          else {
            onMessage(`⚠️ Unknown file: ${file.name}`);
            return;
          }

          try {
            const res = await fetch("/api/ai-map", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sampleRows: sample, entityType: type }),
            });

            const { mapping } = await res.json();

            const mapped = data.map((row: Record<string, string>) => {
              const newRow: Record<string, string> = {};
              for (const key in row) {
                const mappedKey = mapping[key] || key;
                if (mappedKey !== "IGNORE") newRow[mappedKey] = row[key];
              }
              return newRow;
            });

            if (type === "client") rawClients.current = mapped;
            if (type === "worker") rawWorkers.current = mapped;
            if (type === "task") rawTasks.current = mapped;

            onMessage(`✅ Processed ${type} file.`);
            onDataParsed({
              clients: rawClients.current,
              workers: rawWorkers.current,
              tasks: rawTasks.current,
            });
          } catch (error) {
            onMessage(`❌ Failed to process ${file.name}`);
            console.error(error);
          }
        },
      });
    });
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        multiple
        accept=".csv"
        onChange={handleFileChange}
        className="border p-2 w-full"
        title="Upload CSV files"
        aria-label="Upload CSV files"
      />
    </div>
  );
};

export default FileUploaders;
