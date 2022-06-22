const PROXY_CONFIG = [
  {
    context: [
      "/VirtualSports",
      "/Match",
      "/SportBook",
      "/BetTypes",
      "/Home",
      "/Misc",
      "/Tickets",
      "/Gaming",
      "/Content",
      "/History",
      "/MessageTemplate",
      "/TicketVoidingSystem",
      "/TicketVoiding",
      "/Utility",
      "/state-api",
      "/Scripts",
      "/signalr"
    ],
    target: "https://localhost:44312/",
    secure: true
  }
]

module.exports = PROXY_CONFIG;