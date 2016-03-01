'use strict';

// Дополнительный функционал

process.on('uncaughtException', console.error.bind(console));

require('es6-promise').polyfill();

var fs         = require('fs');
var combiner   = require('stream-combiner2');
var merge      = require('merge-stream');
var gulp       = require('gulp');
var watch      = require('gulp-watch');
var concat     = require('gulp-concat');
var add_src    = require('gulp-add-src');
var less       = require('gulp-less');
var minify_css = require('gulp-minify-css');
var coffee     = require('gulp-coffee');
var minify_js  = require('gulp-uglify');
var order      = require('gulp-order');
var replace    = require('gulp-replace');

function task() {
	var combined = combiner.obj(Array.prototype.slice.call(arguments));
	combined.on('error', console.error.bind(console));
	return combined;
}

function Folder(folder, file) {
	this.filePath = folder;
	this.fileName = file;
}
Folder.prototype = {
	toString: function () {
		return this.filePath + '/' + this.fileName;
	}
};

function getSubFolders(folder) {
	var folders = fs.readdirSync(folder.toString())
		.map(function (file) {
			return new Folder(folder, file);
		})
		.filter(function(file) {
			return fs.statSync(file.toString()).isDirectory();
		});
	folders.map(function (folder) {
		folders.concat(getSubFolders(folder));
	});
	return folders;
}

// Основная задача

gulp.task('default', ['styles', 'scripts', 'templates']);
gulp.task('default:watch', ['default', 'styles:watch', 'scripts:watch', 'templates:watch']);

// Стили

gulp.task('styles', function () {
	return task(
		gulp.src('assets/less/**/*.less'),
		concat('style.less'),
		less(),
		add_src('assets/css/**/*.css'),
		concat('style.min.css'),
		minify_css(),
		gulp.dest('assets')
	);
});
gulp.task('styles:watch', ['styles'], function () {
	watch('assets/less/**/*.less', function () {
		console.log('Обнаружено обновление assets/less/**/*.less');
		gulp.run('styles');
	});
	watch('assets/css/**/*.css', function () {
		console.log('Обнаружено обновление assets/less/**/*.css');
		gulp.run('styles');
	});
});

// Скрипты

gulp.task('scripts', function () {
	return task(
		gulp.src('assets/coffee/**/*.coffee'),
		concat('script.coffee'),
		coffee(),
		add_src('assets/js/**/*.js'),
		concat('script.min.js'),
		minify_js(),
		gulp.dest('assets')
	);
});
gulp.task('scripts:watch', ['scripts'], function () {
	watch('assets/coffee/**/*.coffee', function () {
		console.log('Обнаружено обновление assets/coffee/**/*.coffee');
		gulp.run('scripts');
	});
	watch('assets/js/**/*.js', function () {
		console.log('Обнаружено обновление assets/js/**/*.js');
		gulp.run('scripts')
	});
});

// HTM

var templatesFolders = ['content', 'layouts', 'pages', 'partials'].map(function (templatesFolder) {
	var taskName = 'templates:' + templatesFolder;
	gulp.task(taskName, function () {
		return merge(getSubFolders(templatesFolder).map(function (templateFolder) {
			return task(
				merge([
					task(
						gulp.src(templateFolder + '/config.ini')
					),
					task(
						gulp.src(templateFolder + '/functions.php'),
						replace('<?php', '')
					),
					task(
						gulp.src(templateFolder + '/template.twig'),
						replace(/^\s*/gm, '')
					)
				]),
				order([
					'**/config.ini',
					'**/functions.php',
					'**/template.twig'
				]),
				concat(templateFolder.fileName + '.htm', {newLine: '\n==\n'}),
				gulp.dest(templateFolder.filePath)
			);
		}));
	});
	gulp.task(taskName + ':watch', [taskName], function () {
		watch(templatesFolder + '/**/config.ini', function () {
			gulp.run(taskName);
		});
		watch(templatesFolder + '/**/functions.php', function () {
			gulp.run(taskName);
		});
		watch(templatesFolder + '/**/template.twig', function () {
			gulp.run(taskName);
		});
	});
	return taskName;
});
gulp.task('templates', templatesFolders);
gulp.task('templates:watch', ['templates'].concat(templatesFolders.map(function (taskName) {
	return taskName + ':watch';
})));
