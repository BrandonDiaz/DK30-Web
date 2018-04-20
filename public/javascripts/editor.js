requirejs(['/javascripts/vendor/jquery.min.js', '/javascripts/vendor/simplemde.min.js'], function (jQuery, SimpleMDE) {
	window.SimpleMDE = SimpleMDE;
	
	$(document).ready(function () {
		initEditors();
	});
});

function initEditors(){
	var editors = $('.markdown-editor:not(.loaded)');
	            
    // .each(); is very slow, so we're just using a regular loop.
	for (var i = 0; i < editors.length; i++) {
		var editor = $(editors[i]);
		
		editor.addClass('loaded');
	
		new SimpleMDE({
			element: editor.get(0),
			forceSync: true,
			promptURLs: true,
			status: false,
			toolbar: ['heading', 'bold', 'italic', 'strikethrough', '|', 'code', 'quote', '|', 'unordered-list', 'ordered-list', 'table', '|', 'horizontal-rule', 'link', 'image']
		});
	}
}