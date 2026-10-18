export default async (req) => {
    const url = new URL(req.url).searchParams.get("url");
    if (!url || !/^https?:\/\//i.test(url)) {
        return Response.json({ image: null }, { status: 400 });
    }
    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; StarlitWishes/1.0)" },
            signal: AbortSignal.timeout(5000),
        });
        const html = (await res.text()).slice(0, 300000);
        const match =
            html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        const image = match ? new URL(match[1], url).href : null;
        return Response.json({ image });
    } catch {
        return Response.json({ image: null });
    }
};