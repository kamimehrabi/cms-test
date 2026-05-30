"use client";
import { useEffect } from "react";

/**
 * Inject a single widget script string into <head> as a `type="module"`
 * tag, removing it on unmount. Kept as-is for callers that load one
 * script at a time (e.g. `cars/page.tsx`, `car-finder/page.tsx`,
 * `layout.tsx`).
 */
export const useScriptInject = (widget: string) => {
  if (!widget) return;
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.async = false;
    script.defer = true;
    script.setAttribute("data-inject-after", "interactive");
    script.textContent = widget;
    document.head.appendChild(script);

    // تابع cleanup: هنگام unmount یا تغییر decompressed
    return () => {
      document.head.removeChild(script);
    };
  }, [widget]);
};

/**
 * Single entry in a registry-driven script list. The `id` is purely for
 * debugging (added as `data-script-id` on the injected `<script>`) and
 * for keeping the dependency-array signature stable across renders.
 */
export interface InjectableScript {
  /** Stable identifier from the widget registry (e.g. `"slider"`). */
  id: string;
  /** Decompressed script source to inject. */
  code: string;
}

/**
 * Inject every script in `scripts` into `<head>` in array order, removing
 * them all on unmount. Use this when the list comes from a registry so
 * React runs a single effect regardless of length — calling
 * `useScriptInject` inside a `for`/`map` would violate the Rules of Hooks.
 */
export const useScriptInjectAll = (scripts: ReadonlyArray<InjectableScript>) => {
  // Use a content-aware signature so the effect only re-runs when the
  // *meaningful* parts of the list change. Hashing on `id` + code length
  // keeps this cheap even for large compiled bundles.
  const signature = scripts
    .map((s) => `${s.id}:${s.code?.length ?? 0}`)
    .join("|");

  useEffect(() => {
    if (!scripts.length) return;

    const injected: HTMLScriptElement[] = [];
    for (const { id, code } of scripts) {
      if (!code) continue;
      const el = document.createElement("script");
      el.type = "module";
      el.async = false;
      el.defer = true;
      el.dataset.scriptId = id;
      el.setAttribute("data-inject-after", "interactive");
      el.textContent = code;
      document.head.appendChild(el);
      injected.push(el);
    }

    return () => {
      for (const el of injected) {
        if (el.parentNode === document.head) {
          document.head.removeChild(el);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
};
