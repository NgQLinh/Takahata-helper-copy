"use client";

import { useMemo, useState } from "react";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { WorkOrder, WorkOrderStatus, workOrders } from "./work-order-data";

const statusOptions: Array<"ALL" | WorkOrderStatus> = [
  "ALL",
  "PLANNING",
  "WAITING",
  "RUNNING",
  "PAUSED",
  "DONE",
  "DELAYED",
  "CANCELLED",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
}

export function WorkOrderTable() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"ALL" | WorkOrderStatus>("ALL");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    null,
  );

  const filteredData = useMemo(() => {
    return workOrders.filter((item) => {
      const matchKeyword =
        item.code.toLowerCase().includes(keyword.toLowerCase()) ||
        item.moldCode.toLowerCase().includes(keyword.toLowerCase()) ||
        item.partCode.toLowerCase().includes(keyword.toLowerCase()) ||
        item.machine.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus = status === "ALL" || item.status === status;

      return matchKeyword && matchStatus;
    });
  }, [keyword, status]);

  const runningCount = workOrders.filter((x) => x.status === "RUNNING").length;
  const delayedCount = workOrders.filter((x) => x.status === "DELAYED").length;
  const totalPlanHours = workOrders.reduce((sum, x) => sum + x.planHours, 0);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
            <p className="text-sm text-gray-500">
              Quản lý công việc gia công theo khuôn, part, công đoạn và máy
            </p>
          </div>

          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Add Work Order
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Total WO</div>
            <div className="text-2xl font-bold">{workOrders.length}</div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Running</div>
            <div className="text-2xl font-bold text-green-600">
              {runningCount}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Delayed</div>
            <div className="text-2xl font-bold text-red-600">
              {delayedCount}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">Plan Hours</div>
            <div className="text-2xl font-bold">{totalPlanHours}h</div>
          </div>
        </div>

        <div className="rounded-xl border bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search WO, mold, part, machine..."
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400 md:w-80"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "ALL" | WorkOrderStatus)
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">WO Code</th>
                  <th className="px-4 py-3">Mold</th>
                  <th className="px-4 py-3">Part</th>
                  <th className="px-4 py-3">Process</th>
                  <th className="px-4 py-3">Machine</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredData.map((item) => {
                  const progress =
                    item.actualHours && item.planHours > 0
                      ? Math.min((item.actualHours / item.planHours) * 100, 100)
                      : 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-4 py-3">{item.moldCode}</td>
                      <td className="px-4 py-3">{item.partCode}</td>
                      <td className="px-4 py-3">{item.process}</td>
                      <td className="px-4 py-3">{item.machine}</td>
                      <td className="px-4 py-3">
                        <div>{formatDate(item.planStart)}</div>
                        <div className="text-xs text-gray-400">
                          → {formatDate(item.planEnd)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {item.actualHours ?? 0}/{item.planHours}h
                        </div>
                        <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-gray-900"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">P{item.priority}</td>
                      <td className="px-4 py-3">
                        <WorkOrderStatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedWorkOrder(item)}
                          className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <WorkOrderDrawer
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
      />
    </>
  );
}

function WorkOrderDrawer({
  workOrder,
  onClose,
}: {
  workOrder: WorkOrder | null;
  onClose: () => void;
}) {
  const open = !!workOrder;

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
        {workOrder && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {workOrder.code}
                </h2>
                <p className="text-sm text-gray-500">
                  {workOrder.moldCode} · {workOrder.partCode}
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
                  Work Order Info
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Mold Code" value={workOrder.moldCode} />
                  <Info label="Part Code" value={workOrder.partCode} />
                  <Info label="Process" value={workOrder.process} />
                  <Info label="Machine" value={workOrder.machine} />
                  <Info label="Priority" value={`P${workOrder.priority}`} />
                  <div>
                    <div className="text-gray-500">Status</div>
                    <div className="mt-1">
                      <WorkOrderStatusBadge status={workOrder.status} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">Schedule</h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Plan Start" value={formatDate(workOrder.planStart)} />
                  <Info label="Plan End" value={formatDate(workOrder.planEnd)} />
                  <Info label="Plan Hours" value={`${workOrder.planHours}h`} />
                  <Info
                    label="Actual Hours"
                    value={`${workOrder.actualHours ?? 0}h`}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">Progress</h3>

                <div className="rounded-xl border p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Actual / Plan</span>
                    <span>
                      {workOrder.actualHours ?? 0}/{workOrder.planHours}h
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{
                        width: `${Math.min(
                          ((workOrder.actualHours ?? 0) / workOrder.planHours) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
                Edit
              </button>
              <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                Assign Schedule
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{value}</div>
    </div>
  );
}