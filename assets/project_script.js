$('.edit-published-button').click(return confirm('Are you sure?'));

$('#newprojectbutton').click(function() {
	$('#newprojectmodal').modal('show');
})
$('.modal-dialog').draggable({
	//handle: ".modal-header"
});
$('#newprojectsubmit').click(function() {
	var ttl = $('#title').val();
	var desc = $('#description').val();
	if(ttl == '') {
		alert("must not empty");
	}
	else {
		var req = $.ajax({
			url: config.base+"index.php/project/newProject",
			type: "POST",
			data: {
				title: ttl,
				description: desc
			},
			dataType: "json",
			beforeSend: function() {
				$('.request-loading-newproject').show();
			}
		});
		req.done(function(msg) {
			$('.request-loading-newproject').hide();
			if(!msg) {
				$('#newprojectmodal').modal('hide');
				var not = '<div class="alert alert-danger newproject-notification">Failed to create new project!</div>';
				$('#notification').append(not).hide().fadeIn();
				window.setTimeout(function() {
					$('.newproject-notification').fadeTo(500, 0, function() {
						$(this).remove();
					});
				}, 5000);
			}
			else {
				$('#newprojectmodal').modal('hide');
				var not = '<div class="alert alert-success newproject-notification">New project successfully created!</div>';
				$('#notification').append(not).hide().fadeIn();
				window.setTimeout(function() {
					$('.newproject-notification').fadeTo(500, 0, function() {
						$(this).remove();
					});
				}, 5000);
				var block = '<div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;"> <div class="media-left"> <img src="../resources/'+value.fk_user_id+'/'+value.project_id+'/'+value.cover+'" class="media-object project-cover" /> </div> <div class="media-body" style="margin: 15px;"> <div class="project-title"> <h3 class="media-heading">'+value.title+'</h3> </div> <div> <dl class="dl-horizontal" style="margin-left:-50px;"> <dt>Description: </dt> <dd>'+value.description+'</dd> <dt>Created: </dt> <dd>'+value.created_date+'</dd> <dt>Last update: </dt> <dd>'+value.updated_date+'</dd> <dt>Status: </dt> <dd>'+value.status+'</dd> </dl> </div> <div class="project-action pull-right"> <a href="'+config.base+'index.php/project/resource/'+value.project_id+'" class="btn btn-warning">Resource Editor</a> <a href="'+config.base+'index.php/project/editor/'+value.project_id+'" class="btn btn-warning">VN Editor</a> <a href="'+config.base+'index.php/game/play/'+value.project_id+'" class="btn btn-info ?>">Play</a> </div> </div> </div>';
				$(block).appendTo('.project-list');
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
		$('#title').val('');
	}
});

function callProjectList() {
	var req = $.ajax({
		url: config.base + "index.php/project/loadProject",
		type: "POST",
		dataType: "json",
		beforeSend: function() {
			$('.request-loading-projectlist').show();
		}
	});
	req.done(function(msg) {
		$('.request-loading-projectlist').hide();
		$.each(msg, function(index, value) {
			var block = ' <div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;"> <div class="media-left"> <img src="../resources/'+value.fk_user_id+'/'+value.project_id+'/'+value.cover+'" class="media-object project-cover" /> </div> <div class="media-body" style="margin: 15px;"> <div class="project-title"> <h3 class="media-heading">'+value.title+'</h3> </div> <div> <dl class="dl-horizontal" style="margin-left:-50px;"> <dt>Description: </dt> <dd>'+value.description+'</dd> <dt>Created: </dt> <dd>'+value.created_date+'</dd> <dt>Last update: </dt> <dd>'+value.updated_date+'</dd> <dt>Status: </dt> <dd>'+value.status+'</dd> </dl> </div> <div class="project-action pull-right"> <a href="'+config.base+'index.php/project/resource/'+value.project_id+'" class="btn btn-warning">Resource Editor</a> <a href="'+config.base+'index.php/project/editor/'+value.project_id+'" class="btn btn-warning">VN Editor</a> <a href="'+config.base+'index.php/game/play/'+value.project_id+'" class="btn btn-info ?>">Play</a> </div> </div> </div>';
			$(block).appendTo('.project-list');
		});
	})
}
// $(document).ready( callProjectList );