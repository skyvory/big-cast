<div class="container-fluid">
	<div class="page-header">
		<h2>My Project</h2>
	</div>
	<div id="notification">
	</div>
	<div class="row">
		<div class="col-md-1">
			<!--button type="button" id="newprojectbutton" class="btn btn-primary" data-toggle="modal" data-target="#newprojectmodal">New Project</button-->
			<!-- <button type="button" id="newprojectbutton" class="btn btn-primary">New Project</button> -->
			<a href="<?php echo base_url(); ?>index.php/project/new" class="btn btn-primary" data-intro="Use this button to open the page to create a new project." data-step=6 data-position="right">New Project</a>
			<!--Modal-->
			<!-- <div id="newprojectmodal" class="modal fade" role="dialog">
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
								<div class="form-group">
									<label for="description" class="control-label">Description</label>
									<input type="text" id="description" name="description" class="form-control">
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
			</div> -->
		</div>
	</div>

	<div class="row" style="margin-top: 15px;">
		<div class="col-md-9">
			<div class="project-list">

			<?php foreach($project as $value): ?>
				 <div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;" data-step="7" data-intro="This is an example of a newly created project.">
					<div class="media-left">
						<img src="<?php if(isset($value['cover']) && $value['cover'] == 1) { echo base_url() . 'resources/' . $value['fk_user_id'] . '/' . $value['project_id'] .'/cover.jpg'; } else { echo base_url() . '/assets/images/no_image.png'; } ?>" class="media-object project-cover" />
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h3 class="media-heading"><?php echo $value['title']; ?></h3>
						</div>
						<div>
							<dl class="dl-horizontal" style="margin-left:-50px;">
							<dt>Description: </dt>
							<dd><?php echo $value['description']; ?></dd>
							<dt>Created: </dt>
							<dd><?php echo $value['created_date']; ?></dd>
							<dt>Last update: </dt>
							<dd><?php echo $value['updated_date']; ?></dd>
							<dt>Status: </dt>
							<dd><?php echo $value['status']; ?></dd>
							</dl>
						</div>
						<div class="project-action pull-right">
							<a href="<?php echo base_url(); ?>index.php/project/setting/<?php echo $value['project_id']; ?>" class="btn btn-default" data-step="8" data-intro="There are some things you can do in setting page, like change the project's title, description, and cover image, publish the project, and delete the project">Setting</a>
							<a href="<?php echo base_url(); ?>index.php/project/resource/<?php echo $value['project_id']; ?>" class="btn btn-warning" data-step="9" data-intro="This button is for accessing resource management page.">Resource Editor</a>
							<a href="<?php echo base_url(); ?>index.php/project/editor/<?php echo $value['project_id']; ?>"  
							<?php if($value['fk_projectstatus_id'] == 1) { 
								echo 'class="btn btn-warning"'; 
							} 
							else if($value['fk_projectstatus_id'] == 2) {
								echo 'class="btn btn-danger" onclick="return confirm(\'Entering editor of a published project will unpublish it. Keep going?\')"'; } ?>
							" data-step="10" data-intro="This button is for accessing the page to build your visual novel.">VN Editor</a>
							<a href="<?php echo base_url(); ?>index.php/game/play/<?php echo $value['project_id']; ?>" class="btn btn-info ?>" data-step="11" data-intro="And this button is to play your visual novel.<br><br>Now let's go to resource management page.">Play</a>
						</div>
					</div>
				</div>
			<?php endforeach ?>


			</div>
			<center>
				<?php echo $page; ?>
			</center>
		</div>
	</div>
						
</div>

<script type="text/javascript">
	var dummy_id;
	var req = $.ajax({
		url: config.base + 'index.php/project/idDummy',
		type: 'POST',
		dataType: "html"
	});
	req.done(function(msg) {
		dummy_id = msg;
	});
	if(RegExp('multipage', 'gi').test(window.location.search)) {
		introJs().setOption('doneLabel', 'Next page').goToStep(5).start().oncomplete(function() {
			window.location.href = 'project/resource/'+dummy_id+'?multipage=true';
		});
	}
</script>