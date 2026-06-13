"use client";

import { useMemo, useState } from "react";
import {
  MoldProject,
  MoldProjectStatus,
  MoldProjectType,
  moldProjects,
} from "./mold-project-data";
import { MoldProjectStatusBadge } from "./MoldProjectStatusBadge";

const statusOptions: Array<"ALL" | MoldProjectStatus> = [
  "ALL",
  "PLANNING",
  "WAITING",
  "RUNNING",
  "PAUSED",
  "DONE",
  "DELAYED",
  "CANCELLED",
];

const typeOptions: Array<"ALL" | MoldProjectType> = [
  "ALL",
  "NEW_MOLD",
  "REPAIR",
  "ECO",
  "JIG",
  "URGENT",
  "OVERSHOT",
];

function formatDate(date?: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function MoldProjectsPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"ALL" | MoldProjectStatus>("ALL");
  const [type, setType] = useState<"ALL" | MoldProjectType>("ALL");
  const [selectedProject, setSelectedProject] = useState<MoldProject | null>(
    null,
  );

  const filteredProjects = useMemo(() => {
    return moldProjects.filter((project) => {
      const matchKeyword =
        project.moldCode.toLowerCase().includes(keyword.toLowerCase()) ||
        project.customer?.toLowerCase().includes(keyword.toLowerCase()) ||
        project.description?.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus = status === "ALL" || project.status === status;
      const matchType = type === "ALL" || project.projectType === type;

      return matchKeyword && matchStatus && matchType;
    });
  }, [keyword, status, type]);

  const runningCount = moldProjects.filter(
    (x) => x.status === "RUNNING",
  ).length;
  const delayedCount = moldProjects.filter(
    (x) => x.status === "DELAYED",
  ).length;
  const doneCount = moldProjects.filter((x) => x.status === "DONE").length;

  const totalActualCost = moldProjects.reduce(
    (sum, x) => sum + x.actualCost,
    0,
  );

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý khuôn mới, sửa khuôn, ECO, jig và tiến độ tổng thể
            </h1>
          </div>

          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Add Mold Project
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <SummaryCard label="Total Projects" value={moldProjects.length} />
          <SummaryCard label="Running" value={runningCount} />
          <SummaryCard label="Delayed" value={delayedCount} danger />
          <SummaryCard label="Done" value={doneCount} />
          <SummaryCard
            label="Actual Cost"
            value={formatCurrency(totalActualCost)}
          />
        </div>

        <div className="rounded-xl border bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search mold code, customer, description..."
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400 md:w-96"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "ALL" | MoldProjectStatus)
              }
              className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "ALL" | MoldProjectType)
              }
              className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
            >
              {typeOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Mold Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Parts</th>
                  <th className="px-4 py-3">Work Orders</th>
                  <th className="px-4 py-3">Plan / Actual Hours</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {project.moldCode}
                      </div>
                      <div className="text-xs text-gray-500">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">{project.projectType}</td>
                    <td className="px-4 py-3">{project.customer ?? "-"}</td>
                    <td className="px-4 py-3">
                      <Progress value={project.progress} />
                    </td>
                    <td className="px-4 py-3">
                      {project.doneParts}/{project.totalParts}
                    </td>
                    <td className="px-4 py-3">
                      <div>{project.totalWorkOrders} WO</div>
                      <div className="text-xs text-red-600">
                        {project.delayedWorkOrders} delayed
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {project.totalActualHours}/{project.totalPlanHours}h
                    </td>
                    <td className="px-4 py-3">{formatDate(project.dueDate)}</td>
                    <td className="px-4 py-3">
                      <div>{formatCurrency(project.actualCost)}</div>
                      <div className="text-xs text-gray-400">
                        Est: {formatCurrency(project.estimatedCost)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <MoldProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      Không tìm thấy mold project phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MoldProjectDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

function MoldProjectDrawer({
  project,
  onClose,
}: {
  project: MoldProject | null;
  onClose: () => void;
}) {
  const open = !!project;

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
        className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {project && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {project.moldCode}
                </h2>
                <p className="text-sm text-gray-500">
                  {project.projectType} · {project.customer ?? "-"}
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
                  Project Overview
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBox label="Mold Code" value={project.moldCode} />
                  <InfoBox label="Project Type" value={project.projectType} />
                  <InfoBox label="Customer" value={project.customer ?? "-"} />
                  <div className="rounded-lg border bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="mt-1">
                      <MoldProjectStatusBadge status={project.status} />
                    </div>
                  </div>
                  <InfoBox
                    label="Start Date"
                    value={formatDate(project.startDate)}
                  />
                  <InfoBox
                    label="Due Date"
                    value={formatDate(project.dueDate)}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">Progress</h3>

                <div className="rounded-xl border p-4">
                  <Progress value={project.progress} large />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <InfoBox
                    label="Parts"
                    value={`${project.doneParts}/${project.totalParts}`}
                  />
                  <InfoBox
                    label="Work Orders"
                    value={`${project.totalWorkOrders}`}
                  />
                  <InfoBox
                    label="Delayed WO"
                    value={`${project.delayedWorkOrders}`}
                    danger={project.delayedWorkOrders > 0}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Time & Cost
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBox
                    label="Plan Hours"
                    value={`${project.totalPlanHours}h`}
                  />
                  <InfoBox
                    label="Actual Hours"
                    value={`${project.totalActualHours}h`}
                  />
                  <InfoBox
                    label="Estimated Cost"
                    value={formatCurrency(project.estimatedCost)}
                  />
                  <InfoBox
                    label="Actual Cost"
                    value={formatCurrency(project.actualCost)}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Description
                </h3>

                <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
                  {project.description ?? "No description"}
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
                Edit
              </button>
              <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                View Work Orders
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

function Progress({ value, large }: { value: number; large?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-gray-500">Progress</span>
        <span className="font-medium">{value}%</span>
      </div>

      <div className={`${large ? "h-3" : "h-2"} rounded-full bg-gray-100`}>
        <div
          className={`${large ? "h-3" : "h-2"} rounded-full bg-gray-900`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`mt-1 font-medium ${
          danger ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
