"use client";

import { useMemo, useState } from "react";
import { Machine, MachineStatus, machines } from "./machine-data";
import { MachineStatusBadge } from "./MachineStatusBadge";

const statusOptions: Array<"ALL" | MachineStatus> = [
  "ALL",
  "AUTO",
  "MANUAL",
  "SETUP",
  "STOP",
  "ALARM",
  "OFFLINE",
];

export function MachinesPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"ALL" | MachineStatus>("ALL");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchKeyword =
        machine.code.toLowerCase().includes(keyword.toLowerCase()) ||
        machine.name.toLowerCase().includes(keyword.toLowerCase()) ||
        machine.type.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus = status === "ALL" || machine.status === status;

      return matchKeyword && matchStatus;
    });
  }, [keyword, status]);

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý danh sách máy, trạng thái vận hành và hiệu suất sử dụng
            </h1>
          </div>

          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Add Machine
          </button>
        </div>

        <div className="rounded-xl border bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search machine code, name, type..."
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400 md:w-96"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "ALL" | MachineStatus)
              }
              className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredMachines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onView={() => setSelectedMachine(machine)}
              />
            ))}

            {filteredMachines.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">
                Không tìm thấy máy phù hợp.
              </div>
            )}
          </div>
        </div>
      </div>

      <MachineDrawer
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
      />
    </>
  );
}

function MachineCard({
  machine,
  onView,
}: {
  machine: Machine;
  onView: () => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-500">{machine.code}</div>
          <h3 className="mt-1 font-semibold text-gray-900">{machine.name}</h3>
          <div className="mt-1 text-sm text-gray-500">{machine.type}</div>
        </div>

        <MachineStatusBadge status={machine.status} />
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <InfoRow
          label="Current WO"
          value={machine.currentWorkOrder ?? "No active work order"}
        />
        <InfoRow label="Operator" value={machine.operator ?? "-"} />
        <InfoRow
          label="STD Hours"
          value={`${machine.standardHoursPerDay}h/day`}
        />
      </div>

      <div className="mt-4 space-y-3">
        <Progress label="Utilization" value={machine.utilization} />
        <Progress label="Auto Rate" value={machine.autoRate} />
      </div>

      <button
        onClick={onView}
        className="mt-4 w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
      >
        View Detail
      </button>
    </div>
  );
}

function MachineDrawer({
  machine,
  onClose,
}: {
  machine: Machine | null;
  onClose: () => void;
}) {
  const open = !!machine;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {machine && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {machine.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {machine.code} · {machine.type}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Machine Info
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBox label="Machine Code" value={machine.code} />
                  <InfoBox label="Machine Type" value={machine.type} />
                  <InfoBox
                    label="STD Hours"
                    value={`${machine.standardHoursPerDay}h/day`}
                  />
                  <div className="rounded-lg border bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="mt-1">
                      <MachineStatusBadge status={machine.status} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Current Operation
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBox
                    label="Current WO"
                    value={machine.currentWorkOrder ?? "-"}
                  />
                  <InfoBox label="Operator" value={machine.operator ?? "-"} />
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Performance Today
                </h3>

                <div className="rounded-xl border p-4">
                  <Progress label="Utilization" value={machine.utilization} />
                  <div className="mt-4">
                    <Progress label="Auto Rate" value={machine.autoRate} />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
                Edit
              </button>
              <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                View Schedule
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{value}</div>
    </div>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-gray-900"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
