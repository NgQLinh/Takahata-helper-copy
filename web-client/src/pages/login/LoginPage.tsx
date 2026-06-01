import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginAsync } from "../../services";
import { LoginReq } from "../../types";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "annh001@gmail.com",
      password: "123@123Aa",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
      password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        var req: LoginReq = {
          email: values.email,
          password: values.password,
        };
        const res = await loginAsync(req);

        console.log("Login success:", res);

        // 👉 Lưu token (tuỳ bạn chọn nơi lưu)
        localStorage.setItem("access_token", res.accessToken);
        localStorage.setItem("refresh_token", res.refreshToken);

        // 👉 redirect sau login
        navigate("/");
      } catch (error: any) {
        console.error("Login error:", error);

        // 👉 xử lý lỗi từ Keycloak
        if (error.response?.data) {
          const err = error.response.data;

          if (err.error === "invalid_grant") {
            setErrors({
              password: "Sai tài khoản hoặc mật khẩu",
            });
          } else {
            setErrors({
              password: err.error_description || "Đăng nhập thất bại",
            });
          }
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg border-0" style={{ width: "450px" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">TAKAHATA Monitor System</h2>

            <p className="text-muted">Sign in to continue</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>

              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />

              {formik.touched.email && formik.errors.email && (
                <div className="text-danger small mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />

              {formik.touched.password && formik.errors.password && (
                <div className="text-danger small mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">Remember me</label>
              </div>

              <a href="#" className="text-decoration-none">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="btn btn-primary btn-lg w-100"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
