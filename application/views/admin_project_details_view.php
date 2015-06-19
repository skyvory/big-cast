<div class="container-fluid">
	<div class="row">
		<div class="col-md-11 col-md-offset-1">
			 <a href="<?php echo base_url(); ?>index.php/admin/projectList" class="btn btn-default">Back</a>
			<div class="page-header">
			</div>
			<div class="row">
				<div class="col-md-5">
					<img src="<?php if(isset($project['cover']) && $project['cover'] == 1) { echo base_url() . 'resources/' . $project['fk_user_id'] . '/' . $project['project_id'] .'/cover.jpg'; } else { echo base_url() . '/assets/images/no_image.png'; }?>" class="project-cover" />
				</div>
				<div class="col-md-5">
					<h3><?php if(isset($project['title'])) echo $project['title']; ?></h3>
					<dl class="dl-horizontal">
						<dt>ID :</dt>
						<dd><?php if(isset($project['project_id'])) echo $project['project_id']; ?></dd>
						<dt>Title :</dt>
						<dd><?php if(isset($project['title'])) echo $project['title']; ?></dd>
						<dt>Description :</dt>
						<dd><?php if(isset($project['description'])) echo $project['description']; ?></dd>
						<dt>Created Date :</dt>
						<dd><?php if(isset($project['created_date'])) echo $project['created_date']; ?></dd>
						<dt>Updated Date :</dt>
						<dd><?php if(isset($project['updated_date'])) echo $project['updated_date']; ?></dd>
						<dt>Published Date :</dt>
						<dd><?php if(isset($project['published_date'])) echo $project['published_date']; ?></dd>
						<dt>Status :</dt>
						<dd><?php if(isset($project['name'])) echo $project['name']; ?></dd>
						<dt>User :</dt>
						<dd><?php if(isset($project['username'])) echo $project['username']; ?></dd>
					</dl>
					 
					 <?php $attribute = array('style' => 'display: inline-block;'); echo form_open('admin/deleteProject', $attribute); ?>
						<input type="hidden" name="project_id" value="<?php echo $project['project_id']; ?>" />
						<input type="submit" class="btn btn-danger" value="Delete" onclick="return confirm('Are you sure?')" />
					<?php echo form_close(); ?>
				</div>
			</div>
		</div>
	</div>
</div>