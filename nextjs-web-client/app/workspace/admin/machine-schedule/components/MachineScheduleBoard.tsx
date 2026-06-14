"use client";

import { MachineScheduleCell } from "./MachineScheduleCell";
import { machines, scheduleItems } from "./schedule-data";

const dates = [
  "2026-06-06",
  "2026-06-07",
  "2026-06-08",
  "2026-06-09",
  "2026-06-10",
  "2026-06-11",
  "2026-06-12",
];

const statusClass = {
  AUTO: "bg-green-100 text-green-700",
  SETUP: "bg-yellow-100 text-yellow-700",
  STOP: "bg-gray-100 text-gray-700",
  ALARM: "bg-red-100 text-red-700",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

export function MachineScheduleBoard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lịch gia công theo máy, ngày và work order
          </h1>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg border px-4 py-2 text-sm">
            Import Excel
          </button>
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
            Add Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Machines</div>
          <div className="text-2xl font-bold">{machines.length}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Work Orders</div>
          <div className="text-2xl font-bold">{scheduleItems.length}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Running</div>
          <div className="text-2xl font-bold">
            {scheduleItems.filter((x) => x.status === "RUNNING").length}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Delayed</div>
          <div className="text-2xl font-bold text-red-600">
            {scheduleItems.filter((x) => x.status === "DELAYED").length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <div
          className="grid min-w-[1100px]"
          style={{
            gridTemplateColumns: `260px repeat(${dates.length}, minmax(140px, 1fr))`,
          }}
        >
          <div className="sticky left-0 z-20 border-b bg-gray-50 p-3 font-semibold">
            Machine
          </div>

          {dates.map((date) => (
            <div
              key={date}
              className="border-b bg-gray-50 p-3 text-center font-semibold"
            >
              {formatDate(date)}
            </div>
          ))}

          {machines.map((machine) => (
            <div key={machine.id} className="contents">
              <div className="sticky left-0 z-10 border-b bg-white p-3">
                <div className="font-semibold text-gray-900">
                  {machine.name}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {machine.code} · {machine.type}
                </div>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass[machine.status]}`}
                >
                  {machine.status}
                </span>
              </div>

              {dates.map((date) => {
                const item = scheduleItems.find(
                  (x) => x.machineId === machine.id && x.date === date,
                );

                return (
                  <div key={`${machine.id}-${date}`} className="border-b p-2">
                    <MachineScheduleCell item={item} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
