var gulp = require('gulp');
var rename = require('gulp-rename');
var express = require('gulp-express');
var jshint = require('gulp-jshint');

gulp.task("lint", function()
{
    return gulp
    .src(["./server/*.js", "./public/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch(['./server/*.js', './public/*.js'], ['lint']);
})