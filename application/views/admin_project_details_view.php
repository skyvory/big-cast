<div class="container-fluid">
	<div class="row">
		<div class="col-md-11 col-md-offset-1">
			<input type="button" class="btn btn-default" onclick="history.back();" value="Back"><h2>Project Details</h2>
			<div class="page-header">
			</div>
			<div class="row">
				<div class="col-md-5">
					<img src="<?php if(isset($project['cover']) && $project['cover'] == 1) { echo base_url() . 'resources/' . $project['fk_user_id'] . '/' . $project['project_id'] .'/cover.jpg'; } else { echo base_url() . '/assets/images/no_image.png'; }?>" class="project-cover" />
				</div>
				<div class="col-md-5">
					<h3><?php if(isset($project['title'])) echo $project['title']; ?></h3>
					<dl class="dl-horizontal">
						<dt>ID</dt>
						<dd><?php if(isset($project['project_id'])) echo $project['project_id']; ?></dd>
						<dt>Title</dt>
						<dd><?php if(isset($project['title'])) echo $project['title']; ?></dd>
						<dt>Description</dt>
						<dd><?php if(isset($project['description'])) echo $project['description']; ?></dd>
						<dt>Created Date</dt>
						<dd><?php if(isset($project['created_date'])) echo $project['created_date']; ?></dd>
						<dt>Updated Date</dt>
						<dd><?php if(isset($project['updated_date'])) echo $project['updated_date']; ?></dd>
						<dt>Published Date</dt>
						<dd><?php if(isset($project['published_date'])) echo $project['published_date']; ?></dd>
						<dt>Status</dt>
						<dd><?php if(isset($project['name'])) echo $project['name']; ?></dd>
						<dt>User</dt>
						<dd><?php if(isset($project['username'])) echo $project['username']; ?></dd>
					</dl>
					 
					<a href="<?= base_url() . 'index.php/admin/deleteProject/' . $project['project_id']; ?>" class="btn btn-danger pull-right" onclick="return confirm('Are you sure?')">Delete</a>
				</div>
			</div>
		</div>
	</div>
</div>