import { ImportStatus } from "./import-data";

type Props = {
  status: ImportStatus | string;
};

const statusClass: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  VALIDATING: "bg-blue-100 text-blue-700",
  SUCCESS: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  PARTIAL_SUCCESS: "bg-yellow-100 text-yellow-700",
};

export function ImportStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusClass[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
