jQuery ($) ->
	$aside = $ '#aside'
	$asideParent = do $aside.parent
	$breadcrumb = $asideParent.find '.breadcrumb'
	$window = $ window
	.resize ->
		$window.trigger 'scroll'
	.bind 'hashchange', do ->
		$anchor = off
		name = ''
		->
			if $anchor isnt off
				$anchor.removeClass 'anchor'
				$anchor = off
			if name isnt ''
				$ ".link-#{ name }"
				.removeClass 'active'
			name = window.location.hash.substring 1
			if name isnt ''
				$anchor = $ "a[name=#{ name }]"
				.addClass 'anchor'
				$ ".link-#{ name }"
				.addClass 'active'
			yes
	.trigger 'hashchange'
	$ '[data-autofocus]'
	.each ->
		$this = $ @
		$target = $ $this.data 'autofocus'
		.hover ->
			do $target.focus
			do timeout.stop
			yes
		, ->
			if not do $target.val
				do timeout.restart
			yes
		.change ->
			do timeout.stop
			yes
		timeout = new Timeout ->
			do $target.blur
			yes
		, 2000
		yes
	$toTop = $ '#to-top'
	.click (event) ->
		do event.preventDefault
		$window.scrollTop 0
		do $toTop.blur
		no
	if $.fn.ekkoLightbox?
		$ '[data-toggle="lightbox"]'
		.click (event) ->
			do event.preventDefault
			do $ @
			.ekkoLightbox
			no
	if $.fn.dropdownHover?
		do $ '.dropdown-toggle'
		.dropdownHover
	if $.fn.slick?
		do $ '[data-slick]'
		.slick
	$footer = $ '#footer'
	$window.scroll ->
		offset = do $window.scrollTop + do $window.height - (do $footer.offset).top
		if 0 < offset
			$toTop.css
				'margin-bottom': "#{offset}px"
		else
			$toTop.css
				'margin-bottom': "0"
		if 0 < $asideParent.length
			height = do $aside.outerHeight + (3 * $breadcrumb.outerHeight true)
			offset = do $window.scrollTop - (do $asideParent.offset).top
			if 0 < offset
				$aside.addClass 'fly'
			else
				$aside.removeClass 'fly'
			if window.innerHeight > height
				asideMax = do $asideParent.height - height
				if 0 < offset
					if offset < asideMax
						$aside.css
							'margin-top': "#{offset}px"
					else
						$aside.css
							'margin-top': "#{asideMax}px"
				else
					$aside.css
						'margin-top': '0'
			else
				$aside.css
					'margin-top': '0'
	$window.trigger 'scroll'
	$ '[data-toggle="multiselect"]'
		.each ->
			$ this
				.multiselect
					templates:
						filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
						filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="fa fa-times"></i></button></span>',
					nonSelectedText: 'Все возможные'
					allSelectedText: 'Все возможные'
					nSelectedText: 'выбранно'
					enableFiltering: true
					filterPlaceholder: 'Поиск'
					buttonWidth: '100%'
					numberDisplayed: 10
					maxHeight: 500
			yes
	$('[data-repeater]').repeater()
	yes

