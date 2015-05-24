<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="page-header">
				<h2>Project's Setting
					<?php $attributes = array('class' => 'form-inline pull-right'); echo form_open('project/deleteProject', $attributes); ?>
						<input type="submit" name="submitdelete" class="btn btn-danger" value="Delete Project" onclick="return confirm('This action is irreversible! Are you sure?');"/>
					</form>
				</h2>
			</div>
			<?php echo validation_errors(); ?>
			<?php echo form_open_multipart('project/changeSetting'); ?>
				<div class="form-group">
					<label for="title" class="control-label">Title</label>
					<input type="text" id="title" name="title" class="form-control" value="<?php echo $project['title']; ?>">
				</div>
				<div class="form-group">
					<label for="description" class="control-label">Description</label>
					<!-- <input type="text" id="description" name="description" class="form-control"> -->
					<textarea id="description" name="description" class="form-control"><?php echo $project['description']; ?></textarea>
				</div>
					<label for="userfile" class="control-label">Cover upload</label>
					<input type="file" id="userfile" name="userfile" class="">
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

				 <input type="button" class="btn btn-default" onclick="history.back();" value="Back">
				<input type="submit" name="submitchange" class="btn btn-primary" value="submit" />
			<?php echo form_close(); ?>
			
		</div>
	</div>	
</div>