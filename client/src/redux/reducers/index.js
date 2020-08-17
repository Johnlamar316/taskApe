import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import auth from "./auth";
import { reducer as formReducer } from "redux-form";

const appReducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer,
    auth,
  });

export default appReducers;
