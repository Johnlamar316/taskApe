import { applyMiddleware, createStore, compose } from "redux";
import { createLogger } from "redux-logger";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import throttle from "lodash.throttle";
import customMiddleWares from "./middlewares";
import appReducers from "./reducers";

export const history = createBrowserHistory();

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP_STATE") {
    state = undefined;
  }
  return appReducers(history)(state, action);
};

// add and apply the middleWares
const middleWares = [ ...customMiddleWares, routerMiddleware(history)];

//include redux logger if not in production
if (process.env.NODE_ENV !== "production") {
  middleWares.push(createLogger());
}

let parseMiddleware = applyMiddleware(...middleWares);

//include redux dev tools if not in production
if (
  process.env.NODE_ENV !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  parseMiddleware = compose(
    parseMiddleware,
    window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

//persist data to LS
const persistedState = loadState();

// create the store
const store = createStore(rootReducer, persistedState, parseMiddleware);

//subscribe to store
// store.subscribe is called any time an action is dispatched(state changes)
store.subscribe(
  throttle(() => {
    console.log("state updated")
    saveState({ auth: store.getState().auth });
  }, 1000)
);
console.log("STORE::::::", store);

// exporting the store.
export default store; 

//loadState and SaveState function
function loadState() {
  try {
    const serializedState = localStorage.getItem("taskApe");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

function saveState(state) {
  try {
    localStorage.setItem("taskApe", JSON.stringify(state));
  } catch (e) {
    return undefined;
  }
}
