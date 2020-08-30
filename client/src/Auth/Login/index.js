import React from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { login } from "../../redux/actions/index";

const Main = (props) => {
  const {login} = props;
  const onSubmit = (data) => {  
    console.log("ACTION_DATAA::::", data)
    login(data);
  };
  return (
    <div>
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(Main); 
