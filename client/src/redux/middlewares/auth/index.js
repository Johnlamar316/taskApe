import { navigateTo, apiRequest, REGISTER, POST } from "../../actions/index";

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

export default [register];
