import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DealershipManifest } from "@/types/dealershipManifest";

const initialState = {
    manifest: null as DealershipManifest | null,
};

const dealershipManifestSlice = createSlice({
    name: "dealershipManifest",
    initialState,
    reducers: {
        setDealershipManifest: (state, action: PayloadAction<DealershipManifest | null>) => {
            state.manifest = action.payload;
        },
    },
});

export const { setDealershipManifest } = dealershipManifestSlice.actions;
export default dealershipManifestSlice.reducer;
