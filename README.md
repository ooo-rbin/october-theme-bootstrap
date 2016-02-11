# October Bootstrap

Данная тема построена на фреймворке [Bootstrap](http://getbootstrap.com/).
Она предназначена для [CMS October](https://octobercms.com/) и поддерживает плагины [RainLab.Blog](https://octobercms.com/plugin/rainlab-blog) и [RainLab.Pages](https://octobercms.com/plugin/rainlab-pages).
В теме присутствуют примеры шаблонов для этих плагинов взятые из [видео-курсa Дмитрия Афанасьева](http://simple-training.com/category/october-cms-static-pages/).

Для сборки необходимо наличие пакета программ [Node.JS](https://nodejs.org/).
Сборка темы осуществляется командой `npm install`.
Артифактами сборки являются:

* `assets/style.min.css` - минифицированный стиль темы, полученный из компиляци `assets/styles/theme.less`;
* `assets/vendor.style.min.css` - минифицированный стиль темы, полученный из последовательной компиляции `assets/styles/bootstrap.less` и `assets/styles/theme.less`;
* `assets/script.min.js` - минифицированный скрипт темы, полученный последовательной сборкой из файлов вида `assets/scripts/**/*.js`;
* `assets/vendor.script.min.js` - минифицированный скрипт темы, полученный последовательной сборкой из файлов `*.js` указанных в секции `main` устанавливаемых пакетов Bower и файлов вида `assets/scripts/**/*.js`;
* файлы типа `*.htm` в `content/static-pages`, `layouts`, `pages`, `partials` собранные из файлов в одноименных каталогах.
	1. `template.twig` - шаблон разметки HTML.
	2. `functions.php` - PHP функции шаблона.
	3. `config.ini` - параметры шаблона.

Модификации темы отслеживаются командой `npm watch`.
Так же, тема использует скрипты:

* [gulp.js](http://gulpjs.com/), команда `npm gulp` - автоматизированная сборка;
* [Bower](http://bower.io/), команда `npm bower` - менеджер пакетов стороронних поставщиков;
* [LESS](http://lesscss.org/), команда `npm less` - CSS препроцессор.

Скрипты темы подключаются из `assets/scripts`.
Основной стиль темы 'assets/styles/theme.less'.

Лицензия MIT.
