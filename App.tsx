import React from "react";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import CFR from "./CFR";
import { decode, encode } from "base-64";
import { persistor, store } from "./redux/store";

declare var global: any;

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreLogs(["Setting a timer"]);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CFR />
      </PersistGate>
    </Provider>
  );
};

export default App;
