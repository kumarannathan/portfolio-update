// Page view + download click counters for /countertop, stored in Netlify Blobs.
//   POST /api/countertop/hit    body: {"event":"view"|"download"}
//   GET  /api/countertop/stats?key=<STATS_KEY>   -> totals + last 30 days
import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

type Counts = Record<string, number>;
const EVENTS = new Set(["view", "download"]);
const STORE = "countertop-stats";
const KEY = "counts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req: Request, _ctx: Context) => {
  const url = new URL(req.url);
  const store = getStore(STORE);

  if (url.pathname.endsWith("/hit")) {
    if (req.method !== "POST") return json({ error: "POST only" }, 405);
    let event = "";
    try {
      const body = await req.json();
      event = String(body?.event ?? "");
    } catch {
      return json({ error: "bad json" }, 400);
    }
    if (!EVENTS.has(event)) return json({ error: "unknown event" }, 400);

    const day = new Date().toISOString().slice(0, 10);
    const counts = ((await store.get(KEY, { type: "json" })) as Counts | null) ?? {};
    counts[`total:${event}`] = (counts[`total:${event}`] ?? 0) + 1;
    counts[`day:${day}:${event}`] = (counts[`day:${day}:${event}`] ?? 0) + 1;
    await store.setJSON(KEY, counts);
    return json({ ok: true });
  }

  if (url.pathname.endsWith("/stats")) {
    const secret = Netlify.env.get("STATS_KEY");
    if (secret && url.searchParams.get("key") !== secret) return json({ error: "nope" }, 401);

    const counts = ((await store.get(KEY, { type: "json" })) as Counts | null) ?? {};
    const days: Record<string, { view: number; download: number }> = {};
    for (const [k, v] of Object.entries(counts)) {
      const m = k.match(/^day:(\d{4}-\d{2}-\d{2}):(view|download)$/);
      if (!m) continue;
      days[m[1]] ??= { view: 0, download: 0 };
      days[m[1]][m[2] as "view" | "download"] = v;
    }
    const recent = Object.keys(days).sort().slice(-30).reduce((o, d) => ((o[d] = days[d]), o), {} as typeof days);
    return json({
      views: counts["total:view"] ?? 0,
      downloads: counts["total:download"] ?? 0,
      last30Days: recent,
    });
  }

  return json({ error: "not found" }, 404);
};

export const config: Config = {
  path: ["/api/countertop/hit", "/api/countertop/stats"],
};
