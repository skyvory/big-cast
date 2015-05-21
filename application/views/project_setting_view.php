<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<?php if(isset($error)) { echo $error['error'] . "<br />"; foreach ($error['list'] as $value) { echo $value . "<br />" } } ?>
			<?php echo validation_errors(); ?>
			<div class="page-header">
				<h2>Project's Setting</h2>
			</div>
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
				 </div>
				<input type="submit" name="submitchange" class="btn btn-primary" value="submit" />
			</form>
		</div>
	</div>	
</div>