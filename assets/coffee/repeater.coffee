###

<p class="form-group" data-repeater>
	<span class="input-group">
		<span class="input-group-addon" style="padding: 0 0.5em;">
			<input type="file" name="files[][file]" style="width: 300px;">
		</span>
		<input type="text" class="form-control" name="files[][description]" placeholder="Описание">
		<span class="input-group-btn">
			<button type="button" class="btn btn-default" data-append=".fa" data-class="fa fa-minus text-danger">
				<i class="fa fa-plus text-success" aria-hidden="true"></i>
			</button>
		</span>
	</span>
</p>

###
do ($ = jQuery) ->
	class Repeater
		constructor: (@$self) ->
			self = this
			@$self.find('[data-append]').click -> self.append($(this))
			@$self.find('[data-remove]').click -> self.remove($(this))
		getRow: ($self) ->
			$($self.closest('.input-group')[0])
		append: ($self) ->
			self = this
			row = @getRow($self)
			clone = row.clone(true)
			clone.find('input,textarea').val('')
			clone.insertAfter(row)
			row.find($self.data('append')).attr('class', $self.data('class'))
			$self.attr('data-remove', $self.data('append'))
			$self.attr('data-append', null)
			$self.unbind('click')
			$self.click -> self.remove($(this))
			$self.blur()
			yes
		remove: ($self) ->
			if confirm(@$self.data('repeater'))
				@getRow($self).remove()
			else
				$self.blur()
			yes
	$.fn.repeater = ->
		new Repeater(this)