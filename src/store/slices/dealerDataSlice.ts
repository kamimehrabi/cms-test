import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    dealerData: {} as any,
};

const dealerDataSlice = createSlice({
    name: "dealerData",
    initialState,
    reducers: {
        setDealerData: (state, action: PayloadAction<any>) => {
            state.dealerData = action.payload;
        },
    },
});

export const { setDealerData } = dealerDataSlice.actions;
export default dealerDataSlice.reducer;

