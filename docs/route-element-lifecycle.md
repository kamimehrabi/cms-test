# Route Element Lifecycle — Manual Mount / Unmount System

Each page in this app renders its UI inside a **custom element** appended directly to `document.body` (e.g. `<inventory-main-component>`, `<home-container>`). These elements are owned by independent widget bundles that manage their own React roots. Because they live outside the Next.js React tree, Next.js cannot unmount them automatically on navigation — this system does it manually.

---

## Architecture

Four pieces work together:

| File | Role |
|---|---|
| `components/core/base/CustomElement.tsx` | Mounts a custom element into `document.body` once; reuses the existing node if one is already there |
| `app/route-element-registry.ts` | Module-level `Map<route, tag>` written by page components on mount with their **actual runtime tag** |
| `app/routes-map.ts` | Static fallback tables: `routeMap` (exact paths) and `routePrefixMap` (prefix patterns for dynamic segments) |
| `app/RouteWatcher.tsx` | Watches `pathname`; resolves the previous route's tag and removes that element on every navigation |

---

## Mount flow

When a page component renders:

1. The server component fetches the bundle and passes `containerTag` (from `registry.container.customElementTag`) to the client component.
2. The client component calls `registerRouteElement(route, tag)` in a `useEffect` — writing the actual runtime tag into the module-level registry.
3. It renders `<CustomElement element={tag} />`.
4. `CustomElement.useLayoutEffect` runs synchronously after React commits:
   - If an element with that tag already exists in the DOM → **reuse it** (set `elRef.current`, observe it).
   - Otherwise → `document.createElement(tag)`, insert before `<footer-container>` if present, else append to body.

The `useLayoutEffect` is intentional: it runs after the host React tree commits but before paint, avoiding a race with any React root that the widget's `connectedCallback` might create.

---

## Unmount flow

`RouteWatcher` runs inside the root layout and is always mounted. On every `pathname` change:

```
resolveTag(path):
  1. getRegisteredTag(path)        ← dynamic registry (actual runtime tag)
  2. routeMap[path]                ← static exact-path fallback
  3. routePrefixMap prefix match   ← dynamic segment fallback (e.g. /cars/:slug)
```

If `prevTag` is found **and** it differs from `currentTag` (the incoming route's tag), the previous element is removed inside a `requestAnimationFrame`.

`CustomElement`'s cleanup intentionally does **not** remove the DOM node — the widget inside owns its own React root and React 19 would throw if that root were unmounted synchronously during the host's commit phase.

---

## Edge cases

### 1. First page load — no previous route

`prevPathRef.current` starts as `null`. The `if (prev && ...)` guard skips all removal logic on the initial render. Nothing is removed; the first element mounts normally.

---

### 2. Static route → static route (`/` → `/cars`)

Both paths are in `routeMap`. `prevTag = "home-container"` (or whatever the registry recorded), `currentTag = "cars-container"` (or manifest tag). They differ → `home-container` is removed, `cars-container` mounts.

---

### 3. Static route → dynamic route (`/cars` → `/cars/slug`)

- `prevTag`: resolved via `getRegisteredTag("/cars")` — the actual tag that `CarsComponent` registered on mount (may differ from the static `webComponentTag` if the manifest overrides it).
- `currentTag`: resolved via `routePrefixMap` → `"inventory-detail-component"`.
- They differ → previous cars element is removed; detail element mounts.

**Why the registry matters here:** `CarsComponent` renders `containerTag ?? webComponentTag`. If the manifest provides a tag that differs from the hardcoded `"cars-container"` export, `routeMap["/cars"]` would find the wrong tag and `querySelector` would return null — leaving the old element stuck. The registry always holds the actual tag that is in the DOM.

---

### 4. Dynamic route → dynamic route (slug → slug, e.g. Previous / Next car)

Both `/cars/slug-a` and `/cars/slug-b` resolve to `"inventory-detail-component"` via `routePrefixMap`.

`prevTag === currentTag` → **removal is skipped entirely.**

`CustomElement` sees the existing `<inventory-detail-component>` node and reuses it (the `existing` branch in `useLayoutEffect`). The widget inside receives the new props / URL and updates itself without the element being torn down.

If removal were not skipped here, the sequence would be:
1. New page mounts → `CustomElement` reuses existing node.
2. `RouteWatcher` fires → schedules `el.remove()` via rAF.
3. rAF fires → element is deleted, leaving only the footer.

---

### 5. Dynamic route → static route (`/cars/slug` → `/cars`)

- `prevTag`: resolved via `routePrefixMap` → `"inventory-detail-component"`.
- `currentTag`: resolved via `getRegisteredTag("/cars")` → the cars element tag.
- They differ → `inventory-detail-component` is removed; cars element mounts.

This direction is handled by the `routePrefixMap` entry `["/cars/", carsDetailTag]`, which was added precisely because the slug path is never an exact key in `routeMap`.

---

### 6. Direct navigation to a dynamic route (first visit, registry empty for static routes)

If the user lands directly on `/cars/slug` without ever visiting `/cars`, the `route-element-registry` has no entry for `/cars`. This is fine — there is no `cars-container` element in the DOM to remove. The guard `if (el)` inside the rAF callback is a no-op.

The detail element mounts normally.

---

### 7. `containerTag` vs `webComponentTag` mismatch

Page components export a static `webComponentTag` constant (e.g. `"cars-container"`) as a default. When loaded through the manifest, `bundle.registry.container.customElementTag` may return a different value (e.g. `"inventory-main-component"` from a legacy registry entry).

`routeMap` uses the static export, so it would resolve to the wrong tag. The `route-element-registry` solves this: `registerRouteElement` is called with `containerTag ?? webComponentTag`, so whatever tag ends up in the DOM is the one the registry holds.

**Rule:** `routeMap` is a last-resort fallback for routes whose page component has never been visited in the current session. It is correct for fresh loads but may be stale if the manifest diverges from the constant.

---

### 8. `requestAnimationFrame` timing — brief double-render

The removal runs in `requestAnimationFrame`, which fires just before the next paint. `CustomElement` mounts in `useLayoutEffect` (before paint). This means there is one frame where both the old and new element coexist in the DOM.

For most widgets this is invisible because they are absolutely positioned or occupy different scroll positions. If a visible flash occurs on a specific route, move the `el.remove()` call out of the rAF — but only after verifying the widget's `disconnectedCallback` is safe to call during React's commit phase.

---

### 9. Footer insertion order

`CustomElement` inserts new nodes **before** `<footer-container>` when that element exists. This ensures page elements always appear above the footer in DOM order. The footer itself is never a "page element" and is never touched by `RouteWatcher`.

---

## Adding a new route

### Static route (e.g. `/about`)

1. Create `components/AboutComponent.tsx`:
   ```tsx
   export const webComponentTag = "about-container";
   
   const AboutComponent = ({ scripts, container, containerTag }: ...) => {
     const tag = containerTag ?? webComponentTag;
     useEffect(() => { registerRouteElement("/about", tag); }, [tag]);
     useScriptInjectAll(scripts);
     useScriptInject(container);
     return <CustomElement element={tag} />;
   };
   ```

2. Register in `routes-map.ts`:
   ```ts
   import { webComponentTag as aboutTag } from "../components/AboutComponent";
   
   export const routeMap = {
     "/": homeTag,
     "/cars": carsTag,
     "/about": aboutTag,   // ← add
   };
   ```

### Dynamic route (e.g. `/blog/:slug`)

1. Create `components/BlogDetailComponent.tsx` with `webComponentTag = "blog-detail-container"`. No `registerRouteElement` call needed — prefix matching handles it.

2. Add a prefix entry in `routes-map.ts`:
   ```ts
   export const routePrefixMap: Array<[string, string]> = [
     ["/cars/", carsDetailTag],
     ["/blog/", blogDetailTag],   // ← add; longer prefixes first if nesting exists
   ];
   ```

3. Prefix entries are evaluated top-to-bottom; the first match wins. If you have a nested dynamic segment (e.g. `/blog/category/:slug` and `/blog/:slug`), put the more specific prefix first.

---

## Invariants to maintain

- **One page element per route family in the DOM at a time.** `CustomElement` enforces this via `getElementsByTagName` on mount, but `RouteWatcher` must remove the previous element before navigating away.
- **Never remove an element that the incoming route shares.** Always compare `prevTag !== currentTag` before removing.
- **The registry is written on mount, never on unmount.** The Map persists at module scope. The incoming `RouteWatcher` effect may fire after the previous page component has already unmounted, so cleanup callbacks must not delete registry entries.
- **`containerTag` is the source of truth for what is in the DOM.** The static `webComponentTag` export is only a fallback for tests, storybook, and the static `routeMap` table.
