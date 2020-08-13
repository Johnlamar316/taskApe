import React from "react";
import RegisterForm from "./RegisterForm";
import { connect, useDispatch } from "react-redux";
import {register} from "../../redux/actions/index";

const Main = ({register}) => {
  const handleRegisterSubmit = (data) => {
    register(data);
  };


  return (
    <div>
      <RegisterForm onSubmit={handleRegisterSubmit} /> 
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  register,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
