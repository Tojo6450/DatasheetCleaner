"use client";
import React from "react";

type RowData = {
  [key: string]: string | number | undefined;
} & {
  __errors?: Record<string, string>;
};

interface DataTableProps {
  data?: RowData[];
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ data = [], title = "" }) => {
  if (!data.length) return null;

  const columns = Object.keys(data[0]).filter((key) => key !== "__errors");

  return (
    <div className="mt-6">
      <h3 className="text-md font-bold text-indigo-600 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 text-black">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 border bg-gray-50 text-black">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                {columns.map((col) => {
                  const hasError = row.__errors?.[col];
                  return (
                    <td
                      key={col}
                      className={`px-4 py-2 border ${
                        hasError ? "bg-red-100 text-red-700 font-semibold" : ""
                      }`}
                      title={hasError || ""}
                    >
                      {row[col]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
