import { useState } from "react";

function Settings() {
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [port, setPort] = useState("502");
  const [reportEnabled, setReportEnabled] = useState(true);
  const [reportTime, setReportTime] = useState("08:00");
  const [reportInterval, setReportInterval] = useState("daily");
  const [reportPath, setReportPath] = useState("C:\\Reports");

  const handleSave = () => {
    const settings = {
      ipAddress,
      port: Number(port),
      reportEnabled,
      reportTime,
      reportInterval,
      reportPath,
    };

    console.log("Saved settings:", settings);
    alert("Save settings successfully!");
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Cài đặt hệ thống</h4>
        </div>

        <div className="card-body">
          <h5 className="mb-3">Cài đặt kết nối</h5>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">Địa chỉ IP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Example: 192.168.1.100"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Port</label>
              <input
                type="number"
                className="form-control"
                placeholder="Example: 502"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
          </div>

          <hr />

          <h5 className="mb-3">Cài đặt báo cáo định kỳ</h5>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={reportEnabled}
              onChange={(e) => setReportEnabled(e.target.checked)}
              id="reportEnabled"
            />
            <label className="form-check-label" htmlFor="reportEnabled">
              Cho phép xuất báo cáo tự động
            </label>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Thời gian xuất</label>
              <input
                type="time"
                className="form-control"
                value={reportTime}
                onChange={(e) => setReportTime(e.target.value)}
                disabled={!reportEnabled}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Khoảng thời gian xuất</label>
              <select
                className="form-select"
                value={reportInterval}
                onChange={(e) => setReportInterval(e.target.value)}
                disabled={!reportEnabled}
              >
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Thư mục báo cáo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Example: C:\Reports"
                value={reportPath}
                onChange={(e) => setReportPath(e.target.value)}
                disabled={!reportEnabled}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary">Hủy bỏ</button>
            <button className="btn btn-primary" onClick={handleSave}>
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
