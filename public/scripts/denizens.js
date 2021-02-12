
const PHYSICS_TICK_SIZE_S = 0.010;      // Lyme disease is gross.  Measured in seconds.


class Denizen {
  constructor(options) {
    this.last_time = new Date();
    this.height = 60;
    this.width = 60;
    this.position = options.position;
    if (options.tank) {
      this.tank = options.tank;
      this.id = this.tank.registerDenizen(this);
    }
    this.onClick = this.onClick.bind(this);
  }

  calc_physics_ticks(new_time) {
    var delta_t = (new_time - this.last_time) / 1000.0; // convert to seconds
    var n_ticks = Math.floor(delta_t / PHYSICS_TICK_SIZE_S);
    var seconds_consumed = n_ticks * PHYSICS_TICK_SIZE_S;
    this.last_time = new Date(this.last_time.getTime() + seconds_consumed * 1000);
    return n_ticks;
  }

  update(t) {
    if (this.outOfBounds(this.tank.getBounds())) { // if you're out of bounds, despawn
      this.die();
    } else {
      for (var i = 0; i < this.calc_physics_ticks(t); i++) {
        this.update_one_tick();
      }
    }
  }

  update_one_tick() {
    throw "not implemented";
  }

  renderRules() {
    return {
      imageUri: this.imageUri,
      css: {
        width: this.width,
        height: this.height,
      },
      x: this.position[0] - Math.floor(this.width/2),
      y: this.position[1] - Math.floor(this.height/2),
    };
  }

  onClick(event) {
    throw "not implemented";
  }

  die() {
    this.tank.removeDenizen(this.id);
  }

  outOfBounds(bounds) {
    return (
      this.position[0] + this.width < bounds.min_x ||
      this.position[0] - this.width > bounds.max_x ||
      this.position[1] + this.height < bounds.min_y ||
      this.position[1] - this.height > (bounds.max_y * 1.2)
    );
  }
}


class Fish extends Denizen {
  constructor(options) {
    super(options);
    this.imageUri = '/images/fish01.png';
    this.maxSwimSpeed = 100;
    this.swimVelocity = this.generateSwimVelocity(this.maxSwimSpeed);
    this.hype = 1;
    this.maxHype = 3;
    this.timeUntilSpeedChange = randRangeInt(5);
  }

  generateSwimVelocity(max) {
    return [randRangeInt(-max, max), randRangeInt(-max / 2, max / 2)];
  }

  update_one_tick() {
    var dx = this.swimVelocity[0] * PHYSICS_TICK_SIZE_S;
    var dy = this.swimVelocity[1] * PHYSICS_TICK_SIZE_S;
    this.position[0] += dx;
    this.position[1] += dy;
    this.timeUntilSpeedChange -= PHYSICS_TICK_SIZE_S;
    if (this.timeUntilSpeedChange < 0) {
      this.swimVelocity = this.generateSwimVelocity(this.maxSwimSpeed);
      this.timeUntilSpeedChange = randRangeInt(5);
    }
  }

  onClick(event) {
    this.timeUntilSpeedChange = 0;
  }
}

class GoFish extends Fish {
  constructor(options) {
    super(options);
    this.surgeSecondsLeft = 0;
    this.maxSurge = 2.5;
  }

  update_one_tick() {
    var dx = this.swimVelocity[0] * PHYSICS_TICK_SIZE_S;
    var dy = this.swimVelocity[1] * PHYSICS_TICK_SIZE_S;
    this.position[0] += dx * (1 + this.surgeSecondsLeft);
    this.position[1] += dy * (1 + this.surgeSecondsLeft);
    this.surgeSecondsLeft = Math.max(0, this.surgeSecondsLeft - PHYSICS_TICK_SIZE_S);
    this.timeUntilSpeedChange -= PHYSICS_TICK_SIZE_S;
    if (this.timeUntilSpeedChange < 0) {
      this.swimVelocity = this.generateSwimVelocity(this.maxSwimSpeed);
      this.timeUntilSpeedChange = randRangeInt(5);
    }
  }

  onClick(event) {
    this.surgeSecondsLeft = this.maxSurge;
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
    this.imageUri = '/images/volcano.jpg';
    this.position = [0, this.height];
  }

  update(t) {
    // no physics for Starter
  }

  onClick(event) {
    var x_vel = randRangeInt(-300, 300);
    var y_vel = 400 - Math.abs(x_vel);
    var s = new Seed({
      velocity: [x_vel, y_vel],
      tank: this.tank,
      position: this.position.slice(),
      type: this.tank.getRandomSpecies(),
    });
  }
}

class Seed extends Denizen {
  constructor(options) {
    super(options);
    this.water_friction = 0.3;      // lose this fraction, per second
    this.vel_x = options.velocity[0];
    this.vel_y = options.velocity[1];
    this.imageUri = '/images/seed.png';
    this.position = options.position;
    this.onClick = this.onClick.bind(this);
    this.type = options.type;
    this.height = 30;
    this.width = 30;
  }

  update_one_tick() {
    this.vel_x *= 1 - (this.water_friction * PHYSICS_TICK_SIZE_S);
    this.vel_y *= 1 - (this.water_friction * PHYSICS_TICK_SIZE_S);
    this.vel_y -= 50 * PHYSICS_TICK_SIZE_S;

    var dx = this.vel_x * PHYSICS_TICK_SIZE_S;
    var dy = this.vel_y * PHYSICS_TICK_SIZE_S;
    this.position[0] += dx;
    this.position[1] += dy;
  }

  spawn() {
    var Type = this.type;
    var individual = new Type({
      tank: this.tank,
      position: this.position.slice(),
    });
  }

  onClick(event) {
    this.spawn();
    this.die();
  }

}
