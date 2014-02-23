var http = require('http');
var send = require('send');
var url = require('url');
var _ = require('underscore');
var constants = require('./public/js/constants');

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

var io = require('socket.io').listen(app, {log: false});


var players = [];
players[0] = {
  connected: false
};
players[1] = {
  connected: false
};

var actionQueue = [];

io.sockets.on('connection', function(socket) {
  console.log("Connection established!");
  if (players[0].connected && players[1].connected) {
    console.log('More than two connections received');
    socket.disconnect();
    return;
  }
  else {
    var player = players[0].connected ? players[1] : players[0];
    player.id = players[0].connected ? 1 : 0;
    player.connected = true;
    console.log("Assigned ID: " + player.id);
    socket.emit('assignID', player.id); 
    player.connection = socket;
    if (players[0].connected && players[1].connected) {
      runGame();
    }
  }

  socket.on('disconnect', function() {
    _.each(players, function(player) {
      player.connected = player.socket != null;
    });
  });

  socket.on('move', function(data) {
    actionQueue.push(data);
  });
});

function initGame() {
  _.each(players, function(player) {
    player.connection.emit("ready");
    player.position = constants.PADDLE_START_Y;
  });
}

/**
 * Computes the simulation for a single server tick by processing all actions
 * received in the action queue and updating the server's internal model of the
 * game.
 */
function computeServerTick() {
  _.each(actionQueue, function(action) {
    var player = action.id == 0 ? players[0] : players[1];
    if (player.position != action.position) {
      console.log("WARNING: Client state is inconsistent with server state. " + player.position + " " + action.position);
    }
    if (action.direction == constants.DirectionEnum.UP) {
      player.position -= constants.MOVE_DISTANCE;
    }
    else if (action.direction == constants.DirectionEnum.DOWN) {
      player.position += constants.MOVE_DISTANCE;
    }

    if (player.position < 0) {
      player.position = 0;
    }
    else if (player.position + constants.PADDLE_HEIGHT > constants.GAME_HEIGHT) {
      player.position = constants.GAME_HEIGHT - constants.PADDLE_HEIGHT;
    }
  });
  // Now that we've processed the queue, empty it
  actionQueue = [];
}

function sendSnapshot() {
  players[0].connection.emit("snapshot", {'id': 1, 'position': players[1].position});
  players[1].connection.emit("snapshot", {'id': 0, 'position': players[0].position});
}

function runGame() {
  initGame();
  setInterval(computeServerTick, constants.SERVER_TICK_RATE);
  setInterval(sendSnapshot, constants.SERVER_SNAPSHOT_RATE);
}
