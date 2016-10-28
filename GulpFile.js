'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass');


var staticPathSrc = 'public/static/src/',
    staticPathDist = 'public/static/dist/';

var vendors = [
    'react',
    'react-dom',
    'react-modal',
    'three',
];

var getVendorSrc = function(min) {
    var vendorSrcs = [];
    vendors.forEach(function(v) {
        var fileName = staticPathSrc + 'js/vendor/' + v;
        if (min) {
            fileName += '.min';
        }
        vendorSrcs.push(fileName + '.js');
    });
    return vendorSrcs;
};

var createVendor = function(sources) {
    return gulp.src(sources)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(staticPathDist));
};

gulp.task('vendor', function() {
    return createVendor(getVendorSrc(true));
});

gulp.task('vendor-dev', function() {
    return createVendor(getVendorSrc(false));
});

gulp.task('js-bootstrap', function() {
    var appBundler = browserify({
        entries: [staticPathSrc + 'js/bootstrap.jsx'],
        extensions: ['.jsx'],
        debug: false
    })
        .transform('babelify', {presets: ['es2015', 'react']});

    vendors.forEach(function(v) {
        appBundler.require('./' + staticPathSrc + 'js/vendor/' + v + '.import.js', {expose: v})
    });

    return appBundler.bundle()
        .pipe(source('bootstrap.js'))
        .pipe(gulp.dest(staticPathDist));
});

gulp.task('sass', function() {
    gulp.src(staticPathSrc + 'scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(staticPathDist));
});


gulp.task('watch',function() {
    gulp.watch(staticPathSrc + 'scss/**/*.scss',['sass']);
    gulp.watch(staticPathSrc + 'js/**/*.jsx',['js-bootstrap']);
});

// todo - images and a "default" task