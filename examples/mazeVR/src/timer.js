var Timer = function (stopTime = 0) {  // endTime: millisecond
  var start = null;
  var elapased = null;
  var endTime = stopTime;

  function tick (timestamp) {
    if (!start) start = timestamp;
    elapased = Math.floor(timestamp - start);  // Our unit is millisecond.

    window.requestAnimationFrame(tick);
  }

  this.init = function () {
    window.requestAnimationFrame(tick);
  };

  // Return elapased time in millisecond
  this.getLastTime = function () {
    return (endTime - elapased);
  };

  this.getFormatedLastTime = function () {
    var timeRest = endTime - elapased;

    if (timeRest <= 0) {
      return '' + 0 + ': ' + 0 + ': ' + 0;
    }

    var sec = Math.floor(timeRest / 1000);
    var ms = timeRest - sec * 1000;
    var minute = Math.floor(sec / 60);
    sec = sec - minute * 60;
    var result = '' + minute + ': ' + sec + ': ' + ms;

    return result;
  };
};

Timer();

