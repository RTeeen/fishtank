class Denizen {
  constructor(options) {
    this.last_time = new Date();
    this.height = 60;
    this.width = 60;
    this.position = options.position;
    if (options.tank) {
      this.tank = options.tank;
      this.tank.registerDenizen(this);
    }
  }

  update(t) {
    throw "not implemented";
  }

  renderRules() {
    throw "not implemented";
  }

  onClick(event) {
    throw "not implemented";
  }
}


class Fish extends Denizen {
  constructor(options) {
    super(options);
    this.imageUri = '/images/fish01.png';
    this.maxSwimSpeed = 100;
    this.minSwimSpeed = 20;   // unused
    this.swimVelocity = this.generateSwimVelocity(this.maxSwimSpeed);
    this.hype = 1;
    this.maxHype = 3;
  }

  generateSwimVelocity(max) {
    return [randRangeInt(-max, max), randRangeInt(-max, max)];
  }

  update(time) {
    // TODO: periodically update swimVelocity
    // TODO: put bounds on location
    var delta_t = (time - this.last_time) / 1000.0; // convert to seconds
    this.last_time = time;
    var dx = this.swimVelocity[0] * delta_t
    var dy = this.swimVelocity[1] * delta_t
    this.position[0] += dx;
    this.position[1] += dy;
  }

  renderRules() {
    return {
      imageUri: this.imageUri,
      css: {
        width: this.width,
        height: this.height,
      },
      x: this.position[0],
      y: this.position[1],
    };
  }

}


class Plant extends Denizen {
  constructor(options) {
    super(options);
  }
}


class Starter extends Plant {
  constructor(options) {
    super(options);
    this.tank = options.tank;
    this.imageUri = '/images/volcano.jpg';
  }

  update(t) {
    // no physics for Starter
  }

  renderRules() {
    return {
      imageUri: this.imageUri,
      css: {
        width: this.width,
        height: this.height,
      },
      x: 0 - Math.floor(this.width/2),
      y: 0,
    };
  }

  onClick(event) {
    console.log("starter was clicked");

  }
}
