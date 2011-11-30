var windowSize = {
	width: 0,
	height: 0
};

$(document).ready(function(){
	getWindowSize();
	lightbox();
});

function getWindowSize(){
	$window = $(window);
	windowSize.width = $window.width();
	windowSize.height = $window.height();
}

function lightbox() {
	var lightbox = $('.lightbox'),
		contentDiv = lightbox.children('div'),
		contentDivWidth = contentDiv.width(),
		contentDivHeight = contentDiv.height(),
		contentDivLeft = windowSize.width / 2 - contentDivWidth / 2,
		contentDivTop = windowSize.height / 2 - contentDivHeight / 2,
		documentHeight = $(document).height();

	if(contentDivHeight > windowSize.height) {
		contentDivTop = 100;
	};

	contentDiv.css({
		'margin-left' : contentDivLeft+'px',
		'margin-top' : contentDivTop+'px'
	});
	
	lightbox.height(documentHeight);
}