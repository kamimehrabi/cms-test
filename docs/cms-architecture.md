# CMS Architecture — Web Components, Dealerships, and the Registry Chain

> **Status:** working draft. Open questions live at the bottom of this doc.
> Update as decisions are made.

This document describes how the Shadow front-end consumes content from the
multi-tenant CMS. It explains where things live, how they reference each
other, and how a page is assembled at runtime.

---

## 1. Mental model in one paragraph

Web components are **global, immutable, versioned skeletons** with no hard-coded
styles or copy. Each dealership (tenant) is a **private folder of JSON
configuration** that points at those global components by `componentKey@version`
and supplies the per-instance content the components render. The CMS publishes
both layers. The Next.js app is just an orchestrator: it walks a registry
chain, fetches the listed component bundles + JSON configs, injects the
custom-element scripts into `<head>`, and lets the components render
themselves from the JSON they receive.

```
GLOBAL          immutable, shared by every tenant   ─┐
  components/                                        │   web component
    hillz.slider@v1.gz                               │   bundles (gz)
    hillz.slider@v2.gz                               │
    hillz.header@v3.gz                               │
    ...                                              ┘

PER-DEALERSHIP  /cms-dealerships/{id}/...           ─┐   site config,
  config/site-pages-registry.json                    │   layouts, copy,
  pages/<pageId>/registry.json                       │   inventory, etc.
  pages/<pageId>/<Component>/<placement>.json        │
  layouts/header/...                                 │
  data/cars.json                                     │   (temporary; out of scope)
  global/output.css                                  ┘
```

### 1.1 URL conventions

The CMS Backend (Node service at `/home/rouhollahdev/project/CMS_Backend/`) is
served on `http://localhost:5005` and exposes the dealership storage at:

```
http://localhost:5005/cms/dealerships/{id}/...   ← URL
                            │
                            ▼
            /tmp/cms-dealerships/{id}/...        ← on-disk virtual storage
```

Globals (component bundles + manifest) are served from a sibling path; the
canonical location is pinned at runtime by `SiteRegistry.componentsManifestRef`.

Inside the Next.js app:

- **Server-side fetches** (`app/page.tsx`, `app/layout.tsx`, loaders) hit
  `${CMS_BASE_URL}/cms/...` directly. `CMS_BASE_URL` defaults to
  `http://localhost:5005`.
- **Browser-side fetches** use the relative path `/cms/...`, which is
  proxied to the backend by `src/app/cms/[...slug]/route.ts`. The proxy
  fixes `Content-Type` for `.js`/`.mjs` and applies a 60s cache.

Env vars the app reads:

| Var | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_DEALERSHIP_ID` | Which tenant this deployment serves | `"1"` |
| `CMS_BASE_URL` | CMS Backend base URL (server-side fetches) | `http://localhost:5005` |
| `CMS_COMPONENTS_BASE_URL` | Convention fallback when manifest omits a bundle URL | `${CMS_BASE_URL}/cms/components` |

---

## 2. Two-layer separation

### 2.1 Global layer — the component library

Lives in a **shared** directory, not under any dealership:

```
/cms-dealerships/{globals|hub|store}/...
```

(exact name TBD — see Open Questions)

Contains:

- **Compiled web-component bundles** (gzipped JavaScript). Each bundle:
  - Defines one `customElements.define(...)` for its tag (e.g. `<hillz-slider>`).
  - Contains **no Tailwind classes**, **no copy**, **no images**, **no links**.
  - Reads everything it needs from a JSON config attached at runtime.
- **Versioned**: `hillz.slider@v1`, `hillz.slider@v2`, etc. live side by side.
  A component is **never mutated in place** — feature changes go into a new
  version so older dealerships keep working unchanged.
- Optionally, **library defaults**: `defaults/<componentKey@version>.json`
  containing the default content used when a dealership doesn't override
  every field.

> **Component contract.** A web component MUST NOT bake in any styling, copy,
> link, image, or layout. It accepts a JSON object describing what to render
> and where (per-element `className`, `content`, `href`, `image`, `items`,
> ...). If a feature needs to change shape, publish a **new version**.

### 2.2 Private layer — the dealership

Lives under one folder per tenant:

```
/cms-dealerships/{id}/
```

Contains everything that is **specific to this dealership** — its pages list,
which versioned components each page uses, the per-instance JSON each
placement renders, layouts (header/footer), inventory, theme, generated CSS,
manifest, and snapshots.

---

## 3. The registry chain (how a page is assembled)

Schema v2.0. Every document carries `$schemaVersion: "2.0"` so loaders can
distinguish new shapes from legacy ones (the latter are ignored — see §9).

There are **four document shapes** in the new schema, plus one shared
primitive:

### 3.0 The `Ref` primitive

Every cross-document pointer follows the same shape:

```ts
type Ref = {
  url: string;              // absolute or relative-to-baseUrl
  version: string;          // monotonic; used as cache key
  integrity?: string;       // sha256-... (immutable artefacts only)
  encoding?: "json" | "gz" | "json+gz";
};
```

Why it matters:

- `version` is **the** cache key. Any change to the underlying file bumps
  this value, so the loader's caches invalidate automatically.
- `integrity` lets us verify immutable artefacts (component bundles).
  Optional today; planned to become mandatory for `bundle.url`.
- `url` may be absolute or relative. Relative URLs resolve against
  `SiteRegistry.baseUrls.cms`, which keeps documents portable across
  environments / dealership clones.

### 3.1 `SiteRegistry` — `config/site-pages-registry.json`

The **site map for one dealership.** The single document the app needs to
bootstrap a tenant.

```jsonc
{
  "$schemaVersion": "2.0",
  "siteId": "1",
  "snapshotId": "2026-04-27T10-30-00Z",
  "publishedAt": "2026-04-27T10:30:00.000Z",
  "defaultLocale": "en-CA",

  "baseUrls": {
    "cms":        "http://localhost:5005/cms",
    "components": "http://localhost:5005/cms/components"
  },

  "componentsManifestRef": {
    "url": "/components/manifest.json",
    "version": "2026.04.0",
    "integrity": "sha256-..."
  },

  "layout": {
    "regions": {
      "header": [ /* PlacementEntry[] — wraps every page */ ],
      "footer": [ /* PlacementEntry[] */ ]
    }
  },

  "pages": [
    {
      "pageId": "home",
      "route": "/",
      "label": "Home",
      "prefetch": "immediate",
      "priority": 0,
      "registryRef": {
        "url": "/dealerships/1/pages/home/registry.json",
        "version": "12"
      }
    },
    {
      "pageId": "inventory-list",
      "route": "/inventory",
      "label": "Inventory",
      "prefetch": "idle",
      "priority": 10,
      "registryRef": {
        "url": "/dealerships/1/pages/inventory-list/registry.json",
        "version": "4"
      }
    }
  ]
}
```

Key fields:

- `siteId` — the dealership id (matches `NEXT_PUBLIC_DEALERSHIP_ID`).
- `snapshotId` — the active snapshot the app is reading. Surfaces in dev
  tools and error reports for traceability (see §5).
- `baseUrls` — env-var defaults can be overridden here per-tenant. Lets a
  dealership move between environments without redeploying the app.
- `componentsManifestRef` — pointer to the global `ComponentsManifest`
  (§3.4). The app fetches this once per session.
- `layout.regions` — placements that wrap **every** page (header, footer).
  Loaded once at `app/layout.tsx`, not per-route.
- `pages[]` — the list of routable pages. Each entry's `registryRef`
  resolves to a `PageRegistry`.

### 3.2 `PageRegistry` — `pages/<pageId>/registry.json`

The placements that make up one page, **organised by region** so a large
page can split a region out into its own document via `regionRefs`.

```jsonc
{
  "$schemaVersion": "2.0",
  "pageId": "home",
  "layoutVersion": "12",
  "publishedAt": "2026-04-27T10:30:00.000Z",

  // Optional: extra selectors this page wants hydrated alongside placements
  // (e.g. /inventory pre-loads selectInventory). The bridge already supports
  // arbitrary keys in selectorRegistry.
  "hydrate": [
    {
      "selector": "selectWebsiteConfig",
      "ref": { "url": "/dealerships/1/global/websiteConfig.json", "version": "8" }
    }
  ],

  "regions": {
    "main": [
      {
        "placementId": "plc_home_slider_01",
        "componentKey": "hillz.slider@v2",
        "customElementTag": "hillz-slider",
        "order": 0,
        "prefetch": "immediate",
        "jsonRef": {
          "url": "/dealerships/1/pages/home/Slider/plc_home_slider_01.json",
          "version": "7"
        },
        "libraryDefaultsRef": {
          "url": "/components/defaults/hillz.slider@v2.json",
          "version": "2.0.0"
        }
      },
      {
        "placementId": "plc_home_specialcars_01",
        "componentKey": "hillz.special-cars@v1",
        "customElementTag": "hillz-special-cars",
        "order": 1,
        "prefetch": "viewport",
        "jsonRef": {
          "url": "/dealerships/1/pages/home/SpecialCars/SpecialCarsCards.json",
          "version": "3"
        }
      }
    ],
    "aside": [ /* ... */ ]
  },

  // Optional escape hatch for very large pages.
  "regionRefs": {
    "footer-extras": { "url": "/dealerships/1/pages/home/footer-extras.json", "version": "2" }
  }
}
```

Key fields:

- `regions: Record<RegionId, PlacementEntry[]>` — each region renders its
  placements in `order`. Region ids are free-form (`"header"`, `"main"`,
  `"aside"`, `"footer"`, …) and the layout decides how to position them.
- `regionRefs` — lazy-load a region from a separate document; useful when
  one region is very large (long catalogues) and shouldn't bloat the page
  registry.
- `hydrate[]` — declarative way for a page to ask the loader to also
  populate non-placement selectors. The bridge takes care of distribution.

A `PlacementEntry` looks like:

```ts
type PlacementEntry = {
  placementId: string;          // "plc_home_slider_01"
  componentKey: string;         // "hillz.slider@v2"
  customElementTag: string;     // "hillz-slider"
  order: number;
  visibility?: {
    devices?: ("desktop" | "tablet" | "mobile")[];
    locales?: string[];
    flags?: Record<string, boolean>;
  };
  prefetch?: "immediate" | "viewport" | "idle" | "never";
  dependsOn?: string[];         // other placementIds that must hydrate first
  jsonRef: Ref;                 // -> PlacementContent
  libraryDefaultsRef?: Ref;     // -> JSON of base values
  bundleRef?: Ref;              // ESCAPE HATCH: override manifest resolution
                                // for this placement (used during dist-json
                                // migration; see §9.6)
};
```

### 3.3 `PlacementContent` — `pages/<pageId>/<Component>/<placement>.json`

The data a single component instance renders. **Wrapped in an envelope** so
we can evolve metadata without ever touching the component-specific shape
inside `content`.

```jsonc
{
  "$schemaVersion": "2.0",
  "placementId": "plc_home_slider_01",
  "componentKey": "hillz.slider@v2",
  "componentSchemaVersion": "2.0.0",
  "publishedAt": "2026-04-27T10:30:00.000Z",

  "content": {
    // Whatever the existing payload looks like, verbatim.
    "id": "plc_home_slider_01-b2d74240",
    "name": "plc_home_slider_01",
    "order": 2,
    "className": "bg-black h-80 lg:h-[60vh] md:h-[80vh]",
    "components": {
      "images":         { "items": [ /* ... */ ] },
      "swiperSection":  { "swiperConfig": { /* ... */ } },
      "buttonsOverlay": { "buttons":      [ /* ... */ ] },
      "slogansForAll":  { "items":        [ /* ... */ ] }
    }
  }
}
```

What actually reaches the store is `content`:

```ts
store.dispatch(setComponentData({
  placementId: doc.placementId,
  data:        doc.content,    // <-- only the inner payload
}));
```

`componentSchemaVersion` matches `ComponentManifestEntry.acceptsContentSchema`
(§3.4) so the loader can warn early when a placement was published against
a different bundle version than the one currently resolved.

### 3.4 `ComponentsManifest` — global

The catalogue of every published web component. Fetched **once per session**
from `SiteRegistry.componentsManifestRef.url`.

```jsonc
{
  "$schemaVersion": "2.0",
  "publishedAt": "2026-04-27T09:00:00.000Z",
  "components": [
    {
      "componentKey": "hillz.slider@v2",
      "customElementTag": "hillz-slider",
      "bundle": {
        "url": "/components/hillz.slider@v2.gz",
        "version": "2.4.1",
        "integrity": "sha256-...",
        "encoding": "gz"
      },
      "externals": ["React", "Utils"],
      "peerDependencies": [],
      "acceptsContentSchema": "2.0.0"
    },
    {
      "componentKey": "hillz.header@v3",
      "customElementTag": "hillz-header",
      "bundle": { "url": "/components/hillz.header@v3.gz", "version": "3.0.7", "integrity": "sha256-...", "encoding": "gz" },
      "externals": ["React", "Utils"],
      "peerDependencies": [],
      "acceptsContentSchema": "2.0.0"
    }
  ]
}
```

Resolution rules (manifest first, convention as fallback — locked decision):

1. If `ComponentsManifest` has an entry for `componentKey`, use
   `entry.bundle` as the `Ref`.
2. Otherwise fall back to convention:
   `${baseUrls.components}/<componentKey>.gz`, with no integrity check.
3. If a `PlacementEntry` carries a `bundleRef`, **it overrides everything
   above** (§9.6 escape hatch during the `temp/dist-json/` migration).

---

## 4. Folder map (per dealership)

Snapshot of `/cms-dealerships/1/`:

```
config/
  site-pages-registry.json     ← top-level page list (3.1)

pages/
  home/
    registry.json              ← page-level component registry (3.2)
    Slider/
      plc_home_slider_01.json  ← per-placement content (3.3)
      versions/
    SpecialCars/
      SpecialCarsCards.json
      SpecialCarsHeader.json
      versions/
    QuickSearch/QuickSearch.json
    SearchBrand/SearchBrand.json
    SearchBody/SearchBody.json   + versions/
    HomeAbout/HomeAbout.json     + versions/
    Welcome/Welcome.json
    Department/Department.json
    WhyChooseUs/WhyChooseUs.json
    GoogleReviews/GoogleReviews.json + versions/
    Map/Map.json
  home.json                    ← LEGACY single-file dump (do not consume)

layouts/
  header.json                  ← header data (current)
  header/
    Top.json
    navbar.json
    MobileMenu.json
    versions/
  Footer/
    Footer.json
    SubFooter.json
    versions/
  versions/
    header.json

data/
  cars.json                    ← inventory for this dealership (~2 MB)

global/
  output.css                   ← compiled per-dealership CSS bundle
  versions/output.json

manifest/
  manifest.json                ← published-asset id list (cache invalidation)

snapshots/
  snapshots.json               ← rollback points

share/
  atom/                        ← shared atom-component assets (currently empty)

temp/
  dist-json/                   ← TEMPORARY: gz component bundles currently
                                  served from here (should move to globals)
  section.json                 ← LEGACY editor staging
  map.json                     ← LEGACY simple per-page section list
  theme.json                   ← editor staging
  content.json                 ← editor staging
  test/  .trash/
```

---

## 5. Versioning, snapshots, and dealership cloning

Two independent versioning axes:

1. **Component versioning** — global, by `componentKey@version`.
2. **Dealership versioning** — local, by snapshot manifest.

### 5.1 Component versions

When a component evolves (extra/less features, breaking change in its JSON
contract, big visual rework), **publish a new version**. Never mutate an old
one.

```
hillz.header@v1   ← 30 dealerships still use this
hillz.header@v2   ← 12 dealerships migrated
hillz.header@v3   ← 2 early-adopter dealerships
```

Each dealership picks the version it wants in its
`pages/<pageId>/registry.json`. Migration is just a value change in that
file — application code never has to know.

#### `componentKey` grammar

```
<vendor>.<name>@<version>
^^^^^^^ ^^^^^^ ^^^^^^^^^
   |       |       └─ semver-ish version label (v1, v2, 2.0.0, ...)
   |       └─ component name (slider, header, special-cars, ...)
   └─ namespace / library (hillz, partner-x, ...)
```

`customElementTag` is independent of the version and stable across
compatible versions (e.g. `<hillz-slider>` for both `hillz.slider@v1` and
`@v2`). When a breaking schema change forces a tag change, publish under a
new tag too (`<hillz-slider-v3>`).

### 5.2 Dealership snapshots

A **snapshot** is a manifest that pins one immutable version of every
editable file in a dealership at a moment in time. Snapshots are how we get
rollback, forward, and cloning without making the file system itself
versioned.

The CMS folder structure is already shaped for this — every editable file
sits next to a `versions/` neighbour holding every published revision.

```
/cms-dealerships/{id}/
├── config/site-pages-registry.json                ← LIVE copy
├── config/versions/site-pages-registry.{v}.json   ← every revision
├── pages/home/registry.json                       ← LIVE
├── pages/home/registry.versions/                  ← every revision
├── pages/home/Slider/plc_home_slider_01.json      ← LIVE
├── pages/home/Slider/versions/plc_home_slider_01.{v}.json
├── snapshots/
│   ├── active.json                                ← { snapshotId: "..." }
│   └── 2026-04-27T10-30-00Z.json                  ← snapshot manifest
└── ...
```

Anatomy of a snapshot manifest:

```jsonc
{
  "$schemaVersion": "2.0",
  "snapshotId": "2026-04-27T10-30-00Z",
  "label": "Spring promo launch",
  "author": "rouhollah@hillz",
  "createdAt": "2026-04-27T10:30:00.000Z",
  "siteId": "1",

  "componentsManifestRef": {
    "url": "/components/manifest.json",
    "version": "2026.04.0",
    "integrity": "sha256-..."
  },

  "files": [
    { "path": "config/site-pages-registry.json",                "version": "12", "hash": "sha256-..." },
    { "path": "pages/home/registry.json",                       "version": "8",  "hash": "sha256-..." },
    { "path": "pages/home/Slider/plc_home_slider_01.json",      "version": "7",  "hash": "sha256-..." },
    { "path": "pages/home/SpecialCars/SpecialCarsCards.json",   "version": "3",  "hash": "sha256-..." },
    { "path": "layouts/header/Top.json",                        "version": "5",  "hash": "sha256-..." },
    { "path": "layouts/Footer/Footer.json",                     "version": "9",  "hash": "sha256-..." },
    { "path": "global/output.css",                              "version": "44", "hash": "sha256-..." }
  ],

  "excludes": ["data/cars.json"]
}
```

Snapshots **do not include** runtime / operational data (e.g. `data/cars.json`
inventory). The `excludes` list documents this explicitly.

### 5.3 Rollback / forward

Both directions are the same operation: change the active pointer.

```
POST /dealerships/1/activate-snapshot { snapshotId: "2026-04-27T10-30-00Z" }
```

Server-side:

1. Read `snapshots/{snapshotId}.json`.
2. For every file in `files[]`, copy `versions/<file>.<version>.<ext>` to
   the live path.
3. Atomically rewrite `snapshots/active.json` to `{ snapshotId }`.

App-side: nothing. The next request fetches the new live JSONs through
normal HTTP caching, keyed on the `version` field that every `Ref`
already carries.

### 5.4 Cloning a dealership

To bootstrap a new dealership from a snapshot of an existing one:

1. Create `/cms-dealerships/{newId}/`.
2. Copy `snapshots/{snapshotId}.json` into the new dealership's
   `snapshots/` folder.
3. For every file referenced in `files[]`, copy
   `versions/<file>.<version>.<ext>` from the source dealership to:
   - the new dealership's live path, AND
   - the new dealership's `versions/<file>.1.<ext>` so its history starts
     fresh from version 1.
4. Inside the cloned `site-pages-registry.json`, bump `siteId` from
   `{srcId}` to `{newId}` and rewrite any absolute self-referencing
   URLs.
5. Set `snapshots/active.json` in the new dealership to point at the
   cloned snapshotId.

Net result: byte-identical to the source dealership at the chosen moment,
with an independent version chain to evolve from.

### 5.5 Storage notes

The `versions/` folders are cheap (most JSONs gzip well; a full dealership
folder is single-digit MB). Content-addressable deduplication across
snapshots is a nice future optimisation, not a day-one need.

### 5.6 Dev affordance — preview a snapshot

A future query parameter (`?_snapshot=<snapshotId>`) lets QA preview a
non-active snapshot without flipping the production pointer. The loader
plumbs this through but the CMS Backend has to honour the override on
fetch. Out of scope for the initial app refactor; flagged here so we don't
forget.

---

## 6. Runtime fetch flow

```
                    ┌──────────────────────────────┐
                    │  Next.js server component    │
                    │  (e.g. app/page.tsx)         │
                    └───────────────┬──────────────┘
                                    │ knows: dealershipId, pageId
                                    ▼
       ┌──────────────────────────────────────────────────────┐
       │ 1. GET .../{id}/config/site-pages-registry.json      │
       │    → find the entry where pageId matches             │
       └───────────────────────────┬──────────────────────────┘
                                   ▼
       ┌──────────────────────────────────────────────────────┐
       │ 2. GET registryRef.url                               │
       │    → the page-level component list                   │
       └───────────────────────────┬──────────────────────────┘
                                   ▼
       ┌──────────────────────────────────────────────────────┐
       │ 3. For every component placement, in parallel:       │
       │     a) resolve componentKey → global gz URL          │
       │        (resolver TBD — see Open Questions §9.1, §9.2)│
       │     b) GET the gz bundle (decompress)                │
       │     c) GET jsonRef.url (per-placement content)       │
       └───────────────────────────┬──────────────────────────┘
                                   ▼
       ┌──────────────────────────────────────────────────────┐
       │ 4. Hydrate the Redux store BEFORE any component      │
       │    mounts:                                           │
       │      for each placement:                             │
       │        store.dispatch(setComponentData({             │
       │          placementId, data: <jsonRef payload>        │
       │        }))                                           │
       │    → state.componentData.componentData is a map      │
       │      keyed by placementId.                           │
       └───────────────────────────┬──────────────────────────┘
                                   ▼
       ┌──────────────────────────────────────────────────────┐
       │ 5. Render the page on the client:                    │
       │     - <ContextBridge /> mounts and starts publishing │
       │       store snapshots on `window.__selectorData`     │
       │       and broadcasting `getSelectorData` events.     │
       │     - Inject every component bundle in registry      │
       │       order via useScriptInjectAll(...).             │
       │     - Mount each placement's `customElementTag` in   │
       │       its `region` / `order` slot.                   │
       │     - Each web component reads ITS OWN config from   │
       │       the store via                                  │
       │         window.useExternalSelector(                  │
       │           "getSelectorData",                          │
       │           "selectComponentData",                     │
       │           "<placementId>"                            │
       │         )                                            │
       └──────────────────────────────────────────────────────┘
```

Caching guidelines:

- The **gz bundles** are immutable per `componentKey@version`. Cache hard
  (long max-age, content-hashed URLs, dedupe by version on the client so the
  same component used on multiple pages is loaded once).
- The **dealership JSON** changes whenever an admin publishes. Use
  short / SWR-style caching keyed on `version` from the `*Ref` blocks.

---

## 6.5 The Context Bridge — how components reach into the store

Web components run on the page but can't call host React hooks directly:
they may bundle their own React, in which case calling the host's
`useState`/`useEffect` triggers "Invalid hook call". The bridge exists to
break that hook boundary cleanly.

### 6.5.1 What lives where

| Layer | Owns | Lives in |
|---|---|---|
| Host (Next.js) | The Redux store, all selectors, all actions, the bridge component | `src/store/`, `src/components/bridges/ContextBridge.tsx` |
| Bridge | Translation layer between Redux and the page's `window` | `<SelectorBridge />` (mounted once near the root) |
| Web component | Its own UI; subscribes to the host store via the bridge | Global gz bundle |

The store has a dedicated slice that is keyed by `placementId`:

```ts
// src/store/slices/componentDataSlice.ts
state.componentData.componentData = {
  plc_home_slider_01: { /* per-placement JSON */ },
  plc_home_quicksearch_01: { /* per-placement JSON */ },
  // ...
}
```

The matching selector is exported as `selectComponentData` and registered in
`selectorRegistry` so the bridge knows about it.

### 6.5.2 Hydration order (critical)

```
        load page JSONs ──► dispatch setComponentData() per placement
                                          │
                                          ▼
                         <SelectorBridge /> mounts, mirrors store to
                         window.__selectorData on every render
                                          │
                                          ▼
                         inject component bundles via <script>
                                          │
                                          ▼
                         custom elements upgrade and call
                         useExternalSelector("getSelectorData",
                                             "selectComponentData",
                                             "<placementId>")
                         → reads its config synchronously from the
                           live snapshot
```

The store **must be populated before any component bundle runs**. A widget
that asks for its config and gets back `null/undefined/{}` will be queued
by the bridge and re-broadcast when data lands, but the spec is
"hydrate first, mount after" so widgets get a synchronous initial value
through `window.__selectorData`.

### 6.5.3 Event contract (recap)

| Direction | Event | Detail | Purpose |
|---|---|---|---|
| widget → host | `useAppSelector` | `{ type, key? }` | "I want to subscribe to this selector value." |
| host → widget | `getSelectorData` | `{ type, key?, payload }` | "Here's the current value (and on every change)." |
| widget → host | `useAppSelectorRelease` | `{ type, key? }` | "I'm unmounting; drop my refcount." |
| widget → host | `dispatchAction` | `{ type, payload?, requestId? }` | One-shot Redux action dispatch. |
| host → widget | `dispatchActionResult` | `{ type, requestId?, ok, error? }` | Ack for the dispatch. |
| host → widget | `pathnameChange` | `{ pathname }` | Router notification. |
| host → widget | `searchParamsChange` | `{ search }` | Query-string notification. |
| widget → host | `widget-navigation` | `{ action, route? }` | Trigger `router.push/replace/...`. |

Subscriptions are **refcounted by `(type, key)`**: every `useAppSelector`
must be paired with a matching `useAppSelectorRelease` on widget unmount.
The bundled `useExternalSelector` does this automatically in its cleanup.

### 6.5.4 Why this answers per-placement delivery

Per-placement content does NOT travel through DOM attributes, properties,
or self-fetching. It's loaded into the store once, keyed by `placementId`,
and every widget retrieves only its own slice via:

```js
const slide = useExternalSelector(
  "getSelectorData",        // response event name
  "selectComponentData",    // selector key in selectorRegistry
  "plc_home_slider_01"      // this placementId
);
```

Benefits:

- **One source of truth.** All placement data sits in Redux; the bridge
  guarantees consistency across widgets.
- **Cheap re-mount.** A widget that re-mounts doesn't re-fetch — it reads
  `window.__selectorData` synchronously in its `useState` initializer.
- **Live updates.** If an admin republishes a single placement and the
  app dispatches `setComponentData(...)` for it, every widget bound to
  that `placementId` is broadcast the new payload automatically.
- **Same channel, more data.** The bridge already exposes
  `selectWebsiteConfig`, `selectDealerData`, `selectPageData`,
  inventory selectors, etc. Widgets get all of them through one
  consistent contract.

---

## 7. App-side implications

The Shadow Next.js app **does not encode**:

- Which components are on a page.
- The order they render in.
- Which gz file each component lives in.
- Any styling, copy, link, or image content.

The app **does encode**:

- The current `dealershipId` (read from `NEXT_PUBLIC_DEALERSHIP_ID`).
- CMS base URLs (`CMS_BASE_URL`, `CMS_COMPONENTS_BASE_URL`); each one
  overridable per-tenant by `SiteRegistry.baseUrls`.
- The `componentKey → bundle URL` resolver (manifest first, convention
  fallback, `bundleRef` overrides — see §3.4).
- The runtime injection mechanics (`useScriptInjectAll`).
- The store-hydration glue (`setComponentData` per placement).

### 7.1 Per-route, on-demand loading

| Route | Loads |
|---|---|
| `app/layout.tsx` (every request) | `SiteRegistry`, `ComponentsManifest`, `SiteRegistry.layout.regions` (header/footer) |
| `app/page.tsx` (`/`) | `pages/home/registry.json` + bundles + per-placement JSONs for that page only |
| `app/cars/page.tsx` (`/cars`) | only the cars page's registry + bundles + JSONs |
| ... | ... |

- `ComponentsManifest` is fetched **once per session** and reused across
  routes (component bundles dedupe by `componentKey@version`, so a slider
  used on both `/` and `/inventory` loads exactly once across navigations).
- Bundles are immutable per `componentKey@version` → cache hard.
- Per-placement JSONs change on publish → SWR-style cache, keyed on
  `Ref.version`.
- `pages[].prefetch: "immediate" | "viewport" | "idle" | "never"` is a CMS
  hint the app can use to warm likely-next routes in the background.

### 7.2 Module layout — `src/lib/cms/`

```
src/lib/cms/
├── schema/
│   ├── ref.ts                    // Ref + helpers
│   ├── siteRegistry.ts           // SiteRegistry types
│   ├── pageRegistry.ts           // PageRegistry + PlacementEntry types
│   ├── placementContent.ts       // PlacementContent envelope
│   ├── componentsManifest.ts     // ComponentsManifest types
│   └── snapshot.ts               // Snapshot manifest types
├── env.ts                        // reads NEXT_PUBLIC_DEALERSHIP_ID,
│                                 // CMS_BASE_URL, CMS_COMPONENTS_BASE_URL
├── client/
│   ├── fetchJson.ts              // server-side JSON fetcher (Next cache)
│   ├── fetchScript.ts            // gz-aware bundle fetcher (dedup'd)
│   └── resolveUrl.ts             // resolves a Ref.url against baseUrls
├── resolver/
│   └── resolveBundle.ts          // componentKey -> Ref via Manifest
│                                 // (bundleRef > manifest > convention)
├── loaders/
│   ├── loadSiteRegistry.ts       // (dealershipId) -> SiteRegistry
│   ├── loadComponentsManifest.ts // (siteRegistry) -> ComponentsManifest
│   ├── loadPageRegistry.ts       // (siteRegistry, pageId) -> PageRegistry
│   └── loadAndPreparePage.ts     // orchestrator: returns ready-to-render
│                                 // { placements[], bundles[], hydrate[] }
├── hydrate/
│   ├── hydrateComponentData.ts   // dispatch setComponentData per placement
│   └── hydrateExtraSelectors.ts  // walk PageRegistry.hydrate[]
└── index.ts                      // public entry: loadAndPreparePage
```

### 7.3 What a route looks like after the refactor

```ts
// app/page.tsx
import { loadAndPreparePage } from "@/lib/cms";
import DealershipPage from "@/components/DealershipPage";

export default async function Home() {
  const prepared = await loadAndPreparePage("home");
  return <DealershipPage prepared={prepared} />;
}
```

`<DealershipPage />` (client component):

1. `useScriptInjectAll(prepared.bundles)` — register every custom element.
2. For every region in `prepared.regions`, render its placements in
   `order` as their `customElementTag`. No props, no attributes.
3. Each web component's bundle resolves its config from the store via
   `useExternalSelector("getSelectorData", "selectComponentData", placementId)`.

The orchestrator (`loadAndPreparePage`) is the only place that:

- Calls `store.dispatch(setComponentData({ ... }))` per placement.
- Calls `store.dispatch(...)` for any selector listed in
  `PageRegistry.hydrate[]`.
- Resolves bundle URLs through `ComponentsManifest`.
- Runs everything in parallel.

`useScriptInject` (single) stays as-is for the few callers
(`cars/page.tsx`, `car-finder/page.tsx`, `layout.tsx`) until they migrate
to `loadAndPreparePage`.

### 7.4 Things explicitly out of scope for the app

- CMS Backend snapshot endpoints (rollback / activate / clone).
- Authoring `ComponentsManifest` itself — the app reads it; it's a CMS
  artefact.
- Running on legacy documents (`pages/home.json`, `temp/section.json`,
  `temp/map.json`). The loader rejects anything missing `$schemaVersion`.
- `data/cars.json`. Treated as temporary; not touched by the new loaders.

---

## 8. Glossary

| Term | Meaning |
|---|---|
| **Dealership** | Tenant. Each dealership has its own folder under `/cms-dealerships/{id}/`. |
| **Web component** | A versioned bundle that `customElements.define`s one tag. Global, immutable, content-agnostic. |
| **componentKey** | `vendor.name@version`. Canonical reference from a dealership to a global web component. |
| **placementId** | Instance id for a component on a specific page (e.g. `plc_home_slider_01`). |
| **customElementTag** | The DOM tag a bundle registers (`<hillz-slider>`). |
| **registryRef** | Pointer (URL + version) from one registry layer to the next. |
| **jsonRef** | Pointer (URL + version) to a per-placement content JSON. |
| **libraryDefaultsRef** | Fallback values from the component library, applied when the placement JSON omits fields. |
| **placement** | A single instance of a component on a page (= one entry in `pages/<id>/registry.json`). |
| **region** | Named slot in a page layout (e.g. `main`, `aside`). |
| **layoutVersion** | Version of the page layout schema this registry was built against. |
| **ContextBridge / SelectorBridge** | Host-side React component that exposes the Redux store, dispatches, and Next.js navigation to web components via `window` events. Lives at `src/components/bridges/ContextBridge.tsx`. |
| **`selectComponentData`** | Selector returning `state.componentData.componentData`, a `Record<placementId, json>` map. The bridge supports keyed access by `placementId`. |
| **`setComponentData`** | Action that writes a single placement's JSON into the store: `setComponentData({ placementId, data })`. |
| **`useExternalSelector`** | Widget-side hook that subscribes to a host selector through the bridge. Resolves React from `window.React` to avoid hook-instance mismatches. |
| **`window.__selectorData`** | Snapshot of the full selector map mirrored by the bridge on every render. Lets newly-mounted widgets read their value synchronously. |
| **`Ref`** | The shared pointer primitive: `{ url, version, integrity?, encoding? }`. `version` is the cache key. |
| **`SiteRegistry`** | Top-level dealership doc (`config/site-pages-registry.json`). Has `baseUrls`, `componentsManifestRef`, `layout.regions`, `pages[]`. |
| **`PageRegistry`** | Per-page doc (`pages/<id>/registry.json`). Has `regions: Record<RegionId, PlacementEntry[]>`, optional `hydrate[]`. |
| **`PlacementContent`** | Per-placement payload, wrapped in an envelope (`{ $schemaVersion, placementId, componentKey, content }`). Only `content` reaches the store. |
| **`ComponentsManifest`** | Global catalogue listing every `componentKey@version` → bundle `Ref` + integrity + accepted content schema. Fetched once per session. |
| **`bundleRef`** | Optional per-placement override that wins over the manifest. Migration escape hatch (§9.6). |
| **`Snapshot`** | Per-dealership manifest pinning one version of every editable file. Stored under `snapshots/<snapshotId>.json`; `snapshots/active.json` points at the live one. |
| **`baseUrls`** | `{ cms, components }` URL bases stored on `SiteRegistry`. Env vars provide defaults; the doc overrides them per-tenant. |
| **`loadAndPreparePage`** | The single app-side entry point: `(pageId) → { placements, bundles, regions, hydrate }`. Hydrates the store and returns everything needed for render. |

---

## 9. Decisions (locked)

All previously-open questions are resolved. Items are kept here as a record
of the trade-off and the choice taken.

### 9.1 Globals path / URL pattern — RESOLVED ✅

**Decision:** Canonical path is whatever `ComponentsManifest.components[].bundle.url`
says. The app does not assume a fixed pattern.

The schema lets the CMS team move bundles anywhere (`/cms/components/...`,
sibling folders, external CDN) without app changes. As of today the manifest
publishes resolve against `${SiteRegistry.baseUrls.components}`, defaulting to
`${CMS_BASE_URL}/cms/components`.

### 9.2 `componentKey@version` → URL resolver — RESOLVED ✅

**Decision:** Manifest first, convention as fallback, `bundleRef` overrides.

Resolver order in `resolveBundle(componentKey, manifest, placementEntry)`:

1. `placementEntry.bundleRef` — if present, wins. (Used during the
   `temp/dist-json/` migration; see §9.6.)
2. `manifest.components.find(c => c.componentKey === key).bundle` — the
   normal path.
3. Convention fallback: `${baseUrls.components}/<componentKey>.gz`. No
   integrity check; logged as a warning.

### 9.3 Per-placement JSON delivery — RESOLVED ✅

**Decision:** Per-placement content is delivered through the **Redux store
+ ContextBridge**, not via element attributes / properties / self-fetch.

Flow:

1. Server (or initial client load) fetches every placement's `jsonRef.url`
   and dispatches `setComponentData({ placementId, data })` — populating
   `state.componentData.componentData` as a `Record<placementId, any>`.
2. `<ContextBridge />` (already mounted near the root) mirrors the store
   to `window.__selectorData` and brokers `useAppSelector` /
   `getSelectorData` events.
3. Each web-component bundle reads its slice with:
   ```js
   const slide = useExternalSelector(
     "getSelectorData",
     "selectComponentData",
     "plc_home_slider_01"
   );
   ```

See §6.5 for the full bridge contract, hydration order, and rationale.

### 9.4 Dealership-id resolution — RESOLVED ✅

**Decision:** Env var per deployment.

The app reads `process.env.NEXT_PUBLIC_DEALERSHIP_ID` (defaulting to `"1"`
in dev) and passes it into the loaders. One Next.js build per dealership.

This is intentional — it keeps the loader signature simple and makes
caching, error reporting, and snapshot cloning unambiguous. If we ever
need multi-tenant from a single deployment we can switch to a Next.js
dynamic segment (`app/[dealership]/...`) without changing the loaders;
they only care that *some* `dealershipId` is supplied.

### 9.5 Legacy assets — RESOLVED ✅

**Decision:** The new loaders consume **only** documents carrying
`$schemaVersion: "2.0"`. Anything missing that field is ignored, including:

- `pages/home.json` (old flat per-page dump)
- `temp/section.json` (old editor staging)
- `temp/map.json` (old simple per-page section list)

These files can be deleted from the CMS storage when the new schema is
fully rolled out; until then the app simply doesn't read them.

### 9.6 `temp/dist-json/` migration — RESOLVED ✅

**Decision:** Dual-publish during transition; `PlacementEntry.bundleRef`
is the schema-level escape hatch.

- Day 1 (now): bundles still live in `/cms-dealerships/{id}/temp/dist-json/`.
  The page-level registry can carry an optional `bundleRef` per placement
  that points there. The resolver honours it ahead of the manifest.
- Day N: bundles move to a global location. The CMS publishes a real
  `ComponentsManifest`. Page registries drop their `bundleRef` overrides as
  dealerships are republished.
- Day N+M: legacy `temp/dist-json/` folders can be removed.

App code never has to change between these phases — the resolver order in
§9.2 covers all three.

---

## 10. Changelog

- _2026-04-27_ — Initial draft. Captures current understanding from inspection
  of `/cms-dealerships/1/` and architecture conversations. All §9 items still
  open.
- _2026-04-27_ — §9.3 resolved: per-placement JSON is delivered through Redux
  + `ContextBridge` (`useExternalSelector("getSelectorData",
  "selectComponentData", placementId)`). Added §6.5 documenting the bridge
  (event contract, hydration order, refcounted releases). §6 fetch flow
  updated so step 4 is "hydrate the store" and step 5 is "mount + bundles
  read from the store". §7 loader sketch updated to dispatch
  `setComponentData` before render. Added bridge-related entries to §8
  glossary.
- _2026-04-27_ — All §9 questions resolved. Locked schema v2.0 with four
  documents (`SiteRegistry`, `PageRegistry`, `PlacementContent`,
  `ComponentsManifest`) + `Ref` primitive (§3, fully rewritten). Added
  §1.1 URL conventions (CMS Backend URL pattern, env vars). Added §5
  snapshot model (manifest + `versions/` + `active.json` pointer) with
  rollback / forward / clone flows. §7 rewritten with env-var
  dealership-id, locked `src/lib/cms/` module layout, per-route on-demand
  loading model, post-refactor route example. §8 glossary picked up
  `Ref`, `SiteRegistry`, `PageRegistry`, `PlacementContent`,
  `ComponentsManifest`, `bundleRef`, `Snapshot`, `baseUrls`,
  `loadAndPreparePage`. §9.1/9.2/9.4/9.5/9.6 all marked RESOLVED with
  decision text.
