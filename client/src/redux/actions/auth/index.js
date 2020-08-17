import { createActionType } from "../../../utils";

export const REGISTER = createActionType("REGISTER", "Auth"); 
export const LOGIN = createActionType("LOGIN", "Auth");

export const register = (payload) => ({
  type: REGISTER.START,
  meta: { payload },
});

export const login = (payload) => ({
  type: LOGIN.START,
  meta: {payload} 
});