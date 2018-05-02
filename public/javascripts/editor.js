requirejs(['/javascripts/vendor/jquery.min.js', '/javascripts/vendor/simplemde.min.js'], function (jQuery, SimpleMDE) {
	window.SimpleMDE = SimpleMDE;
	
	$(document).ready(function () {
		initEditors();
	});
});

window.editors = [];

function initEditors(){
	var editors = $('.markdown-editor:not(.loaded)');
	            
    // .each(); is very slow, so we're just using a regular loop.
	for (var i = 0; i < editors.length; i++) {
		var editor = $(editors[i]);
		
		editor.addClass('loaded');
	
		var editor = new SimpleMDE({
			element: editor.get(0),
			forceSync: true,
			promptURLs: true,
			status: false,
			toolbar: ['heading', 'bold', 'italic', 'strikethrough', '|', 'code', 'quote', '|', 'unordered-list', 'ordered-list', 'table', '|', 'horizontal-rule', 'link', 'image']
		});
		
		window.editors.push(editor.codemirror);
	}
}

function refreshEditors(){
	// Codemirror won't update the rendered view unless it's visible.
	// This isn't ideal, but it ensures that they display the proper content without requiring a click/focus.
	// Should replace with some sort of reference system to only refresh required boxes.
	window.editors.forEach(function(editor){
		editor.refresh();
	});
}