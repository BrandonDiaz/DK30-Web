requirejs(['/javascripts/vendor/jquery.min.js'], function(){
	// TODO: Really these selectors should all be scoped to the edit modal once modals have an identification scheme.
	$(document).ready(function(){
		var preview = $('.modal .card .project');
		var selects = $('.select');
		
		// .each(); is very slow, so we're just using a regular loop.
		for (var i = 0; i < selects.length; i++) {
			var select = $(selects[i]);
			var value = select.find('input').val();
			var text = select.find('li[value="' + value + '"]').text();
			
			select.find('.input').text(text);
		}
		
		$('.select li').on('click', function(){
			var select = $(this).closest('.select');
			
			select.find('input[type="hidden"]').val($(this).attr('value')).trigger('change');
			select.find('.input').text($(this).text());
			
			select.blur();
		});
		
		$('[name="goal"]').on('change keyup keydown', function(){
			preview.parent().find('.goal').text($(this).val());
		});
		
		$('[name="category"]').on('change', function(){
			preview.parent().find('.category').text('#' + $(this).val());
		});
		
		$('[name="card[background][color]"]').on('change', function(){
			preview.attr('color', $(this).val());
		});
		
		$('[name="card[background][pattern]"]').on('change', function(){
			preview.attr('pattern', $(this).val());
		});
		
		// Boot up the markdown editors;
		initEditors();
	});
});