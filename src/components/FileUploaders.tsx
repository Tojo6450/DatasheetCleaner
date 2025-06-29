"use client";

import React, { useRef } from "react";
import Papa from "papaparse";

type EntityType = "client" | "worker" | "task";

type RawRow = Record<string, string>;

type Props = {
  onDataParsed: (data: {
    clients: RawRow[];
    workers: RawRow[];
    tasks: RawRow[];
  }) => void;
  onMessage: (msg: string) => void;
};

const FileUploaders: React.FC<Props> = ({ onDataParsed, onMessage }) => {
  const rawClients = useRef<RawRow[]>([]);
  const rawWorkers = useRef<RawRow[]>([]);
  const rawTasks = useRef<RawRow[]>([]);

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

      Papa.parse<RawRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async ({ data }: Papa.ParseResult<RawRow>) => {
          const sample = data.slice(0, 5);

          let type: EntityType | "" = "";
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

            const { mapping }: { mapping: Record<string, string> } = await res.json();

            const mapped = data.map((row) => {
              const newRow: RawRow = {};
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
