// /utils/eventBridge.ts
export type BridgeEvent = {
    type: string;
    payload?: any;
  };
  
  export const sendEvent = (type: string, payload?: any) => {
    window.dispatchEvent(
      new CustomEvent(type, {
        detail: payload,
        bubbles: true,
        composed: true,
      })
    );
  };
  
  export const listenEvent = (type: string, callback: (payload: any) => void) => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent;
      callback(custom.detail);
    };
    window.addEventListener(type, handler);
    return () => window.removeEventListener(type, handler);
  };
  