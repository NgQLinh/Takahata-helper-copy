"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Button, DatePicker, Select } from "antd";
import { Machine } from "@/app/types";
import { getMachinesAsync } from "@/app/services/machine/MachineService";
import { toast } from "react-toastify";

// New
const { RangePicker } = DatePicker;
type DateRange = [Dayjs | null, Dayjs | null] | null;

export function KpiReportsPage() {
  // New
  const [filterDateRange, setFilterDateRange] = useState<DateRange>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [machines, setMachines] = useState<Machine[]>();
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [filterMachineIds, setFilterMachineIds] = useState<number[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingMachines(true);
        const data = await getMachinesAsync();
        if (data) {
          setMachines(data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Không thể tải danh sách máy.");
      } finally {
        setLoadingMachines(false);
      }
    };

    void run();
  }, []);

  return (
    <div>
      <div
        className="container-fluid py-3 d-flex flex-column"
        style={{ height: "calc(100vh - 20px)" }}
      >
        <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
          <div style={{ width: 270 }}>
            <label className="form-label mb-1">Kế hoạch</label>
            <RangePicker
              value={filterDateRange}
              onChange={setFilterDateRange}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>
          <div style={{ width: 250 }}>
            <label className="form-label mb-1">Máy</label>
            <Select
              mode="multiple"
              allowClear
              showSearch
              loading={loadingMachines}
              placeholder="Chọn máy"
              style={{ width: "100%" }}
              value={filterMachineIds}
              onChange={setFilterMachineIds}
              maxTagCount="responsive"
              options={machines?.map((machine) => ({
                value: machine.id,
                label: `${machine.name} - ${machine.code}`,
              }))}
            />
          </div>

          <Button>Export report</Button>
        </div>

        <div className="grow overflow-auto pe-2">
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-xl-3">
              <SummaryCard label="Hiệu suất" value={`${333}%`} />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <SummaryCard label="Thời gian gá đặt" value={`100h`} />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <SummaryCard label="Thời gian thực tế" value={`$200h`} />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <SummaryCard label="Thời gian chờ" value={`$400h`} danger />
            </div>
          </div>

          <div className="grid gap-5 ">
            <div className="rounded-xl border bg-white">
              <div className="border-b p-5">
                <h2 className="font-semibold text-gray-900">
                  Machine KPI Detail
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Machine</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Utilization</th>
                      <th className="px-4 py-3">Auto Rate</th>
                      <th className="px-4 py-3">Setup Rate</th>
                      <th className="px-4 py-3">Alarm Rate</th>
                      <th className="px-4 py-3">Plan / Actual</th>
                      <th className="px-4 py-3">Delay</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
