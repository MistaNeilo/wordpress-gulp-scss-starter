var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create();
    reload = browserSync.reload;
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util')


var paths = {
    bower: ['./bower_components/'],
    dist: './library/dist',
    src: './library/'
};

gulp.task('sass', function() {
    return gulp.src(paths.src + 'scss/main.scss')
        .pipe(sass({
            style: 'compressed',
            loadPath: [
                paths.bower + 'bootstrap-sass/assets/stylesheets',
                paths.bower + 'animate.scss/scss',
                paths.bower + 'font-awesome/scss'
            ]
            })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest( 'library/dist/css/'))
        .pipe(reload({stream: true}));
});

gulp.task('copy-assets', function () {
    gulp.src([paths.bower + 'bootstrap-sass/assets/fonts/**/*{eot,svg,ttf,woff,woff2}', paths.bower + 'font-awesome/fonts/**/*{eot,otf,svg,ttf,woff,woff2}'])
        .pipe(gulp.dest('library/dist/fonts/'));

    gulp.src([paths.bower + 'bootstrap-sass/assets/javascripts/bootstrap.min.js', paths.bower + 'jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('library/js/vendor/'));
});

gulp.task('scripts', function () {

    // production version
    gulp.src([
            paths.src + 'js/vendor/jquery.min.js',
            paths.src + 'js/vendor/bootstrap.min.js',
            paths.src + 'js/scripts.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('theme.min.js'))
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(gulp.dest('library/dist/js/'))
        .pipe(reload({stream: true}));

    // dev version 
    gulp.src([
            paths.src + 'js/vendor/jquery.min.js',
            paths.src + 'js/vendor/bootstrap.min.js',
            paths.src + 'js/custom.js'
        ])
        .pipe(concat('theme.js'))
        .pipe(gulp.dest('library/dist/js/'))
        .pipe(reload({stream: true}));
});

gulp.task('copy', ['copy-assets']);

gulp.task('default', ['copy-assets', 'sass', 'scripts'], function(){
    gulp.watch(paths.src + "scss/**/*.scss", ['sass']);
    gulp.watch(paths.src + "js/**/*.js", ['scripts']);
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'scripts'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch(paths.src + "scss/**/*.scss", ['sass']);
    gulp.watch(paths.src + "js/**/*.js", ['scripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});
