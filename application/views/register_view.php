<div class="container-fluid" style="margin: 30px 10px 20px;">
<div class="row">
	<div class="col-md-7">


		<div class="jumbotron">
			<h3>Visual Novel Authoring Tool<span style="font-size: 0.6em;"> on web</span></h3>
			<p>Be a creator, create your own visual novel without complication over learning scripting language.</p>
			<p>Or, play some creations by others.</p>
			<p><a href="#" class="btn btn-info btn-sm">Learn more</a></p>
		</div>

	</div>
	<div class="col-md-5">


		<?php if(isset($notification)) echo($notification); ?>
		<div id="registerfront" class="panel panel-primary">
			<div class="panel-heading">Log In</div>
			<div class="panel-body">
				<?php echo validation_errors(); ?>
				<?php echo form_open('register'); ?>
					<div class="form-group">
					<label for="username">Username</label>
					<input type="text" id="username" name="username" class="form-control"><span id="usernamematch"></span>
					</div>
					<div class="form-group">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" class="form-control">
					</div>
					<div class="form-group">
					<label for="passwordrepeat">Re-type password</label>
					<input type="password" id="passwordrepeat" name="passwordrepeat" class="form-control"/>
					<span id="passwordmatch"></span>
					</div>
					<input type="submit" id="register" value="Register" class="btn btn-primary"/>
				</form>
			</div>
		</div>
		<p>Already have an account? <span> <a href="<?= base_url() ?>index.php/login" class="btn btn-default btn-sm">login</a> </span></p>

	</div>

</div>
</div>


	


<script type="text/javascript">
$("#username").focusout(function(){
	var usr = $("#username").val();
	if(usr.length > 3){
		var req = $.ajax({
			url: config.base+"index.php/login/checkUsername",
			type: "POST",
			data: {username: usr},
			dataType: "html",
			beforeSend: function(){$("#usernamematch").html("checking...");}
		});
		req.done(function(msg){
			if(msg == 1){
				$("#usernamematch").html("User is already exist!");
			}
			else{
				$("#usernamematch").html("Username is available!")
			}
		});
		req.fail(function(jqXHR, textStatus){
		});
	}
});
$("#passwordrepeat").focusout(function(){
	var pwd = $("#password").val();
	var pwdr = $("#passwordrepeat").val();
	if(pwdr.length >=3){
		if(pwd == pwdr){
			$("#passwordmatch").html("Passwords match!");
		}
		else{
			$("#passwordmatch").html("Passwords don't match!");
		}
	}
});
</script>