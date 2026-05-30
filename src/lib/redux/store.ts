import { configureStore } from "@reduxjs/toolkit";
import { carsReducer } from "./carsSlice";

export const makeStore = () =>
    configureStore({
        reducer: {
            cars: carsReducer,
        },
    });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

