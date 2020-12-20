import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import CFR from "./CFR";
import { persistor, store } from "./redux/store";

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
