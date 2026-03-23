const https = require("https");

const ALLOWED = [
  /^\/api\/v1\.1\/exchange$/,
  /^\/api\/v1\/prices$/,
  /^\/api\/v1\/auctions$/,
  /^\/api\/v1\/nfts$/,
  /^\/api\/v1\/land\/[\w-]+$/,
  /^\/api\/v1\.1\/land\/[\w-]+$/,
  /^\/api\/v1\/land\/info\/(nft_id|username|farm_id)\/[\w-]+$/,
];

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();

  const endpoint = req.query.endpoint;
  if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

  const allowed = ALLOWED.some((r) => r.test(endpoint));
  if (!allowed) return res.status(403).json({ error: "Endpoint not allowed" });

  const url = `https://sfl.world${endpoint}`;

  return new Promise((resolve) => {
    const request = https.get(
      url,
      { headers: { "User-Agent": "SFL-Advisor/1.0", Accept: "application/json" } },
      (upstream) => {
        let data = "";
        upstream.on("data", (chunk) => (data += chunk));
        upstream.on("end", () => {
          res.status(upstream.statusCode).send(data);
          resolve();
        });
      }
    );

    request.on("error", (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });

    request.setTimeout(10000, () => {
      request.destroy();
      res.status(504).json({ error: "Timeout" });
      resolve();
    });
  });
};
