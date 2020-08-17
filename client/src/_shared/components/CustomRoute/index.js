import React from "react";
import { Redirect, Route } from "react-router-dom";
import authService from "../../../service/auth";

const CustomRoute = ({ component: Component,isPrivate, ...rest }) => {
  const isLoggedIn = authService.isLoggedIn();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isPrivate && !isLoggedIn) {
          return (
            <Redirect
              to={{ pathname: "/", state: { from: props.location.pathname } }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default CustomRoute;
