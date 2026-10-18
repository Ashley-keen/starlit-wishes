export function formatPrice(n) {
    return "£" + n.toLocaleString("en-GB",{
        minimumFractionDigits: n % 1 ? 2 : 0,
        maximumFractionDigits: 2,
    });
}

export function cleanUrl(text) {
    let url = (text || "").trim();
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : "";
    } catch {
        return "";
 }
}