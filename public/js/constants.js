if (typeof exports == 'undefined') {
  var exports = this['constants'] = {}
}

exports.PADDLE_HEIGHT = 100;
exports.PADDLE_WIDTH = 25;
exports.PADDLE_START_Y = 250;
exports.DirectionEnum = Object.freeze({
  UP: "up",
  DOWN: "down",
  IDLE: "idle"
});
exports.PADDLE_MOVE_SPEED = 600 / 1000;
exports.MOVE_DURATION = 10;
exports.FRAMES_PER_SECOND = 60;
exports.FRAMES_PER_MOVE = Math.ceil(exports.MOVE_DURATION / exports.FRAMES_PER_SECOND);
exports.MOVE_DISTANCE = exports.PADDLE_MOVE_SPEED * exports.MOVE_DURATION;
exports.DISTANCE_PER_FRAME = exports.MOVE_DISTANCE / exports.FRAMES_PER_MOVE;
