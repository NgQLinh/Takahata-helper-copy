"use client";

import "./IndexPage.css";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { Input, Button, Space } from "antd";
import { useState } from "react";

type RowType = "MC" | "P" | "A";

type ScheduleCell = {
  machine?: string;
  date?: string;
  green?: boolean;
};

type PartSchedule = {
  index: string;
  partName: string;
  rows: Record<RowType, ScheduleCell[]>;
};

const columns = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

const data: PartSchedule[] = [
  {
    index: "CN219",
    partName: "FIXING PIN H1",
    rows: {
      MC: [
        { machine: "L1-2.5", green: true },
        { machine: "GSR2-3", green: true },
        { machine: "WE-4", green: true },
        { machine: "GSR1-5", green: true },
        { machine: "M1-9", green: true },
        { machine: "EDM2-12", green: true },
        { machine: "L3-2", green: true },
        { machine: "ME-2", green: true },
        { machine: "D" },
        { machine: "M2" },
        { machine: "M3S" },
      ],
      P: [
        { date: "19-thg 3", green: true },
        { date: "20-thg 4", green: true },
        { date: "23-thg 4", green: true },
        { date: "23-thg 4", green: true },
        { date: "27-thg 4", green: true },
        { date: "2-3/5", green: true },
        { date: "4-thg 5", green: true },
        { date: "6-thg 5", green: true },
      ],
      A: [
        { date: "18/4-1" },
        { date: "18/4-3" },
        { date: "24/4-5" },
        { date: "18/4-4" },
        { date: "27/4-13" },
        { date: "4/5-11" },
        { date: "22/4-2" },
        { date: "8/5-2.75" },
        { date: "23/4-1" },
        { date: "24/4-3" },
        { date: "8/5-2" },
      ],
    },
  },
  {
    index: "CN219",
    partName: "MOVING CORE C2",
    rows: {
      MC: [
        { machine: "L1-8", green: true },
        { machine: "M3S-6", green: true },
        { machine: "HRC", green: true },
        { machine: "GSR2-3", green: true },
        { machine: "EDM60-15", green: true },
        { machine: "L3-3", green: true },
        { machine: "GSR1-9", green: true },
        { machine: "M3S-7", green: true },
        { machine: "ME-2.5", green: true },
      ],
      P: [
        { date: "15-thg 3", green: true },
        { date: "16-thg 3", green: true },
        {},
        { date: "19-thg 4", green: true },
        { date: "21-thg 5", green: true },
        { date: "21-thg 5", green: true },
        { date: "23-thg 5", green: true },
        { date: "24-thg 5", green: true },
        { date: "25-thg 5", green: true },
      ],
      A: [
        { date: "15/3-7.5" },
        { date: "15/3-5" },
        {},
        { date: "19/4-3" },
        { date: "20-22/5-14" },
        { date: "2/5-3" },
        { date: "22/5-8" },
        { date: "23/5-" },
        { date: "23/5-2.5" },
      ],
    },
  },
  {
    index: "CN219",
    partName: "MOVING CORE C1",
    rows: {
      MC: [
        { machine: "L1-10", green: true },
        { machine: "M3S-14", green: true },
        { machine: "HRC", green: true },
        { machine: "GSR2-3", green: true },
        { machine: "M1-6", green: true },
        { machine: "D-6", green: true },
        { machine: "WE-20", green: true },
        { machine: "EDM2-16", green: true },
        { machine: "GSR1-15", green: true },
        { machine: "M3S-10", green: true },
        { machine: "ME-5", green: true },
        { machine: "CAM NX" },
      ],
      P: [
        { date: "16-thg 3", green: true },
        { date: "18-19/3", green: true },
        {},
        { date: "19-thg 4", green: true },
        { date: "24-thg 4", green: true },
        { date: "26-thg 4", green: true },
        { date: "6-7/5", green: true },
        { date: "2-3/5", green: true },
        { date: "10-11/5", green: true },
        { date: "12-thg 5", green: true },
        { date: "14-thg 5", green: true },
      ],
      A: [
        { date: "18/3-7" },
        { date: "18-19/14.5" },
        {},
        { date: "19/4-3" },
        { date: "25/4-11" },
        { date: "26/4-6" },
        { date: "3-4/5-20.5" },
        { date: "2-3/5-13" },
        { date: "4-6/5-10.5" },
        { date: "13/5-6" },
        { date: "22/5-4" },
        { date: "2" },
      ],
    },
  },
];

export function IndexPage() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="schedule-page">
      {/* Toolbar */}
      <div className="toolbar">
        <Space>
          <Input
            placeholder="Tìm theo Part Name hoặc Index..."
            allowClear
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 350 }}
          />

          <Button icon={<ReloadOutlined />} onClick={() => setKeyword("")}>
            Làm mới
          </Button>
        </Space>

        <Button type="primary">Thêm part</Button>
      </div>

      <div className="table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="title" colSpan={18}>
                MOLD PART PROCESSING SCHEDULE
                <br />
                <span>(LỊCH TRÌNH GIA CÔNG CHI TIẾT KHUÔN)</span>
              </th>
            </tr>

            <tr>
              <th className="sticky-col col-index" rowSpan={2}>
                Index
                <br />
                (Tên)
              </th>
              <th className="sticky-col col-part" rowSpan={2}>
                Part Name
                <br />
                (Tên chi tiết)
              </th>
              <th className="col-type" rowSpan={2}>
                Plan/Actual
                <br />
                KH/TT
              </th>
              <th className="process-title" colSpan={columns.length}>
                PROCESSING SCHEDULE
                <br />
                <span>(Lịch trình gia công)</span>
              </th>
            </tr>

            <tr className="green-row">
              {columns.map((col) => (
                <th key={col}></th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((part, partIndex) =>
              (["MC", "P", "A"] as RowType[]).map((type, rowIndex) => (
                <tr key={`${part.partName}-${type}`}>
                  {rowIndex === 0 && (
                    <>
                      <td
                        className="sticky-col col-index part-index"
                        rowSpan={3}
                      >
                        {part.index}
                      </td>
                      <td className="sticky-col col-part part-name" rowSpan={3}>
                        {part.partName}
                      </td>
                    </>
                  )}

                  <td className="col-type">{type}</td>

                  {columns.map((_, i) => {
                    const cell = part.rows[type][i];

                    return (
                      <td key={i} className={cell?.green ? "green-cell" : ""}>
                        {cell?.machine || cell?.date || ""}
                      </td>
                    );
                  })}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
