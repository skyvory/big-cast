

	<div id="loginarea">
	<?php echo validation_errors(); ?>
	<?php echo form_open('login'); ?>
		<?php if(isset($notification)) echo($notification); ?>
		<label for="username">Username</label>
		<input value="sv" type="username" id="username" name="username" tabindex="1"/>
		<br/>
		<label for="password">Password</label>
		<input value="sv" type="password" id="password" name="password" tabindex="2"/>
		<br/>
	  	<input type="submit" id="login" value="Login" tabindex="3"/>
	  	<div id="error"></div>
	</form>
	  	<button id="registerbutton">to register</button>
	</div>

	<div id="registerarea" style="display: none;">
	<?php echo validation_errors(); ?>
	<?php echo form_open('register'); ?>
		<?php if(isset($notification)) echo($notification); ?>
		<label for="username_reg">Username</label>
		<input value="" id="username_reg" name="username_reg"?>
		<br/>
		<label for="password_reg">Password</label>
		<input value="" id="password_reg" name="password_reg"/>
		<br/>
		<input type="submit" id="register" value="Register"/>
	</form>
		<button id="loginbutton">to login</button>
	</div>