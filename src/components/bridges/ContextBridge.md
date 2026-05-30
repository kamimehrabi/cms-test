# ContextBridge

`SelectorBridge` exposes Redux selector values to external scripts through browser events.

## Why it exists

External widgets (for example, web comments or embedded scripts) cannot call React hooks directly.
This bridge listens for a request event, reads the current selector value from Redux, and sends it back in a response event.

## Event contract

- Request event: `useAppSelector`
- Request detail: `{ type: "<selectorKey>", key?: "<itemKey>" }`
- Response event: `getSelectorData`
- Response detail: `{ type: "<selectorKey>", key?: "<itemKey>", payload: <selectorData> }`
- Release event: `useAppSelectorRelease`
- Release detail: `{ type: "<selectorKey>", key?: "<itemKey>" }`

## Subscription lifecycle

Each `useAppSelector` request opens a standing subscription so the bridge can
push fresh values whenever the underlying Redux selector changes. Subscriptions
are refcounted by `(type, key)`:

- Every `useAppSelector` increments the refcount.
- Every `useAppSelectorRelease` decrements it.
- When the count reaches zero, the entry is fully removed (subscription set,
  pending-requests set, and last-broadcast cache).

This means widgets that subscribe in a `useEffect` MUST dispatch a matching
`useAppSelectorRelease` in the cleanup function. Without it, the entry leaks
forever, the broadcast loop keeps iterating over dead ids on every store
change, and `lastBroadcastRef` retains old payloads — the typical symptom is
unbounded memory growth in churn-heavy UIs (infinite scroll, filtering, view
toggles).

The bridge tolerates a missing release event (it simply leaks that one entry),
so older widgets that haven't been updated still work.

## Race condition handling

If a request arrives before selector data is ready (for example during delayed fetch/init):

1. The request is queued by selector `type`.
2. The bridge waits for next renders/state updates.
3. As soon as data becomes ready, it dispatches the response event.

Data is treated as "not ready" when it is:

- `undefined`
- `null`
- an empty object (`{}`)

## Usage example

```js
// Request full selector data (no key)
window.dispatchEvent(
  new CustomEvent("useAppSelector", {
    detail: { type: "websiteConfig" },
  })
);

// Listen for response
window.addEventListener("getSelectorData", (event) => {
  const { type, payload } = event.detail || {};
});
```

## Keyed request example (for componentData)

Use keyed requests to avoid sending large payloads for all placements:

```js
// Request only one placement from selectComponentData
window.dispatchEvent(
  new CustomEvent("useAppSelector", {
    detail: { type: "selectComponentData", key: "plc_home_slider_01" },
  })
);

window.addEventListener("getSelectorData", (event) => {
  const { type, key, payload } = event.detail || {};
  if (type === "selectComponentData" && key === "plc_home_slider_01") {
    console.log("single placement payload:", payload);
  }
});
```

## Release example

```js
// Subscribe
window.dispatchEvent(
  new CustomEvent("useAppSelector", {
    detail: { type: "selectComponentData", key: "plc_home_slider_01" },
  })
);

// Later, when the widget unmounts:
window.dispatchEvent(
  new CustomEvent("useAppSelectorRelease", {
    detail: { type: "selectComponentData", key: "plc_home_slider_01" },
  })
);
```

The bundled `useExternalSelector` hook (exposed under the `Utils` external)
already handles this automatically inside its `useEffect` cleanup.

## Bootstrapping new subscribers cheaply

The bridge mirrors its full selector snapshot to `window.__selectorData` on
every render. Newly-mounted widgets read the current value from there
synchronously in `useState`'s initializer, so the bridge does **not** answer
every subscribe with its own dispatch — only the **first** subscriber for a
`(type, key)` triggers an on-subscribe broadcast (to flush any pending state).
Subsequent subscribers to a hot `(type, key)` are silent: they read the live
value and then listen for future change broadcasts like everyone else.

Practical effect: mounting 100 cards that all subscribe to the same selector
produces 1 broadcast, not 100. After mount, only real Redux state changes
produce a broadcast (`getSelectorData`).

If your widget bypasses the bundled `useExternalSelector` and dispatches
events directly, you can do the same:

```js
const all = window.__selectorData ?? {};
const initial = all[type]; // or all[type]?.[key] for keyed selectors
```

## Notes

- Selector keys must exist in `selectorRegistry`.
- Unknown selector keys are ignored with a warning in the console.
- `key` is optional. Selectors like dealership/site config can keep using unkeyed requests.
- Dispatch (`dispatchAction`) is one-shot and not refcounted; only selector
  subscriptions need release events.
