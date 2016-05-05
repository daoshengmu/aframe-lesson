
var MyGame = function () {
  var score = 0;
  var bStart = false;
  var bFinish = false;
  var totalBall = 0;
  var stopWatch = null;

  function ballHit (e) {
    console.log('Ball is hit......');
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
    stopWatch.init();
    // While game start, give hovered animation.
    var balls = document.querySelectorAll('.enemy');
    totalBall = balls.length;
    for (var i = 0; i < totalBall; ++i) {
      var ball = balls[i];
      ball.lastElementChild.data.begin = 'hovered';
    }
  }

  function gameStop () {
    var playBtn = document.querySelector('#playButton');
    var gameClearBtn = document.querySelector('#gameClearButton');
    var stopWatchItem = document.querySelector('#stopWatch');

    console.log('gameStop');
    if (stopWatch) {
      stopWatch.stop();
    }

    if (bFinish) {
      gameClearBtn.setAttribute('visible', true);
      stopWatchItem.setAttribute('visible', true);
      playBtn.setAttribute('visible', true);
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
    const lookScale = 0.6;
    var mainActor = document.querySelector('#vehicle');
    var camera = document.querySelector('#camera');
    var cameraPos = camera.object3D.position;
    var cameraRotate = camera.object3D.rotation;

    // 1..getAttribute("look-controls");//camera.components['look-controls']; //.getAttribute("look-controls"); // It doesn't work at aframe-core. Have a look at aframe.
    // 2. In fullscreen, the background would be black.
    var cameraMtx = camera.object3D.matrix.elements;
    var lookAtVector = new THREE.Vector3(-cameraMtx[8], -cameraMtx[9], -cameraMtx[10]);
    lookAtVector.multiplyScalar(lookScale); // Add actor in front of the camera

    mainActor.setAttribute('rotation', { x: 0, y: radianToDegree(cameraRotate.y), z: 0 });
    mainActor.setAttribute('position', { x: cameraPos.x + lookAtVector.x, y: cameraPos.y - actorOffsetY, z: cameraPos.z + lookAtVector.z });

    if (bStart) {
      var wasd = camera.components['wasd-physics-controls'];
      wasd.keys[87] = true; // press 'W' key;
    }
  }

  function updateGUI () {
    const offsetPlayBtn = new THREE.Vector3(0, 0.2, 0);
    const offsetStopWatch = new THREE.Vector3(-0.1, -0.2, 0);
    const offsetGameClear = new THREE.Vector3(0, 0.0, 0);
    var menus = document.querySelectorAll('.menu');
    var camera = document.querySelector('#camera').object3D;
    var cameraPos = camera.position;
    var cameraRotate = camera.rotation;
    var cameraMtx = camera.matrix.elements;
    var offset = null;
    var lookAtVector = new THREE.Vector3(-cameraMtx[8], -cameraMtx[9], -cameraMtx[10]);
    lookAtVector.multiplyScalar(1.0);

    for (var i = 0; i < menus.length; ++i) {
      var entity = menus[i];

      if (entity.getAttribute('visible')) {
        // Update transform
        // Make face to the camera
        entity.setAttribute('rotation', { x: radianToDegree(cameraRotate.x),
          y: radianToDegree(cameraRotate.y), z: radianToDegree(cameraRotate.z) });

        switch (entity.id) {
          case 'playButton':
            offset = offsetPlayBtn;
            break;
          case 'stopWatch':
            offset = offsetStopWatch;
            break;
          case 'gameClearButton':
            offset = offsetGameClear;
            break;
          default:
            console.log('This gui type is undefined ' + entity.id);
            break;
        }

        entity.setAttribute('position', { x: cameraPos.x + lookAtVector.x + offset.x, y: cameraPos.y + offset.y,
          z: cameraPos.z + lookAtVector.z + offset.z });
      }
    }

    if (!bStart) {
      gameStop();
    }
  }

  function updateTime () {
    if (stopWatch) {
      stopWatch.showElapsedTime(document.querySelector('#stopWatch'));
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
    updateGUI();
    updateActor();
    updateTime();
  };
};
