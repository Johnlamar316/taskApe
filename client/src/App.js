import React, { Fragment, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Spin } from "antd";
// import Route from "./_shared/components/CustomRoute";

//styling
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.min.css";
import "antd/dist/antd.css";
import "./App.css";
import "./Auth/index.scss";

//components
const loginAuth = lazy(() => import("./Auth/Login"));
const RegisterAuth = lazy(() => import("./Auth/Register"));
const ResetPasswordAuth = lazy(() =>
  import("./Auth/ResetPassword/ResetPasswordForm.js")
);
const UpdatePasswordAuth = lazy(() =>
  import("./Auth/ResetPassword/UpdatePasswordForm.js")
);

const loading = () => (
  <div className="example">
    <Spin tip="loading..." />
  </div>
);

const App = () => {
  // toast.info("Still under construction");
  return (
    <Fragment>
      <Suspense fallback={loading}>
        <Switch>
          <Route exact path="/" name="login" component={loginAuth} />
          <Route
            exact
            path="/register"
            name="register"
            component={RegisterAuth}
          />
          <Route
            exact
            path="/resetPassword"
            name="reset password"
            component={ResetPasswordAuth}
          />
          <Route
            exact
            path="/reset/:token"
            name="reset password"
            component={UpdatePasswordAuth}
          />
        </Switch>
      </Suspense>
    </Fragment>
  );
};

export default App;
