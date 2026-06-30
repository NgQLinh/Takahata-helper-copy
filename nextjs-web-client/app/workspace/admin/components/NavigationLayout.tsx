"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DashboardPath = "/workspace/admin/dashboard";
const MachinesPath = "/workspace/admin/machines";
const MachineSchedulePath = "/workspace/admin/machine-schedule";
const KPIReportsPath = "/workspace/admin/kpi-reports";
const UsersRolesPath = "/workspace/admin/users-roles";
const IndexPath = "/workspace/admin/index";

export default function NavigationLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const navClass = (href: string) =>
    `nav-link ${pathname === href ? "text-info fw-bold" : "text-light"}`;

  const handleLogout = () => {
    // Optional: clear token/cookie here
    router.push("/login");
  };

  return (
    <div className="vh-100 d-flex flex-column overflow-hidden">
      <nav
        className="navbar navbar-expand-lg px-3 shrink-0"
        style={{ backgroundColor: "#2f3b52" }}
      >
        <div className="d-flex align-items-center text-white fw-semibold">
          TAKAHATA Monitor System
        </div>

        <div className="navbar-collapse justify-content-center">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link href={DashboardPath} className={navClass(DashboardPath)}>
                Giám sát
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={MachinesPath} className={navClass(MachinesPath)}>
                Máy móc
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={IndexPath} className={navClass(IndexPath)}>
                Quản lý Index & part
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link
                href={MachineSchedulePath}
                className={navClass(MachineSchedulePath)}
              >
                Lịch máy
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={UsersRolesPath} className={navClass(UsersRolesPath)}>
                Người dùng & phân quyền
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={KPIReportsPath} className={navClass(KPIReportsPath)}>
                Báo cáo
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-white fw-semibold px-3 py-2">
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </nav>

      <main className="grow p-3 overflow-hidden">{children}</main>
    </div>
  );
}
