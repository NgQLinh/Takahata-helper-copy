"use client";

import { useState } from "react";
import { costCategories, processTypes, users } from "./settings-data";

type Tab = "GENERAL" | "USERS" | "PROCESS" | "COST" | "IMPORT";

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "GENERAL", label: "General" },
  { key: "USERS", label: "Users & Roles" },
  { key: "PROCESS", label: "Process Types" },
  { key: "COST", label: "Cost Categories" },
  { key: "IMPORT", label: "Excel Import" },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("GENERAL");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Cấu hình hệ thống, tài khoản, công đoạn, chi phí và import Excel.
        </p>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="flex gap-2 overflow-x-auto border-b p-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "GENERAL" && <GeneralSettings />}
          {activeTab === "USERS" && <UserSettings />}
          {activeTab === "PROCESS" && <ProcessSettings />}
          {activeTab === "COST" && <CostSettings />}
          {activeTab === "IMPORT" && <ImportSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="General Settings"
        description="Cấu hình thông tin xưởng và thông số vận hành mặc định."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Factory Name" defaultValue="Mold Factory" />
        <Input label="Default Shift Hours" defaultValue="7.5" />
        <Input label="Default Timezone" defaultValue="Asia/Bangkok" />
        <Input label="Currency" defaultValue="VND" />
      </div>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

function UserSettings() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle
          title="Users & Roles"
          description="Quản lý tài khoản người dùng và phân quyền truy cập."
        />

        <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
          Add User
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{user.username}</td>
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProcessSettings() {
  return (
    <DictionarySettings
      title="Process Types"
      description="Danh mục công đoạn dùng cho Work Orders."
      placeholder="Add process type..."
      items={processTypes}
    />
  );
}

function CostSettings() {
  return (
    <DictionarySettings
      title="Cost Categories"
      description="Danh mục chi phí dùng cho Project Costs."
      placeholder="Add cost category..."
      items={costCategories}
    />
  );
}

function ImportSettings() {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="Excel Import Settings"
        description="Cấu hình quy tắc import dữ liệu từ Excel."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Duplicate Handling"
          options={["Skip duplicate rows", "Update existing rows", "Allow duplicates"]}
        />

        <Select
          label="Error Handling"
          options={["Stop when error", "Import valid rows only"]}
        />

        <Input label="Max File Size MB" defaultValue="20" />

        <Select
          label="Default Import Status"
          options={["PENDING", "VALIDATING", "SUCCESS", "FAILED"]}
        />
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <div className="font-semibold text-gray-900">Required Columns</div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {[
            "MoldCode",
            "PartCode",
            "Process",
            "Machine",
            "PlanDate",
            "PlanHours",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full bg-white px-3 py-1 font-medium text-gray-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}

function DictionarySettings({
  title,
  description,
  placeholder,
  items,
}: {
  title: string;
  description: string;
  placeholder: string;
  items: string[];
}) {
  return (
    <div className="space-y-5">
      <SectionTitle title={title} description={description} />

      <div className="flex gap-3">
        <input
          placeholder={placeholder}
          className="h-10 flex-1 rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
        />

        <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
          Add
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-xl border bg-gray-50 p-4"
          >
            <span className="font-medium text-gray-900">{item}</span>

            <button className="rounded-lg border bg-white px-3 py-1.5 text-xs hover:bg-gray-100">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function Input({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      <input
        defaultValue={defaultValue}
        className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400"
      />
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      <select className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-gray-400">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SaveButton() {
  return (
    <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
      Save Settings
    </button>
  );
}