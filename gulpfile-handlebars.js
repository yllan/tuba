var handlebars = require('gulp-compile-handlebars');
var inlinesource = require('gulp-inline-source');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var replace = require('gulp-html-replace');

module.exports = function (gulp, config) {
    gulp.task('hbs-index', function () {
        var data = require('./source/data/data.json').index;
        var options = {
            ignorePartials: true,
            batch : ['./source/templates/partials']
        };
        return gulp.src('./source/templates/index.handlebars')
        .pipe(handlebars(data, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./assets'));
    });
    gulp.task('hbs-index-zh', function () {
        var data = require('./source/data/zh/data.json').index;
        var options = {
            ignorePartials: true,
            batch : ['./source/templates/partials']
        };
        return gulp.src('./source/templates/index.handlebars')
        .pipe(handlebars(data, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./assets/zh'));
    });

    gulp.task('handlebars', ['hbs-index', 'hbs-index-zh'], function () {
        return gulp.src('./assets/**/*.html')
        .pipe(replace({
            css: {
                src: '/' + config.fileNames.css,
                tpl: '<link rel="stylesheet" href="%s">'
            },
            js: {
                src: '/' + config.fileNames.js,
                tpl: '<script src="%s"></script>'
            }
        }))
        .pipe(gulp.dest('./assets'));
    });
    gulp.task('handlebars-prod', function () {
        var optsHtml = {
          conditionals: true,
          spare: true
        };
        var optsInline = {
            swallowErrors: true
        };
        return gulp.src('./assets/**/*.html')
        .pipe(replace({
            css: {
                src: config.fileNames.css,
                tpl: '<link rel="stylesheet" href="%s">'
            },
            js: {
                src: config.fileNames.js,
                tpl: '<script src="%s"></script>'
            }
        }))
        .pipe(inlinesource(optsInline))
        .pipe(minifyHTML(optsHtml))
        .pipe(gulp.dest('./assets'));
    });
};