// Pulled from GitHub at build time and refreshed every hour (ISR). Falls back to a fixed list if GitHub is down.

export type Repo = {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  updated: string;
};

const USER = "KushagraKanaujia";
// forks of other people's projects and class starter code don't belong on the page
const HIDE = new Set(["KushagraKanaujia", "portfolio", "throttle-landing", "throttle-docs", "SBHacks", "STARTER-lab05", "cs24"]);

const FALLBACK: Repo[] = [
  { name: "throttle", description: "My startup. Helps companies stop overpaying for AI.", url: `https://github.com/${USER}/throttle`, homepage: "https://throttle-pro.com", language: "Python", stars: 7, updated: "2026-10-28" },
  { name: "claude-cost-proxy", description: "HTTP proxy for Claude Code with cost tracking, request logging, and semantic caching", url: `https://github.com/${USER}/claude-cost-proxy`, homepage: null, language: "Python", stars: 0, updated: "2026-08-20" },
  { name: "codemind", description: "Semantic code search engine powered by Claude AI.", url: `https://github.com/${USER}/codemind`, homepage: null, language: "Python", stars: 0, updated: "2026-06-27" },
  { name: "streamfinder", description: "Full-stack content discovery platform with a hybrid recommendation algorithm", url: `https://github.com/${USER}/streamfinder`, homepage: "https://streamfinder-app.vercel.app", language: "TypeScript", stars: 0, updated: "2025-12-08" },
];

export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "kushagrakanaujia-site" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK;
    type GH = { name: string; description: string | null; html_url: string; homepage: string | null; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean; private: boolean; archived: boolean };
    const data = (await res.json()) as GH[];
    const repos = data
      .filter((r) => !r.fork && !r.private && !r.archived && !HIDE.has(r.name) && r.description)
      .map((r) => ({
        name: r.name,
        description: r.name === "throttle" ? "My startup. Helps companies stop overpaying for AI." : r.description!.replace(/\s+/g, " ").trim(),
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        updated: r.pushed_at.slice(0, 10),
      }));
    // the startup first, then by most recent push
    repos.sort((a, b) => (a.name === "throttle" ? -1 : b.name === "throttle" ? 1 : b.updated.localeCompare(a.updated)));
    return repos.length ? repos : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
