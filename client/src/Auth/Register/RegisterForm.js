import React from "react";
import { Field, reduxForm, getFormValues } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Checkbox } from "antd";

import InputField from "../../_shared/components/ReduxFormField/TexInput/TextInput";
import taskApelogo from "../../_shared/svg/TaskApe.svg";

// import App from "../../App";

const RegisterForm = (props) => {
  const { onSubmit } = props;

  const validate = (fieldName) => (formInstance) => ({
    validator(rule, value) {
      const formValue = formInstance.getFieldValue(fieldName);
      switch (fieldName) {
        case "username": {
          if (!formValue) {
            return Promise.reject("Please enter your username");
          }
          if (formValue.length < 3) {
            return Promise.reject("Username should be 3+ characters");
          }
          return Promise.resolve();
        }
        case "email": {
          if (!formValue) {
            return Promise.reject("Please enter your email");
          }
          if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
              formInstance.getFieldValue("email")
            )
          ) {
            return Promise.reject("Invalid email address");
          }
        }
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
          <h5 className="mt-2 mb-3">Your Every day’s to-do App</h5>
          <h6 className="text-secondary">Sign up to your account</h6>
        </div>

        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={onSubmit}
          onFinishFailed={false}
        >
          <Form.Item name={"username"} rules={[validate("username")]}>
            <Field
              name="username"
              type="text"
              component={InputField}
              placeholder="enter username"
              disabled={false}
            />
          </Form.Item>
          <Form.Item name={"email"} rules={[validate("email")]}>
            <Field
              name="email"
              type="email"
              component={InputField}
              placeholder="name@example.com"
              disabled={false}
            />
          </Form.Item>
          <Form.Item name={"password"} rules={[validate("password")]}>
            <Field
              name="password"
              type="password"
              component={InputField}
              placeholder="enter password"
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

          <Form.Item>
            <Link to={"/"} className="login-form-forgot">
              Already have an account?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button mb-3"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

const connectedForm = reduxForm({
  // a unique name for the form
  form: "Register",
})(RegisterForm);

export default connect(
  (state) => ({
    fields: getFormValues("RegisterForm")(state),
  }),
  {}
)(connectedForm);
