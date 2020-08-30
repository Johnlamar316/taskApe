import { createActionString, createActionType } from "../../../utils";

export const REGISTER = createActionType("REGISTER", "Auth");
export const LOGIN = createActionType("LOGIN", "Auth");
export const UPDATE_SESSION_TOKEN = createActionString(
  "UPDATE_SESSION_TOKEN",
  "auth"
);

export const register = (payload) => ({
  type: REGISTER.START,
  meta: { payload },
});

export const login = (payload) => ({
  type: LOGIN.START,
  meta: { payload },
});

export const updateSessionToken = (token) => ({
  type: UPDATE_SESSION_TOKEN,
  payload: token,
});
