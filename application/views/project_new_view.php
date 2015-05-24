<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<?php if(isset($error)) echo $error['error']; ?>
			<?php echo validation_errors(); ?>
			<div class="page-header">
				<h2>New Project</h2>
			</div>
			<?php echo form_open('project/new'); ?>
				<div class="form-group">
					<label for="title" class="control-label">Title</label>
					<input type="text" id="title" name="title" class="form-control">
				</div>
				<div class="form-group">
					<label for="description" class="control-label">Description</label>
					<!-- <input type="text" id="description" name="description" class="form-control"> -->
					<textarea id="desceription" name="description" class="form-control"></textarea>
				</div>
				<!-- <div class="form-group">
					<label for="userfile" class="control-label">Cover upload</label>
					<input type="file" id="coverimage" name="userfile" class="form-control">
				</div> -->
				<button type="submit" id="newprojectsubmit" class="btn btn-primary">Create</button>
			<?php echo form_close(); ?>
		</div>
	</div>	
</div>