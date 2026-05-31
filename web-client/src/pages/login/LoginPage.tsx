import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/auth/LoginService";
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
        const res = await loginApi(req);

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
    <section className="vh-100">
      <div className="container-fluid h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          {/* Left - Image */}
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="/images/EMS-Eco-System-1.png"
              className="img-fluid"
              alt="EMS Logo"
            />
          </div>

          {/* Right - Form */}
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={formik.handleSubmit}>
              <h2 className="mb-4 fw-bold text-primary">
                Welcome to TAKAHATA Monitor System
              </h2>

              {/* Email */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
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
              <div className="form-outline mb-3">
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

              {/* Remember + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">Remember me</label>
                </div>
                <a href="#" className="text-decoration-none">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formik.isValid}
                className="btn btn-primary btn-lg w-100"
              >
                Login
              </button>

              {/* Register */}
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <a href="#" className="text-danger">
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-primary text-white d-flex justify-content-between p-3">
        <span>© 2026. All rights reserved.</span>
        <div>
          <i className="me-3">FB</i>
          <i className="me-3">TW</i>
          <i className="me-3">GG</i>
          <i>IN</i>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
