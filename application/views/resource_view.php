<div class="container-fluid" style="margin: 30px 10px 20px;">
<div id="notification"></div>
<div id="dropshade"></div>
<div class="row">
	<div class="col-md-10" style="background-color: rgba(0, 0, 0, 0.1); border: 0px strip #000; padding: 20px;">

		<?php if(isset($error)) echo($error); ?>
		<?php echo form_open_multipart('home/do_upload'); ?>
		<!--input type="file" multiple name="userfile[]"/-->

		<input type="file" id="fileupload" name="userfile" multiple />
		<input type="hidden" id="resourcetype" name="resourcetype" value="background" />
		<input type="submit" id="upload" value="upload" />
		</form>
		
		<div id="progress">
		<div class="bar" style="width: 0%;"></div>
		</div>

		<div>
		<ul class="nav nav-tabs resource-navbar">
			<li role="presentation" class="active"><a href="#" id="backgroundbutton">Background</a></li>
			<li role="presentation"><a href="#" id="spritebutton">Sprites</a></li>
			<li role="presentation"><a href="#" id="musicbutton">BGM</a></li>
			<li role="presentation"><a href="#" id="voicebutton">Voice</a></li>
		</ul>
		</div>
		<div id="resourcelist" class="resource-list">
		</div>
	</div>

</div>
</div>

<script type="text/javascript">


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
					var res = '<p>' + file.id + '</p>';
// layout!
// <div class="media" style="background-color: #ddffff; margin: 5px; padding: 10px;">
// 	<div class="media-left">
// 		<img src="'+file.url+'" class="media-object resource-thumbnail" />
// 	</div>
// 	<div class="media-body">
// 		<div class="resource-property">
// 			<form class="form-inline">
// 				<div class="form-group">
// 					<label for="backgroundname_'+file.id+'">Name</label>
// 					<input type="text" id="backgroundname_'+file.id+'" class="form-control" />
// 				</div>
// 				<input type="hidden" id="backgroundid_'+file.id+'" value="'+file.id+'" />
// 				<button type="button" id="backgroundpropertysubmit" class="btn btn-primary">Change</button>
// 			</form>
// 		</div>
// 	</div>
// </div>
					var res = '<div class="media" style="background-color: #ddffff; margin: 5px; padding: 10px;"><div class="media-left resource-thumbnail-area"><img src="'+file.url+'" class="media-object resource-thumbnail" /></div><div class="media-body"><div class="resource-property"><form class="form-inline"><div class="form-group background-form"><label for="backgroundname_'+file.id+'">Name &nbsp;</label><input type="text" id="backgroundname_'+file.id+'" name="background_name" class="form-control" value="'+file.name+'" /></div><input type="hidden" id="backgroundid_'+file.id+'" name="background_id" value="'+file.id+'" /><button type="button" class="btn btn-primary background-form-submit-button">Change</button></form></div></div></div>';
					$(res).appendTo('.resource-list');
					console.log(data.result);
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
			data.formData = {restype: restype_input.val()};
			if(!data.formData.restype) {
				return false;
			}
		});
	});

	//load content on resource type tab select
	//define restype variable
	var restype = $('#resourcetype');
	$('#backgroundbutton').click(function() {
		restype.val("background");
		var req = $.ajax({
			url: config.base+"index.php/resource/loadResource",
			type: "POST",
			data: {type: "2"},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
		});
		req.done(function(msg) {
			$('.resource-list').html(msg);
		});
	});
	$('#spritebutton').click(function() {
		restype.val("sprite");
		var req = $.ajax({
			url: config.base+"index.php/resource/loadResource",
			type: "POST",
			data: {type: "1"},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
		});
		req.done(function(msg) {
			$('.resource-list').html(msg);
		});
	});
	$('#musicbutton').click(function() {
		var req = $.ajax({
			url: config.base+"index.php/resource/loadResource",
			type: "POST",
			data: {type: "3"},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
		});
		req.done(function(msg) {
			$('.resource-list').html(msg);
		});
	});
	$('#voicebutton').click(function() {
		restype.val("voice");
		var req = $.ajax({
			url: config.base+"index.php/resource/loadResource",
			type: "POST",
			data: {type: "5"},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
		});
		req.done(function(msg) {
			$('.resource-list').html(msg);
		});
	});

	$(document).bind('drop dragover', function(e){
		//e.preventDefault();
	});

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


	$('.resource-navbar li').click(function(e) {
		$('.resource-navbar li.active').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
	});

	$('.resource-list').on("click", '.background-form-submit-button', function(e) {
		console.log("background submit accessed");
		e.preventDefault();
		var selectform = this.form;
		var bgi = $(selectform).find('[name=background_id]').val();
		var bgn = $(selectform).find('[name=background_name]').val();
		var req = $.ajax({
			url: config.base+"index.php/resource/changeBackgroundProperty",
			type: "POST",
			data: {id: bgi, name: bgn},
			dataType: "html",
			beforeSend: function() {
				//placeholder
			}
		});
		req.done(function(msg) {
			if(msg == 1) {
				$('#backgroundname_' + bgi).css("background", "#FFFFFF");
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

	//detect changed input value
	$('.resource-list').on("keyup", 'input[type=text]', function() {
		$(this).css("background", "#FDFFD5");
	});

	
</script>

<style type="text/css">
	.resource-thumbnail-area {
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
	.resource-thumbnail {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}
	.resource-property {
		margin: 5px 10px;
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
</style>
