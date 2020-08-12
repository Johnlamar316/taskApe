import React from "react";
import { Field, reduxForm, getFormValues } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Checkbox } from "antd";

import InputField from "../../_shared/components/ReduxFormField/TexInput/TextInput";
import taskApelogo from "../../_shared/svg/TaskApe.svg";

const ResetPasswordForm = () => {
  const validate = (fieldName) => (formInstance) => ({
    validator(rule, value) {
      const formValue = formInstance.getFieldValue(fieldName);
      console.log(formValue);
      switch (fieldName) {
        case "password": {
          if (!formValue) {
            return Promise.reject("Please enter your password");
          }
          if (formValue.length < 6) {
            return Promise.reject("Password should be 6+ characters");
          }
          return Promise.resolve();
        }
        case "password2": {
          if (!formValue) {
            return Promise.reject("Please comfirm your password");
          }
          if (formValue.length < 6) {
            return Promise.reject("Password should be 6+ characters");
          }
          if (formValue !== formInstance.getFieldValue("password")) {
            return Promise.reject("passwords do not match");
          }
        }
        default:
          return Promise.resolve();
      }
    },
  });
  return (
    <Row className="d-flex justify-content-center align-items-center auth-layout">
      <Col className="border p-5 shadow auth-width bg-white">
        <div className="text-center mb-4">
          <img src={taskApelogo} alt="Logo" />
          <h5 className="mt-2 mb-3">Reset Password</h5>
        </div>
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={(value) => console.log(value)}
          onFinishFailed={false}
        >
          <Form.Item name={"username"} rules={[validate("username")]}>
            <Form.Item name={"password"} rules={[validate("password")]}>
              <Field
                name="password"
                type="password"
                component={InputField}
                placeholder="choose a new password"
                disabled={false}
              />
            </Form.Item>

            <Form.Item name={"password2"} rules={[validate("password2")]}>
              <Field
                name="password2"
                type="password"
                component={InputField}
                placeholder="confirm password"
                disabled={false}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button mb-3"
            >
              Log in
            </Button>
            Want to login?{" "}
            <Link to={"/"} className="text-dark font-weight-bold">
              Login here!
            </Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

const connectedForm = reduxForm({
  // a unique name for the form
  form: "resetPassword",
  // validate,
})(ResetPasswordForm);

export default connect(
  (state) => ({
    fields: getFormValues("ResetPasswordForm")(state),
  }),
  {}
)(connectedForm);
