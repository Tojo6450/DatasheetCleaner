export function buildValidationPrompt(entityType: string, sample: any[]): string {
  return `
You're a smart data validation AI. The user has uploaded a dataset for the "${entityType}" entity. Your job is to scan the data for:

- Missing fields
- Malformed or incorrectly typed values
- Out-of-range numbers (e.g., Priority should be 1–5, Duration ≥ 1)
- Broken JSON
- Unknown references (e.g., task IDs that don't match existing ones)
- Any other potential quality issues

You will return a JSON array describing each row that contains issues, including suggestions if possible.

Expected format (return only valid JSON):
[
  {
    "index": 0,  // index in the uploaded array
    "issues": ["PriorityLevel out of range", "Empty ClientName"],
    "suggestions": {
      "PriorityLevel": "3",
      "ClientName": "Acme Corp"
    }
  }
]

Validate this sample (first 10 rows only for brevity):
${JSON.stringify(sample.slice(0, 10), null, 2)}
`.trim();
}
