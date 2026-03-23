const https = require("https");

const ALLOWED_SFL = [
  /^\/api\/v1\.1\/exchange$/,
  /^\/api\/v1\/prices$/,
  /^\/api\/v1\/auctions$/,
  /^\/api\/v1\/nfts$/,
  /^\/api\/v1\/land\/[\w-]+$/,
  /^\/api\/v1\.1\/land\/[\w-]+$/,
  /^\/api\/v1\/land\/info\/(nft_id|username|farm_id)\/[\w.-]+$/,
];

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(12000, () => { req.destroy(); reject(new Error("Timeout")); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // ── ANTHROPIC PROXY (POST /api/proxy?type=ai) ──────────────────────────
  if (req.method === "POST" && req.query.type === "ai") {
    try {
      let body = "";
      await new Promise((resolve) => {
        req.on("data", (c) => (body += c));
        req.on("end", resolve);
      });

      const result = await fetchUrl("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body,
      });

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.body);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── SFL.WORLD PROXY (GET /api/proxy?endpoint=...) ─────────────────────
  const endpoint = req.query.endpoint;
  if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

  const allowed = ALLOWED_SFL.some((r) => r.test(endpoint));
  if (!allowed) return res.status(403).json({ error: "Endpoint not allowed" });

  try {
    const result = await fetchUrl(`https://sfl.world${endpoint}`, {
      method: "GET",
      headers: { "User-Agent": "SFL-Advisor/1.0", Accept: "application/json" },
    });

    res.setHeader("Content-Type", "application/json");
    return res.status(result.status).send(result.body);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
