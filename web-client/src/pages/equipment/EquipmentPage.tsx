import { useEffect, useState } from "react";
import { Device } from "../../types";
import { getDevicesAsync } from "../../services";

function EquipmentPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = devices.slice(firstIndex, lastIndex);

  const npage = Math.ceil(devices.length / recordsPerPage);
  const numbers = [...Array(npage).keys()].map((n) => n + 1);

  const fetchDevices = async () => {
    const devices = await getDevicesAsync();
    setDevices(devices);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleEdit = (device: Device) => {
    console.log("Edit device:", device);
  };

  const handleDelete = (id: number) => {
    console.log("Delete device id:", id);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Equipment Page</h1>

      <div className="d-flex justify-content-between mb-3">
        <span>
          Showing {devices.length === 0 ? 0 : firstIndex + 1} -{" "}
          {Math.min(lastIndex, devices.length)} of {devices.length}
        </span>
      </div>

      <table className="table table-bordered table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Serial Number</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Create At</th>
            <th>Create By</th>
            <th style={{ width: "160px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                No devices found
              </td>
            </tr>
          ) : (
            records.map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{device.serialNumber}</td>
                <td>{device.brand}</td>
                <td>{device.status}</td>
                <td>{device.createAt}</td>
                <td>{device.createBy}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(device)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(device.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {npage > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={prevPage}>
                Previous
              </button>
            </li>

            {numbers.map((n) => (
              <li
                key={n}
                className={`page-item ${currentPage === n ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => changePage(n)}>
                  {n}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === npage ? "disabled" : ""}`}
            >
              <button className="page-link" onClick={nextPage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default EquipmentPage;
