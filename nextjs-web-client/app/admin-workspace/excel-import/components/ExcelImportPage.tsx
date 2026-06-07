"use client";

import { useMemo, useState } from "react";
import { ImportType, importHistory, previewRows } from "./import-data";
import { ImportStatusBadge } from "./ImportStatusBadge";

const importTypes: Array<{
  value: ImportType;
  label: string;
}> = [
  { value: "MACHINE_SCHEDULE", label: "Machine Schedule" },
  { value: "WORK_ORDERS", label: "Work Orders" },
  { value: "MOLD_PROJECTS", label: "Mold Projects" },
  { value: "MACHINE_OPERATION", label: "Machine Operation" },
  { value: "COSTS", label: "Costs" },
];

export function ExcelImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>("MACHINE_SCHEDULE");
  const [step, setStep] = useState<"UPLOAD" | "PREVIEW" | "RESULT">("UPLOAD");

  const totalRows = previewRows.length;
  const validRows = previewRows.filter((x) => x.status === "VALID").length;
  const errorRows = previewRows.filter((x) => x.status === "ERROR").length;

  const canPreview = useMemo(() => {
    return !!file && !!importType;
  }, [file, importType]);

  function handleValidate() {
    if (!canPreview) return;
    setStep("PREVIEW");
  }

  function handleImport() {
    setStep("RESULT");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Excel Import</h1>
        <p className="text-sm text-gray-500">
          Upload Excel để chuyển dữ liệu lịch máy, work order, khuôn và chi phí
          vào hệ thống.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-gray-900">Upload File</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Import Type
                </label>

                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value as ImportType)}
                  className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
                >
                  {importTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100">
                <div className="text-sm font-medium text-gray-900">
                  Chọn file Excel
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  .xlsx hoặc .xls
                </div>

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>

              {file && (
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              )}

              <button
                onClick={handleValidate}
                disabled={!canPreview}
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Validate & Preview
              </button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-gray-900">Import Steps</h2>

            <div className="mt-4 space-y-3 text-sm">
              <Step
                active={step === "UPLOAD"}
                done={step !== "UPLOAD"}
                label="1. Upload file"
              />
              <Step
                active={step === "PREVIEW"}
                done={step === "RESULT"}
                label="2. Preview & validate"
              />
              <Step
                active={step === "RESULT"}
                done={false}
                label="3. Import result"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {step === "UPLOAD" && <EmptyPanel />}

          {step === "PREVIEW" && (
            <div className="rounded-xl border bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
                <div>
                  <h2 className="font-semibold text-gray-900">Preview Data</h2>
                  <p className="text-sm text-gray-500">
                    Kiểm tra dữ liệu trước khi import vào database.
                  </p>
                </div>

                <button
                  onClick={handleImport}
                  disabled={errorRows > 0}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Import Valid Data
                </button>
              </div>

              <SummaryCards
                totalRows={totalRows}
                validRows={validRows}
                errorRows={errorRows}
              />

              <PreviewTable />
            </div>
          )}

          {step === "RESULT" && (
            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Import Completed
                  </h2>
                  <p className="text-sm text-gray-500">
                    Dữ liệu đã được import vào hệ thống.
                  </p>
                </div>

                <ImportStatusBadge status="SUCCESS" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                <ResultBox label="Total Rows" value={totalRows} />
                <ResultBox label="Success Rows" value={validRows} />
                <ResultBox label="Error Rows" value={0} />
              </div>

              <button
                onClick={() => {
                  setStep("UPLOAD");
                  setFile(null);
                }}
                className="mt-5 rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Import Another File
              </button>
            </div>
          )}
        </div>
      </div>

      <ImportHistory />
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-xl border bg-white">
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900">
          Chưa có dữ liệu preview
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Chọn file Excel và bấm Validate & Preview.
        </p>
      </div>
    </div>
  );
}

function SummaryCards({
  totalRows,
  validRows,
  errorRows,
}: {
  totalRows: number;
  validRows: number;
  errorRows: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b p-5">
      <ResultBox label="Total Rows" value={totalRows} />
      <ResultBox label="Valid Rows" value={validRows} />
      <ResultBox label="Error Rows" value={errorRows} danger={errorRows > 0} />
    </div>
  );
}

function ResultBox({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className={`mt-1 text-2xl font-bold ${
          danger ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function PreviewTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Row</th>
            <th className="px-4 py-3">Mold</th>
            <th className="px-4 py-3">Part</th>
            <th className="px-4 py-3">Process</th>
            <th className="px-4 py-3">Machine</th>
            <th className="px-4 py-3">Plan Date</th>
            <th className="px-4 py-3">Plan Hours</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Message</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {previewRows.map((row) => (
            <tr key={row.row} className="hover:bg-gray-50">
              <td className="px-4 py-3">{row.row}</td>
              <td className="px-4 py-3 font-medium">{row.moldCode}</td>
              <td className="px-4 py-3">{row.partCode}</td>
              <td className="px-4 py-3">{row.process}</td>
              <td className="px-4 py-3">{row.machine || "-"}</td>
              <td className="px-4 py-3">{row.planDate}</td>
              <td className="px-4 py-3">{row.planHours}h</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    row.status === "VALID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-red-600">{row.message ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImportHistory() {
  return (
    <div className="rounded-xl border bg-white">
      <div className="border-b p-5">
        <h2 className="font-semibold text-gray-900">Import History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Imported At</th>
              <th className="px-4 py-3">Rows</th>
              <th className="px-4 py-3">Success</th>
              <th className="px-4 py-3">Errors</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {importHistory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.fileName}
                </td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.importedAt}</td>
                <td className="px-4 py-3">{item.totalRows}</td>
                <td className="px-4 py-3">{item.successRows}</td>
                <td className="px-4 py-3 text-red-600">{item.errorRows}</td>
                <td className="px-4 py-3">
                  <ImportStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-3 w-3 rounded-full ${
          done ? "bg-green-500" : active ? "bg-gray-900" : "bg-gray-300"
        }`}
      />
      <span
        className={
          active || done ? "font-medium text-gray-900" : "text-gray-500"
        }
      >
        {label}
      </span>
    </div>
  );
}
