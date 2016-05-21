
var MyGame = function () {
  const bDebug = true;

  function radianToDegree (rad) {
    const k = 180 / Math.PI;
    return rad * k;
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

    if (!bDebug) {
      var wasd = camera.components['wasd-physics-controls'];
      wasd.keys[87] = true; // press 'W' key;
    }
  }

  this.init = function () {
    var mapGenerator = new MapGenerator();

    // Load map to the scene
    var scene = document.querySelector('a-scene');
    mapGenerator.loadMap(scene, './asset/map.json');
  };

  this.update = function () {
    updateActor();
  };
};
