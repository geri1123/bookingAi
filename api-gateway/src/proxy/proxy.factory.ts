import { createProxyMiddleware } from "http-proxy-middleware";
import { ServiceRoute } from "../config/gateway.config";

export function createServiceProxy(route: ServiceRoute) {
  return createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    pathFilter: route.prefix,
    pathRewrite: { [`^${route.prefix}`]: "" },
    on: {
      proxyReq: (proxyReq, req) => {
        const forwardedFor = req.headers["x-forwarded-for"];
        const clientIp = req.socket.remoteAddress ?? "";
        proxyReq.setHeader("x-forwarded-for", forwardedFor ? `${forwardedFor}, ${clientIp}` : clientIp);
      },
      error: (err, _req, res) => {
        console.error(`[gateway] Proxy error për ${route.prefix} -> ${route.target}:`, err.message);
        if ("writeHead" in res && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
        }
        res.end(JSON.stringify({ success: false, code: "UPSTREAM_UNAVAILABLE" }));
      },
    },
  });
}
