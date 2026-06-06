"use client";

import { useEffect, useState } from "react";
import { CreateDeviceRequest, Device } from "@/app/types";
import {
  createDeviceAsync,
  deleteDeviceAsync,
  getDevicesAsync,
  updateDeviceAsync,
} from "@/app/services/device/DeviceService";

export default function MachinesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [createForm, setCreateForm] = useState<CreateDeviceRequest>({
    name: "",
    type: 1,
    serialNumber: "",
    brand: "",
    bitAddress: 0,
  });

  const [updateForm, setUpdateForm] = useState({
    id: 0,
    name: "",
    type: 1,
    serialNumber: "",
    brand: "",
    bitAddress: 0,
  });

  const recordsPerPage = 8;

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = devices.slice(firstIndex, lastIndex);

  const npage = Math.ceil(devices.length / recordsPerPage);
  const numbers = [...Array(npage).keys()].map((n) => n + 1);

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

  const fetchDevices = async () => {
    try {
      const result = await getDevicesAsync();
      setDevices(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const result = await getDevicesAsync();
        setDevices(result);
      } catch (error) {
        console.error(error);
      }
    };

    loadDevices();
  }, []);

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "type" || name === "bitAddress" ? Number(value) : value,
    }));
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUpdateForm((prev) => ({
      ...prev,
      [name]: name === "type" || name === "bitAddress" ? Number(value) : value,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createDeviceAsync(createForm);

    setShowCreateModal(false);

    setCreateForm({
      name: "",
      type: 1,
      serialNumber: "",
      brand: "",
      bitAddress: 0,
    });

    await fetchDevices();
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updateDeviceAsync(updateForm);

    setShowUpdateModal(false);

    await fetchDevices();
  };

  const handleEdit = (device: Device) => {
    setUpdateForm({
      id: device.id,
      name: device.name,
      type: Number(device.type),
      serialNumber: device.serialNumber,
      brand: device.brand,
      bitAddress: device.bitAddress,
    });

    setShowUpdateModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this device?")) return;

    await deleteDeviceAsync({ id });

    await fetchDevices();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Machines Page</h1>

        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          Create Device
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Serial Number</th>
            <th>Brand</th>
            <th>Bit Address</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((device) => (
            <tr key={device.id}>
              <td>{device.id}</td>
              <td>{device.name}</td>
              <td>{device.type}</td>
              <td>{device.serialNumber}</td>
              <td>{device.brand}</td>
              <td>{device.bitAddress}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(device)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(device.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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
                  <input
                    name="name"
                    className="form-control mb-3"
                    value={updateForm.name}
                    onChange={handleUpdateChange}
                    required
                  />

                  <select
                    name="type"
                    className="form-select mb-3"
                    value={updateForm.type}
                    onChange={handleUpdateChange}
                  >
                    <option value={1}>CNC</option>
                  </select>

                  <input
                    name="serialNumber"
                    className="form-control mb-3"
                    value={updateForm.serialNumber}
                    onChange={handleUpdateChange}
                    required
                  />

                  <input
                    name="brand"
                    className="form-control mb-3"
                    value={updateForm.brand}
                    onChange={handleUpdateChange}
                    required
                  />

                  <input
                    name="bitAddress"
                    type="number"
                    className="form-control mb-3"
                    value={updateForm.bitAddress}
                    onChange={handleUpdateChange}
                    required
                  />
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
                  <input
                    name="name"
                    className="form-control mb-3"
                    value={createForm.name}
                    onChange={handleCreateChange}
                    placeholder="CNC 001"
                    required
                  />

                  <select
                    name="type"
                    className="form-select mb-3"
                    value={createForm.type}
                    onChange={handleCreateChange}
                  >
                    <option value={1}>CNC</option>
                  </select>

                  <input
                    name="serialNumber"
                    className="form-control mb-3"
                    value={createForm.serialNumber}
                    onChange={handleCreateChange}
                    placeholder="ABC00111"
                    required
                  />

                  <input
                    name="brand"
                    className="form-control mb-3"
                    value={createForm.brand}
                    onChange={handleCreateChange}
                    placeholder="Makino"
                    required
                  />

                  <input
                    name="bitAddress"
                    type="number"
                    className="form-control mb-3"
                    value={createForm.bitAddress}
                    onChange={handleCreateChange}
                    required
                  />
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
