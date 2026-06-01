import { useState } from "react";

function SystemControlPage() {
  const [productCode, setProductCode] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!productCode.trim()) {
      alert("Vui lòng nhập mã hàng");
      return;
    }

    if (!estimatedTime) {
      alert("Vui lòng nhập thời gian dự kiến");
      return;
    }

    const payload = {
      productCode,
      estimatedTime: Number(estimatedTime),
      quantity: Number(quantity || 0),
      note,
      isCompleted,
      submittedAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      console.log("Gửi dữ liệu về máy chủ:", payload);

      // TODO: gọi API gửi về máy chủ ở đây
      // await createProductionLogAsync(payload);

      alert("Gửi dữ liệu thành công");

      setProductCode("");
      setEstimatedTime("");
      setQuantity("");
      setNote("");
      setIsCompleted(false);
    } catch (error) {
      console.error(error);
      alert("Gửi dữ liệu thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Giám sát sản xuất</h4>
        </div>

        <div className="card-body">
          <div className="alert alert-info">
            Công nhân nhập thông tin sản xuất tại máy gia công và gửi dữ liệu về
            máy chủ.
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Mã hàng <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Ví dụ: SP-001"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Thời gian dự kiến, phút <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="Ví dụ: 120"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Số lượng</label>
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="Ví dụ: 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Trạng thái</label>
              <div className="form-check form-switch mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isCompleted"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isCompleted">
                  Hàng đã làm xong
                </label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Ghi chú</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Nhập ghi chú nếu có..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <hr />

          <div className="bg-light rounded p-3 mb-3">
            <h6 className="fw-bold mb-3">Thông tin sẽ gửi</h6>

            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Mã hàng:</strong> {productCode || "---"}
                </p>
                <p className="mb-1">
                  <strong>Thời gian dự kiến:</strong>{" "}
                  {estimatedTime ? `${estimatedTime} phút` : "---"}
                </p>
              </div>

              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Số lượng:</strong> {quantity || "---"}
                </p>
                <p className="mb-1">
                  <strong>Trạng thái:</strong>{" "}
                  {isCompleted ? (
                    <span className="badge bg-success">Đã hoàn thành</span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Đang sản xuất
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-secondary btn-lg"
              type="button"
              onClick={() => {
                setProductCode("");
                setEstimatedTime("");
                setQuantity("");
                setNote("");
                setIsCompleted(false);
              }}
            >
              Xóa dữ liệu
            </button>

            <button
              className="btn btn-primary btn-lg"
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi về máy chủ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemControlPage;
