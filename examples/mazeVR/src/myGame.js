// var timer = require('./timer.js');
// var mapGenerator1 = require('./mapGenerator');

function MyGame () {
  var score = 0;
  var bStart = false;
  var bFinish = false;
  var stopWatch = new StopWatch();
  var totalBall = 0;

  function ballHit (e) {
    console.log('Ball hit......');
    score += 100;

    if (score === totalBall * 100) {
      bStart = false; // Finish the game.
      bFinish = true;
      console.log('Game is finished...');
    }
  }

  function radianToDegree (rad) {
    const k = 180 / Math.PI;
    return rad * k;
  }

  function gameStart () {
    bStart = true;
    bFinish = false;
    score = 0;

    var gameClearBtn = document.querySelector('#gameClearButton');
    gameClearBtn.setAttribute('visible', false);

    stopWatch = new StopWatch();

    // While game start, give hovered animation.
    var balls = document.querySelectorAll('.enemy');
    totalBall = balls.length;
    for (var i = 0; i < totalBall; ++i) {
      var ball = balls[i];
      ball.lastElementChild.data.begin = 'hovered';
    }
  }

  function gameStop () {
    // Make playbutton face to the camera
    var playBtn = document.querySelector('#playButton');
    var gameClearBtn = document.querySelector('#gameClearButton');
    var camera = document.querySelector('#camera');
    var cameraPos = camera.object3D.position;
    var cameraRotate = camera.object3D.rotation;
    var cameraMtx = camera.object3D.matrix.elements;
    var lookAtVector = new THREE.Vector3(-cameraMtx[8], -cameraMtx[9], -cameraMtx[10]);
    const fixedHeight = 0.3;
    const fixedHeight1 = 0.6;

    lookAtVector.multiplyScalar(1.0); // Add actor in front of the camera
    playBtn.setAttribute('rotation', { x: radianToDegree(cameraRotate.x), y: radianToDegree(cameraRotate.y), z: radianToDegree(cameraRotate.z) });
    playBtn.setAttribute('position', { x: cameraPos.x + lookAtVector.x, y: cameraPos.y + fixedHeight, z: cameraPos.z + lookAtVector.z });
    // playBtn.setAttribute('scale', { x: 0.4, y: 0.2, z: 1.0 });
    playBtn.setAttribute('visible', true);

    if (bFinish) {
      gameClearBtn.setAttribute('rotation', { x: radianToDegree(cameraRotate.x), y: radianToDegree(cameraRotate.y), z: radianToDegree(cameraRotate.z) });
      gameClearBtn.setAttribute('position', { x: cameraPos.x + lookAtVector.x, y: cameraPos.y + fixedHeight1, z: cameraPos.z + lookAtVector.z });
      // gameClearBtn.setAttribute('scale', { x: 0.4, y: 0.2, z: 1.0 });
      gameClearBtn.setAttribute('visible', true);
    }

    // While game stop, remove hovered animation.
    var balls = document.querySelectorAll('.enemy');
    totalBall = balls.length;
    for (var i = 0; i < totalBall; ++i) {
      var ball = balls[i];
      ball.lastElementChild.data.begin = 'wait';
    }
  }

  function updateActor () {
    const actorOffsetY = 1.5;
    var mainActor = document.querySelector('#vehicle');
    var camera = document.querySelector('#camera');
    var cameraPos = camera.object3D.position;
    var cameraRotate = camera.object3D.rotation;

    // 1..getAttribute("look-controls");//camera.components['look-controls']; //.getAttribute("look-controls"); // It doesn't work at aframe-core. Have a look at aframe.
    // 2. In fullscreen, the background would be black.
    var cameraMtx = camera.object3D.matrix.elements;
    var lookAtVector = new THREE.Vector3(-cameraMtx[8], -cameraMtx[9], -cameraMtx[10]);
    lookAtVector.multiplyScalar(1.0); // Add actor in front of the camera

    mainActor.setAttribute('rotation', { x: 0, y: radianToDegree(cameraRotate.y), z: 0 });
    mainActor.setAttribute('position', { x: cameraPos.x + lookAtVector.x, y: cameraPos.y + lookAtVector.y - actorOffsetY, z: cameraPos.z + lookAtVector.z });

    if (bStart) {
      var wasd = camera.components['wasd-physics-controls'];
      //wasd.keys[87] = true; // press 'W' key;
    }
  }

  function showGUI () {
    if (!bStart) {
      gameStop();
    }
  }

  function updateTime () {
    if (stopWatch) {
      stopWatch.showElapsedTime();
    }
  }

  this.init = function () {
    var mapGenerator = new MapGenerator();
    var scene = document.querySelector('a-scene');
    mapGenerator.loadMap(scene, './asset/map.json');

    // Setup ball hit event
    var balls = document.querySelectorAll('.enemy');
    totalBall = balls.length;

    for (var i = 0; i < totalBall; ++i) {
      var ball = balls[i];
      ball.addEventListener('animationend', ballHit);
    }

    var playBtn = document.querySelector('#playButton');
    playBtn.addEventListener('animationend', function () {
      gameStart();
    });
  };

  this.update = function () {
    showGUI();
    updateActor();
    updateTime();
  };
}

MyGame();
