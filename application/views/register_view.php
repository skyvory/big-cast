<div class="container-fluid" style="margin: 30px 10px 20px;">
<div class="row">
	<div class="col-md-7">


		<div class="jumbotron">
			<h2>Visual Novel Authoring Tool<span style="font-size: 0.6em;"> on web</span></h2>
			<p>Be a creator, Create your own visual novel.</p>
			<p>Publishing visual novel made easy.</p>
			<p><a href="http://en.wikipedia.org/wiki/Visual_novel" class="btn btn-info btn-sm">Learn more</a></p>
		</div>

	</div>
	<div class="col-md-5">


		<div id="registerfront" class="panel panel-primary">
			<div class="panel-heading">
				Log In
			</div>
			<div class="panel-body">
				<?php if(isset($notification)) echo($notification); ?>
				<?php echo form_open('register'); ?>
					<div class="form-group">
					<label for="username">Username</label>
					<?php echo form_error('username'); ?>
					<input type="text" id="username" name="username" class="form-control" value="<?php echo set_value('username'); ?>"><span id="usernamematch"></span>
					</div>
					<div class="form-group">
					<label for="password">Password</label>
					<?php echo form_error('password'); ?>
					<input type="password" id="password" name="password" class="form-control" value="<?php echo set_value('password'); ?>">
					</div>
					<div class="form-group">
					<label for="passwordrepeat">Re-type password</label>
					<?php echo form_error('password_repeat'); ?>
					<input type="password" id="passwordrepeat" name="password_repeat" class="form-control" value="<?php echo set_value('passwordrepeat'); ?>"/>
					<span id="passwordmatch"></span>
					</div>
					<input type="submit" id="register" value="Register" class="btn btn-primary"/>
				<?php echo form_close(); ?>
			</div>
		</div>
		<p>Already have an account? <span> <a href="<?= base_url() ?>index.php/login" class="btn btn-default btn-sm">login</a> </span></p>

	</div>

</div>
</div>


	


<script type="text/javascript">
$("#username").focusout(function() {
	var usr = $('#username').val();
	if(usr.length > 3) {
		var req = $.ajax({
			url: config.base+"index.php/login/checkUsername",
			type: "POST",
			data: {username: usr},
			dataType: "html",
			beforeSend: function(){$('#usernamematch').html("checking...");}
		});
		req.done(function(msg) {
			if(msg == 1) {
				$('#usernamematch').html("User is already exist!");
			}
			else {
				$('#usernamematch').html("Username is available!")
			}
		});
		req.fail(function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 0) {
				console.log('Not connected.\n Verify Network.');
			} else if (jqXHR.status == 404) {
				console.log('Requested page not found. [404]');
			} else if (jqXHR.status == 500) {
				console.log('Internal Server Error [500].');
			} else if (exception === 'parsererror') {
				console.log('Requested JSON parse failed.');
			} else if (exception === 'timeout') {
				console.log('Time out error.');
			} else if (exception === 'abort') {
				console.log('Ajax request aborted.');
			} else {
				console.log('Uncaught Error.\n' + jqXHR.responseText);
			}
		});
	}
});
$('#passwordrepeat').focusout(function() {
	var pwd = $('#password').val();
	var pwdr = $('#passwordrepeat').val();
	if(pwdr.length >=3) {
		if(pwd == pwdr) {
			$('#passwordmatch').html("Passwords match!");
		}
		else{
			$('#passwordmatch').html("Passwords don't match!");
		}
	}
});
</script>