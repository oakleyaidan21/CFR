import { persistStore, persistReducer } from "redux-persist";

import reducer from "./reducer";
import { createStore } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistingReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistingReducer);

const persistor = persistStore(store);

export { store, persistor };
