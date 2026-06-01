import { PropsWithChildren } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AlertServicePath,
  HomePath,
  SettingsPath,
  SystemControlPath,
  EquipmentPath,
  ReportPath,
} from "../../constants/routes";

export default function DefaultNavigationLayout({
  children,
}: PropsWithChildren) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "text-info fw-bold" : "text-light"}`;

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg px-3"
        style={{ backgroundColor: "#2f3b52" }}
      >
        {/* Left */}
        <div className="d-flex align-items-center text-white fw-semibold">
          TAKAHATA Monitor System
        </div>

        {/* Center */}
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <NavLink to={HomePath} className={navClass}>
                Giám sát
              </NavLink>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <NavLink to={SystemControlPath} className={navClass}>
                Nhập liệu
              </NavLink>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <NavLink to={EquipmentPath} className={navClass}>
                Thiết bị
              </NavLink>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <NavLink to={SettingsPath} className={navClass}>
                Cài đặt
              </NavLink>
            </li>

            <span className="mx-2 text-secondary">|</span>

            <li className="nav-item">
              <NavLink to={ReportPath} className={navClass}>
                Báo cáo
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to={AlertServicePath} className={navClass}>
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
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="text-white fw-semibold px-3 py-2">
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow-1 p-3">{children}</main>
    </div>
  );
}
