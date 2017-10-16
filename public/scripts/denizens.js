
const PHYSICS_TICK_SIZE_S = 0.010;      // Lyme disease is gross.  Measured in seconds.


class Denizen {
  constructor(options) {
    console.log("constructing:", this.constructor.name, options);
    this.last_time = new Date();
    this.height = 60;
    this.width = 60;
    this.position = options.position;
    if (options.tank) {
      this.tank = options.tank;
      this.tank.registerDenizen(this);
    }
    this.onClick = this.onClick.bind(this);
  }

  calc_physics_ticks(new_time) {
    var delta_t = (new_time - this.last_time) / 1000.0; // convert to seconds
    var n_ticks = Math.floor(delta_t / PHYSICS_TICK_SIZE_S);
    var seconds_consumed = n_ticks * PHYSICS_TICK_SIZE_S;

//    console.log(this.last_time.getSeconds(), this.last_time.getMilliseconds(), "...", new_time.getSeconds(), new_time.getMilliseconds(), 
//        "-->", n_ticks, "ticks,   ", seconds_consumed, "time consumed");

    this.last_time = new Date(this.last_time.getTime() + seconds_consumed * 1000);
    return n_ticks;
  }

  update(t) {
    // TODO: put bounds on location: if you're way out of bounds, despawn


    var n_ticks = this.calc_physics_ticks(t);
    for (var i = 0; i < n_ticks; i++) {
      console.log("updating", this.constructor.name);
      this.update_one_tick();
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

  update_one_tick() {
    var dx = this.swimVelocity[0] * PHYSICS_TICK_SIZE_S;
    var dy = this.swimVelocity[1] * PHYSICS_TICK_SIZE_S;
    this.position[0] += dx;
    this.position[1] += dy;

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
    var s = new Seed({
      velocity: [200, 200],
      tank: this.tank,
      position: this.position.slice(),
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
  }

  update_one_tick() {
    console.log("seed u1t");
    this.vel_x *= 1 - (this.water_friction * PHYSICS_TICK_SIZE_S);
    this.vel_y *= 1 - (this.water_friction * PHYSICS_TICK_SIZE_S);
    this.vel_y -= 50 * PHYSICS_TICK_SIZE_S;

    var dx = this.vel_x * PHYSICS_TICK_SIZE_S;
    var dy = this.vel_y * PHYSICS_TICK_SIZE_S;
    this.position[0] += dx;
    this.position[1] += dy;
  }

}
