"use client";

import "./IndexPage.css";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { Input, Button, Space } from "antd";
import { useState } from "react";
import CreatePart from "./CreatePart";

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
];

export function IndexPage() {
  // Search
  const [keyword, setKeyword] = useState("");

  // Create
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredData = data.filter(
    (x) =>
      x.index.toLowerCase().includes(keyword.toLowerCase()) ||
      x.partName.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <div className="schedule-page">
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

        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Thêm part
        </Button>
      </div>

      <div className="table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="title" colSpan={columns.length + 4}>
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

              <th className="sticky-col col-type" rowSpan={2}>
                Plan/Actual
                <br />
                KH/TT
              </th>

              <th className="process-title" colSpan={columns.length}>
                PROCESSING SCHEDULE
                <br />
                <span>(Lịch trình gia công)</span>
              </th>

              <th className="sticky-action col-action" rowSpan={2}>
                Action
              </th>
            </tr>

            <tr className="green-row">
              {columns.map((col) => (
                <th key={col}></th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((part) =>
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

                  <td className="sticky-col col-type">{type}</td>

                  {columns.map((_, i) => {
                    const cell = part.rows[type][i];

                    return (
                      <td key={i} className={cell?.green ? "green-cell" : ""}>
                        {cell?.machine || cell?.date || ""}
                      </td>
                    );
                  })}

                  {rowIndex === 0 && (
                    <td className="sticky-action col-action" rowSpan={3}>
                      <Space>
                        <Button size="small">Sửa</Button>
                        <Button size="small" danger>
                          Xóa
                        </Button>
                      </Space>
                    </td>
                  )}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      <CreatePart open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
