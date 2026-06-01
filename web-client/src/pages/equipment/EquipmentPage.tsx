import { useEffect, useState } from "react";
import { CreateDeviceRequest, Device } from "../../types";
import {
  createDeviceAsync,
  getDevicesAsync,
  deleteDeviceAsync,
} from "../../services";
import { updateDeviceAsync } from "../../services/device/DeviceService";

function EquipmentPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [createForm, setCreateForm] = useState<CreateDeviceRequest>({
    name: "",
    type: 1,
    serialNumber: "",
    brand: "",
  });

  const [updateForm, setUpdateForm] = useState({
    id: 0,
    name: "",
    type: 1,
    serialNumber: "",
    brand: "",
  });

  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = devices.slice(firstIndex, lastIndex);

  const npage = Math.ceil(devices.length / recordsPerPage);
  const numbers = [...Array(npage).keys()].map((n) => n + 1);

  const fetchDevices = async () => {
    const result = await getDevicesAsync();
    setDevices(result);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setCreateForm({
      ...createForm,
      [name]: name === "type" ? Number(value) : value,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createDeviceAsync(createForm);

    setShowCreateModal(false);
    setCreateForm({
      name: "",
      type: 1,
      serialNumber: "",
      brand: "",
    });

    await fetchDevices();
  };

  const handleEdit = (device: Device) => {
    setUpdateForm({
      id: device.id,
      name: device.name,
      type: Number(device.type),
      serialNumber: device.serialNumber,
      brand: device.brand,
    });

    console.log(device);

    setShowUpdateModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this device?",
    );
    if (!confirmed) return;

    await deleteDeviceAsync({ id });
    await fetchDevices();
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUpdateForm({
      ...updateForm,
      [name]: name === "type" || name === "id" ? Number(value) : value,
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateDeviceAsync(updateForm);

    setShowUpdateModal(false);
    setUpdateForm({
      id: 0,
      name: "",
      type: 1,
      serialNumber: "",
      brand: "",
    });

    await fetchDevices();
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < npage) setCurrentPage(currentPage + 1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Equipment Management</h1>

        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          Create Device
        </button>
      </div>

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

      {showUpdateModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Update Device</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUpdateModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <input type="hidden" name="id" value={updateForm.id} />

                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={updateForm.name}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      name="type"
                      className="form-select"
                      value={updateForm.type}
                      onChange={handleUpdateChange}
                    >
                      <option value={1}>CNC</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Serial Number</label>
                    <input
                      name="serialNumber"
                      className="form-control"
                      value={updateForm.serialNumber}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      name="brand"
                      className="form-control"
                      value={updateForm.brand}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Create Device</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={createForm.name}
                      onChange={handleCreateChange}
                      placeholder="CNC 001"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      name="type"
                      className="form-select"
                      value={createForm.type}
                      onChange={handleCreateChange}
                    >
                      <option value={1}>CNC</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Serial Number</label>
                    <input
                      name="serialNumber"
                      className="form-control"
                      value={createForm.serialNumber}
                      onChange={handleCreateChange}
                      placeholder="ABC00111"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      name="brand"
                      className="form-control"
                      value={createForm.brand}
                      onChange={handleCreateChange}
                      placeholder="Makino"
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-success">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentPage;
