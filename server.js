require("dotenv").config();
// const http = require("http");

const http = require("http");
const https = require("https");
const { createProxyServer } = require("http-proxy");

function callPollAiEndpoint() {
  https
    .get("https://held-accountable.com/api/poll_ai", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(
          `[${new Date().toISOString()}] Called /api/poll_ai: ${res.statusCode}`
        );
      });
    })
    .on("error", (err) => {
      console.error(
        `[${new Date().toISOString()}] Error calling /api/poll_ai:`,
        err.message
      );
    });
}

// Proxy server: проксирует все запросы на next.js dev server (localhost:3001)

const proxy = createProxyServer({ target: "http://localhost:3001", ws: true });

http
  .createServer((req, res) => {
    proxy.web(req, res);
  })
  .listen(3000, () => {
    console.log("> Proxy server ready on http://localhost:3000");
    callPollAiEndpoint();
    setInterval(callPollAiEndpoint, 3 * 60 * 1000);
  });
