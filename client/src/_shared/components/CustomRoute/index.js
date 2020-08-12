import React from "react";
import { Redirect, Route } from "react-router-dom";

const CustomRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (true) {
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
