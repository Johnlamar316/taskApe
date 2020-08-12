import React from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";

const Main = (props) => {
  const onSubmit = (data) => {
      console.log("data just submitted");
  };
  return (
    <div>
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
