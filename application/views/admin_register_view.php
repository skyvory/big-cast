<div class="container-fluid">
	

	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="page-header">
				<h2>User</h2>
			</div>
			<?php echo validation_errors(); ?>
			<?php echo form_open('admin/register'); ?>
				<div class="form-group">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" class="form-control" value="<?php echo set_value('username'); ?>"><span id="usernamematch"></span>
				</div>
				<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" class="form-control" value="<?php echo set_value('password'); ?>">
				</div>
				<div class="form-group">
				<label for="passwordrepeat">Re-type password</label>
				<input type="password" id="passwordrepeat" name="password_repeat" class="form-control" value="<?php echo set_value('passwordrepeat'); ?>"/>
				<span id="passwordmatch"></span>
				</div>
				<input type="button" class="btn btn-default" onclick="history.back();" value="Back">
				<input type="submit" id="register" value="Register" class="btn btn-primary"/>
			</form>
		</div>
	</div>
						
</div>

