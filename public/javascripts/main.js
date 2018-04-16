requirejs([
	'/javascripts/vendor/jquery.min.js',
	'/javascripts/vendor/underscore.min.js'
], function() {
	$(document).ready(function () {
		$('[modal]').on('click', function(){
			var url = $(this).attr('modal');
			
			showModal(url);
		});
		
		$('body').on('click', '.modal .cancel', function(){
			if ($('.modal').length <= 1) {
				$('#modal-wrapper').removeClass('visible');
			}
			
			$(this).closest('.modal').fadeOut(function(){
				$(this).remove();
			});
		}).on('click', '.modal .tabs li', function(){
			var modal = $(this).closest('.modal');
			var index = $(this).index();
			
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			
			modal.find('.tab').hide();
			modal.find('.tab:eq(' + index + ')').show();
		}).on('click', '.select', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
		}).on('click', '.submit', function(){
			var form = $(this).closest('form');
			var error = false;
			
			form.find('.error').removeClass('error');
			form.find('[required]').each(function() {
				if (!$(this).val().trim()) {
					$(this).addClass('error');
					error = true;
				}
			});
			
			if (!error) {
				form.submit();
			}
		});
	});
});

function showModal(url){
	$('#modal-wrapper').addClass('visible');
	
	$.get(url, function(result){
		$('#modal-wrapper').after(result);
	});
}