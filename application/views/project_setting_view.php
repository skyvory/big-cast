<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="page-header">
				<h2>Project's Setting
					<?php $attributes = array('class' => 'form-inline pull-right'); echo form_open('project/deleteProject', $attributes); ?>
						<input type="submit" name="submitdelete" class="btn btn-danger" value="Delete Project" onclick="return confirm('This action is irreversible! Are you sure?');"/>
					<?php echo form_close(); ?>
				</h2>
			</div>
			<?php echo form_open_multipart('project/changeSetting'); ?>
				<div class="form-group">
					<label for="title" class="control-label">Title</label>
					<?php echo form_error('title'); ?>
					<input type="text" id="title" name="title" class="form-control" value="<?php echo $project['title']; ?>">
				</div>
				<div class="form-group">
					<label for="description" class="control-label">Description</label>
					<?php echo form_error('description'); ?>
					<textarea id="description" name="description" class="form-control"><?php echo $project['description']; ?></textarea>
				</div>
				<label for="userfile" class="control-label">Cover upload (jpg only)</label>
				<?php if($project['cover'] == 1) echo '<span class="label label-success">exist</span>'; ?>
				<?php echo form_error('userfile'); ?>
				<input type="file" id="userfile" name="userfile" class="">
				<br />
				<label for="title_background" class="control-label">Title screen background upload (jpg only)</label>
				<?php if($project['title_background'] == 1) echo '<span class="label label-success">exist</span>'; ?>
				<?php echo form_error('title_background'); ?>
				<input type="file" id="title_background" name="title_background" class="">
				<br />
				<label for="savedata_background" class="control-label">Save data screen background upload (jpg only)</label>
				<?php if($project['savedata_background'] == 1) echo '<span class="label label-success">exist</span>'; ?>
				<?php echo form_error('savedata_background'); ?>
				<input type="file" id="savedata_background" name="savedata_background" class="">
				<br />
				<label for="configuration_background" class="control-label">Configuration screen backgoround upload (jpg only)</label>
				<?php if($project['configuration_background'] == 1) echo '<span class="label label-success">exist</span>'; ?>
				<?php echo form_error('configuration_background'); ?>
				<input type="file" id="configuration_background" name="configuration_background" class="">
				<br />
				<div class="form-group">
					<div class="checkbox">
					<label>
					<input type="checkbox" id="status" name="status" <?php if($project['fk_projectstatus_id'] == 2) {echo "checked";} ?>> Publish this project
					</label>
					</div>
					<?php
						if(isset($error)) {
							echo $error['error'] . "<br />";
							if(isset($error['list'])) {
								echo '<ul class="list-group">';
								foreach ($error['list'] as $value) {
									echo '<li class="list-group-item">' . $value . '</li>'; 
								}
								echo '</ul>';
							}
						}
					?>
				 </div>
				 <a href="<?php echo base_url(); ?>index.php/project" class="btn btn-default">Back</a>
				<input type="submit" name="submitchange" class="btn btn-primary" value="submit" />
			<?php echo form_close(); ?>
		</div>
	</div>	
</div>