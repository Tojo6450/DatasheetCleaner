"use client";

import React, { useState } from "react";
import FileUploaders from "@/components/FileUploaders";
import Validator from "@/components/Validator";
import RuleBuilder from "@/components/RuleBuilder";
import DataTable from "@/components/DataTable";
import ExportPanel from "@/components/ExportPanel";
import ShowMessages from "@/components/Showmsg";

// Define types for entities
interface Client {
  [key: string]: any;
}

interface Worker {
  [key: string]: any;
}

interface Task {
  TaskID: string;
  [key: string]: any;
}

interface ParsedData {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [messages, setMessages] = useState<(string | string[])[]>([]);

  const handleDataParsed = ({ clients, workers, tasks }: ParsedData) => {
    setClients(clients);
    setWorkers(workers);
    setTasks(tasks);
  };

  const handleMessage = (msg: string | string[]) => {
    setMessages((prev) => [...prev, ...(Array.isArray(msg) ? msg : [msg])]);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧹 Data Sheet Cleaner</h1>

      <FileUploaders onDataParsed={handleDataParsed} onMessage={handleMessage} />

      <Validator
        rawClients={clients}
        rawWorkers={workers}
        rawTasks={tasks}
        onValidate={({ clients, workers, tasks }: ParsedData) => {
          setClients(clients);
          setWorkers(workers);
          setTasks(tasks);
          setMessages((prev) => [...prev, "✅ Validations completed."]);
        }}
        onMessage={handleMessage}
      />

      <ShowMessages messages={messages.flat()} />

      <DataTable data={clients} title="Clients Data" />
      <DataTable data={workers} title="Workers Data" />
      <DataTable data={tasks} title="Tasks Data" />

      <RuleBuilder
        tasks={tasks}
        workers={workers}
        clients={clients}
        onRulesChange={setRules}
      />

      <ExportPanel
        clients={clients}
        workers={workers}
        tasks={tasks}
        rules={rules}
      />
    </main>
  );
}
