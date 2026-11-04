// Live stats for the YouTube channel, read from its public page at build time and
// refreshed hourly. If YouTube changes its page, the last known numbers are used.

export type Channel = { handle: string; url: string; subscribers: string; views: string; videos: string; since: string; live: boolean };

const HANDLE = "@ai_reveal_tech";
const URL = `https://www.youtube.com/${HANDLE}`;
const FALLBACK: Channel = { handle: HANDLE, url: URL, subscribers: "376", views: "392,441", videos: "229", since: "Dec 2021", live: false };

export async function getChannel(): Promise<Channel> {
  try {
    const res = await fetch(`${URL}/about`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36", "Accept-Language": "en-US,en;q=0.9" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK;
    const html = await res.text();
    const subs = html.match(/([\d.,]+[KM]?) subscribers/)?.[1];
    const vids = html.match(/([\d,]+) videos/)?.[1];
    const views = html.match(/"viewCountText":"([\d,]+) views"/)?.[1];
    const since = html.match(/Joined ([A-Z][a-z]{2}) \d{1,2}, (\d{4})/);
    if (!subs || !vids) return FALLBACK;
    return { handle: HANDLE, url: URL, subscribers: subs, videos: vids, views: views ?? FALLBACK.views, since: since ? `${since[1]} ${since[2]}` : FALLBACK.since, live: true };
  } catch {
    return FALLBACK;
  }
}
