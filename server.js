require('dotenv').config(); // Load environment variables

const fs = require('fs');
const http = require('http'); // Import http for redirection
const https = require('https');
const next = require('next');
const cron = require('node-cron'); // <-- Add cron
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: false });
const handle = app.getRequestHandler();

// Function to call the API endpoint
function callPollAiEndpoint() {
  https.get('https://held-accountable.com/api/poll_ai', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] Called /api/poll_ai: ${res.statusCode}`);
    });
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Error calling /api/poll_ai:`, err.message);
  });
}

function callViralDetectionEndpoint() {
  https.get('https://held-accountable.com/api/viral_detection', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] Called /api/viral_detection: ${res.statusCode}`);
    });
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Error calling /api/viral_detection:`, err.message);
  });
}

app.prepare().then(() => {
  // Redirect from HTTP to HTTPS
  http.createServer((req, res) => {
    const host = req.headers['host'];
    const redirectUrl = `https://held-accountable.com`;
    res.writeHead(301, { Location: redirectUrl });
    res.end();
  }).listen(80, () => {
    console.log('> HTTP server listening on port 80 and redirecting to HTTPS');
  });

  // Start HTTPS server
  https.createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/held-accountable.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/held-accountable.com/fullchain.pem'),
    },
    (req, res) => {
      handle(req, res);
    }
  ).listen(443, (err) => {
    if (err) throw err;
    console.log('> Ready on https://held-accountable.com');

    // Start polling every 15 minutes
    callPollAiEndpoint(); // Call immediately on startup
    setInterval(callPollAiEndpoint, 5 * 60 * 1000); // Every 15 minutes
    cron.schedule('30 11 * * *', () => {
      console.log(`[${new Date().toISOString()}] Triggering daily viral detection task...`);
      callViralDetectionEndpoint();
    });
  });
});
