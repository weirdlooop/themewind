const convert = require('color-convert');

const lightnessStartIndex = (value, lightFactor) => {

  let values = [];
  let first = 100 - (lightFactor * 1.5);

  for (let i = 0; i < 10; ++i) {
    if (i > 0) {
      first -= lightFactor;
    }
    values.push(first);
  }

  const closest = values.reduce(function (prev, curr) {
    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
  });

  return values.indexOf(closest);
}

const generateShades = (color, saturationFactor, lightFactor) => {

  const hsl = convert.hex.hsl(color);

  const start = lightnessStartIndex(hsl[2], lightFactor);

  let currentS = hsl[1];
  let currentL = hsl[2];
  let globalCount = 0;
  const final = [];

  for (let i = 0; i < (10 - start); ++i) {
    ++globalCount;
    if (i !== 0) {
      currentS -= saturationFactor;
      currentL -= lightFactor;
    }
    const rgb = convert.hsl.rgb(hsl[0], currentS, currentL);
    final.push(rgb[0] + ' ' + rgb[1] + ' ' + rgb[2]);
  }

  if (globalCount < 10) {

    currentS = hsl[1];
    currentL = hsl[2];

    for (let i = 1; i < (11 - globalCount); ++i) {

      currentS = Math.min(currentS + saturationFactor, 100);
      currentL = Math.min(currentL + lightFactor, 100);

      const rgb = convert.hsl.rgb(hsl[0], currentS, currentL);
      final.unshift(rgb[0] + ' ' + rgb[1] + ' ' + rgb[2]);
    }
  }

  return final;
}

module.exports = {
  generateShades
}
