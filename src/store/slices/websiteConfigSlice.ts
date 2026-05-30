import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    websiteConfig: {} as any,
};

const websiteConfigSlice = createSlice({
    name: "websiteConfig",
    initialState,
    reducers: {
        setWebsiteConfig: (state, action: PayloadAction<any>) => {
            state.websiteConfig = action.payload;
        },
    },
});

export const { setWebsiteConfig } = websiteConfigSlice.actions;
export default websiteConfigSlice.reducer;