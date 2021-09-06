import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { LogBox, Platform, UIManager } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import CFR from "./CFR";
import { decode, encode } from "base-64";
import { persistor, store } from "./src/redux/store";
import { changeBarColors } from "react-native-immersive-bars";

// These next three blocks are for snoowrap shenannigans
declare var global: any;

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreLogs(["Setting a timer", "Require cycle"]);

// For android layout animations
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      changeBarColors(true, "#50000000", "transparent");
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CFR />
      </PersistGate>
    </Provider>
  );
};

export default App;
