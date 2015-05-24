<div class="container-fluid">
	

	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="page-header">
				<h2>Edit User</h2>
			</div>
			<?php if(isset($error)) echo $error['error']; ?>
			<?php echo form_open('admin/editUser'); ?>
				<div class="form-group">
					<label for="username">Username</label>
					<?php echo form_error('username'); ?>
					<input type="text" id="username" name="username" class="form-control" value="<?php echo $userdata['username']; ?>">
				</div>
				<div class="form-group">
					<label for="password">Password (leave empy if no change)</label>
					<?php echo form_error('password'); ?>
					<input type="password" id="password" name="password" class="form-control" value="">
				</div>
				<div class="form-group">
					<label for="passwordrepeat">Re-type password</label>
					<?php echo form_error('password_repeat'); ?>
					<input type="password" id="passwordrepeat" name="password_repeat" class="form-control" value=""/>
					<span id="passwordmatch"></span>
				</div>
				 <a href="<?php echo base_url(); ?>index.php/admin" class="btn btn-default">Back</a>
				<input type="hidden" name="user_id" value="<?php echo $userdata['user_id']; ?>" />
				<input type="submit" id="edit" value="Edit" class="btn btn-primary"/>
			<?php echo form_close(); ?>
		</div>
	</div>		
</div>

