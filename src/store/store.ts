import { configureStore } from "@reduxjs/toolkit";
import dealerDataReducer from "./slices/dealerDataSlice";
import websiteConfigReducer from "./slices/websiteConfigSlice";
import dealershipManifestReducer from "./slices/dealershipManifestSlice";
import pageDataReducer from "./slices/pageDataSlice";
import componentDataReducer from "./slices/componentDataSlice";
import inventoryReducer from "./slices/inventorySlice";

export const store = configureStore({
  reducer: {
    dealerData: dealerDataReducer,
    websiteConfig: websiteConfigReducer,
    dealershipManifest: dealershipManifestReducer,
    pageData: pageDataReducer,
    componentData: componentDataReducer,
    inventory: inventoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ["persist/PERSIST"],
  //     },
  //   }),
  // devTools: process.env.NODE_ENV !== "production",
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
