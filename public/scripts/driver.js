$(() => {

  var denizens = {};
  var specieses = {};

  // This is a global helper
  window.registerSpecies = (species, weight) => {
    specieses[species.name] = {
      'class': species,
      weight: weight,
    }
  }

  // This is a global helper
  window.registerDenizen = (instance) => {
    var id;
    while (!id || denizens[id]) {
      id = Math.floor(Math.random() * 1000) + '';
    }
    denizens[id] = instance;
    return id;
  }







  runPhysics = (time) => {
    for (var id in denizens) {
      if (denizens[id].update) {
        denizens[id].update(time);
      }
    }
  }

  drawGraphics = () => {
    $fishtank = $('#fishtank');
//    var center_x = Math.floor(window.innerWidth / 2);
//    var floor_y = Math.floor(window.innerHeight * 0.95);
//    $fishtank.css({
//      margin: `${floor_y}px ${center_x}px`,
//    });
    for (var id in denizens) {
      console.log(id);
      var denizen = denizens[id];
      var renderRules = denizen.renderRules(window.innerWidth, window.innerHeight);
      var $denizen = $('#' + id);
      if ($denizen.length === 0) {
        $denizen = $(`<img id="${id}"></img>`);
        $denizen.css({position: 'fixed'});
        $fishtank.append($denizen);
      }

      if ($denizen.attr('src') !== renderRules.imageUri) {
        $denizen.attr('src', renderRules.imageUri);
      }

      $denizen.css(renderRules.css);

    }

    requestAnimationFrame(drawGraphics);
  }





  var starter = new Starter({});
  registerDenizen(starter);



  requestAnimationFrame(drawGraphics);



})


