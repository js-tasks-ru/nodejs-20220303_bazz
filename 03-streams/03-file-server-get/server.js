const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const outputStatusCode = res.statusCode = getStatusCode(pathname, filepath);
      if ( outputStatusCode === 200 ) {
        res.setHeader("Content-Type", "application/octet-stream");
        const readStream = fs.createReadStream(filepath);
        readStream.pipe(res);
        res.on('close', () => {
          readStream.destroy();
        });
      } else {
        res.end('Internal programmer error O_o');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function getStatusCode(pathname, filepath) {
  let statusCode = 500;
  if ( pathname.indexOf('/') !== -1 ) {
    statusCode = 400;
  }
  if ( pathname.indexOf('.') !== -1 ) {
    if ( fs.existsSync(filepath) ) {
      statusCode = 200;
    } else {
      statusCode = 404;
    }
  }
  return statusCode;
}

module.exports = server;
