// src/validations/workerValidator.tsx

export interface Worker {
  WorkerID?: string;
  WorkerName?: string;
  AvailableSlots?: string;
  MaxLoadPerPhase?: string | number;
}

export function validateWorker(worker: Worker): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!worker.WorkerID) {
    errors.WorkerID = "WorkerID is required";
  }

  if (!worker.WorkerName) {
    errors.WorkerName = "WorkerName is required";
  }

  // Validate AvailableSlots is a JSON array of numbers
  if (worker.AvailableSlots) {
    try {
      const slots = JSON.parse(worker.AvailableSlots);
      if (!Array.isArray(slots) || slots.some((s) => typeof s !== "number")) {
        errors.AvailableSlots = "AvailableSlots must be an array of numbers";
      }
    } catch {
      errors.AvailableSlots = "Invalid format for AvailableSlots";
    }
  }

  const maxLoad = parseInt(String(worker.MaxLoadPerPhase));
  if (isNaN(maxLoad) || maxLoad < 1) {
    errors.MaxLoadPerPhase = "MaxLoadPerPhase must be a positive number";
  }

  return errors;
}
