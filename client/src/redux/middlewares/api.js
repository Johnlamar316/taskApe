import React from "react";
import { isEmpty } from "lodash";
import { createAPIRequest } from "../../service/axios";
import {
  API_REQUEST,
  startUILoading,
  stopUILoading,
  updateUIError,
  updateSessionToken,
  navigateTo,
} from "../actions/index";

function formatMessagesFromError(error) {
  return (
    <span>
      <i className="fa fa-times pl-1" /> {error || (error && error.message)}
    </span>
  );
}

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
    } = action.meta; // from the third func parameter
    const config = { method, url };

    if (payload && !isEmpty(payload)) {
      config.data = payload;
    }

    if (params && !isEmpty(params)) {
      config.params = params;
    }

    // dispatch(updateUIError(key, null));
    // dispatch(startUILoading(key));
    createAPIRequest(config)
      .then((response) => {
        console.log("RESPONSE:::::: ", response);
        const { data, _meta } = response;

        //   if (_meta && _meta.token) {
        //     dispatch(updateSessionToken(_meta.token));
        //   }

        if (onSuccess) {    
          if (typeof onSuccess === "function") {
            alert("success");
            console.log("typeOf:::>>>>>>>>>>", typeof onSuccess);
            onSuccess(data);
          } else {
            dispatch({ type: onSuccess, payload: data });
          }
        }

        // if (nextRoute) {
        //   dispatch(navigateTo(nextRoute));
        // }

        // dispatch(stopUILoading(key));
        //   const toastMessage = successMessage || (_meta && _meta.message);
        //   if (!noSuccessToast && toastMessage) {
        //     toast.dismiss();
        //     toast.info(toastMessage);
        //   }
      })
      .catch((e) => {
        const err = e && e.data && e.data.message;
        console.log("ERR:::::: ", e);

        const showErrorMessage = (message) => {
          if (!noErrorToast && method.toLowerCase() !== "get" && message) {
            // toast.error(message);
            alert("errorError>>>>", message);
          }
        };

        if (onError) {
          if (typeof onError === "function") {
            onError(err);
          } else {
            const message = formatMessagesFromError(err);
            dispatch(updateUIError(key, message));
            showErrorMessage(message);
          }
        } else {
          const error = (err && err.statusText) || err;
          const message = errorMessage || formatMessagesFromError(error);
          dispatch(updateUIError(key, message));
          showErrorMessage(message);
        }
        dispatch(stopUILoading(key));
      });
  }

  return next(action);
};

export default [apiRequest];
