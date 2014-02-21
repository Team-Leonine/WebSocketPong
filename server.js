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

var PADDLE_HEIGHT = 100;
var GAME_HEIGHT = 600;
var PADDLE_START_Y = 250;

var paddleY = PADDLE_START_Y;


io.sockets.on('connection', function(socket) {
  console.log("Connection established!");

  socket.on('keyPressed', function(data) {
    console.log("Player pressed " + data + " key.");

    if (data === "up") {
      paddleY -= 10;
    }
    else if (data === "down") {
      paddleY += 10;
    }

    checkBounds();
    socket.emit('positionUpdate', paddleY);
  });

  function checkBounds() {
    if (paddleY + PADDLE_HEIGHT > GAME_HEIGHT) {
      paddleY = GAME_HEIGHT - PADDLE_HEIGHT;
    }
    else if (paddleY < 0) {
      paddleY = 0;
    }
  };
});


