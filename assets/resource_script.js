//for file upload
$(function(){

	$('#fileupload').fileupload({
		url: 'http://localhost/cast/index.php/resource/do_upload',
		dataType: 'json',
		//calculate progress
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress .bar').slideDown(500).css(
				'width',
				progress + '%'
			);
		},
		stop: function(e, data) {
		  	$('#progress .bar').delay(500).slideUp(500);
		},
		done: function (e, data) {
			$.each(data.result.files, function (index, file) {
				if(file.error) {
					callErrorNotification(file.error);
				}
				if(file.resource_type == "1") {
					var res = '<div class="media sprite-media"> <div class="media-left sprite-thumbnail-area"> <img src="'+file.url+'" class="media-object resource-thumbnail" /> </div> <div class="media-body"> <div class="resource-property"> <form class="form-horizontal sprite-form"> <div class="form-group"> <label for="spritecharactername_'+file.id+'" class="col-sm-3 control-label">Character Name</label> <div class="col-sm-5"> <input type="text" id="spritecharactername_'+file.id+'" name="sprite_character" class="form-control input-sm" value="'+file.character_name+'" /> </div> </div> <div class="form-group"> <label for="spritefigurename_'+file.id+'" class="col-sm-3 control-label">Pose Name</label> <div class="col-sm-5"> <input type="text" id="spritefigurename_'+file.id+'" name="sprite_figure" class="form-control input-sm" value="'+file.figure_name+'" /> </div> </div> <div class="form-group"> <label for="spriteexpressionname_'+file.id+'" class="col-sm-3 control-label">Expression Name</label> <div class="col-sm-5"> <input type="text" id="spriteexpressionname_'+file.id+'" name="sprite_expression" class="form-control input-sm" /> </div> </div> <input type="hidden" id="spriteid_'+file.id+'" name="sprite_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary sprite-form-submit-button">Change</button> <button type="button" class="btn btn-danger sprite-form-delete-button" tabindex="-1">Delete</button> </form> </div> </div> </div>';
					$(res).appendTo('.resource-list');
				}
				else if(file.resource_type == 2) {
					var res = '<div class="media background-media"> <div class="media-left background-thumbnail-area"> <img src="'+file.url+'" class="media-object resource-thumbnail" /> </div> <div class="media-body"> <div class="resource-property"> <form class="form-inline background-form"> <div class="form-group"> <label for="backgroundname_'+file.id+'">Name &nbsp;</label> <input type="text" id="backgroundname_'+file.id+'" name="background_name" class="form-control input-sm" value="'+file.name+'" /> </div> <input type="hidden" id="backgroundid_'+file.id+'" name="background_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary background-form-submit-button">Change</button> <button type="button" class="btn btn-danger background-form-delete-button">Delete</button> </form> </div> </div> </div>';
					$(res).appendTo('.resource-list');
				}
				else if(file.resource_type == 3) {
					var res = '<tr><td> <div class="media bgm-media"> <div class="media-left audio-thumbnail-area"> <img src="'+config.base+'assets/images/musical_note-512.png" class="media-object resource-thumbnail"/> </div> <div class="media-body"> <div class="resource-property"> <div class="audio-player-area"> <audio controls preload="none"> <source src="'+file.url+'"> </audio> </div> <form class="form-inline audio-inline-form"> <div class="form-group bgm-form"> <label for="bgmname_'+file.id+'">Name &nbsp;</label> <input type="text" id="bgmname_'+file.id+'" name="bgm_name" class="form-control input-xs" value="'+file.name+'" /> </div> <input type="hidden" id="bgmid_'+file.id+'" name="bgm_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary bgm-form-submit-button">Change</button> <button type="button" class="btn btn-danger bgm-form-delete-button">Delete</button> </form> </div> </div> </div> </td></tr>'
					$(res).appendTo('.resource-list table tbody');
				}
				else if(file.resource_type == 4) {
					var res = '<div class="media sfx-media"> <div class="media-left audio-thumbnail-area"> <img src="'+config.base+'assets/images/Audio-512.png" class="media-object resource-thumbnail"/> </div> <div class="media-body"> <div class="resource-property"> <div class="audio-player-area"> <audio controls preload="none"> <source src="'+file.url+'"> </audio> </div> <form class="form-inline audio-inline-form"> <div class="form-group sfx-form"> <label for="sfxname_'+file.id+'">Name &nbsp;</label> <input type="text" id="sfxname_'+file.id+'" name="sfx_name" class="form-control input-xs" value="'+file.name+'" /> </div> <input type="hidden" id="sfxid_'+file.id+'" name="sfx_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary sfx-form-submit-button">Change</button> <button type="button" class="btn btn-danger sfx-form-delete-button">Delete</button> </form> </div> </div> </div>'
					$(res).appendTo('.resource-list table tbody');
				}
				else if(file.resource_type == 5) {
					var res = '<tr><td> <div class="media voice-media"> <div class="media-left audio-thumbnail-area"> <img src="'+config.base+'assets/images/microphone-2-512.png" class="media-object resource-thumbnail"/> </div> <div class="media-body"> <div class="resource-property"> <div class="audio-player-area"> <audio controls preload="none" class="audio-player"> <source src="'+file.url+'"> </audio> </div> <form class="form-inline audio-inline-form"> <div class="form-group"> <label for="voicename_'+file.id+'">Name &nbsp;</label> <input type="text" id="voicename_'+file.id+'" name="voice_name" class="form-control input-xs" value="'+file.name+'" /> </div> <div class="form-group"><input type="hidden" id="voiceid_'+file.id+'" name="voice_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary voice-form-submit-button">Change</button> <button type="button" class="btn btn-danger voice-form-delete-button">Delete</button> </form> </div> </div> </div> </td></tr>'
					$(res).appendTo('.resource-list table tbody');
				}
				else if(file.resource_type == 6) {
					var res = '<tr><td> <div class="media video-media"> <div class="media-left video-player-area"> <video controls width="300" height="225" class="video-player" preload="none"> <video src="'+file.url+'"> </video> </div> <div class="media-body media-middle"> <div class="resource-property"> <form class="form-inline"> <div class="form-group"> <label for="videoname_'+file.id+'">Name &nbsp;</label> <input type="text" id="videoname_'+file.id+'" name="video_name" class="form-control input-sm" value="'+file.name+'" /> </div> <input type="hidden" id="videoid_'+file.id+'" name="video_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary video-form-submit-button">Change</button> <button type="button" class="btn btn-danger video-form-delete-button">Delete</button> </form> </div> </div> </div> </td></tr>'
					$(res).appendTo('.resource-list table tbody');
				}
			});
		},
		fail: function(e, data) {
			callErrorNotification("Upload failed! Try again!");
		}
		
	});
	
	//programatically set form data on upload start
	$('#fileupload').bind('fileuploadsubmit', function (e, data) {
		var restype_input = $('#resourcetype');
		var charname_input = $('#charactername');
		var figname_input = $('#figurename');
		if(restype_input.val() == 1) {
			data.formData = {
				restype: restype_input.val(),
				charname: charname_input.val(),
				figname: figname_input.val()
			};
		}
		// else if(restype_input.val() == 5) {
		// 	data.formData = {
		// 		restype: restype_input.val(),
		// 		charname: charname_input.val()
		// 	};
		// }
		else {
			data.formData = {restype: restype_input.val()};
		}
		if(!data.formData.restype) {
			return false;
		}
	});
});

function callErrorNotification(message) {
	var block = '<div class="alert alert-danger error-notification">'+message+'</div>';
	$('#notification').append(block).hide().fadeIn();
	window.setTimeout(function() {
		$('.error-notification').fadeTo(500, 0, function() {
			$(this).remove();
		});
	}, 5000);
}

//load content on resource type on navbar click and set resource type to use on file uplaod
var restype = $('#resourcetype');
$('#spritebutton').click(function() {
	restype.val("1");
	callResourceList(1);
});
$('#backgroundbutton').click(function() {
	restype.val("2");
	callResourceList(2);
});
$('#bgmbutton').click(function() {
	restype.val("3");
	callResourceList(3);
});
$('#sfxbutton').click(function() {
	restype.val("4");
	callResourceList(4);
});
$('#voicebutton').click(function() {
	restype.val("5");
	callResourceList(5);
});
$('#videobutton').click(function() {
	restype.val("6");
	callResourceList(6);
});

//drag hover effect
$(document).bind('dragover', function(e) {
	var dropzone = $('#dropshade'),
	timeout = window.dropzoneTimeout;
	if(!timeout) {
		dropzone.addClass('in');
	}
	else {
		clearTimeout(timeout);
	}
	var found = false,
	node = e.target;
	do {
		if(node === dropzone[0]) {
			found = true;
			break;
		}
		node = node.parentNode;
	}
	while(node != null);
	if(found) {
		dropzone.addClass('hover');
	}
	window.dropzoneTimeout = setTimeout(function(){
		window.dropzoneTimeout = null;
		dropzone.removeClass('in hover');
	}, 100);
});

//resource navbar click change active
$('.resource-navbar li').click(function(e) {
	$('.resource-navbar li.active').removeClass('active');
	var $this = $(this);
	if (!$this.hasClass('active')) {
		$this.addClass('active');
	}
	e.preventDefault();
});

//change background resource property
$('.resource-list').on("click", '.background-form-submit-button', function(e) {
	e.preventDefault();
	var selectform = this.form;
	var bg_id = $(selectform).find('[name=background_id]').val();
	var bg_name = $(selectform).find('[name=background_name]').val();
	var req = $.ajax({
		url: config.base+"index.php/resource/changeBackgroundProperty",
		type: "POST",
		data: {id: bg_id, name: bg_name},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$('#backgroundname_' + bg_id).css("background", "#FFFFFF");
			var not = '<div class="alert alert-success resourcechange-notification">Change saved!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourcechange-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed updating... try again later!")
		}
	});
});

//change sprite resource property
$('.resource-list').on("click", '.sprite-form-submit-button', function(e) {
	e.preventDefault();
	var selectform = this.form;
	var spr_id = $(selectform).find('[name=sprite_id]').val();
	var spr_ch = $(selectform).find('[name=sprite_character]').val();
	var spr_fg = $(selectform).find('[name=sprite_figure]').val();
	var spr_xp = $(selectform).find('[name=sprite_expression]').val();
	var req = $.ajax({
		url: config.base+"index.php/resource/changeSpriteProperty",
		type: "POST",
		data: {id: spr_id, character: spr_ch, figure: spr_fg, expression: spr_xp},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$('#spritecharactername_' + spr_id).css("background", "#FFFFFF");
			$('#spritefigurename_' + spr_id).css("background", "#FFFFFF");
			$('#spriteexpressionname_' + spr_id).css("background", "#FFFFFF");
			var not = '<div class="alert alert-success resourcechange-notification">Change saved!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourcechange-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed updating... try again later!")
		}
	});
});

// change bgm resource property
$('.resource-list').on("click", '.bgm-form-submit-button', function(e) {
	e.preventDefault();
	var selectform = this.form;
	var bgm_id = $(selectform).find('[name=bgm_id]').val();
	var bgm_name = $(selectform).find('[name=bgm_name]').val();
	var req = $.ajax({
		url: config.base+"index.php/resource/changeAudioVideoProperty",
		type: "POST",
		data: {id: bgm_id, name: bgm_name},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$('#bgmname_' + bgm_id).css("background", "#FFFFFF");
			var not = '<div class="alert alert-success resourcechange-notification">Change saved!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourcechange-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed updating... try again later!")
		}
	});
});

// change sfx resource property
$('.resource-list').on("click", '.sfx-form-submit-button', function(e) {
	e.preventDefault();
	var selectform = this.form;
	var sfx_id = $(selectform).find('[name=sfx_id]').val();
	var sfx_name = $(selectform).find('[name=sfx_name]').val();
	var req = $.ajax({
		url: config.base+"index.php/resource/changeAudioVideoProperty",
		type: "POST",
		data: {id: sfx_id, name: sfx_name},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$('#sfxname_' + sfx_id).css("background", "#FFFFFF");
			var not = '<div class="alert alert-success resourcechange-notification">Change saved!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourcechange-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed updating... try again later!")
		}
	});
});

// change voice resource property
$('.resource-list').on("click", '.voice-form-submit-button', function(e) {
	e.preventDefault();
	var selectform = this.form;
	var voi_id = $(selectform).find('[name=voice_id]').val();
	var voi_name = $(selectform).find('[name=voice_name]').val();
	// var voi_character = $(selectform).find('[name=voice_character]').val();
	var req = $.ajax({
		url: config.base+"index.php/resource/changeAudioVideoProperty",
		type: "POST",
		// data: {id: voi_id, name: voi_name, character: voi_character},
		data: {id: voi_id, name: voi_name},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$('#voicename_' + voi_id).css("background", "#FFFFFF");
			// $('#voicecharactername_' + voice_id).css("background", "#FFFFFF");
			var not = '<div class="alert alert-success resourcechange-notification">Change saved!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourcechange-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed updating... try again later!")
		}
	});
});

// change video resource property
$('.resource-list').on("click", '.video-form-submit-button', function(e) {
	e.preventDefault();
	var selectform = this.form;
	var vid_id = $(selectform).find('[name=video_id]').val();
	var vid_name = $(selectform).find('[name=video_name]').val();
	var req = $.ajax({
		url: config.base+"index.php/resource/changeAudioVideoProperty",
		type: "POST",
		data: {id: vid_id, name: vid_name},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$('#videoname_' + vid_id).css("background", "#FFFFFF");
			var not = '<div class="alert alert-success resourcechange-notification">Change saved!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourcechange-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed updating... try again later!")
		}
	});
});

// detect changed input value
$('.resource-list').on("keyup", 'input[type=text]', function() {
	$(this).css("background", "#FDFFD5");
});

// load resource list
function callResourceList(type) {
	var req = $.ajax({
		url: config.base + "index.php/resource/loadResource",
		type: "POST",
		data: {type: type},
		dataType: "html",
		beforeSend: function() {
			$('.request-loading-resourcelist').show();
		}
	});
	req.done(function(msg) {
		$('.request-loading-resourcelist').hide();
		$('.resource-list').html(msg);
	});
	//append additional form for sprite upload
	if(type == 1) {
		var html2append = '<div class="row"><div class="col-md-10 sprite-input-append"><p>Fill the Character and Pose Name before dropping your files</p><form class="form-inline"><label for="charactername">Character name</label> <input type="text" id="charactername" name="character_name" value="" /> <label for="figurename">Pose name</label> <input type="text" id="figurename" name="figure_name" value="" /></form></div></div>';
		// $(html2append).appendTo('.resource-preinput');
		$('.resource-preinput').html(html2append);
	}
	//append additional form for voice upload
	// else if(type == 5) {
	// 	var html2append = '<label for="charactername">Character name</label><input type="text" id="charactername" name="character_name" value="ageha" />';
	// 	// $(html2append).appendTo('.resource-preinput');
	// 	$('.resource-preinput').html(html2append);
	// }
	else {
		$('.resource-preinput').html('');
	}
}

// load resource list on start
$(document).ready( callResourceList(1) );

// delete sprite resource item
$('.resource-list').on("click", '.sprite-form-delete-button, .sprite-form-remove-button', function(e) {
	e.preventDefault();
	var selectform = $(this.form);
	var spr_id = $(this.form).find('[name=sprite_id]').val();
	var req = $.ajax({
		url: config.base + "index.php/resource/removeResource",
		type: "POST",
		data: {id: spr_id},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$(selectform).closest('.sprite-media, .sprite-thumbnail-image').remove();
			var not = '<div class="alert alert-warning resourceremove-notification">Resource deleted!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourceremove-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed deleting... try again later!")
		}
	});
});

// delete background resource item
$('.resource-list').on("click", '.background-form-delete-button', function(e) {
	e.preventDefault();
	var selectform = $(this.form);
	var spr_id = $(this.form).find('[name=background_id]').val();
	var req = $.ajax({
		url: config.base + "index.php/resource/removeResource",
		type: "POST",
		data: {id: spr_id},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$(selectform).closest('.background-media').remove();
			var not = '<div class="alert alert-warning resourceremove-notification">Resource deleted!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourceremove-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed deleting... try again later!")
		}
	});
});

// delete bgm resource item
$('.resource-list').on("click", '.bgm-form-delete-button', function(e) {
	e.preventDefault();
	var selectform = $(this.form);
	var spr_id = $(this.form).find('[name=bgm_id]').val();
	var req = $.ajax({
		url: config.base + "index.php/resource/removeResource",
		type: "POST",
		data: {id: spr_id},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$(selectform).closest('tr').remove();
			var not = '<div class="alert alert-warning resourceremove-notification">Resource deleted!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourceremove-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed deleting... try again later!")
		}
	});
});

// delete sfx resource item
$('.resource-list').on("click", '.sfx-form-delete-button', function(e) {
	e.preventDefault();
	var selectform = $(this.form);
	var sfx_id = $(this.form).find('[name=sfx_id]').val();
	var req = $.ajax({
		url: config.base + "index.php/resource/removeResource",
		type: "POST",
		data: {id: sfx_id},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$(selectform).closest('tr').remove();
			var not = '<div class="alert alert-warning resourceremove-notification">Resource deleted!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourceremove-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed deleting... try again later!")
		}
	});
});

// delete voice resource item
$('.resource-list').on("click", '.voice-form-delete-button', function(e) {
	e.preventDefault();
	var selectform = $(this.form);
	var voice_id = $(this.form).find('[name=voice_id]').val();
	var req = $.ajax({
		url: config.base + "index.php/resource/removeResource",
		type: "POST",
		data: {id: voice_id},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$(selectform).closest('tr').remove();
			var not = '<div class="alert alert-warning resourceremove-notification">Resource deleted!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourceremove-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed deleting... try again later!")
		}
	});
});

// delete video resource item
$('.resource-list').on("click", '.video-form-delete-button', function(e) {
	e.preventDefault();
	var selectform = $(this.form);
	var vid_id = $(this.form).find('[name=video_id]').val();
	var req = $.ajax({
		url: config.base + "index.php/resource/removeResource",
		type: "POST",
		data: {id: vid_id},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == 1) {
			$(selectform).closest('tr').remove();
			var not = '<div class="alert alert-warning resourceremove-notification">Resource deleted!</div>';
			$('#notification').append(not).hide().fadeIn();
			window.setTimeout(function() {
				$('.resourceremove-notification').fadeTo(500, 0, function() {
					$(this).remove();
				});
			}, 5000);
		}
		else {
			callErrorNotification("Failed deleting... try again later!")
		}
	});
});