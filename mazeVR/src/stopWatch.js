
var StopWatch = function () {
  var start = null;
  var elapased = 0;
  var reqId = null;

  function tick (timestamp) {
    if (!start) {
      start = timestamp;
    }

    elapased = Math.floor(timestamp - start);
    reqId = window.requestAnimationFrame(tick);
  }

  this.init = function () {
    console.log('init');
    start = null;
    tick();
  };

  this.stop = function () {
    if (reqId) {
      setTimeout(function() { 
        window.cancelAnimationFrame(reqId);
        reqId = null;
      }, 1);
    }
  };

  this.getElapsedTime = function () {
    return elapased;
  };

  this.getFormatedElapsedTime = function () {
    var sec = Math.floor(elapased / 1000);
    var ms = elapased - sec * 1000;
    var minute = Math.floor(sec / 60);
    var result = {};

    sec = sec - minute * 60;
    result['min'] = minute;
    result['sec'] = sec;
    result['ms'] = ms;

    return result;
  };

  this.showElapsedTime = function (stopWatchItem) {
    var items = stopWatchItem.children;
    var elapsedTime = this.getFormatedElapsedTime();

    // Display as-> mm mm:ss ss:ms ms ms
    var t = 0;
    var item = null;
    var t0, t1, t2, t3, t4, t5, t6;

    for (var i = 0; i < items.length; i++) {
      switch (i) {
        case 0:
          t0 = Math.floor(elapsedTime['min'] / 10);
          t = t0;
          break;
        case 1:
          t1 = elapsedTime['min'] - t0 * 10;
          t = t1;
          break;
        case 2:
          t2 = Math.floor(elapsedTime['sec'] / 10);
          t = t2;
          break;
        case 3:
          t3 = elapsedTime['sec'] - t2 * 10;
          t = t3;
          break;
        case 4:
          t4 = Math.floor(elapsedTime['ms'] / 100);
          t = t4;
          break;
        case 5:
          t5 = Math.floor(elapsedTime['ms'] / 10) - t4 * 10;
          t = t5;
          break;
        case 6:
          t6 = elapsedTime['ms'] % 100;
          t = t6;
          break;
      }

      item = items['' + i];
      // texture offset can't be updated in real-time, and the map in three.js object will be equal
      // while the src are the same. So, I separate them to different images.
      var material = item.object3DMap.mesh.material;
      material.map.offset.x = t * 0.1;
    }
  };
};
