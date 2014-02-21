var http = require('http');
var send = require('send');
var url = require('url');

var app = http.createServer(function(req, res) {

  function error(err) {
    res.statusCode = err.status || 500;
    res.end(err.message);
  }

  function redirect() {
    res.statusCode = 301;
    res.setHeader('Location', req.url + '/');
    res.end('Redirecting to ' + req.url + '/');
  }

  send(req, url.parse(req.url).pathname)
    .root('public')
    .on('error', error)
    .on('directory', redirect)
    .pipe(res);
}).listen(3000);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
  console.log("Connection established!");
  socket.on('upPressed', function(socket) {
    console.log("Player pressed up key.");
  });
  socket.on('downPressed', function(socket) {
    console.log("Player pressed down key.");
  });
});


