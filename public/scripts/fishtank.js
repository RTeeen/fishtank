
class Fishtank {
  constructor(divName) {
    this.divName = divName;
    this.denizens = {};
    this.specieses = {};
    this.drawing = true;
    this.drawGraphicsBound = this.drawGraphics.bind(this);    // ahahaha, welcome to `this` hell.  callback hell never had it so fiery.
    requestAnimationFrame(this.drawGraphicsBound);
  }

  registerSpecies() {
    for (var species of arguments) {
      this.specieses[species.name] = species;
    }
  }

  getRandomSpecies() {
    var specieses = Object.values(this.specieses);
    var index = randRangeInt(specieses.length - 1);
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

  removeDenizen(id) {
    delete (this.denizens[id]);
    var $victim = $('#' + id);
    $victim.off();
    $victim.css({ transition: 'all 2s' });
    $victim.css({ 
      opacity: '0',
      width: $victim.width() * 2,
      height: $victim.height() * 2,
    });
    setTimeout(() => $victim.remove(), 3000);
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
    this.runPhysics();  // TODO: maybe this should be on a separate setInterval
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

  getBounds() {
    return {
      min_x: - window.innerWidth / 2,
      max_x: window.innerWidth / 2,
      min_y: -10,
      max_y: window.innerHeight - 10,
    };
  }

}

