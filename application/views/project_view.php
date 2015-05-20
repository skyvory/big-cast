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
			<a href="<?php echo base_url(); ?>index.php/project/new" class="btn btn-primary">New Project</a>
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
				 <div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;">
					<div class="media-left">
						<img src="<?php if(isset($value['cover']) && $value['cover'] == 1) { echo base_url() . 'resources/' . $value['fk_user_id'] . '/' . $value['project_id'] .'/cover.jpg'; } ?>" class="media-object project-cover" />
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
							<a href="<?php echo base_url(); ?>index.php/project/setting/<?php echo $value['project_id']; ?>" class="btn btn-default">Setting</a>
							<a href="<?php echo base_url(); ?>index.php/project/resource/<?php echo $value['project_id']; ?>" class="btn btn-warning">Resource Editor</a>
							<a href="<?php echo base_url(); ?>index.php/project/editor/<?php echo $value['project_id']; ?>" class="btn btn-warning">VN Editor</a>
							<a href="<?php echo base_url(); ?>index.php/game/play/<?php echo $value['project_id']; ?>" class="btn btn-info ?>">Play</a>
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

