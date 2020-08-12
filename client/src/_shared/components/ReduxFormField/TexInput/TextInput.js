import React, { Fragment } from "react";
import { Input, Form } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

export default ({
  className,
  input,
  disabled,
  length,
  value,
  onChange,
  meta: { touched, error },  // if there was a redux validation error
  ...rest
}) => {
  // console.log("redux form props>>>>>>>>>>>>", props);
  return (
    <>
      {rest.type === "text" && (
        <Input prefix={<UserOutlined className="site-form-item-icon" />} {...input} {...rest} disabled={disabled} />
      )}
      {rest.type === "email" && (
        <Input type={'email'} prefix={<MailOutlined  className="site-form-item-icon" />} {...input} {...rest} disabled={disabled} /> 
      )}
       {rest.type === "password" && (
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} {...input} {...rest} disabled={disabled} /> 
      )}
    </>
  );
};
