import { RootState } from '../store';

export const selectDealerData = (state: RootState) => state.dealerData.dealerData;
export const selectWebsiteConfig = (state: RootState) => state.websiteConfig.websiteConfig;
export const selectDealershipManifest = (state: RootState) => state.dealershipManifest.manifest;
export const selectPageData = (state: RootState) => state.pageData.pageData;
export const selectComponentData = (state: RootState) => state.componentData.componentData;
