
var PlayState = {
  pitch: null,
  yaw: null
};

var MyGame = function () {
  const bDebug = false;

  var score = 0;
  var bStart = false;
  var bFinish = false;
  var totalBall = 0;
  var stopWatch = null;
  var playerState = PlayState;

  function ballHit (e) {
    console.log('Ball is hit......');
    score += 100;

    if (score === totalBall * 100) {
      bStart = false; // Game is finished.
      bFinish = true;
      console.log('Game is finished...');
    }
  }

  function radianToDegree (rad) {
    const k = 180 / Math.PI;
    return rad * k;
  }

  function resetGame() {
    // Main actor position
    var camera = document.querySelector('#camera');
    var physicsBody = camera.components['physics-body'];
    physicsBody.body.position.copy(physicsBody.body.initPosition);
    var look = camera.components['look-controls'];
    look.pitchObject.rotation.copy(playerState.pitch);
    look.yawObject.rotation.copy(playerState.yaw);
   
    // Respawn Enemies 
    // (For visibility changes, we need to assign materials to entities initially.)
    var balls = document.querySelectorAll('.enemy');
    totalBall = balls.length;
    for (var i = 0; i < totalBall; ++i) {
      var ball = balls[i];
      ball.setAttribute('visible', true);
    }
  }

  function gameStart () {
    bStart = true;
    bFinish = false;
    score = 0;
    var gameClearBtn = document.querySelector('#gameClearButton');
    var stopWatchItem = document.querySelector('#stopWatch');

    resetGame();
    gameClearBtn.setAttribute('visible', false);
    stopWatchItem.setAttribute('visible', false);

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
    var cameraMtx = camera.object3D.matrix.elements;
    var lookAtVector = new THREE.Vector3(-cameraMtx[8], -cameraMtx[9], -cameraMtx[10]);
    lookAtVector.multiplyScalar(lookScale);

    // Put actor in front of the camera
    mainActor.setAttribute('rotation', { x: 0, y: radianToDegree(cameraRotate.y), z: 0 });
    mainActor.setAttribute('position', { x: cameraPos.x + lookAtVector.x,
                            y: cameraPos.y - actorOffsetY, z: cameraPos.z + lookAtVector.z });

    if (!bDebug && bStart) {
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
        // Update GUI transform
        // Make GUI face to the camera
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

        entity.setAttribute('position',{ x: cameraPos.x + lookAtVector.x + offset.x,
                            y: cameraPos.y + offset.y, z: cameraPos.z + lookAtVector.z + offset.z });
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

    // At http connection, we sometimes would not finish loading before rendering.
    // We need to make sure these GUI assets be downloaded first.
    var gameClearBtn = document.querySelector('#gameClearButton');
    var stopWatchItem = document.querySelector('#stopWatch');
    gameClearBtn.setAttribute('visible', false);
    stopWatchItem.setAttribute('visible', false);

    // Using #camera is because we adopt camera as the main actor's reference object.
    var camera = document.querySelector('#camera');
    var look = camera.components['look-controls'];
    // Store initial rotation info for reseting game.
    playerState.pitch = new THREE.Euler();
    playerState.pitch.copy(look.pitchObject.rotation);
    playerState.yaw = new THREE.Euler();
    playerState.yaw.copy(look.yawObject.rotation);

    // Setup hit event to balls
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
