import React from "react";
import { isEmpty } from "lodash";
import { createAPIRequest } from "../../service/axios";
import { message } from "antd";
import { API_REQUEST, updateSessionToken } from "../actions/index";

//atd message
const atderror = (err) => {
  message.error(err);
};

const atdsuccess = (suc) => {
  message.success(suc);
};

const apiRequest = ({ dispatch }) => (next) => (action) => {
  if (action.type === API_REQUEST.START) {
    const {
      method,
      url,
      key, //the identify
      payload,
      onError,
      successMessage,
      params,
      nextRoute,
      onSuccess,
      errorMessage,
      noSuccessToast,
      noErrorToast,
    } = action.meta;

    const config = { method, url };

    if (payload && !isEmpty(payload)) {
      config.data = payload;
    }

    if (params && !isEmpty(params)) {
      config.params = params;
    }
    createAPIRequest(config)
      .then((response) => {
        console.log("RESPONSE:::::: ", response);
        const { data, _meta } = response;
        if (_meta && _meta.session) {
          dispatch(updateSessionToken(_meta.session));
        }
        if (onSuccess) {
          if (typeof onSuccess === "function") {
            const { message } = _meta;
            onSuccess(data);
            atdsuccess(message);
          } else {
            dispatch({ type: onSuccess, payload: data }); 
          }
        }
      })
      .catch((e) => {
        const err = e && e.data && e.data.message;
        console.log("ERR:::::: ", e);

        const showErrorMessage = (message) => {
          if (!noErrorToast && method.toLowerCase() !== "get" && message) {
            atderror(message);
          }
        };

        if (onError) {
          if (typeof onError === "function") {
            onError(err);
          } else {
            const message = err || (err && err.message);
            showErrorMessage(message);
          }
        } else {
          const error = (err && err.statusText) || err;
          const message = errorMessage || err || (err && err.message);
          showErrorMessage(message);
        }
      });
  }

  return next(action);
};

export default [apiRequest];
