import { useEffect, useState } from "react";
import { Device, DeviceStatus } from "../../types";
import { getDevicesAsync } from "../../services";
import "./HomePage.css";

function HomePage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const result = await getDevicesAsync();
      setDevices(result);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status?: DeviceStatus) => {
    return "bg-success";
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Giám sát thiết bị</h2>

        <button className="btn btn-primary" onClick={fetchDevices}>
          Làm mới
        </button>
      </div>

      <div className="row g-4">
        {devices.map((device) => (
          <div key={device.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="device-card card shadow-sm border-0 h-100">
              <div className="card-body p-0">
                {/* Header */}
                <div className="device-header">
                  <span
                    className={`badge rounded-pill ${getStatusColor(
                      device.status,
                    )}`}
                  >
                    {device.status ?? "Unknown"}
                  </span>

                  <h5 className="fw-bold mt-4 text-center">{device.name}</h5>

                  <div className="text-center text-muted small">
                    {device.brand}
                  </div>

                  <div className="text-center text-muted small">
                    SN: {device.serialNumber}
                  </div>
                </div>

                {/* Divider */}
                <div className="device-divider"></div>

                {/* Machine Icon */}
                <div className="device-footer">
                  <div
                    className={`status-indicator ${getStatusColor(
                      device.status,
                    )}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="col-12">
            <div className="alert alert-light text-center">
              No devices found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
