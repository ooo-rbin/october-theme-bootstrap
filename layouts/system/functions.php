<?php

use Cms\Classes\Theme;

function onInit() {
	$this['page_id'] = preg_replace('/^_*|_*(htm)?_*$/', '', str_replace(['/', '.'], '_', Request::path()));
	if (!empty($this['page_id'])) {
		$dir = Theme::getActiveTheme()->getPath() . '/assets/images/head/';
		$this['head_image'] = array_rand(array_flip(array_filter(scandir($dir), function ($file) use ($dir) {
			return is_file($dir . $file);
		})));
	}
}