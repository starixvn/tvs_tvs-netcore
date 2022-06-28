const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/signalr"
    ],
    target: "https://localhost:44312/",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
  }
]

module.exports = PROXY_CONFIG;