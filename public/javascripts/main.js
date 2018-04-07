requirejs(['/javascripts/vendor/jquery.min.js'], function() {
	$(document).ready(function () {
		$('[modal]').on('click', function(){
			var url = $(this).attr('modal');
			
			$('#modal-wrapper').addClass('visible');
			
			$.get(url, function(result){
				$('#modal-wrapper').after(result);
			});
		});
		
		
		$('.load-more').on('click', function(){
			if ($(this).hasClass('busy')) {
				return false;
			}
			
			var listing = $(this).closest('.listing');
			var self = $(this);
			var page = parseInt(listing.attr('page'));
			
			listing.attr('page', page + 1);
			
			$.get(listing.attr('source') + page, function(results){
				listing.find('.list').append(results);
				
				self.removeClass('busy');
				
				// Listings always return results in sets of 9. If there are any less, there are none remaining.
				if (results.length == 9) {
					self.removeClass('hidden');
				} else {
					self.addClass('hidden');
				}
			});
		});
		
		// If there's a listing on the page, trigger the first load.
		$('.load-more').trigger('click');
		
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