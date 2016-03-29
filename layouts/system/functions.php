<?php

use Cms\Classes\Theme;

function onInit() {
	$this['page_id'] = preg_replace('/^_*|_*(htm)?_*$/', '', str_replace(['/', '.'], '_', Request::path()));
}