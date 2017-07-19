/*
*
* 1.cmd:npm init
* 2.npm install --save-dev gulp gulp-sass gulp-autoprefixer gulp-combine-media-queries gulp-cssmin browser-sync browsersync-ssi gulp-jsmin
* 3.cmd:gulp/gulp auto/gulp cmq/gulp cssmin/gulp jsmin/
* 
*/

var gulp = require("gulp");
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var cmq = require('gulp-combine-media-queries');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync').create();
var ssi = require("browsersync-ssi");
var jsmin = require('gulp-jsmin');

/* ----------------------------------------------------------------------------------
　config (project dir)
---------------------------------------------------------------------------------- */
var root = "htdocs",
    config = {
   "path" : {
      "htdocs"    : root,
      "sass"      : root+"/asset/_dev/",
      "css"       : root+"/asset/css/",
      "js"       : root+"/asset/js/"
   }
};

/* ----------------------------------------------------------------------------------
* Static server
* browser-sync
*　-----------------------------------------------------------------------------------*/
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./htdocs/",
            middleware: [
              ssi({
                 baseDir: __dirname + "/htdocs",
                 ext: ".html"
              })
            ]
        }
    });
});


/* ----------------------------------------------------------------------------------
　Sass compile ： Step1
---------------------------------------------------------------------------------- */
gulp.task('sass', function () {
  return gulp.src(config.path.sass+'lp-style.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(config.path.css));
});

/* ----------------------------------------------------------------------------------
　autoprefixer ： Step2
---------------------------------------------------------------------------------- */
gulp.task('auto', function () {
  return gulp.src(config.path.css+'/style.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions','Android 4.3','IE 11'], // can i use :http://caniuse.com/
        cascade: false
    }))
    .pipe(gulp.dest(config.path.css))
    .pipe(gulp.dest(config.path.css+'/bk/'));
});

/* ----------------------------------------------------------------------------------
*　Combine Media Queries ： Step3
---------------------------------------------------------------------------------- */
gulp.task('cmq', function () {
  gulp.src(config.path.css+'/style.css')
    .pipe(cmq({
      log: true
    }))
    .pipe(gulp.dest(config.path.css))
    .pipe(gulp.dest(config.path.css+'/bk/'));
});


/* ----------------------------------------------------------------------------------
  cssmin ： Step4
---------------------------------------------------------------------------------- */
gulp.task('cssmin', function () {
    gulp.src(config.path.css+'/style.css')
        .pipe(cssmin())
        .pipe(gulp.dest(config.path.css));
});

/* ----------------------------------------------------------------------------------
  jsmin ： Step5
---------------------------------------------------------------------------------- */
gulp.task('jsmin', function () {
  gulp.src(config.path.js+'/*.js')
    .pipe(gulp.dest(config.path.js+'/bk/'))
    .pipe(jsmin())
    .pipe(gulp.dest(config.path.js));
});

/* ----------------------------------------------------------------------------------
　Default task
---------------------------------------------------------------------------------- */
gulp.task("default",['browser-sync'], function() {
    gulp.watch(config.path.sass+'/*',["sass"]).on('change', browserSync.reload);
    gulp.watch(config.path.htdocs+'/**/*.html').on('change', browserSync.reload);
});