import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    componentData: {} as Record<string, any>,
};

const componentDataSlice = createSlice({
    name: "componentData",
    initialState,
    reducers: {
        setComponentData: (state, action: PayloadAction<{ placementId: string, data: any }>) => {
            state.componentData[action.payload.placementId] = action.payload.data;
        },
    },
});

export const { setComponentData } = componentDataSlice.actions;
export default componentDataSlice.reducer;