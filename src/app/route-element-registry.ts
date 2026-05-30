const registry = new Map<string, string>();

export function registerRouteElement(route: string, tag: string) {
    registry.set(route, tag);
}

export function getRegisteredTag(route: string): string | undefined {
    return registry.get(route);
}
