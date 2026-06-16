const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const DIST = path.join(__dirname, 'dist');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let filePath = path.join(DIST, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: serve index.html for unknown routes
      fs.readFile(path.join(DIST, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
      res.end(data);
    }
  });
}).listen(PORT, () => {
  console.log('Qinghe app running at http://localhost:' + PORT);
});
