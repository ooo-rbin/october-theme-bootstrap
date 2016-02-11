'use strict';

require('es6-promise').polyfill();

var fs           = require('fs');
var path         = require('path');
var gulp         = require('gulp');
var bower        = require('gulp-bower');
var less         = require('gulp-less');
var minify_css   = require('gulp-minify-css');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var prepend      = require('gulp-insert').prepend;
var replace      = require('gulp-replace');
var rename       = require("gulp-rename");

function wrapPipe(taskFn) {
	return function(done) {
		var onSuccess = function () {
			done();
		};
		var onError = function (err) {
			done(err);
		};
		var check = function (stream) {
			if (stream && typeof stream.on === 'function') {
				stream.on('end', onSuccess);
			} else if (stream instanceof Array) {
				stream.map(check);
			} else {
				throw new Error();
			}
		};
		try {
			check(taskFn(onError));
		} catch (err) {
			onError(err);
		}
	}
}

gulp.task('default', ['styles', 'scripts', 'templates']);
gulp.task('default:watch', ['default', 'styles:watch', 'scripts:watch', 'templates:watch'], function () {
	gulp.watch(['.bowerrc', 'bower.json'], ['bower']);
});

gulp.task('bower', wrapPipe(function () {
	return bower({cmd: 'update'});
}));

// Стили

gulp.task('styles', ['project-styles', 'vendor-styles']);
gulp.task('styles:watch', function () {
	gulp.watch('assets/styles/**/*.{sass,scss,css}', ['styles']);
});

gulp.task('project-styles', wrapPipe(function (err) {
	return gulp.src([
			'assets/styles/theme.less'
		])
		.pipe(less().on('error', err))
		.pipe(concat('style.min.css').on('error', err))
		.pipe(minify_css().on('error', err))
		.pipe(gulp.dest('assets').on('error', err));
}));

gulp.task('vendor-styles', wrapPipe(function (err) {
	return gulp.src([
			'assets/styles/bootstrap.less',
			'assets/styles/theme.less'
		])
		.pipe(less().on('error', err))
		.pipe(concat('vendor.style.min.css').on('error', err))
		.pipe(minify_css().on('error', err))
		.pipe(gulp.dest('assets').on('error', err));
}));

// Скрипты

gulp.task('scripts', ['project-scripts', 'vendor-scripts']);
gulp.task('styles:watch', function () {
	gulp.watch('assets/scripts/**/*.js', ['scripts']);
});

gulp.task('project-scripts', wrapPipe(function (err) {
	return gulp.src([
			'assets/scripts/**/*.js'
		])
		.pipe(concat('script.min.js').on('error', err))
		.pipe(uglify().on('error', err))
		.pipe(gulp.dest('assets').on('error', err));
}));

gulp.task('vendor-scripts', ['bower'], wrapPipe(function (err) {
	var directory = JSON.parse(fs.readFileSync('.bowerrc', 'utf8')).directory;
	var dependencies = JSON.parse(fs.readFileSync('bower.json', 'utf8')).dependencies;
	var libs = [];
	var is_lib = /\.js$/i;
	var pushLib = function (dir, lib) {
		if (lib instanceof Array) {
			lib.map(function (lib) {
				pushLib(dir, lib);
			});
		} else if (lib.search(is_lib) >= 0) {
			libs.push(path.join(dir, lib));
		}
	};
	Object.keys(dependencies).map(function (pack) {
		pushLib(path.join(directory, pack), JSON.parse(fs.readFileSync(path.join(directory, pack, 'bower.json'), 'utf8')).main);
	});
	libs.push('assets/scripts/**/*.js');
	return gulp.src(libs)
		.pipe(concat('vendor.script.min.js').on('error', err))
		.pipe(uglify().on('error', err))
		.pipe(gulp.dest('assets').on('error', err));
}));

// Шпблоны

gulp.task('templates', function (err) {
	var getFolders = function (dir) {
		return fs.readdirSync(dir)
			.filter(function (file) {
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
			.pipe(prepend('==\n').on('error', err));
		if (fs.existsSync(php)) {
			task
				.pipe(prepend(fs.readFileSync(php)).on('error', err))
				.pipe(replace('<?php\n', '==\n').on('error', err));
		}
		if (fs.existsSync(ini)) {
			task
				.pipe(prepend(fs.readFileSync(ini)).on('error', err));
		}
		return task
			.pipe(rename(folder.name + '.htm').on('error', err))
			.pipe(gulp.dest(folder.base).on('error', err));
	});
});
gulp.task('templates:watch', function () {
	gulp.watch('{layouts,pages,partials}/**/*.{ini,twig,php}', ['templates']);
});
