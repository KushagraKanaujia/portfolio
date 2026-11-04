// One story per thing I've built or worked on. Every fact here comes from the project's own
// README, its repo, or my resume. Nothing invented: if something isn't shipped or measured yet, it says so.

export type Story = {
  slug: string;
  title: string;
  kind: "startup" | "project" | "open source" | "work";
  year: string;
  role: string;
  status: string;
  oneLiner: string;
  summary: string;
  purpose: string;
  steps: { h: string; p: string }[];
  results: string[];
  stack: string[];
  links: { label: string; href: string }[];
  repo?: string; // GitHub repo name, so live repo cards can link here
};

export const STORIES: Story[] = [
  {
    slug: "throttle",
    title: "Throttle",
    kind: "startup",
    year: "2026",
    role: "Founder, solo",
    status: "Open source (MIT). Looking for design partners.",
    oneLiner: "Stop renting your AI.",
    summary:
      "Most AI products send every request to OpenAI or Anthropic and pay for every token, forever. Throttle sits in a company's code, tests each AI job against other models on the company's own traffic, and moves the jobs that pass to a model they own. If nothing passes, nothing moves.",
    purpose:
      "AI bills grow with usage, and most teams never check whether a cheaper model, or one they run themselves, would do the same job just as well. Checking by hand is slow and risky, so nobody does it. Throttle makes that check automatic and safe.",
    steps: [
      { h: "Plug in", p: "Point your API base URL at Throttle and add the GitHub Action. It sees every call your app makes to OpenAI or Anthropic. Nothing else changes." },
      { h: "Watch", p: "When your team adds or changes an AI feature, Throttle notices it in the pull request and picks the job up. No ticket, no project." },
      { h: "Test, then move", p: "Other models, closed or open, answer the same requests in the background. If one does the job as well for less, you approve and the job moves." },
      { h: "Fall back", p: "If the new model errors or gives a broken answer, that request goes straight back to the API. Every miss is kept as a lesson." },
    ],
    results: [
      "Real runs on rented AMD MI300X GPUs (Qwen2.5 on vLLM), with the raw data public on GitHub.",
      "A properly quantized FP8 checkpoint of Qwen2.5-72B went from $1.67 to $1.13 per million tokens with correct answers.",
      "On-the-fly FP8 looked 47% cheaper, but the answers broke (the 32B model replied “!!!!”). Throttle flagged it instead of calling it a saving.",
      "The same untouched server swung 27% one way and 11% the other across checks, which is why a change has to beat the noise before it counts.",
      "It hasn't run on a real company's production traffic yet. That's the next step, with design partners.",
    ],
    stack: ["Python", "LLMs", "vLLM", "GitHub Actions", "AWS"],
    links: [
      { label: "throttle-pro.com", href: "https://throttle-pro.com" },
      { label: "GitHub", href: "https://github.com/KushagraKanaujia/throttle" },
    ],
    repo: "throttle",
  },
  {
    slug: "spreadreader",
    title: "SpreadReader",
    kind: "project",
    year: "2026",
    role: "Solo, design + iOS",
    status: "In development (private). Tested in the simulator so far.",
    oneLiner: "A comic and PDF reader built for foldable iPhones.",
    summary:
      "A reader made for a phone that unfolds into two pages. It shows real two-page spreads across the fold, turns pages with a physical page curl, plays soft paper sounds, and uses eye tracking for subtle haptics.",
    purpose:
      "Foldables finally give you a book-shaped screen, but most readers just stretch one page across it. I wanted reading comics on a foldable to feel like holding a book.",
    steps: [
      { h: "Fold-aware spreads", p: "Pages lay out as left and right halves that respect the fold, so spreads read the way the artist drew them." },
      { h: "Page curl and sound", p: "Turning a page bends it like paper, with a matching paper sound." },
      { h: "Eye-tracked haptics", p: "Gaze tracking adds light haptic feedback as you read." },
      { h: "Next up", p: "Series and Up Next, OPDS/Komga library sources, a Continue Reading widget, and reading streaks." },
    ],
    results: [
      "Page curl, paper sounds and eye-tracked haptics are built and working in the simulator.",
      "How the sound, haptics and gaze tracking feel still needs testing on a real device.",
    ],
    stack: ["Swift", "SwiftUI", "iOS", "ARKit"],
    links: [],
  },
  {
    slug: "shorts-autopilot",
    title: "Shorts autopilot",
    kind: "project",
    year: "2026",
    role: "Solo",
    status: "Private. It makes the videos for my YouTube channel.",
    oneLiner: "Type an idea, get a finished YouTube Short.",
    summary:
      "A pipeline that turns an AI or tech topic into a finished vertical video: it writes the script, voices it, finds matching footage, renders it with word-by-word captions, and publishes it to YouTube with one click.",
    purpose:
      "Making a good Short by hand takes hours of scripting, recording and editing. I wanted to spend my time on ideas and let a pipeline do the rest, then use my channel to learn what people actually watch.",
    steps: [
      { h: "Topic", p: "Pulls live AI and tech headlines from Google News and Hacker News, or takes your own idea." },
      { h: "Script", p: "Writes one tight 30 to 45 second script, with a tone picked per video so the channel can learn which one works." },
      { h: "Hook", p: "Offers three opening hooks; you pick one and the script is rewritten to open with it." },
      { h: "Voice", p: "Voices it with ElevenLabs and word-level timestamps, with an offline voice as a fallback." },
      { h: "Footage", p: "Searches stock footage per line and scores candidates on aspect ratio, resolution and length." },
      { h: "Render and publish", p: "Builds the 1080x1920 video with karaoke captions, then uploads it to YouTube with a title, description and tags." },
    ],
    results: ["Powers @ai_reveal_tech: 376 subscribers and 392k+ views across 229 videos."],
    stack: ["Python", "LLMs", "ElevenLabs", "ffmpeg", "YouTube API"],
    links: [{ label: "@ai_reveal_tech on YouTube", href: "https://www.youtube.com/@ai_reveal_tech" }],
  },
  {
    slug: "jobpilot",
    title: "JobPilot",
    kind: "project",
    year: "2026",
    role: "Solo",
    status: "Private. Runs daily.",
    oneLiner: "New AI and startup job postings, every morning.",
    summary:
      "A small tool that checks AI company and startup job boards every day, keeps track of what's new, and shows only fresh postings on a simple dashboard.",
    purpose: "The best roles at fast-moving companies fill quickly. Seeing them the day they go up matters more than seeing all of them.",
    steps: [
      { h: "Discover", p: "Checks job boards at AI companies and startups on a schedule." },
      { h: "Track", p: "Stores every posting so it can tell what's genuinely new since yesterday." },
      { h: "Review", p: "A dashboard lists only new postings. I read and apply myself." },
    ],
    results: ["Runs every day from my machine."],
    stack: ["Python", "FastAPI", "SQLite", "LLMs"],
    links: [],
  },
  {
    slug: "livekit-fix",
    title: "LiveKit fix",
    kind: "open source",
    year: "2026",
    role: "Contributor",
    status: "Pull request #4876, submitted.",
    oneLiner: "Why older ESP32 devices couldn't connect.",
    summary:
      "The LiveKit server was silently dropping SCTP INIT packets from older ESP32 clients, so their data channels never came up. I traced the root cause and submitted a fix.",
    purpose: "Silent failures are the worst kind: nothing errors, the device just never connects. Tracking this one down meant reading code and specs until the dropped packets made sense.",
    steps: [
      { h: "Reproduce", p: "Worked through a large, unfamiliar Go codebase to find where the packets were being dropped." },
      { h: "Trace it", p: "Followed the problem across LiveKit, Pion WebRTC and the RFC 8832 and RFC 8841 specs." },
      { h: "Fix", p: "Created subscriber data channels for publisher-primary clients and added SCTP diagnostic logging." },
      { h: "Prove it", p: "Added three regression tests and wrote up the problem and trade-offs for the maintainers." },
    ],
    results: ["A 162-line pull request with three regression tests, to a 20.9k-star repo."],
    stack: ["Go", "WebRTC", "SCTP", "DTLS"],
    links: [{ label: "PR #4876 on GitHub", href: "https://github.com/livekit/livekit/pull/4876" }],
  },
  {
    slug: "claude-cost-proxy",
    title: "claude-cost-proxy",
    kind: "project",
    year: "2026",
    role: "Solo",
    status: "Open source.",
    oneLiner: "See what every Claude Code request costs.",
    summary:
      "An HTTP proxy that sits between Claude Code and Anthropic. It forwards requests unchanged, logs tokens, latency and dollar cost for each one, and caches responses that are safe to reuse.",
    purpose: "Coding agents make a lot of API calls, and the bill is hard to read. I wanted per-request costs and an easy way to stop paying twice for the same answer.",
    steps: [
      { h: "Set up once", p: "A setup command stores your API key and points Claude Code at the proxy." },
      { h: "Track", p: "Every request is logged with tokens, latency and USD cost." },
      { h: "Cache", p: "Responses without tool use are cached and served again when the request and files are unchanged." },
      { h: "Report", p: "A summary command shows daily and weekly spend and savings." },
    ],
    results: ["Works with Claude Code with no change to how you use it."],
    stack: ["Python", "LLMs", "HTTP proxy"],
    links: [{ label: "GitHub", href: "https://github.com/KushagraKanaujia/claude-cost-proxy" }],
    repo: "claude-cost-proxy",
  },
  {
    slug: "codemind",
    title: "codemind",
    kind: "project",
    year: "2026",
    role: "Solo",
    status: "Open source.",
    oneLiner: "Semantic code search that explains itself.",
    summary:
      "A code search engine that understands what code does, not just what it's named. It finds implementations, ranks them against your criteria, and explains the trade-offs. It can also generate tests for AI systems and suggest fixes.",
    purpose: "Keyword search finds names, not ideas. I wanted to ask for 'a rate limiter that handles bursts' and get ranked, explained answers.",
    steps: [
      { h: "Search", p: "Semantic search over a library of 203 code examples across algorithms, data structures and web dev." },
      { h: "Rank and explain", p: "Claude ranks results by your criteria and shows why." },
      { h: "Test", p: "Generates test cases for AI systems, finds failures, and suggests improvements in a loop." },
    ],
    results: ["Full stack: FastAPI backend, React frontend, Supabase storage."],
    stack: ["Python", "FastAPI", "React", "Supabase", "LLMs"],
    links: [{ label: "GitHub", href: "https://github.com/KushagraKanaujia/codemind" }],
    repo: "codemind",
  },
  {
    slug: "mini-companion",
    title: "mini-companion",
    kind: "project",
    year: "2026",
    role: "Solo",
    status: "Open source.",
    oneLiner: "An AI companion that remembers you.",
    summary:
      "A chat companion with long-term memory, adjustable personality, several conversation modes, and real-time voice calls with live transcription. It can run on local models for free, private chat.",
    purpose: "Most chatbots forget you the moment the tab closes. I wanted to see what conversation feels like when it remembers.",
    steps: [
      { h: "Memory", p: "Stores past conversations in Supabase so it remembers you over time." },
      { h: "Personality", p: "Tunable traits and modes: casual, vent, playful, advice." },
      { h: "Voice", p: "Real-time voice calls with live transcription in the browser." },
      { h: "Private by default", p: "Runs on local Ollama models, or Gemini Flash." },
    ],
    results: ["Your data can be exported as JSON at any time."],
    stack: ["TypeScript", "Next.js", "React", "Supabase", "Ollama"],
    links: [{ label: "GitHub", href: "https://github.com/KushagraKanaujia/mini-companion" }],
    repo: "mini-companion",
  },
  {
    slug: "streamfinder",
    title: "StreamFinder",
    kind: "project",
    year: "2025",
    role: "Solo",
    status: "Live demo.",
    oneLiner: "One search for movies, shows and YouTube.",
    summary:
      "A video search tool that looks across streaming platforms and YouTube at once, shows where something is available to stream, and recommends what to watch next.",
    purpose: "Finding something to watch means checking five apps. I wanted one search box.",
    steps: [
      { h: "Search everywhere", p: "Movies and shows from TMDB plus YouTube videos and Shorts in one place." },
      { h: "Where to watch", p: "Detects which platforms carry each title." },
      { h: "Recommend", p: "A multi-factor algorithm weighs genre, cast, director and ratings." },
      { h: "Fast", p: "Cached results and a local watchlist." },
    ],
    results: ["Live on Vercel."],
    stack: ["Python", "FastAPI", "React", "TMDB API", "YouTube API"],
    links: [
      { label: "Live demo", href: "https://streamfinder-app.vercel.app" },
      { label: "GitHub", href: "https://github.com/KushagraKanaujia/streamfinder" },
    ],
    repo: "streamfinder",
  },
  {
    slug: "visual-layer",
    title: "Visual Layer",
    kind: "work",
    year: "2025 — 26",
    role: "Full stack software engineer · UCSB capstone",
    status: "Completed March 2026.",
    oneLiner: "Finding mislabeled images in a 1.2M+ image dataset.",
    summary:
      "For my capstone with Visual Layer, I built an end-to-end data quality system that finds mislabeled training data and flags unreliable model outputs before they reach production.",
    purpose: "Bad labels quietly make models worse. At a million-plus images, nobody can check them by hand.",
    steps: [
      { h: "Train", p: "Trained Vision Transformer and ResNet models in PyTorch on 1.2M+ images." },
      { h: "Detect", p: "Applied noise-injection techniques to surface mislabeled data and triage unreliable outputs." },
      { h: "Profile", p: "Profiled inference latency with perf to find the real bottleneck." },
      { h: "Speed up", p: "Wrote custom C++ pool allocators and tracked down a rare concurrency bug under parallel load." },
    ],
    results: ["Processing latency cut by 50%."],
    stack: ["PyTorch", "C++", "Python", "perf"],
    links: [],
  },
  {
    slug: "dawdle",
    title: "Dawdle",
    kind: "work",
    year: "2025",
    role: "Software engineering intern",
    status: "Summer 2025.",
    oneLiner: "An LLM chatbot for 1,000+ daily users.",
    summary: "Built full-stack features for a production consumer app on AWS, including an LLM chatbot on the Anthropic API that helped 1,000+ daily users make sense of information faster.",
    purpose: "Users had a lot of information to get through; a good assistant made it quicker and more accurate.",
    steps: [
      { h: "Build", p: "Shipped features in React, TypeScript and Go." },
      { h: "Integrate", p: "Added the LLM chatbot on the Anthropic API." },
      { h: "Debug", p: "Traced a 40% latency regression to a serialization bottleneck in the networking layer." },
      { h: "Fix and hold", p: "Shipped an async fix and added automated tests to keep it fixed." },
    ],
    results: ["40% latency regression fixed.", "18% lift in user retention measured after the fix."],
    stack: ["React", "TypeScript", "Go", "AWS", "LLMs"],
    links: [],
  },
  {
    slug: "smartshore",
    title: "Smartshore",
    kind: "work",
    year: "2024",
    role: "Software engineering intern · New York",
    status: "Summer 2024.",
    oneLiner: "Backend reliability for 100,000+ concurrent users.",
    summary: "Worked on a distributed Java and Python backend processing signals for 100,000+ concurrent users in a regulated financial-services environment.",
    purpose: "In finance, a slow or flaky backend is a business problem, not just a technical one.",
    steps: [
      { h: "Bridge", p: "Worked between senior engineers and business stakeholders, delivering hourly p99 latency analysis." },
      { h: "Find", p: "Analyzed system logs and found a connection pool leak." },
      { h: "Fix", p: "Resolved it and improved response time." },
      { h: "Watch", p: "Built monitoring dashboards to flag similar issues early." },
    ],
    results: ["22% faster response times."],
    stack: ["Java", "Python", "distributed systems", "monitoring"],
    links: [],
  },
];

export const bySlug = (s: string) => STORIES.find((x) => x.slug === s);
export const byRepo = (r: string) => STORIES.find((x) => x.repo === r);
