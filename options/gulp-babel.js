const gulp = require('gulp')
const cached = require('gulp-cached')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const CONFIG = require('../configs/config')

const option = {}

module.exports = (IS_PROD = false) => {
  return () => {
    return (
      gulp.src([
        CONFIG.path.src + '/**/*.js',
        '!' + CONFIG.path.src + '/_*/',
        '!' + CONFIG.path.src + '/**/_*'
      ])
      .pipe(cached('babel'))
      .pipe(IS_PROD ? plumber.stop() : plumber(CONFIG.plumber))
      .pipe(babel(option))
      .on('error', (error) => {
        console.error('Error!', error.message)
      })
      .pipe(gulp.dest(CONFIG.path.dist))
    )
  }
}
