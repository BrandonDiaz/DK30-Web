requirejs(['/javascripts/vendor/jquery.min.js'], function() {
	$(document).ready(function () {
		$('.media-add .expand').on('click', function () {
			$(this).closest('.media-add').toggleClass('expanded');
		});
		
		$('.media-add .confirm').on('click', function () {
			var input = $(this).closest('.media-add').find('input')
			var url = input.val();
			
			if (url.length) {
				// Reset the form state, append the URL to the media list.
				input.val('');
				
				// TODO: Add a version of this in the markup with a class of placeholder, hidden, and copy it here before appending.
				$(this).closest('.update-form').find('.media-links').append(
					'<li><i class="fas fa-times"></i><input name="media" type="text" value="' + url + '" readonly /></li>'
				);
			}
		});
		
		$('body').on('click', '.media-links .fas', function(){
			$(this).closest('li').remove();
		});
	});
});