const https = require("https");
const http = require("http");

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const endpoint = event.queryStringParameters?.endpoint;
  if (!endpoint) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing endpoint parameter" }),
    };
  }

  const allowedPaths = [
    /^\/api\/v1\.1\/exchange$/,
    /^\/api\/v1\/prices$/,
    /^\/api\/v1\/auctions$/,
    /^\/api\/v1\/nfts$/,
    /^\/api\/v1\/land\/[\w-]+$/,
    /^\/api\/v1\.1\/land\/[\w-]+$/,
    /^\/api\/v1\/land\/info\/(nft_id|username|farm_id)\/[\w-]+$/,
  ];

  const isAllowed = allowedPaths.some((pattern) => pattern.test(endpoint));
  if (!isAllowed) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: "Endpoint not allowed" }),
    };
  }

  const url = `https://sfl.world${endpoint}`;

  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "SFL-Advisor/1.0",
          Accept: "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers,
            body: data,
          });
        });
      }
    );

    req.on("error", (err) => {
      resolve({
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message }),
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        statusCode: 504,
        headers,
        body: JSON.stringify({ error: "Request timeout" }),
      });
    });
  });
};
