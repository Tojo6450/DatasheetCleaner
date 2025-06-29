// src/validations/clientValidator.tsx

export interface Client {
  ClientID?: string;
  ClientName?: string;
  PriorityLevel?: string | number;
  AttributesJSON?: string;
  RequestedTaskIDs?: string;
}

export function validateClient(client: Client, taskIds: string[] = []): Record<string, string> {
  const errors: Record<string, string> = {};

  // Required fields
  if (!client.ClientID) errors.ClientID = "ClientID is required";
  if (!client.ClientName) errors.ClientName = "ClientName is required";

  // PriorityLevel should be 1–5
  const priority = parseInt(String(client.PriorityLevel));
  if (isNaN(priority) || priority < 1 || priority > 5) {
    errors.PriorityLevel = "PriorityLevel must be between 1 and 5";
  }

  // AttributesJSON must be valid JSON
  if (client.AttributesJSON) {
    try {
      JSON.parse(client.AttributesJSON);
    } catch {
      errors.AttributesJSON = "Invalid JSON format in AttributesJSON";
    }
  }

  // RequestedTaskIDs must all exist in taskIds
  const taskIdsSet = new Set(taskIds.map((id) => id.trim().toUpperCase()));

  if (client.RequestedTaskIDs) {
    const ids = client.RequestedTaskIDs.split(",").map((id) => id.trim().toUpperCase());
    const unknown = ids.filter((id) => !taskIdsSet.has(id));
    if (unknown.length) {
      errors.RequestedTaskIDs = `Unknown Task IDs: ${unknown.join(", ")}`;
    }
  }

  return errors;
}
