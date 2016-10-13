// =============================================
// options
//
module.exports = {
  SITE_CONF    : require('./configs/site-config.js'),
  path         : require('./configs/path-env.js'),

  browserSync  : require('./options/browser-sync.js'),
  pug          : require('./options/gulp-pug.js'),
  data         : require('./options/gulp-data.js'),
  sass         : require('./options/gulp-sass.js'),
  autoprefixer : require('./options/gulp-autoprefixer.js'),
  uglify       : require('./options/gulp-uglify.js'),
  babel        : require('./options/gulp-babel.js'),
  imagemin     : require('./options/gulp-imagemin.js'),
  plumber      : require('./options/gulp-plumber.js'),
  sitemap      : require('./options/gulp-sitemap.js'),
  htmlhint     : require('./options/gulp-htmlhint.js'),
  eslint       : require('./options/gulp-eslint.js')
};
