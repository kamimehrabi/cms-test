// Note: Next.js optimizePackageImports in next.config.ts will automatically
// tree-shake unused exports from react-icons and swiper
import * as ReactIconsFa6 from 'react-icons/fa6';
import * as SwiperModules from 'swiper/modules';
import * as SwiperReact from 'swiper/react';

// Import Swiper CSS (side effect) - these are small CSS files
import 'swiper/css';
import 'swiper/css/pagination';

// Export as const for tree-shaking and clarity
const SwiperCSS = 'swiper/css' as const;
const SwiperCSSPagination = 'swiper/css/pagination' as const;

export const Libs = {
    ...ReactIconsFa6,
    ...SwiperModules,
    ...SwiperReact,
    SwiperCSS,
    SwiperCSSPagination,
};