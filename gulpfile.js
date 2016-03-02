'use strict';

// gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
// ejs
var ejs = require("gulp-ejs");
// jshint
var jshint = require('gulp-jshint');
// lessCSS
var less = require('gulp-less');
// less plugin to minify resulting css
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new LessPluginCleanCSS({ advanced: true });
// js minification
// var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
// flatten (for fonts)
var flatten = require('gulp-flatten');
// directories
var SRC_DIR = 'src';
var BUILD_DIR = 'build';

// source paths
var paths = {
    scripts: [
        SRC_DIR + '/**/*.module.js',
        SRC_DIR + '/**/*.js',
        '!' + SRC_DIR + '/**/*flycheck*.js',
    ],
    vendor: [
        'bower_components/**/*',
        'vendor/**/*',
    ],
    fonts: [
        'bower_components/**/fonts/*',
        SRC_DIR + '/fonts/*',
    ],
    templates: [SRC_DIR + '/**/*.html'],
    index: [SRC_DIR + '/index.html'],
    proto: [SRC_DIR + '/proto/*.proto'],
    images: [SRC_DIR + '/img/**/*'],
    package: ['pkg/**/*'],
    less: [
        SRC_DIR + '/style/bootstrap.less',
        SRC_DIR + '/style/app.less',
    ]
};

var getBuildDest = function(path) {
    if (!path) {
        return BUILD_DIR;
    }
    if (path[0] !== '/') {
        path = '/' + path;
    }
    return gulp.dest(BUILD_DIR + path);
};

// chrome app package files
gulp.task('package', function() {
    return gulp.src(paths.package)
        .pipe(gulp.dest(getBuildDest()));
});

// HTML

gulp.task('index', function() {
    return gulp.src(paths.index)
        .pipe(debug({title: 'Index file'}))
        .pipe(ejs(require('./locales/en_US.json')).on('error', gutil.log))
        .pipe(gulp.dest(getBuildDest()));
});

gulp.task('proto', function() {
    return gulp.src(paths.proto)
        .pipe(debug({title: 'Proto'}))
        .pipe(getBuildDest('proto'));
});

gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(debug({title: 'Template files'}))
        .pipe(ejs(require('./locales/en_US.json')).on('error', gutil.log))
        .pipe(gulp.dest(getBuildDest()));
});

// Images

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(getBuildDest('img'));
});

// LESS

gulp.task('less', function() {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [cleancss]
        })).on('error', HandleError)
        .pipe(sourcemaps.write())
        .pipe(getBuildDest('css'));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(flatten())
        .pipe(getBuildDest('fonts'));
});

// JS

gulp.task('vendor', function() {
    return gulp.src(paths.vendor)
        .pipe(getBuildDest('vendor'));
});


gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
    // .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(getBuildDest('js'));
});

gulp.task('watch', function() {
    for(var task in paths) {
        if (paths.hasOwnProperty(task)) {
            if (task === "less") {
                gulp.watch(SRC_DIR + '/style/**/*.less', [task]);
            } else {
                gulp.watch(paths[task], [task]);
            }
        }
    }
});

gulp.task('default', [
    'index',
    'proto',
    'templates',
    'less',
    'vendor',
    'scripts',
    'images',
    'package',
    'fonts',
]);

function HandleError(err) {
    console.error(err);
    this.emit('end');
}
