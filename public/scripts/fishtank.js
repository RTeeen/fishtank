
class Fishtank {
  constructor(divName) {
    this.divName = divName;
    this.denizens = {};
    this.specieses = {};
    this.drawing = true;
    this.drawGraphicsBound = this.drawGraphics.bind(this);    // ahahaha, welcome to this hell
    requestAnimationFrame(this.drawGraphicsBound);
  }

  registerSpecies(species) {
    this.specieses[species.name] = species;
  }

  getRandomSpecies() {
    var specieses = Object.values(this.specieses);
    var index = randRangeInt(specieses.length);
    return specieses[index];
  }

  registerDenizen(individual) {
    var id;
    while (!id || this.denizens[id]) {
      id = Math.floor(Math.random() * 1000) + '';
    }
    this.denizens[id] = individual;
    return id;
  }

  runPhysics(time) {
    if (!time) {
      time = new Date();
    }
    for (var id in this.denizens) {
      if (this.denizens[id].update) {
        this.denizens[id].update(time);
      }
    }
  }

  pause(doPause) {
    this.drawing = !doPause;
    if (this.drawing) {
      this.drawGraphics();
    }
  }

  unpause() {
    this.pause(false);
  }

  drawGraphics() {
    var $fishtank = $('#' + this.divName);
    var center_x = Math.floor(window.innerWidth / 2);
    var floor_y = Math.floor(window.innerHeight * 0.95);
    for (var id in this.denizens) {
      var denizen = this.denizens[id];
      var renderRules = denizen.renderRules();
      var $denizen = $('#' + id);
      if ($denizen.length === 0) {
        $denizen = $(`<img id="${id}"></img>`);
        $denizen.css({position: 'fixed'});
        $denizen.click(denizen.onClick);
        $fishtank.append($denizen);
      }

      if ($denizen.attr('src') !== renderRules.imageUri) {
        $denizen.attr('src', renderRules.imageUri);
      }

      if (renderRules.x !== undefined) {
        $denizen.css('left', renderRules.x + center_x);
      }
      if (renderRules.y !== undefined) {
        $denizen.css('bottom', renderRules.y + 10);
      }
      $denizen.css(renderRules.css);    // this is allowed to override the previous, if the Denizen wants to
    }

    if (this.drawing) {
      requestAnimationFrame(this.drawGraphicsBound);
    }
  }

}

