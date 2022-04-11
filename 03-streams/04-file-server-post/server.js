const url = require('url');
const http = require('http');
const path = require('path');
const fs =require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

fs.mkdirSync(path.join(__dirname, 'files'), {recursive: true});

server.on('request', (req, res) => {

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('Nesting is not allowed.');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File is already exist.');
    return;
  }

  switch (req.method) {
    case 'POST':

      const writebleStream = fs.createWriteStream(filepath);
      const limitedStream = new LimitSizeStream({limit: 1024*1024});

      req.pipe(limitedStream)
          .on('error', (err) => {
            writebleStream.destroy();
            fs.rmSync(filepath);
            res.statusCode = 413;
            res.end('Too large');
          }).pipe(writebleStream);

      req.on('end', () => {
        res.statusCode = 201;
        res.end('OK');
      });

      req.on('aborted', () => {
        writebleStream.destroy();
        fs.rmSync(filepath);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
