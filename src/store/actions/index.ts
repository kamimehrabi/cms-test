import * as inventoryActions from "../slices/inventorySlice";
import * as dealerDataActions from "../slices/dealerDataSlice";
import * as websiteConfigActions from "../slices/websiteConfigSlice";
import * as dealershipManifestActions from "../slices/dealershipManifestSlice";
import * as pageDataActions from "../slices/pageDataSlice";
import * as componentDataActions from "../slices/componentDataSlice";

const allActions = {
  ...inventoryActions,
  ...dealerDataActions,
  ...websiteConfigActions,
  ...dealershipManifestActions,
  ...pageDataActions,
  ...componentDataActions,
};

export const actionRegistry = Object.fromEntries(
  Object.entries(allActions).filter(
    ([name, value]) => typeof value === "function" && name !== "default"
  )
) as Record<string, (payload?: unknown) => { type: string; payload?: unknown }>;
