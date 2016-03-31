jQuery ($) ->
	$window = $ window
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
	toTop = $ '#to-top'
	.click (event) ->
		do event.preventDefault
		$window.scrollTop 0
		do toTop.blur
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
	yes

