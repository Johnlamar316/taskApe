import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import ui from "./ui";
import { reducer as formReducer } from "redux-form";

const appReducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer,
  });

export default appReducers;
