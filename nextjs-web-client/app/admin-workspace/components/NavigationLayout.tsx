"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DashboardPath = "/admin-workspace/dashboard";
const MachinesPath = "/admin-workspace/machines";
const MoldProjectsPath = "/admin-workspace/mold-projects";
const WorkOrdersPath = "/admin-workspace/work-orders";
const MachineSchedulePath = "/admin-workspace/machine-schedule";
const KPIReportsPath = "/admin-workspace/kpi-reports";
const UsersRolesPath = "/admin-workspace/users-roles";

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
    <div className="min-vh-100 d-flex flex-column">
      <nav
        className="navbar navbar-expand-lg px-3"
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
              <Link
                href={MoldProjectsPath}
                className={navClass(MoldProjectsPath)}
              >
                Dự án khuôn
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={WorkOrdersPath} className={navClass(WorkOrdersPath)}>
                Đơn hàng
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
              <Link
                href={UsersRolesPath}
                className={navClass(UsersRolesPath)}
              >
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

      <main className="flex-grow-1 p-3">{children}</main>
    </div>
  );
}
