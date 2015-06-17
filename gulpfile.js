;(function(){
  "use strict";

  // =============================================
  // gulp | plig-in
  // 
  var gulp           = require("gulp"),
      sass           = require("gulp-ruby-sass"),
      imagemin       = require("gulp-imagemin"),
      pngquant       = require("imagemin-pngquant"),
      yuicompressor  = require("gulp-yuicompressor"),
      rimraf         = require('rimraf'),
      ejs            = require('gulp-ejs'),
      plumber        = require("gulp-plumber"),
      runSequence    = require('run-sequence'),
      browserSync    = require('browser-sync').create();

  // =============================================
  // path
  // 
  var srcDir   = "./src",
      buildDir = "./build";

  // =============================================
  // browser-sync
  // 
  gulp.task("browser-sync", function() {
    browserSync.init({
      server: {
        baseDir: buildDir
      }
    });
  });

  // =============================================
  // sass
  // 
  gulp.task("sass", function() {
    return sass(srcDir, {
             "style": "nested",
             "compass": true
           })
           .pipe(plumber())
           .on('error', function (err) {
             console.error('Error!', err.message);
           })
           .pipe(gulp.dest(buildDir))
           .pipe(browserSync.stream());
  });

  // =============================================
  // image min
  // 
  gulp.task("imagemin", function(){
    gulp.src([srcDir + "/**/*.+(jpg|jpeg|png|gif|svg)"])
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(buildDir));
  });


  // =============================================
  // js min
  // 
  gulp.task("jsmin", function() {
    gulp.src([srcDir + "/**/*.js"])
        .pipe(plumber())
        .pipe(yuicompressor({
          type: 'js'
        }))
        .on('error', function (err) {
          console.error('Error!', err.message);
        })
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });


  // =============================================
  // copy
  // 
  gulp.task("copy", function() {   
    gulp.src([
          srcDir + "/**/*",
          "!" + srcDir + "/**/*.js",
          "!" + srcDir + "/**/*.ejs",
          "!" + srcDir + "/**/*.+(jpg|jpeg|png|gif|svg)",
          "!" + srcDir + "/**/*.scss",
          "!" + srcDir + "/_*/",
          "!" + srcDir + "/**/_*"
        ])
        .pipe(gulp.dest(buildDir));
  });

  // =============================================
  // ejs
  // 
  gulp.task("ejs", function() {  
    gulp.src([
          srcDir + "/**/*.ejs",
          "!" + srcDir + "/**/_*.ejs"
        ])
        .pipe(plumber())
        .pipe(ejs())
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream());
  });

  // =============================================
  // clean dir
  // 
  gulp.task("clean", function(callBack) {
    rimraf(buildDir, callBack);
  });

  // =============================================
  // gulp default task
  // 
  gulp.task("default", function(){
    runSequence(
      "clean",
      ["copy", "ejs", "sass", "imagemin", "jsmin"],
      "browser-sync"
    );
    gulp.watch([srcDir + "/**/*.js"], ["jsmin"]);
    gulp.watch([srcDir + "/**/*.scss"], ["sass"]);
    gulp.watch([srcDir + "/**/*.ejs"], ["ejs"]);
    gulp.watch([srcDir + "/**/*.html", srcDir + "/**/*.css"], ["copy"]);

  });

  // =============================================
  // gulp build
  // 
  gulp.task("build", function(){
    runSequence(
      "clean",
      ["copy", "ejs", "sass", "imagemin", "jsmin"]
    );
  });

})();