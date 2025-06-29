"use client";

import React, { useState } from "react";

type Task = {
  TaskID: string;
  [key: string]: any;
};

type Rule =
  | { type: "coRun"; tasks: string[] }
  | { type: "loadLimit"; group: string; maxSlotsPerPhase: number }
  | { type: "phaseWindow"; task: string; allowedPhases: number[] };

interface RuleBuilderProps {
  tasks: Task[];
  workers: any[];
  clients: any[];
  onRulesChange: (rules: Rule[]) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  tasks,
  workers,
  clients,
  onRulesChange,
}) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [maxSlots, setMaxSlots] = useState("");
  const [allowedPhases, setAllowedPhases] = useState("");
  const [selectedTaskID, setSelectedTaskID] = useState("");

  const addCoRunRule = () => {
    if (selectedTasks.length >= 2) {
      const rule: Rule = { type: "coRun", tasks: [...selectedTasks].sort() };
      const isDuplicate = rules.some(
        (r) =>
          r.type === "coRun" &&
          r.tasks.length === rule.tasks.length &&
          r.tasks.every((t) => rule.tasks.includes(t))
      );
      if (isDuplicate) return;

      const updated = [...rules, rule];
      setRules(updated);
      onRulesChange(updated);
      setSelectedTasks([]);
    }
  };

  const addLoadLimitRule = () => {
    if (groupName && maxSlots) {
      const rule: Rule = {
        type: "loadLimit",
        group: groupName,
        maxSlotsPerPhase: Number(maxSlots),
      };
      const updated = [...rules, rule];
      setRules(updated);
      onRulesChange(updated);
      setGroupName("");
      setMaxSlots("");
    }
  };

  const addPhaseWindowRule = () => {
    if (selectedTaskID && allowedPhases) {
      const phases = allowedPhases.split(",").map((p) => Number(p.trim()));
      const rule: Rule = {
        type: "phaseWindow",
        task: selectedTaskID,
        allowedPhases: phases,
      };
      const updated = [...rules, rule];
      setRules(updated);
      onRulesChange(updated);
      setAllowedPhases("");
      setSelectedTaskID("");
    }
  };

  return (
    <div className="p-4 shadow rounded mt-8">
      <h2 className="text-lg font-bold mb-4">Define Business Rules</h2>

      {/* Co-run Tasks */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Co-run Tasks</h3>
        <div className="grid grid-cols-2 gap-2">
          {tasks.map((t) => (
            <label key={t.TaskID} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={t.TaskID}
                checked={selectedTasks.includes(t.TaskID)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTasks((prev) =>
                    e.target.checked
                      ? [...prev, value]
                      : prev.filter((id) => id !== value)
                  );
                }}
              />
              <span>{t.TaskID}</span>
            </label>
          ))}
        </div>
        <button
          onClick={addCoRunRule}
          className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded"
        >
          Add Co-run Rule
        </button>
      </div>

      {/* Load Limit Rule */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Load Limit</h3>
        <input
          type="text"
          placeholder="Worker Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-1 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Max Slots Per Phase"
          value={maxSlots}
          onChange={(e) => setMaxSlots(e.target.value)}
          className="border p-1 w-full mb-2"
        />
        <button
          onClick={addLoadLimitRule}
          className="bg-indigo-500 text-white px-3 py-1 rounded"
        >
          Add Load Limit Rule
        </button>
      </div>

      {/* Phase Window Rule */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Phase Window</h3>
        <label htmlFor="phase-window-task-select" className="sr-only">
          Select Task for Phase Window
        </label>
        <select
          id="phase-window-task-select"
          className="border p-1 w-full mb-2"
          value={selectedTaskID}
          onChange={(e) => setSelectedTaskID(e.target.value)}
          aria-label="Select Task for Phase Window"
        >
          <option value="" className="bg-black">Select Task</option>
          {tasks.map((t) => (
            <option key={t.TaskID} value={t.TaskID} className="bg-black">
              {t.TaskID}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Comma separated phases (e.g., 1,2)"
          value={allowedPhases}
          onChange={(e) => setAllowedPhases(e.target.value)}
          className="border p-1 w-full"
        />
        <button
          onClick={addPhaseWindowRule}
          className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded"
        >
          Add Phase Window Rule
        </button>
      </div>

      {/* Current Rules Output */}
      <div className="mt-6">
        <h4 className="font-semibold">Current Rules:</h4>
        <pre className="text-sm p-2 rounded max-h-60 overflow-auto ">
          {JSON.stringify(rules, null, 2)}
        </pre>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(rules, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "rules.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Rules Config
        </button>
      </div>
    </div>
  );
};

export default RuleBuilder;
