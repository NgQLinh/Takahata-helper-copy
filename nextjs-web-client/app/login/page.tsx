"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { loginAsync } from "../services/auth/LoginService";
import { LoginRequest } from "../types";

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      userName: "admin",
      password: "123@123Aa",
    },

    validationSchema: Yup.object({
      userName: Yup.string().required("Bắt buộc"),
      password: Yup.string().min(8, "Tối thiểu 8 ký tự").required("Bắt buộc"),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const req: LoginRequest = {
          userName: values.userName,
          password: values.password,
        };

        const res = await loginAsync(req);

        console.log(res.roles);

        localStorage.setItem("access_token", res.accessToken);
        localStorage.setItem("refresh_token", res.refreshToken);

        if (!res.roles) return;

        if (res.roles.includes("ADMIN"))
          router.push("/workspace/admin/dashboard");
        else if (res.roles.includes("USER"))
          router.push("/workspace/user/worker");
      } catch (error: unknown) {
        console.error("Login error:", error);

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as {
            response?: {
              data?: {
                error?: string;
                error_description?: string;
              };
            };
          };

          const err = axiosError.response?.data;

          if (err?.error === "invalid_grant") {
            setErrors({
              password: "Sai tài khoản hoặc mật khẩu",
            });
          } else {
            setErrors({
              password: err?.error_description || "Đăng nhập thất bại",
            });
          }
        } else {
          setErrors({
            password: "Không thể kết nối server",
          });
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
            <div className="mb-3">
              <label className="form-label">Username</label>

              <input
                type="text"
                name="userName"
                className="form-control form-control-lg"
                placeholder="Enter username"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.userName && formik.errors.userName && (
                <div className="text-danger small mt-1">
                  {formik.errors.userName}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.password && formik.errors.password && (
                <div className="text-danger small mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="btn btn-primary btn-lg w-100"
            >
              {formik.isSubmitting ? "Đang đăng nhập..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
