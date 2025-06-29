"use client";

import React from "react";
import { validateClient } from "@/validations/clientValidator";
import { validateWorker } from "@/validations/workerValidator";
import { validateTask } from "@/validations/taskValidator";

interface Suggestion {
  index: number;
  issues?: string[];
  suggestions?: Record<string, string>;
}

interface Props {
  rawClients: any[];
  rawWorkers: any[];
  rawTasks: any[];
  onValidate: (data: {
    clients: any[];
    workers: any[];
    tasks: any[];
  }) => void;
  onMessage?: (msg: string | string[]) => void;
}

const Validator: React.FC<Props> = ({
  rawClients,
  rawWorkers,
  rawTasks,
  onValidate,
  onMessage,
}) => {
  const runValidation = async () => {
    const taskIDs = rawTasks.map((t) => (t.TaskID || "").trim().toUpperCase());

    const validatedClients = rawClients.map((entry) => ({
      ...entry,
      __errors: validateClient(entry, taskIDs),
    }));

    const validatedWorkers = rawWorkers.map((entry) => ({
      ...entry,
      __errors: validateWorker(entry),
    }));

    const validatedTasks = rawTasks.map((entry) => ({
      ...entry,
      __errors: validateTask(entry),
    }));

    onValidate({
      clients: validatedClients,
      workers: validatedWorkers,
      tasks: validatedTasks,
    });

    // onMessage?.("✅ Core Validations completed.");

    const parseSafeJSON = async (res: Response) => {
      try {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e: any) {
        console.warn("Invalid AI JSON response:", e.message);
        return { suggestions: [] };
      }
    };

    try {
      const [clientAIRes, workerAIRes, taskAIRes] = await Promise.all([
        fetch("/api/ai-validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "client", data: rawClients }),
        }),
        fetch("/api/ai-validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "worker", data: rawWorkers }),
        }),
        fetch("/api/ai-validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "task", data: rawTasks }),
        }),
      ]);

      const [clientAI, workerAI, taskAI]: {
        suggestions: Suggestion[];
      }[] = await Promise.all([
        parseSafeJSON(clientAIRes),
        parseSafeJSON(workerAIRes),
        parseSafeJSON(taskAIRes),
      ]);

      if (clientAI?.suggestions?.length) {
        const lines = [
          `🧠 AI found ${clientAI.suggestions.length} issues in Clients:`,
          ...clientAI.suggestions.map(
            (s) =>
              `Row ${s.index}: ${s.issues?.join("; ") || "No issue description"}`
          ),
        ];
        onMessage?.(lines);
        console.log("AI Client Suggestions:", clientAI.suggestions);
      }

      if (workerAI?.suggestions?.length) {
        const lines = [
          `🧠 AI found ${workerAI.suggestions.length} issues in Workers:`,
          ...workerAI.suggestions.map(
            (s) =>
              `Row ${s.index}: ${s.issues?.join("; ") || "No issue description"}`
          ),
        ];
        onMessage?.(lines);
        console.log("AI Worker Suggestions:", workerAI.suggestions);
      }

      if (taskAI?.suggestions?.length) {
        const lines = [
          `🧠 AI found ${taskAI.suggestions.length} issues in Tasks:`,
          ...taskAI.suggestions.map(
            (s) =>
              `Row ${s.index}: ${s.issues?.join("; ") || "No issue description"}`
          ),
        ];
        onMessage?.(lines);
        console.log("AI Task Suggestions:", taskAI.suggestions);
      }
    } catch (error: any) {
      console.error("AI validation failed:", error.message);
      onMessage?.(`⚠️ AI validation failed: ${error.message}`);
    }
  };

  return (
    <button
      onClick={runValidation}
      className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-md"
    >
      Run Validations
    </button>
  );
};

export default Validator;
