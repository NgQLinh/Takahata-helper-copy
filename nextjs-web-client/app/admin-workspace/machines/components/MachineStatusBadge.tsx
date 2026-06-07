import { MachineStatus } from "./machine-data";

type Props = {
  status: MachineStatus;
};

const statusClass: Record<MachineStatus, string> = {
  AUTO: "bg-green-100 text-green-700",
  MANUAL: "bg-blue-100 text-blue-700",
  SETUP: "bg-yellow-100 text-yellow-700",
  STOP: "bg-gray-100 text-gray-700",
  ALARM: "bg-red-100 text-red-700",
  OFFLINE: "bg-zinc-200 text-zinc-600",
};

export function MachineStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[status]}`}
    >
      {status}
    </span>
  );
}