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

function onAsk() {
	$name = Input::get('name', false);
	$company = Input::get('company', false);
	$better = Input::get('better', false);
	$tel = Input::get('tel', false);
	$email = Input::get('email', false);
	$question = Input::get('question', false);
	$error = false;
	if ($name && $company && $question) {
		if ($better == 'tel' || $better == 'email') {
			if (($better == 'tel' && $tel) || ($better == 'email' && $email)) {
				Mail::sendTo(\Backend\Models\User::all(['email'])->lists('email'), 'feedback', [
					'name' => $name,
					'company' => $company,
					'better' => $better,
					'tel' => $tel,
					'email' => $email,
					'question' => $question,
				], function($message) use ($name, $company) {
					$message->subject('Сообщение от ' . $name . ' (' . $company . ')');
				});
			} else {
				if ($better == 'tel') {
					$tel = false;
				} else if ($better == 'email') {
					$email = false;
				}
				$error = 'Не указаны контакты для предпочтительного способа связи';
			}
		} else {
			$better = false;
			$error = 'Не указан предпочтительный способ связи';
		}
	} else {
		if ($name) {
			$name = false;
		} else if ($company) {
			$company = false;
		} else {
			$question = false;
		}
		$error = 'Не все обязательные поля формы были заполнены';
	}
	if ($error) {
		throw new AjaxException([
			'#flashMessages' => $error,
			'ask-form' => $this->renderPartial('ask-form', [
				'error' => $error,
				'name' => $name,
				'company' => $company,
				'better' => $better,
				'tel' => $tel,
				'email' => $email,
				'question' => $question,
			]),
		]);
	} else {
		$this->success = 'Ваше сообщение успешно отправлено';
		$this->name = $name;
		$this->company = $company;
		$this->better = $better;
		$this->tel = $tel;
		$this->email = $email;
		$this->question = $question;
		return [

			'#ask-form' => $this->renderPartial('ask-form', [
				'success' => 'Ваше сообщение успешно отправлено',
				'name' => $name,
				'company' => $company,
				'better' => $better,
				'tel' => $tel,
				'email' => $email,
				'question' => $question,
			]),
		];
	}
}
