import { ScheduleItem } from "./schedule-data";

type Props = {
  item?: ScheduleItem;
};

const statusClass = {
  PLANNED: "bg-blue-50 text-blue-700 border-blue-200",
  RUNNING: "bg-green-50 text-green-700 border-green-200",
  DONE: "bg-gray-50 text-gray-600 border-gray-200",
  DELAYED: "bg-red-50 text-red-700 border-red-200",
};

export function MachineScheduleCell({ item }: Props) {
  if (!item) {
    return (
      <div className="min-h-24 rounded-lg border border-dashed border-gray-200 bg-gray-50" />
    );
  }

  return (
    <div
      className={`min-h-24 rounded-lg border p-3 text-sm shadow-sm ${statusClass[item.status]}`}
    >
      <div className="font-semibold">
        {item.moldCode} - {item.partCode}
      </div>

      <div className="mt-1 text-xs opacity-80">{item.process}</div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span>{item.planHours}h</span>
        <span>{item.status}</span>
      </div>
    </div>
  );
}