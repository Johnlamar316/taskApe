import {
  navigateTo,
  apiRequest,
  REGISTER,
  POST,
  LOGIN,
} from "../../actions/index";

const login = ({ dispatch }) => (next) => (action) => { 
  next(action);
  if (action.type === LOGIN.START) {
    dispatch(
      apiRequest({
        method: POST,
        url: "/users/login",
        key: "login",
        onSuccess: (data) => {
          console.log("MIDDLEWARE_DATA", data);
          dispatch({ type: LOGIN.SUCCESS, payload: data });
          dispatch(navigateTo("/dashboard"));
        },
        ...action.meta, 
      })
    );
  }
};

const register = ({ dispatch }) => (next) => (action) => {
  next(action);
  if (action.type === REGISTER.START) {
    dispatch(
      apiRequest({
        method: POST,
        url: "/users/register",
        key: "register",
        onSuccess: (data) => {
          dispatch({ type: REGISTER.SUCCESS, payload: data });
          dispatch(navigateTo("/"));
        },
        ...action.meta,
      })
    );
  }
};

export default [register, login];
