const { src, dest, watch, parallel, series } = require('gulp');



const gulp           = require('gulp');
const scss           = require('gulp-sass')(require('sass'));
const concat         = require('gulp-concat');
const autoprefixer   = require('gulp-autoprefixer');
const uglify         = require('gulp-uglify');
const rename         = require('gulp-rename');
const imagemin       = require('gulp-imagemin');
const del            = require('del');
const { notify }     = require('browser-sync');
const browserSync    = require('browser-sync').create();

function img() {
  return src('app/images/**/*.*')
    .pipe(imagemin())
    .pipe(dest('app/images/'))
};

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  })
}

function styles() {
  return src('app/scss/*.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js',
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function dist() {
  return src([
    'app/**/*.html',
    'app/css/**/*.css',
    'app/css/critical/**/*.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}



exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.img = img;
exports.cleanDist = cleanDist;
exports.dist = series(cleanDist, dist);


exports.default = parallel(styles, scripts, img, browsersync, watching);