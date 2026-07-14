"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import "./NavigationLayout.css";

const navItems = [
  {
    href: "/workspace/user/worker",
    label: "Worker",
    icon: <UserAddOutlined />,
  },
];

export default function NavigationLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="vh-100 d-flex overflow-hidden app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-main">TAKAHATA</span>
          <span className="brand-sub">Monitor System</span>
        </div>

        <ul className="nav-menu">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href} className="nav-menu-item">
                <Link
                  href={item.href}
                  className={`nav-menu-link ${active ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-bottom">
          <div className="quick-actions">
            <button className="icon-btn">
              <BellOutlined />
            </button>

            <button className="icon-btn">
              <QuestionCircleOutlined />
            </button>
          </div>

          <div className="user-menu">
            <UserOutlined />
            <span>User</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
