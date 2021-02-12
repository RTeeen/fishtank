

function randRange(min, max) {
  var interval = max - min;
  return Math.random() * interval + min;
}

function randRangeInt(min, max) {
  if (max === undefined) {
    [min, max] = [0, min];
  }
  return Math.floor(randRange(min, max+0.99999));
}

