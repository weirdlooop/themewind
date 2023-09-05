// Get a css var that exists within the document
const getCssVar = (cssVar) => {

  return getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar).split(' ');
}

// Export the css var as an RGB string for use in JS
export const themewindRGB = (cssVar) => {

  const themewindColor = getCssVar(cssVar);
  return 'rgb(' + themewindColor.join(',') + ')';
}

// Export the css var as an RGBA string for use in JS
export const themewindRGBA = (cssVar, alpha = 1) => {

  const themewindColor = getCssVar(cssVar);
  themewindColor.push(alpha);
  return 'rgba(' + themewindColor.join(',') + ')';
}