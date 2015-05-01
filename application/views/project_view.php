<div class="container-fluid" style="margin: 30px 10px 20px">
	<div id="notification">
	</div>
	<div class="row">
		<div class="col-md-1">
			<!--button type="button" id="newprojectbutton" class="btn btn-primary" data-toggle="modal" data-target="#newprojectmodal">New Project</button-->
			<button type="button" id="newprojectbutton" class="btn btn-primary">New Project</button>
			<!--Modal-->
			<div id="newprojectmodal" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">New Project</h4>
						</div>
						<div class="modal-body">
							<form>
								<div class="form-group">
									<label for="title" class="control-label">Title</label>
									<input type="text" id="title" name="title" class="form-control">
								</div>
							</form>
						</div>
						<div class="modal-footer">
							
							<span class="request-loading request-loading-newproject" style="">
								<img src="../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."/>
							</span>
							<button type="button" id="newprojectsubmit" class="btn btn-primary">Create</button>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row" style="margin-top: 15px;">
		<div class="col-md-9">
			<span class="request-loading request-loading-projectlist" style="">
				<img src="../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."/>
			</span>
			<div class="project-list">
				
			</div>
		</div>
	</div>
						
</div>

<style type="text/css">
	.request-loading {
		display:none;
		position: relative;
		opacity: 0.8;
		color: #333;
	}
	.project-cover {
		width: 200px;
		height: 150px;
	}
	.newproject-notification {
		position: absolute;
		z-index: 3;
		right: 5%;
	}
</style>

<script type="text/javascript">
	$('#newprojectbutton').click(function() {
		$('#newprojectmodal').modal('show');
	})
	$('.modal-dialog').draggable({
		//handle: ".modal-header"
	});
	$('#newprojectsubmit').click(function() {
		var ttl = $('#title').val();
		if(ttl == '') {
			alert("must not empty");
		}
		var req = $.ajax({
			url: config.base+"index.php/project/newProject",
			type: "POST",
			data: {title: ttl},
			dataType: "html",
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
	});
	
	function callProjectList() {
		var req = $.ajax({
			url: config.base + "index.php/project/loadProject",
			type: "POST",
			dataType: "html",
			beforeSend: function() {
				$('.request-loading-projectlist').show();
			}
		});
		req.done(function(msg) {
			$('.request-loading-projectlist').hide();
			$('.project-list').html(msg);
		})
	}
	$(document).ready( callProjectList );
</script>
