export interface ExternalDispatchResult {
  ok: boolean;
  error?: string;
}

/**
 * Dispatches a Redux action from outside the React tree (web components, plain scripts)
 * by firing a `dispatchAction` CustomEvent on window. Resolves once the bridge acks,
 * or rejects the ack with `ok: false` on timeout / unknown action / thrown reducer.
 */
export const externalDispatch = (
  type: string,
  payload?: unknown,
  options: { timeoutMs?: number } = {}
): Promise<ExternalDispatchResult> => {
  const { timeoutMs = 5000 } = options;

  return new Promise((resolve) => {
    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    let settled = false;
    const cleanup = () => {
      window.removeEventListener("dispatchActionResult", handler);
      clearTimeout(timer);
    };

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ExternalDispatchResult & { requestId?: string }>)
        .detail;
      if (detail?.requestId !== requestId) return;
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ ok: !!detail.ok, error: detail.error });
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ ok: false, error: "Timeout waiting for dispatch ack" });
    }, timeoutMs);

    window.addEventListener("dispatchActionResult", handler);
    window.dispatchEvent(
      new CustomEvent("dispatchAction", {
        bubbles: true,
        composed: true,
        detail: { type, payload, requestId },
      })
    );
  });
};
