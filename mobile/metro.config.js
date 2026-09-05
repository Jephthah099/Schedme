// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require("expo/metro-config");
const http = require("http");

const config = getDefaultConfig(__dirname);

const API_PORT = 4000;

// Proxies /api/* through Metro's own dev server so the Express API is reachable
// over the same connection Expo Go uses for the JS bundle (LAN address or tunnel
// host alike) — no separate tunnel/port for the backend needed.
function proxyToApi(req, res) {
  const proxyReq = http.request(
    {
      hostname: "localhost",
      port: API_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );
  proxyReq.on("error", (err) => {
    res.writeHead(502);
    res.end("API proxy error: " + err.message);
  });
  req.pipe(proxyReq, { end: true });
}

const originalEnhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (metroMiddleware, metroServer) => {
  const base = originalEnhanceMiddleware
    ? originalEnhanceMiddleware(metroMiddleware, metroServer)
    : metroMiddleware;
  return (req, res, next) => {
    if (req.url && req.url.startsWith("/api/")) {
      return proxyToApi(req, res);
    }
    return base(req, res, next);
  };
};

module.exports = config;
