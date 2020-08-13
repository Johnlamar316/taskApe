import React from "react";
import { Field, reduxForm, getFormValues } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button, Checkbox } from "antd";


import InputField from "../../_shared/components/ReduxFormField/TexInput/TextInput";
import taskApelogo from "../../_shared/svg/TaskApe.svg";


const LoginForm = props => {
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
        case "password": {
          if (!formValue) {
            return Promise.reject("Please enter your password");
          }
          if (formValue.length < 6) {
            return Promise.reject("Password should be 6+ characters");
          }
          return Promise.resolve();
        }
        default:
          return Promise.resolve();
      }
    },
  });

  return (
    <Row justify={'center'} align={'middle'} className="auth-layout">
      <Col className="border p-5 shadow auth-width bg-white">
        <div className="text-center mb-4">
          <img src={taskApelogo} alt="Logo" />
          <h5 className="mt-2 mb-3">Your Every day’s to-do App</h5>
          <h6 className="text-secondary">Sign in to your account</h6>
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
          <Form.Item name={"password"} rules={[validate("password")]}>
            <Field
              name="password"
              type="password"
              component={InputField}
              placeholder="enter password"
              disabled={false}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link to={"/resetPassword"} className="login-form-forgot" href="">
              Forgot password
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button mb-3"
            >
              Log in
            </Button>
            Or{" "}
            <Link to={"/register"} className="text-dark font-weight-bold" >
              register now!
            </Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

//redux validation//
// const validate = (values) => {
//   const errors = {};
//   if (!values.username) {
//     errors.username = "Please enter your username";
//   }
//   if (!values.password) {
//     errors.password = "Please enter your password";
//   } else if (values.password.length < 6) {
//     errors.password = "Password should be 6+ characters";
//   }
//   return errors;
// };

const connectedForm = reduxForm({
  // a unique name for the form
  form: "login",
  // validate,
})(LoginForm);

export default connect(
  (state) => ({
    fields: getFormValues("LoginForm")(state),
  }),
  {}
)(connectedForm);
