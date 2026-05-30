import { ungzip } from "pako";

export const fetchScript = async (url: string) => {
    const res = await fetch(url, {
        // Add cache headers for better performance
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to fetch " + url);

    const data = await res.arrayBuffer();

    return ungzip(new Uint8Array(data), { to: "string" });
}