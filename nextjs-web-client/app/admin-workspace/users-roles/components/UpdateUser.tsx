"use client";

import { Modal, Form, Input, Select, Button } from "antd";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Account } from "@/app/types/user/User";

type Props = {
  open: boolean;
  user: Account | null;
  onClose: () => void;
  onUpdate: (user: Account) => void | Promise<void>;
};

const validationSchema = Yup.object({
  username: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),

  fullName: Yup.string().trim().required("Vui lòng nhập họ và tên"),

  role: Yup.string()
    .oneOf(["Admin", "Manager", "User"])
    .required("Vui lòng chọn vai trò"),

  isActive: Yup.boolean().required(),
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
    <Formik
      initialValues={user}
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
          <form onSubmit={handleSubmit}>
            <Form layout="vertical">
              <Form.Item
                label="Tên đăng nhập"
                validateStatus={
                  touched.userName && errors.userName ? "error" : ""
                }
                help={touched.userName && errors.userName}
              >
                <Input
                  name="username"
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
                label="Vai trò"
                validateStatus={touched.role && errors.role ? "error" : ""}
                help={touched.role && errors.role}
              >
                <Select
                  value={values.role}
                  onChange={(value) => setFieldValue("role", value)}
                  options={[
                    { label: "Admin", value: "Admin" },
                    { label: "Manager", value: "Manager" },
                    { label: "User", value: "User" },
                  ]}
                />
              </Form.Item>

              <div className="flex justify-end gap-2">
                <Button
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
          </form>
        </Modal>
      )}
    </Formik>
  );
}
