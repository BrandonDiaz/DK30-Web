requirejs([
	'/javascripts/vendor/jquery.min.js',
	'/javascripts/vendor/underscore.min.js'
], function() {
	$(document).ready(function () {
		$('.filters .search input').on('keyup keydown', _.debounce(function () {
			var listing = $('.project-listing');
			
			listing.attr('page', 0);

			getProjects();
		}, 300));
		
		$('.load-more').on('click', function(){
			var self = $(this);
			
			if ($(this).hasClass('busy')) {
				return false;
			}

			getProjects(function(){
				self.removeClass('busy');
			});
		});
		
		// If there's a listing on the page, trigger the first load.
		$('.load-more').trigger('click');
	});
});

function getProjects(callback){
	var listing = $('.project-listing');
	var page = parseInt(listing.attr('page'));

	var filters = {
		search : $('.filters .search input').val()
	};
	
	$.get(listing.attr('source') + page + '?' + jQuery.param(filters), function(results){
		if (page === 0) {
			listing.find('.list').empty();
		}
		
		// Listings always return results in sets of 9. If there are any less, there are none remaining.
		if ($(results).closest('.card').length >= 9) {
			listing.find('.load-more').removeClass('hidden');
		} else {
			listing.find('.load-more').addClass('hidden');
		}
		
		listing.attr('page', page + 1);
		listing.find('.list').append(results);
		
		if (callback) {
			callback(results);
		}
	});
}