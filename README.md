# October Bootstrap

Данная тема построена на фреймворках [jQuery](https://jquery.com/) и [Bootstrap](http://getbootstrap.com/).
Она предназначена для [CMS October](https://octobercms.com/) и поддерживает плагины [RainLab.Blog](https://octobercms.com/plugin/rainlab-blog) и [RainLab.Pages](https://octobercms.com/plugin/rainlab-pages).
В теме присутствуют примеры шаблонов для этих плагинов, взятые из [видео-курсa Дмитрия Афанасьева](http://simple-training.com/category/october-cms-static-pages/).

Для сборки необходимо наличие пакета программ [Node.JS](https://nodejs.org/).
Сборка темы осуществляется командой `npm install`.
Артефактами сборки являются:

* `assets/style.min.css` - минифицированный стиль темы, полученный из компиляци файлов вида `assets/less/**/*.less`;
* `assets/script.min.js` - минифицированный скрипт темы, полученный из компиляции файлов вида `assets/coffee/**.coffee`;
* файлы типа `*.htm` в `content/static-pages`, `layouts`, `pages`, `partials` собранные из файлов в одноименных каталогах.
	1. `template.twig` - шаблон разметки HTML.
	2. `functions.php` - PHP функции шаблона.
	3. `config.ini` - параметры шаблона.

Модификации темы отслеживаются командой `npm run watch`.
Так же, тема использует скрипты:

* [gulp.js](http://gulpjs.com/), команда `npm run gulp` - автоматизированная сборка;
* [LESS](http://lesscss.org/), команда `npm run less` - CSS препроцессор;
* [CoffeeScript](http://coffeescript.org/), команда 'npm run coffee' - JS препроцессор.

Тема включает часть исходного кода Bootstrap для разработки стилей.

Лицензия [MIT](http://licenseit.ru/wiki/index.php/MIT_License).
