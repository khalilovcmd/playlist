var gulp = require('gulp');
var rename = require('gulp-rename');
var express = require('gulp-express');
var jshint = require('gulp-jshint');

gulp.task("lint", function()
{
    return gulp
    .src(["./backend/**/*.js", "./frontend/**/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch(['./backend/**/*.js', './frontend/**/*.js'], ['lint']);
})