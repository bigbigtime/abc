export function getLocalImgUrl(url) {
    return new URL(`../${resolvePath(url)}`,
        import.meta.url).href
}

const resolvePath = (path) => {
    if (path.startsWith("@/")) return path.replace("@/", "");
    if (path.startsWith("/")) return path.replace("/", "");
    else return path;
}