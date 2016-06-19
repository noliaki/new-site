const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

module.exports = {
  plugins : [
    imagemin.gifsicle(),
    imagemin.jpegtran(),
    pngquant(),
    imagemin.svgo()
  ],
  verbose : true
}
