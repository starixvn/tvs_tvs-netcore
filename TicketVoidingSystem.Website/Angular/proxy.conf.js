const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/state-api",
      "/SignalR",
      "/css",
      "/js",
      "/lib"
    ],
    target: "https://localhost:44312/",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
    ws: true
  }
]

module.exports = PROXY_CONFIG;