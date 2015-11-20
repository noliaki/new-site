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
      coffee         = require('gulp-coffee'),
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
  // coffee
  // 
  gulp.task("coffee", function() {
    gulp.src([srcDir + "/**/*.coffee"])
        .pipe(plumber())
        .pipe(coffee())
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
          "!" + srcDir + "/**/*.coffee",
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
      ["copy", "ejs", "sass", "imagemin", "coffee"],
      "browser-sync"
    );
    gulp.watch([srcDir + "/**/*.coffee"], ["coffee"]);
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
      ["copy", "ejs", "sass", "imagemin", "coffee"]
    );
  });

})();