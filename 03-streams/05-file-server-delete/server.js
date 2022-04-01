const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if ( pathname.indexOf('/') !== -1 ) {
    res.statusCode = 400;
    res.end('Nesting is not allowed');
    return;
  }

  if (! fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('File is not exist');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.rm(filepath, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('Filesystem error: ' + err.toString());
        }
        res.statusCode = 200;
        res.end('OK');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
