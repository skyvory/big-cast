<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="page-header">
				<h2>New Project</h2>
			</div>
			<?php if(isset($error)) echo $error['error']; ?>
			<?php echo form_open('project/new'); ?>
				<div class="form-group">
					<label for="title" class="control-label">Title</label>
					<?php echo form_error('title'); ?>
					<input type="text" id="title" name="title" class="form-control">
				</div>
				<div class="form-group">
					<label for="description" class="control-label">Description</label>
					<?php echo form_error('description'); ?>
					<textarea id="description" name="description" class="form-control"></textarea>
				</div>
				<button type="submit" id="newprojectsubmit" class="btn btn-primary">Create</button>
			<?php echo form_close(); ?>
		</div>
	</div>	
</div>