'use strict';

require('es6-promise').polyfill();

var fs           = require('fs');
var path         = require('path');
var gulp         = require('gulp');
var bower        = require('gulp-bower');
var sass         = require('gulp-sass');
var minify_css   = require('gulp-minify-css');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var prepend      = require('gulp-insert').prepend;
var replace      = require('gulp-replace');
var rename       = require("gulp-rename");

gulp.task('default', ['styles', 'scripts', 'templates']);
gulp.task('default:watch', ['default', 'styles:watch', 'scripts:watch', 'templates:watch'], function () {
	gulp.watch(['.bowerrc', 'bower.json'], ['bower']);
});

gulp.task('bower', function () {
	return bower({cmd: 'update'});
});

// Стили

gulp.task('styles', ['project-styles', 'vendor-styles']);
gulp.task('styles:watch', function () {
	gulp.watch('assets/styles/**/*.{sass,scss,css}', ['styles']);
});

gulp.task('project-styles', function () {
	return gulp.src([
			'assets/styles/theme.scss'
		])
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.min.css'))
		.pipe(minify_css())
		.pipe(gulp.dest('assets'));
});

gulp.task('vendor-styles', function () {
	return gulp.src([
			'assets/styles/bootstrap.scss',
			'assets/styles/theme.scss'
		])
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('vendor.style.min.css'))
		.pipe(minify_css())
		.pipe(gulp.dest('assets'));
});

// Скрипты

gulp.task('scripts', ['project-scripts', 'vendor-scripts']);
gulp.task('styles:watch', function () {
	gulp.watch('assets/scripts/**/*.js', ['scripts']);
});

gulp.task('project-scripts', function () {
	return gulp.src([
			'assets/scripts/theme.js'
		])
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets'));
});

gulp.task('vendor-scripts', ['bower'], function () {
	return gulp.src([
			'assets/vendor.components/jquery/dist/jquery.js',
			'assets/vendor.components/bootstrap-sass/assets/javascripts/bootstrap.js',
			'assets/scripts/theme.js'
		])
		.pipe(concat('vendor.script.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets'));
});

// Шпблоны

gulp.task('templates', function () {
	var getFolders = function(dir) {
		return fs.readdirSync(dir)
			.filter(function(file) {
				return fs.statSync(path.join(dir, file)).isDirectory();
			})
			.map(function (subDir) {
				return {
					'name': subDir,
					'base': dir,
					'path': path.join(dir, subDir)
				};
			});
	};
	var folders = []
		.concat(getFolders('content/static-pages'))
		.concat(getFolders('layouts'))
		.concat(getFolders('pages'))
		.concat(getFolders('partials'));
	return folders.map(function(folder) {
		var twig = path.join(folder.path, 'template.twig');
		var php = path.join(folder.path, 'functions.php');
		var ini = path.join(folder.path, 'config.ini');
		var task = gulp.src(twig)
			//.pipe(minify_html())
			.pipe(prepend('==\n'));
		if (fs.existsSync(php)) {
			task
				.pipe(prepend(fs.readFileSync(php)))
				.pipe(replace('<?php\n', '==\n'));
		}
		if (fs.existsSync(ini)) {
			task
				.pipe(prepend(fs.readFileSync(ini)));
		}
		return task
			.pipe(rename(folder.name + '.htm'))
			.pipe(gulp.dest(folder.base));
	});
});
gulp.task('templates:watch', function () {
	gulp.watch('{layouts,pages,partials}/**/*.{ini,twig,php}', ['templates']);
});
