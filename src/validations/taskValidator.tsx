// src/validations/taskValidator.tsx

export interface Task {
  TaskID?: string;
  TaskName?: string;
  Duration?: string | number;
  RequiredSkills?: string;
  PreferredPhases?: string;
  MaxConcurrent?: string | number;
}

export function validateTask(task: Task): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!task.TaskID) errors.TaskID = "TaskID is required";
  if (!task.TaskName) errors.TaskName = "TaskName is required";

  const duration = parseInt(String(task.Duration));
  if (isNaN(duration) || duration < 1) {
    errors.Duration = "Duration must be a number ≥ 1";
  }

  if (!task.RequiredSkills) {
    errors.RequiredSkills = "RequiredSkills are required";
  }

  if (!task.PreferredPhases) {
    errors.PreferredPhases = "PreferredPhases must be provided";
  }

  const maxConcurrent = parseInt(String(task.MaxConcurrent));
  if (isNaN(maxConcurrent) || maxConcurrent < 1) {
    errors.MaxConcurrent = "MaxConcurrent must be a number ≥ 1";
  }

  return errors;
}
