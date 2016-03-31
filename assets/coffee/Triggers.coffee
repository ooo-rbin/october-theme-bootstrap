class Trigger
	constructor: (@cb, @state) ->
	start: ->
		@state = on
	stop: ->
		@state = off
	restart: ->
		do @stop
		do @start
	trigger: ->
		if @state isnt off
			do @stop
			do @cb

class Timeout extends Trigger
	constructor: (@cb, @timeout) ->
		super @cb, false
	start: ->
		if @state is off
			@state = setTimeout =>
				do @trigger
			, @timeout
		else
			@state
	stop: ->
		if @state isnt off
			clearTimeout @state
			super
		else
			@state

class Interval extends Trigger
	constructor: (@cb, @interval) ->
		super @cb, false
	start: ->
		if @state is off
			@state = window.setInterval =>
				do @trigger
			, @interval
		else
			@state
	stop: ->
		if @state isnt off
			window.clearInterval @state
			super
		else
			@state
