import * as dealerDataSelectors from './dealerDataSelectors';
import * as inventorySelectors from './inventorySelectors';

export * from './dealerDataSelectors';
export * from './inventorySelectors';

const allExports = { ...dealerDataSelectors, ...inventorySelectors };

// Only expose exports that start with `select` (i.e. real selectors).
// Factories like `makeSelectCarsByPriceRange` are excluded automatically.
export const selectorRegistry = Object.fromEntries(
    Object.entries(allExports).filter(([name]) => name.startsWith('select'))
) as {
    [K in keyof typeof allExports as K extends `select${string}` ? K : never]: typeof allExports[K];
};
