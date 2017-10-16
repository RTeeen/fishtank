

function randRange(min, max) {
  var interval = max - min;
  return Math.random() * interval + min;
}

function randRangeInt(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(randRange(min, max+0.99999));
}

