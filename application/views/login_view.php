

	
	<?php echo validation_errors(); ?>
	<?php echo form_open('login'); ?>
		
		<?php $loginnotification = $this->session->flashdata('loginnotification'); if(isset($loginnotification)) echo '<p>' . $loginnotification . '</p>'; ?>
		<label for="username">Username</label>
		<input value="" type="username" id="username" name="username" tabindex="1"/>

		<br/>
		<label for="password">Password</label>
	
		<input value="" type="password" id="password" name="password" tabindex="2"/>
		
		
		<br/>
	  	<input type="submit" id="login" value="Login" tabindex="3"/>
	</form>
	