import { useState } from "react";

function ReportPage() {
  const [fromDate, setFromDate] = useState("2026-06-01");
  const [toDate, setToDate] = useState("2026-06-01");

  const summary = {
    totalMachines: 12,
    activeMachines: 8,
    inactiveMachines: 3,
    alarmMachines: 1,
    totalProduction: 1250,
    completedOrders: 18,
    runningOrders: 5,
    averageProgress: 76,
  };

  const machineReports = [
    {
      id: 1,
      machineName: "CNC 001",
      status: "Active",
      productCode: "SP-001",
      targetQty: 200,
      actualQty: 160,
      progress: 80,
      runTime: "06:30",
    },
    {
      id: 2,
      machineName: "CNC 002",
      status: "Inactive",
      productCode: "SP-002",
      targetQty: 150,
      actualQty: 90,
      progress: 60,
      runTime: "04:10",
    },
    {
      id: 3,
      machineName: "CNC 003",
      status: "Alarm",
      productCode: "SP-003",
      targetQty: 300,
      actualQty: 120,
      progress: 40,
      runTime: "02:45",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="badge bg-success">Đang chạy</span>;
      case "Inactive":
        return <span className="badge bg-warning text-dark">Dừng</span>;
      case "Alarm":
        return <span className="badge bg-danger">Cảnh báo</span>;
      default:
        return <span className="badge bg-secondary">Không rõ</span>;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Báo cáo sản xuất</h2>
          <p className="text-muted mb-0">
            Thống kê trạng thái máy và tình hình sản xuất
          </p>
        </div>

        <button className="btn btn-primary">
          Xuất báo cáo
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Từ ngày</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Đến ngày</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Máy</label>
              <select className="form-select">
                <option value="">Tất cả máy</option>
                <option value="CNC001">CNC 001</option>
                <option value="CNC002">CNC 002</option>
                <option value="CNC003">CNC 003</option>
              </select>
            </div>

            <div className="col-md-3">
              <button className="btn btn-dark w-100">
                Lọc dữ liệu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Tổng số máy</p>
              <h3 className="fw-bold">{summary.totalMachines}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Máy đang chạy</p>
              <h3 className="fw-bold text-success">{summary.activeMachines}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Tổng sản lượng</p>
              <h3 className="fw-bold text-primary">
                {summary.totalProduction}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Tiến độ trung bình</p>
              <h3 className="fw-bold text-info">
                {summary.averageProgress}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold">
              Trạng thái máy
            </div>

            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Đang chạy</span>
                  <span>{summary.activeMachines}</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Dừng</span>
                  <span>{summary.inactiveMachines}</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Cảnh báo</span>
                  <span>{summary.alarmMachines}</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-danger"
                    style={{ width: "8%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold">
              Tình hình sản xuất
            </div>

            <div className="card-body">
              <p>
                <strong>Lệnh đã hoàn thành:</strong>{" "}
                {summary.completedOrders}
              </p>

              <p>
                <strong>Lệnh đang sản xuất:</strong>{" "}
                {summary.runningOrders}
              </p>

              <p>
                <strong>Tổng sản lượng:</strong>{" "}
                {summary.totalProduction}
              </p>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tiến độ trung bình</span>
                  <span>{summary.averageProgress}%</span>
                </div>

                <div className="progress" style={{ height: "22px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${summary.averageProgress}%` }}
                  >
                    {summary.averageProgress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white fw-bold">
          Chi tiết sản xuất theo máy
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Máy</th>
                <th>Trạng thái</th>
                <th>Mã hàng</th>
                <th>Kế hoạch</th>
                <th>Thực tế</th>
                <th>Tiến độ</th>
                <th>Thời gian chạy</th>
              </tr>
            </thead>

            <tbody>
              {machineReports.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.machineName}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.productCode}</td>
                  <td>{item.targetQty}</td>
                  <td>{item.actualQty}</td>
                  <td style={{ minWidth: 160 }}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${item.progress}%` }}
                      >
                        {item.progress}%
                      </div>
                    </div>
                  </td>
                  <td>{item.runTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;