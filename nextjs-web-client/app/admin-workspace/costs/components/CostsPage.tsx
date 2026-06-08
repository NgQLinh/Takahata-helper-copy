"use client";

import { useMemo, useState } from "react";
import {
  CostCategory,
  ProjectCost,
  projectCosts,
} from "./cost-data";
import { CostCategoryBadge } from "./CostCategoryBadge";

const categoryOptions: Array<"ALL" | CostCategory> = [
  "ALL",
  "MATERIAL",
  "MACHINE",
  "LABOR",
  "OUTSOURCE",
  "REPAIR",
  "MODIFY",
  "TRY_OUT",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CostsPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<"ALL" | CostCategory>("ALL");
  const [selectedCost, setSelectedCost] = useState<ProjectCost | null>(null);

  const filteredCosts = useMemo(() => {
    return projectCosts.filter((cost) => {
      const matchKeyword =
        cost.moldCode.toLowerCase().includes(keyword.toLowerCase()) ||
        cost.partCode?.toLowerCase().includes(keyword.toLowerCase()) ||
        cost.workOrderCode?.toLowerCase().includes(keyword.toLowerCase()) ||
        cost.note?.toLowerCase().includes(keyword.toLowerCase());

      const matchCategory =
        category === "ALL" || cost.category === category;

      return matchKeyword && matchCategory;
    });
  }, [keyword, category]);

  const totalCost = filteredCosts.reduce(
    (sum, item) => sum + item.costAmount,
    0,
  );

  const repairCost = filteredCosts
    .filter((x) => x.category === "REPAIR")
    .reduce((sum, x) => sum + x.costAmount, 0);

  const machineCost = filteredCosts
    .filter((x) => x.category === "MACHINE")
    .reduce((sum, x) => sum + x.costAmount, 0);

  const materialCost = filteredCosts
    .filter((x) => x.category === "MATERIAL")
    .reduce((sum, x) => sum + x.costAmount, 0);

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Costs</h1>
            <p className="text-sm text-gray-500">
              Theo dõi chi phí theo khuôn, part, work order và hạng mục.
            </p>
          </div>

          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Add Cost
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard label="Total Cost" value={formatCurrency(totalCost)} />
          <SummaryCard label="Repair Cost" value={formatCurrency(repairCost)} danger />
          <SummaryCard label="Machine Cost" value={formatCurrency(machineCost)} />
          <SummaryCard label="Material Cost" value={formatCurrency(materialCost)} />
        </div>

        <div className="rounded-xl border bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search mold, part, WO, note..."
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400 md:w-96"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "ALL" | CostCategory)
              }
              className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
            >
              {categoryOptions.map((item) => (
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
                  <th className="px-4 py-3">Mold</th>
                  <th className="px-4 py-3">Part</th>
                  <th className="px-4 py-3">Work Order</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Cost Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {cost.moldCode}
                    </td>
                    <td className="px-4 py-3">{cost.partCode ?? "-"}</td>
                    <td className="px-4 py-3">
                      {cost.workOrderCode ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <CostCategoryBadge category={cost.category} />
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(cost.costDate)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(cost.costAmount)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {cost.note ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedCost(cost)}
                        className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCosts.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      Không tìm thấy chi phí phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CostDrawer
        cost={selectedCost}
        onClose={() => setSelectedCost(null)}
      />
    </>
  );
}

function CostDrawer({
  cost,
  onClose,
}: {
  cost: ProjectCost | null;
  onClose: () => void;
}) {
  const open = !!cost;

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
        {cost && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {cost.moldCode}
                </h2>
                <p className="text-sm text-gray-500">
                  {cost.partCode ?? "-"} · {cost.workOrderCode ?? "-"}
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
                  Cost Information
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBox label="Mold Code" value={cost.moldCode} />
                  <InfoBox label="Part Code" value={cost.partCode ?? "-"} />
                  <InfoBox
                    label="Work Order"
                    value={cost.workOrderCode ?? "-"}
                  />
                  <InfoBox label="Cost Date" value={formatDate(cost.costDate)} />

                  <div className="rounded-lg border bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="mt-1">
                      <CostCategoryBadge category={cost.category} />
                    </div>
                  </div>

                  <InfoBox
                    label="Amount"
                    value={formatCurrency(cost.costAmount)}
                    strong
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-gray-900">Note</h3>

                <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
                  {cost.note ?? "No note"}
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-2 border-t p-5">
              <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
                Edit
              </button>
              <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                View Project
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

function InfoBox({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`mt-1 ${
          strong ? "text-lg font-bold" : "font-medium"
        } text-gray-900`}
      >
        {value}
      </div>
    </div>
  );
}