"use client";

import { users } from "../../settings/components/settings-data";

export function UserAndRolePage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý tài khoản người dùng và phân quyền truy cập
        </h1>

        <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
          Thêm người dùng
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Tên đăng nhập</th>
              <th className="px-4 py-3">Họ và tên</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Hoạt động</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{user.username}</td>
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? "Hoạt động" : "Không hoạt động"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100">
                    Sửa
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
