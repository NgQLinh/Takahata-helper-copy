"use client";

import { Modal, Form, Input, Select, Button } from "antd";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Account } from "@/app/types/account/Account";

type Props = {
  open: boolean;
  user: Account | null;
  onClose: () => void;
  onUpdate: (user: Account) => void | Promise<void>;
};

const validationSchema = Yup.object({
  userName: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),

  fullName: Yup.string().trim().required("Vui lòng nhập họ và tên"),

  password: Yup.string().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]).{8,}$/,
    {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      excludeEmptyString: true,
    },
  ),

  role: Yup.string()
    .oneOf(["ADMIN", "MANAGER", "USER"])
    .required("Vui lòng chọn vai trò"),
});

export default function UpdateUser({ open, user, onClose, onUpdate }: Props) {
  if (!user) return null;

  const handleSubmit = async (
    values: Account,
    helpers: FormikHelpers<Account>,
  ) => {
    try {
      await onUpdate(values);
      onClose();
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik<Account>
      initialValues={{
        ...user,
        password: user.password ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm,
      }) => (
        <Modal
          title="Cập nhật người dùng"
          open={open}
          onCancel={() => {
            resetForm();
            onClose();
          }}
          footer={null}
          destroyOnHidden
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tên đăng nhập"
              validateStatus={
                touched.userName && errors.userName ? "error" : ""
              }
              help={touched.userName && errors.userName}
            >
              <Input
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              validateStatus={
                touched.fullName && errors.fullName ? "error" : ""
              }
              help={touched.fullName && errors.fullName}
            >
              <Input
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              validateStatus={
                touched.password && errors.password ? "error" : ""
              }
              help={touched.password && errors.password}
            >
              <Input.Password
                name="password"
                placeholder="Nhập mật khẩu"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              validateStatus={touched.role && errors.role ? "error" : ""}
              help={touched.role && errors.role}
            >
              <Select
                value={values.role}
                onChange={(value) => setFieldValue("role", value)}
                onBlur={() => setFieldValue("role", values.role)}
                options={[
                  { label: "ADMIN", value: "ADMIN" },
                  { label: "MANAGER", value: "MANAGER" },
                  { label: "USER", value: "USER" },
                ]}
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button
                htmlType="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Hủy
              </Button>

              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Cập nhật
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
}
