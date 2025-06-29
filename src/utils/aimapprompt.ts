type EntityType = "client" | "worker" | "task";

const expectedHeadersMap: Record<EntityType, string[]> = {
  client: [
    "ClientID",
    "ClientName",
    "PriorityLevel",
    "RequestedTaskIDs",
    "GroupTag",
    "AttributesJSON",
  ],
  worker: [
    "WorkerID",
    "WorkerName",
    "Skills",
    "AvailableSlots",
    "MaxLoadPerPhase",
    "WorkerGroup",
    "QualificationLevel",
  ],
  task: [
    "TaskID",
    "TaskName",
    "Category",
    "Duration",
    "RequiredSkills",
    "PreferredPhases",
    "MaxConcurrent",
  ],
};

export function buildHeaderMappingPrompt(
  sampleRows: Record<string, any>[],
  entityType: EntityType
): { prompt: string; expectedHeaders: string[] } {
  const expectedHeaders = expectedHeadersMap[entityType];
  if (!expectedHeaders) throw new Error("Invalid entityType");

  const prompt = `
You're an intelligent AI assistant designed to help clean and align messy CSV data.

The user is uploading a CSV file for the "${entityType}" entity. Each row contains fields that may be mislabeled, swapped, or unordered. Your task is to identify which field corresponds to which expected property — based on the actual column values, not just the headers.

Expected headers for "${entityType}" are:
${expectedHeaders.join(", ")}

Given this sample of raw data:
${JSON.stringify(sampleRows, null, 2)}

Please return a JSON object where each key is the *original column name* and the value is one of:
- The correct expected header it represents (e.g., "ClientID")
- "IGNORE" if the column is irrelevant

Format:
{
  "rawColumn1": "MappedHeader1",
  "rawColumn2": "MappedHeader2",
  "extraColumn": "IGNORE"
}

Respond ONLY with valid JSON.
`;

  return { prompt, expectedHeaders };
}
