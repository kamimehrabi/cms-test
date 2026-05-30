

export const appFetcher = async (url: string, tags: string[]) => {
    const response = await fetch(url, {
        next: {
            "tags": tags
        },
        cache: "no-store",
    });
    const data = await response.json();
    return data;
}

export default appFetcher;