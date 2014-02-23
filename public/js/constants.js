if (typeof exports == 'undefined') {
  var exports = this['constants'] = {}
}

// Game Constants
exports.PADDLE_HEIGHT = 100;
exports.PADDLE_WIDTH = 25;
exports.PADDLE_START_Y = 250;
exports.DirectionEnum = Object.freeze({
  UP: "up",
  DOWN: "down",
  IDLE: "idle"
});
// How fast the paddles should move in pixels/millisecond
exports.PADDLE_MOVE_SPEED = 600 / 1000;
exports.GAME_HEIGHT = 600;
exports.GAME_WIDTH = 800;

/* Client Constants */
// How long a move should take in milliseconds
exports.MOVE_DURATION = 10;
exports.FRAMES_PER_SECOND = 60;
exports.FRAMES_PER_MOVE = Math.ceil(exports.MOVE_DURATION / exports.FRAMES_PER_SECOND);
exports.MOVE_DISTANCE = exports.PADDLE_MOVE_SPEED * exports.MOVE_DURATION;
exports.DISTANCE_PER_FRAME = exports.MOVE_DISTANCE / exports.FRAMES_PER_MOVE;

/* Server Constants */
// The tick rate of the server simulation steps in milliseconds
exports.SERVER_TICK_RATE = 15;
// How often the server sends snapshots to the clients in milliseconds
exports.SERVER_SNAPSHOT_RATE = 10;
