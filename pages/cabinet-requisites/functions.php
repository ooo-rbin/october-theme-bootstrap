<?php

use RBIn\Shop\Models\Settings;

function onInit() {
	$this['activeMenuItem'] = 'cabinet';
	$this['requisites'] = Settings::get('requisites');
}