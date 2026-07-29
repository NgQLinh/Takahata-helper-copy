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

          <Button type="primary">Tạo báo cáo</Button>
        </div>

        <div className="grow overflow-auto pe-2">
          <div className="grid gap-3 ">
            <div className="rounded-xl border bg-white">
              <div className="d-flex flex-row justify-between p-3">
                <h4 className="font-semibold text-gray-900">Máy</h4>

                <Button>Export report</Button>
              </div>

              <div className="row g-3 mb-4 p-3">
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
            </div>

            <div className="rounded-xl border bg-white">
              <div className="d-flex flex-row justify-between p-3">
                <h4 className="font-semibold text-gray-900">Part</h4>

                <Button>Export report</Button>
              </div>

              <div className="row g-3 mb-4 p-3">
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
            </div>

            <div className="rounded-xl border bg-white">
              <div className="d-flex flex-row justify-between p-3">
                <h4 className="font-semibold text-gray-900">Index</h4>

                <Button>Export report</Button>
              </div>

              <div className="row g-3 mb-4 p-3">
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
