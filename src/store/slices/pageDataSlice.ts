import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    pageData: {} as Record<string, any>,
};

const pageDataSlice = createSlice({
    name: "pageData",
    initialState,
    reducers: {
        setPageData: (state, action: PayloadAction<{ pageId: string, data: any }>) => {
            state.pageData[action.payload.pageId] = action.payload.data;
        },
    },
});

export const { setPageData } = pageDataSlice.actions;
export default pageDataSlice.reducer;