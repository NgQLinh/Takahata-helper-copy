"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const HomePath = "/home";
const SystemControlPath = "/system-control";
const EquipmentPath = "/equipment";
const SettingsPath = "/settings";
const ReportPath = "/report";
const AlertServicePath = "/alert-service";

export default function DefaultNavigationLayout({
  children,
}: PropsWithChildren) {
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

        <div className="justify-content-center">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link href={HomePath} className={navClass(HomePath)}>
                Giám sát
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link
                href={SystemControlPath}
                className={navClass(SystemControlPath)}
              >
                Nhập liệu
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={EquipmentPath} className={navClass(EquipmentPath)}>
                Thiết bị
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={SettingsPath} className={navClass(SettingsPath)}>
                Cài đặt
              </Link>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <Link href={ReportPath} className={navClass(ReportPath)}>
                Báo cáo
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href={AlertServicePath}
                className={navClass(AlertServicePath)}
              >
                Cảnh báo
                <span
                  className="badge bg-danger ms-1"
                  style={{
                    fontSize: "0.6rem",
                    position: "relative",
                    top: "-6px",
                  }}
                >
                  !
                </span>
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
