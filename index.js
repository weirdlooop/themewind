const plugin = require('tailwindcss/plugin');
const {generateShades} = require('./colors');
const convert = require('color-convert');

module.exports = themeConfig => {

  const saturationFactor = 1.77;
  const lightFactor = 7.4;

  const genCssVars = theme => {

    const colors = {};

    themeConfig.shades?.forEach(color => {

      const shades = Object.assign(
        {},
        ...generateShades(themeConfig.themes[theme].colors[color], saturationFactor, lightFactor)
          .map((colorValue, index) => {
            return {['--color-' + color + '-' + (index === 0 ? 50 : index * 100)]: colorValue}
          })
      );

      Object.keys(shades).forEach(e => {
        colors[e] = shades[e];
      });
    });

    Object.keys(themeConfig.themes[theme].colors).forEach(color => {
      const rgb = convert.hex.rgb(themeConfig.themes[theme].colors[color]);
      colors['--color-' + color] = rgb[0] + ' ' + rgb[1] + ' ' + rgb[2];
    });

    return colors;
  }

  return plugin(function ({addBase}) {

    Object.keys(themeConfig.themes).forEach(theme => {
      const obj = {};
      const defaultTheme = themeConfig.defaultTheme === theme ? ':root,[data-theme=' + theme + ']' : '[data-theme=' + theme + ']';
      obj[defaultTheme] = genCssVars(theme);
      addBase(obj);
    });

  }, {

    theme: {
      extend: {
        colors: () => {

          const obj = {};
          const themeStructure = themeConfig.themes[Object.keys(themeConfig.themes)[0]];

          themeConfig.shades?.forEach(e => {
            for (let i = 0; i < 10; ++i) {
              const varNumber = i === 0 ? 50 : i * 100;
              obj[e + '-' + varNumber] = 'rgb(var(--color-' + e + '-' + varNumber + ') / <alpha-value>)';
            }
          })

          Object.keys(themeStructure.colors).forEach(e => {
            obj[e] = 'rgb(var(--color-' + e + ') / <alpha-value>)';
          })

          return obj;
        }
      }
    }
  });
}
