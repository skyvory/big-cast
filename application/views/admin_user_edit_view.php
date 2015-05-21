<div class="container-fluid">
	

	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="page-header">
				<h2>Edit User</h2>
			</div>
			<?php if(isset($error)) echo $error['error']; ?>
			<?php echo validation_errors(); ?>
			<?php echo form_open('admin/editUser'); ?>
				<div class="form-group">
					<label for="username">Username</label>
					<input type="text" id="username" name="username" class="form-control" value="<?php echo $userdata['username']; ?>">
				</div>
				<div class="form-group">
					<label for="password">Password (leave empy if no change)</label>
					<input type="password" id="password" name="password" class="form-control" value="">
				</div>
				<div class="form-group">
					<label for="passwordrepeat">Re-type password</label>
					<input type="password" id="passwordrepeat" name="password_repeat" class="form-control" value=""/>
					<span id="passwordmatch"></span>
				</div>
				<input type="button" class="btn btn-default" onclick="history.back();" value="Back">
				<input type="hidden" name="user_id" value="<?php echo $userdata['user_id']; ?>" />
				<input type="submit" id="edit" value="Edit" class="btn btn-primary"/>
			</form>
		</div>
	</div>		
</div>

