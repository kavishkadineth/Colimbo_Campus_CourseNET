const http = require('http');
http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    console.log("RECEIVED ERROR:", body);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('OK');
  });
}).listen(9999, () => console.log('Listening on 9999'));
