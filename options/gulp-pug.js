const gulp = require('gulp')
const cached = require('gulp-cached')
const pathEnv = require('../configs/path-env.js')

const option = {
  pretty: true,
  basedir: pathEnv.src
}

module.exports = () => {
  return (
    gulp.src([
      pathEnv.src + '/**/*.pug',
      '!' + pathEnv.src + '/_*/',
      '!' + pathEnv.src + '/**/_*'
    ])
    .pipe(cached('pug'))
    .pipe(IS_PROD? plumber.stop() : plumber(CONFIG.plumber))
    .pipe(data(CONFIG.data))
    .pipe(pug(option))
    .pipe(gulp.dest(CONFIG.path.dist))
    .pipe(browserSync.stream())
  );
}
