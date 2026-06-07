import { MoldProjectStatus } from "./mold-project-data";

type Props = {
  status: MoldProjectStatus;
};

const statusClass: Record<MoldProjectStatus, string> = {
  PLANNING: "bg-gray-100 text-gray-700",
  WAITING: "bg-blue-100 text-blue-700",
  RUNNING: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  DONE: "bg-slate-100 text-slate-700",
  DELAYED: "bg-red-100 text-red-700",
  CANCELLED: "bg-zinc-200 text-zinc-600",
};

export function MoldProjectStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[status]}`}
    >
      {status}
    </span>
  );
}
