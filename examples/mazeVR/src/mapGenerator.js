function MapGenerator () {
  var mapScene = null;
  function loadJSON (url) {
    /*global XMLHttpRequest*/
    /* no-undef in eslint */
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        parseMap(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  function addEntityToScene (entity) {
    var e = document.createElement('a-entity');
    mapScene.appendChild(e);

    e.setAttribute('geometry', {primitive: entity.geometry});
    e.setAttribute('position', {x: entity.position[0],
                                y: entity.position[1],
                                z: entity.position[2]});
    e.setAttribute('scale', {x: entity.scale[0],
                            y: entity.scale[1],
                            z: entity.scale[2]});
    e.setAttribute('rotation', {x: entity.rotation[0],
                                y: entity.rotation[1],
                                z: entity.rotation[2]});
    e.setAttribute('material', {color: entity.material.color});

    e.setAttribute('physics-body', 'boundingBox', {x: entity.scale[0], y: entity.scale[1], z: entity.scale[2]});
    e.setAttribute('physics-body', 'mass', 0);
    e.setAttribute('physics-body', 'velocity', {x: 0.2, y: 0, z: 0});
  }

  function parseMap (resultText) {
    var result = JSON.parse(resultText);
    var scene = result['scene'];
    var entities = scene['entity'];

    for (var i = 0; i < entities.length; ++i) {
      var e = entities[i];
      var mapEntity = {
        geometry: e.geometry,
        position: [e.position.x, e.position.y, e.position.z],
        scale: [e.scale.x, e.scale.y, e.scale.z],
        rotation: [e.rotation.x, e.rotation.y, e.rotation.z],
        material: {color: e.material.color}
      };

      addEntityToScene(mapEntity);
    }
  }

  this.loadMap = function (scene, url) {
    mapScene = scene;
    loadJSON(url);
  };
}

MapGenerator();
