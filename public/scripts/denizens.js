


class Denizen {
  constructor(options) {
    this.last_time = new Date();
    this.position = options.position;
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
    this.imageUri = 'https://maxcdn.icons8.com/Android_L/PNG/512/Food/dressed_fish-512.png';
    // for shark: http://pixeljoint.com/files/icons/full/iaza15981137357300.gif
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
    this.imageUri = 'https://cdn.vectorstock.com/i/thumb-large/27/56/14002756.jpg';
  }

  update(t) {
    // no physics for Starter
  }

  renderRules() {
    return {
      imageUri: this.imageUri,
      css: {
        width: '5em',
        height: '5em',
        bottom: 10,
      }
    };
  }

  onClick(event) {

  }
}
