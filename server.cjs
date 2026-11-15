/**
 * CareCircle Production Web & API Server for Google Cloud Run
 * Listens on process.env.PORT (default 8080) and 0.0.0.0
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. Google Cloud Run Health Check Probe (/healthz & /api/health)
  if (pathname === '/healthz' || pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    res.end(
      JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'carecircle-cloud-run',
        version: '1.0.0',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'carecircle-4ec05',
      })
    );
    return;
  }

  // 2. 1-Tap Action Link Endpoint (/action or /api/action)
  if (pathname === '/api/action' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const { token } = JSON.parse(body || '{}');
        if (!token) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Missing token' }));
          return;
        }

        // Return acknowledged status
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Action token processed' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: String(err) }));
      }
    });
    return;
  }

  // 3. Static File Serving from /dist
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      // Cache assets for 1 year, HTML for 0
      const cacheControl =
        ext === '.html'
          ? 'no-cache, must-revalidate'
          : 'public, max-age=31536000, immutable';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // 4. SPA Fallback: Serve index.html for all client routes
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('CareCircle dist bundle not found. Please run npm run build.');
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        });
        res.end(content);
      });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[CareCircle Cloud Run] Server listening on http://${HOST}:${PORT}`);
  console.log(`[CareCircle Cloud Run] Serving static assets from ${DIST_DIR}`);
  console.log(`[CareCircle Cloud Run] Health check active at http://${HOST}:${PORT}/healthz`);
});

// Graceful shutdown on Cloud Run SIGTERM
process.on('SIGTERM', () => {
  console.log('[CareCircle Cloud Run] SIGTERM received. Closing HTTP server gracefully...');
  server.close(() => {
    console.log('[CareCircle Cloud Run] Server closed. Exiting process.');
    process.exit(0);
  });
});

