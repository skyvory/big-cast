<div class="container-fluid" style="margin: 30px 10px 20px;">
<div id="notification"></div>
<!-- <div id="dropshade"></div> -->
<div class="row">
	<div class="col-md-10 resource-area">

		<?php if(isset($error)) echo($error); ?>
		<?php echo form_open_multipart('home/do_upload'); ?>
		<!--input type="file" multiple name="userfile[]"/-->
		<h3>Drop files anywhere on this page.</h3>
		<p>Or use browse button below.</p>
		<input type="file" id="fileupload" name="userfile" multiple />
		<input type="hidden" id="resourcetype" name="resourcetype" value="1" />
		<!-- <input type="submit" id="upload" value="upload" /> -->
		</form>
		
		<div id="progress">
		<div class="bar" style="width: 0%;"></div>
		</div>

		<div>
		<ul class="nav nav-tabs resource-navbar">
			<li role="presentation" class="active"><a href="#" id="spritebutton">Sprites</a></li>
			<li role="presentation"><a href="#" id="backgroundbutton">Background</a></li>
			<li role="presentation"><a href="#" id="bgmbutton">BGM</a></li>
			<li role="presentation"><a href="#" id="sfxbutton">SFX</a></li>
			<li role="presentation"><a href="#" id="voicebutton">Voice</a></li>
			<li role="presentation"><a href="#" id="videobutton">Video</a></li>
		</ul>
		</div>
		<div class="resource-preinput">
		</div>
		<span class="request-loading request-loading-resourcelist" style="">
			<img src="../../../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."/>
		</span>
		<div class="resource-list">
		</div>
	</div>

</div>
</div>


<!-- sprite form template
<div class="media sprite-media">
	<div class="media-left sprite-thumbnail-area">
		<img src="'+file.url+'" class="media-object resource-thumbnail" />
	</div>
	<div class="media-body">
		<div class="resource-property">
			<form class="form-horizontal sprite-form">
				<div class="form-group">
					<label for="spritecharactername_'+file.id+'" class="col-sm-2 control-label">Character Name</label>
					<div class="col-sm-10">
					<input type="text" id="spritecharactername_'+file.id+'" name="sprite_character" class="form-control input-sm" value="'+file.character_name+'" />
					</div>
				</div>
				<div class="form-group">
					<label for="spritefigurename_'+file.id+'" class="col-sm-2 control-label">Pose Name</label>
					<div class="col-sm-10">
					<input type="text" id="spritefigurename_'+file.id+'" name="sprite_figure" class="form-control input-sm" value="'+file.figure_name+'" />
					</div>
				</div>
				<div class="form-group">
					<label for="spriteexpressionname_'+file.id+'" class="col-sm-2 control-label">Expression Name</label>
					<div class="col-sm-10">
					<input type="text" id="spriteexpressionname_'+file.id+'" name="sprite_expression" class="form-control input-sm" />
					</div>
				</div>
				<input type="hidden" id="spriteid_'+file.id+'" name="sprite_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary sprite-form-submit-button">Change</button>
				<button type="button" class="btn btn-primary sprite-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
 -->

<!-- background form template
<div class="media background-media">
	<div class="media-left background-thumbnail-area">
		<img src="'+file.url+'" class="media-object resource-thumbnail" />
	</div>
	<div class="media-body">
		<div class="resource-property">
			<form class="form-inline background-form">
				<div class="form-group">
				<label for="backgroundname_'+file.id+'">Name &nbsp;</label>
				<input type="text" id="backgroundname_'+file.id+'" name="background_name" class="form-control input-sm" value="'+file.name+'" />
				</div>
				<input type="hidden" id="backgroundid_'+file.id+'" name="background_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary background-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger background-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
 -->

<!-- bgm form template
<tr><td>
<div class="media bgm-media">
	<div class="media-left audio-thumbnail-area">
		<img src="../../../assets/images/musical_note-512.png" class="media-object resource-thumbnail"/>
	</div>
	<div class="media-body">
		<div class="resource-property">
			<div class="audio-player-area">
				<audio controls preload="none">
					<source src="'+file.url+'">
				</audio>
			</div>
			<form class="form-inline audio-inline-form">
				<div class="form-group bgm-form">
					<label for="bgmname_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="bgmname_'+file.id+'" name="bgm_name" class="form-control input-xs" value="'+file.name+'" />
				</div>
				<input type="hidden" id="bgmid_'+file.id+'" name="bgm_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary bgm-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger bgm-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<!-- sfx form template
<tr><td>
<div class="media sfx-media">
	<div class="media-left audio-thumbnail-area">
		<img src="../../../assets/images/Audio-512.png" class="media-object resource-thumbnail"/>
	</div>
	<div class="media-body">
		<div class="resource-property">
			<div class="audio-player-area">
				<audio controls>
					<source src="'+file.url+'">
				</audio>
			</div>
			<form class="form-inline audio-inline-form">
				<div class="form-group sfx-form">
					<label for="sfxname_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="sfxname_'+file.id+'" name="sfx_name" class="form-control input-xs" value="'+file.name+'" />
				</div>
				<input type="hidden" id="sfxid_'+file.id+'" name="sfx_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary sfx-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger sfx-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<!-- voice form template
<tr><td>
<div class="media voice-media">
	<div class="media-left audio-thumbnail-area">
		<img src="../../../assets/images/microphone-2-512.png" class="media-object resource-thumbnail"/>
	</div>
	<div class="media-body">
		<div class="resource-property">
			<div class="audio-player-area">
				<audio controls class="audio-player">
					<source src="'+file.url+'">
				</audio>
			</div>
			<form class="form-inline audio-inline-form">
				<div class="form-group">
					<label for="voicename_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="voicename_'+file.id+'" name="voice_name" class="form-control input-xs" value="'+file.name+'" />
				</div>
				<div class="form-group">
					<label for="voicecharactername_'+file.id+'">Character Name &nbsp;</label>
					<input type="text" id="voicecharactername_'+file.id+'" name="voicecharacter_name" class="form-control input-xs" value="'+file.character_name+'" />
				</div>
				<input type="hidden" id="voiceid_'+file.id+'" name="voice_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary voice-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger voice-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<!-- video form template
<tr><td>
<div class="media video-media">
	<div class="media-left video-player-area">
		<video controls width="300" height="225" class="video-player">
			<source src="'+file.url+'">
		</video>
	</div>
	<div class="media-body media-middle">
		<div class="resource-property">
			<form class="form-inline">
				<div class="form-group">
					<label for="videoname_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="videoname_'+file.id+'" name="video_name" class="form-control input-sm" value="'+file.name+'" />
				</div>
				<input type="hidden" id="videoid_'+file.id+'" name="video_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary video-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger video-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<script type="text/javascript">


	//for file upload
	$(function(){

		$('#fileupload').fileupload({
			//dropZone: $('body'),
			url: 'http://localhost/cast/index.php/resource/do_upload',
			dataType: 'json',
			//maxChunkSize: 1000000,
			drop: function (e, data) {
				$.each(data.files, function (index, file) {
					// console.log('Dropped file: ' + file.name);
				});
			},
			//calculate progress
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .bar').css(
					'width',
					progress + '%'
				);
			},
			done: function (e, data) {
				$.each(data.result.files, function (index, file) {
					console.log(data.result);
					if(file.resource_type == "1") {
						console.log("ok");
						var res = '<div class="media sprite-media"> <div class="media-left sprite-thumbnail-area"> <img src="'+file.url+'" class="media-object resource-thumbnail" /> </div> <div class="media-body"> <div class="resource-property"> <form class="form-horizontal sprite-form"> <div class="form-group"> <label for="spritecharactername_'+file.id+'" class="col-sm-2 control-label">Character Name</label> <div class="col-sm-10"> <input type="text" id="spritecharactername_'+file.id+'" name="sprite_character" class="form-control input-sm" value="'+file.character_name+'" /> </div> </div> <div class="form-group"> <label for="spritefigurename_'+file.id+'" class="col-sm-2 control-label">Pose Name</label> <div class="col-sm-10"> <input type="text" id="spritefigurename_'+file.id+'" name="sprite_figure" class="form-control input-sm" value="'+file.figure_name+'" /> </div> </div> <div class="form-group"> <label for="spriteexpressionname_'+file.id+'" class="col-sm-2 control-label">Expression Name</label> <div class="col-sm-10"> <input type="text" id="spriteexpressionname_'+file.id+'" name="sprite_expression" class="form-control input-sm" /> </div> </div> <input type="hidden" id="spriteid_'+file.id+'" name="sprite_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary sprite-form-submit-button">Change</button> <button type="button" class="btn btn-danger sprite-form-delete-button">Delete</button> </form> </div> </div> </div>';
						$(res).appendTo('.resource-list');
					}
					else if(file.resource_type == 2) {
						var res = '<div class="media background-media"> <div class="media-left background-thumbnail-area"> <img src="'+file.url+'" class="media-object resource-thumbnail" /> </div> <div class="media-body"> <div class="resource-property"> <form class="form-inline background-form"> <div class="form-group"> <label for="backgroundname_'+file.id+'">Name &nbsp;</label> <input type="text" id="backgroundname_'+file.id+'" name="background_name" class="form-control input-sm" value="'+file.name+'" /> </div> <input type="hidden" id="backgroundid_'+file.id+'" name="background_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary background-form-submit-button">Change</button> <button type="button" class="btn btn-danger background-form-delete-button">Delete</button> </form> </div> </div> </div>';
						$(res).appendTo('.resource-list');
					}
					else if(file.resource_type == 3) {
						var res = '<tr><td> <div class="media bgm-media"> <div class="media-left audio-thumbnail-area"> <img src="../../../assets/images/musical_note-512.png" class="media-object resource-thumbnail"/> </div> <div class="media-body"> <div class="resource-property"> <div class="audio-player-area"> <audio controls preload="none"> <source src="'+file.url+'"> </audio> </div> <form class="form-inline audio-inline-form"> <div class="form-group bgm-form"> <label for="bgmname_'+file.id+'">Name &nbsp;</label> <input type="text" id="bgmname_'+file.id+'" name="bgm_name" class="form-control input-xs" value="'+file.name+'" /> </div> <input type="hidden" id="bgmid_'+file.id+'" name="bgm_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary bgm-form-submit-button">Change</button> <button type="button" class="btn btn-danger bgm-form-delete-button">Delete</button> </form> </div> </div> </div> </td></tr>'
						$(res).appendTo('.resource-list table tbody');
					}
					else if(file.resource_type == 4) {
						var res = '<div class="media sfx-media"> <div class="media-left audio-thumbnail-area"> <img src="../../../assets/images/Audio-512.png" class="media-object resource-thumbnail"/> </div> <div class="media-body"> <div class="resource-property"> <div class="audio-player-area"> <audio controls preload="none"> <source src="'+file.url+'"> </audio> </div> <form class="form-inline audio-inline-form"> <div class="form-group sfx-form"> <label for="sfxname_'+file.id+'">Name &nbsp;</label> <input type="text" id="sfxname_'+file.id+'" name="sfx_name" class="form-control input-xs" value="'+file.name+'" /> </div> <input type="hidden" id="sfxid_'+file.id+'" name="sfx_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary sfx-form-submit-button">Change</button> <button type="button" class="btn btn-danger sfx-form-delete-button">Delete</button> </form> </div> </div> </div>'
						$(res).appendTo('.resource-list table tbody');
					}
					else if(file.resource_type == 5) {
						var res = '<tr><td> <div class="media voice-media"> <div class="media-left audio-thumbnail-area"> <img src="../../../assets/images/microphone-2-512.png" class="media-object resource-thumbnail"/> </div> <div class="media-body"> <div class="resource-property"> <div class="audio-player-area"> <audio controls preload="none" class="audio-player"> <source src="'+file.url+'"> </audio> </div> <form class="form-inline audio-inline-form"> <div class="form-group"> <label for="voicename_'+file.id+'">Name &nbsp;</label> <input type="text" id="voicename_'+file.id+'" name="voice_name" class="form-control input-xs" value="'+file.name+'" /> </div> <div class="form-group"><input type="hidden" id="voiceid_'+file.id+'" name="voice_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary voice-form-submit-button">Change</button> <button type="button" class="btn btn-danger voice-form-delete-button">Delete</button> </form> </div> </div> </div> </td></tr>'
						$(res).appendTo('.resource-list table tbody');
					}
					else if(file.resource_type == 6) {
						var res = '<tr><td> <div class="media video-media"> <div class="media-left video-player-area"> <video controls width="300" height="225" class="video-player"> <video src="'+file.url+'"> </video> </div> <div class="media-body media-middle"> <div class="resource-property"> <form class="form-inline"> <div class="form-group"> <label for="videoname_'+file.id+'">Name &nbsp;</label> <input type="text" id="videoname_'+file.id+'" name="video_name" class="form-control input-sm" value="'+file.name+'" /> </div> <input type="hidden" id="videoid_'+file.id+'" name="video_id" value="'+file.id+'" /> <button type="button" class="btn btn-primary video-form-submit-button">Change</button> <button type="button" class="btn btn-danger video-form-delete-button">Delete</button> </form> </div> </div> </div> </td></tr>'
						$(res).appendTo('.resource-list table tbody');
					}
				});
				// $.each(data.files, function (index, file) {
				// 	$('<p/>').text(file.name).appendTo('.resource-list');
				// 	console.log(data.files);
				// });
			},
			fail: function(e, data) {
				console.log("fail!");
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
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
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
				console.log("fail");
			}
		});
		req.fail(function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 0) {
				console.log('Not connected.\n Verify Network.');
			} else if (jqXHR.status == 404) {
				console.log('Requested page not found. [404]');
			} else if (jqXHR.status == 500) {
				console.log('Internal Server Error [500].');
			} else if (exception === 'parsererror') {
				console.log('Requested JSON parse failed.');
			} else if (exception === 'timeout') {
				console.log('Time out error.');
			} else if (exception === 'abort') {
				console.log('Ajax request aborted.');
			} else {
				console.log('Uncaught Error.\n' + jqXHR.responseText);
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
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
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
				console.log("fail");
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
			url: config.base+"index.php/resource/changeAudioProperty",
			type: "POST",
			data: {id: bgm_id, name: bgm_name},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
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
				console.log("fail");
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
			url: config.base+"index.php/resource/changeAudioProperty",
			type: "POST",
			data: {id: sfx_id, name: sfx_name},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
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
				console.log("fail");
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
			url: config.base+"index.php/resource/changeVoiceProperty",
			type: "POST",
			// data: {id: voi_id, name: voi_name, character: voi_character},
			data: {id: voi_id, name: voi_name},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
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
				console.log("fail");
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
			url: config.base+"index.php/resource/changeVideoProperty",
			type: "POST",
			data: {id: vid_id, name: vid_name},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
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
				console.log("fail");
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
			var html2append = '<div class="row"><div class="col-md-10 sprite-input-append"><form class="form-inline"><label for="charactername">Character name</label> <input type="text" id="charactername" name="character_name" value="" /> <label for="figurename">Pose name</label> <input type="text" id="figurename" name="figure_name" value="" /></form></div></div>';
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
			dataType: "html",
			beforeSend: function(){
				//placeholder
			}
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
				//placeholder
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
			dataType: "html",
			beforeSend: function(){
				//placeholder
			}
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
				//placeholder
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
			dataType: "html",
			beforeSend: function(){
				//placeholder
			}
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
				//placeholder
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
			dataType: "html",
			beforeSend: function(){
				//placeholder
			}
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
				//placeholder
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
			dataType: "html",
			beforeSend: function(){
				//placeholder
			}
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
				//placeholder
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
			dataType: "html",
			beforeSend: function(){
				//placeholder
			}
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
				//placeholder
			}
		});
	});

	
</script>

<style type="text/css">
	/*duplicate*/
	.request-loading {
		display:none;
		position: relative;
		opacity: 0.8;
		color: #333;
	}
	.background-thumbnail-area {
		width: 80px;
		height: auto;
		max-width: 80px;
		max-height: 80px;
		margin: 1px auto;
		padding: 1px;
		float: left;
		vertical-align: middle;
		text-align: center;
	}
	.sprite-thumbnail-area {
		width: 300px;
		height: auto;
		max-width: 300px;
		max-height: 300px;
		margin: 1px auto;
		padding: 1px;
		float: left;
		vertical-align: middle;
		text-align: center;
	}
	.audio-thumbnail-area {
		width: 30px;
		height: auto;
		max-width: 30px;
		max-height: 30px;
		margin: 1px auto;
		padding: 1px;
		float: left;
		vertical-align: middle;
		text-align: center;
	}
	.resource-thumbnail {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}
	.resource-property {
		margin: 5px 10px;
	}
	.background-media {
		background-color: #ddffff; 
		margin: 5px; 
		padding: 10px;
		font-size: 0.7em;
	}
	.sprite-media {
		background-color: #B9E5FF; 
		margin: 5px; 
		padding: 10px;
		font-size: 0.7em;
	}
	.resourcechange-notification {
		position: fixed;
		z-index: 3;
		top: 15%;
		right: 5%;
	}
	.resourceremove-notification {
		position: fixed;
		z-index: 3;
		top: 15%;
		right: 5%;
	}
	.audio-inline-form {
		display: inline-block;
	}
	.audio-player-area {
		display:inline-block; 
		vertical-align: middle;
	}
	/*smaller input size*/
	.input-xs {
		height: 22px;
		padding: 2px 5px;
		font-size: 12px;
		line-height: 1.5;
		border-radius: 3px;
	}
	/*customize table border style*/
	table td {
		border-top-width: 1px !important;
		border-top-color: #FF8989 !important;
	}
	/*remove first border line on table*/
	.table > tbody > tr:first-child > td {
		border: none;
	}
	.audio-player {
		width: 200px;
	}



	body {}
	.bar {
		height: 18px;
		background: green;
	}

	#dropshade {
		background: rgba(255, 255, 255, 0);
		width: 600px;
		height: 400px;
		position: absolute;
		line-height: 50px;
		text-align: center;
		z-index: 0;
	}
	#dropshade.in {
		width: 800px;
		height: 500px;
		line-height: 200px;
	}
	#dropshade.hover {
		background: lawngreen;
		opacity: 0.4;
	}
	#dropshade.fade {
		-webkit-transition: all 0.3s ease-out;
		-moz-transition: all 0.3s ease-out;
		-ms-transition: all 0.3s ease-out;
		-o-transition: all 0.3s ease-out;
		transition: all 0.3s ease-out;
		opacity: 1;
	}
	.sprite-input-append {
		margin: 10px;
	}
</style>
