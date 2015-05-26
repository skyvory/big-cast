<div class="container-fluid" style="margin: 30px 10px 20px;">
<div class="row">
	<div class="col-md-7">


		<div class="jumbotron">
			<h2>Visual Novel Authoring Tool<span style="font-size: 0.6em;"> on web</span></h2>
			<p>Be a creator, Create your own visual novel.</p>
			<p>Publishing visual novel made easy.</p>
			<p><a href="#" class="btn btn-info btn-sm">Learn more</a></p>
		</div>

	</div>
	<div class="col-md-5">


		<div id="loginfront" class="panel panel-primary">
			<div class="panel-heading">
				Log In
			</div>
			<div class="panel-body">
				<?php if(isset($notification)) echo($notification); ?>
				<?php echo form_open('login'); ?>
					<div class="form-group">
					<label for="username">Username</label>
					<?php echo form_error('username'); ?>
					<input type="username" id="username" name="username" class="form-control" tabindex="1" value=""/>
					</div>
					<div class="form-group">
					<?php echo form_error('password'); ?>
					<label for="password">Password</label>
					<input type="password" id="password" name="password" class="form-control" tabindex="2" value=""/>
					</div>
				  	<input type="submit" id="login" value="Login" tabindex="3" class="btn btn-primary" style="width: 40%;"/>
				  	<div id="error"></div>
				<?php echo form_close(); ?>
			</div>
		</div>
		<p>Don't have an account yet? <span> <a href="<?= base_url() ?>index.php/register" class="btn btn-default btn-sm">register</a> </span></p>

	</div>

</div>
</div>

