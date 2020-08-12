import { createActionType } from "../../../utils";

export const REGISTER = createActionType("REGISTER", "Auth");

export const register = (payload) => ({
  type: REGISTER.START,
  meta: { payload },
});
