'use client';
import { useEffect } from 'react';

// Core - these are needed immediately
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

// Components - load synchronously as they're likely needed early
import Atom, { UIComponent } from '@/components/core/Atom';
import NextLink from '@/components/core/system/NextLink';
import NextImage from '@/components/core/system/NextImage';
// Utils
import { Utils } from '@/lib/global/windowExpose/utils';
// Libs - loaded synchronously but Next.js will tree-shake unused exports
import { Libs } from '@/lib/global/windowExpose/libs';
import * as tailwindMerge from 'tailwind-merge';
// Widget-safe navigation: bridged replacement for `next/navigation`.
// `next/navigation` itself is NOT exposed because its hooks require the
// Next.js App Router context, which doesn't exist inside widget roots.
import { Navigation } from '@/utils/widgetNavigation';
import { useExternalPathname } from '@/hooks/useExternalPathname';
import { useExternalSearchParams } from '@/hooks/useExternalSearchParams';

interface WidgetGlobals {
  core: {
    React: typeof React;
    ReactDOMClient: typeof ReactDOMClient;
  }
  libs: {
    Libs: typeof Libs;
    tailwindMerge: typeof tailwindMerge;
  }
  ui: {
    Atom: typeof Atom;
    NextLink: typeof NextLink;
    UIComponent: typeof UIComponent;
    NextImage: typeof NextImage;
  }
  navigation: {
    Navigation: typeof Navigation;
    useExternalPathname: typeof useExternalPathname;
    useExternalSearchParams: typeof useExternalSearchParams;
  }
  utils: {
    Utils: typeof Utils;
  }
}

// Single source of truth - expose to window after mount
const globals: WidgetGlobals = {
  core: {
    React,
    ReactDOMClient,
  },
  libs: {
    Libs,
    tailwindMerge,
  },
  ui: {
    Atom,
    NextLink,
    UIComponent,
    NextImage,
  },
  navigation: {
    Navigation,
    useExternalPathname,
    useExternalSearchParams,
  },
  utils: {
    Utils,
  },
};

export default function ExposeWidgetGlobals() {
  useEffect(() => {
    Object.values(globals).forEach(category => {
      Object.assign(window, category);
    });

  }, []);

  return null;
}
