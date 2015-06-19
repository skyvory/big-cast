$(document).ready(function() {
	var win_width = $(window).width();
	// $('.cover-container').css("height", win_width / 6 +50);

	$('.release-area').children('.thumbnail').each(function(index) {
		$(this).delay(index * 300).fadeIn(500);
	});
});

$(window).resize(function() {
	var win_width = $(window).width();
	// $('.cover-container').css("height", win_width / 6 +50);
});