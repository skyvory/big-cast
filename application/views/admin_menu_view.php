<nav class="navbar navbar-default navbar-fixed-top">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand">
				<img alt="Cast" src="<?php echo base_url(); ?>assets/images/ArtificialPoint_8.0.jpg" class="brand-icon" />
			</a>
		</div>

		<div id="navbar-collapse" class="collapse navbar-collapse">
			<ul class="nav navbar-nav">
				<li class=""><a href="<?php echo base_url(); ?>index.php/admin/user">User <span class="sr-only">(current)</span></a></li>
				<li><a href="<?php echo base_url(); ?>index.php/admin/project">Project</a></li>
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown pull-right">
					<a href="#" class="dropdown-toggle pull-right" data-toggle="dropdown" role="button" area-expanded="false"><?php echo $user['name']; ?>&nbsp; &nbsp;<span class="glyphicon glyphicon-user"></span> <span class="caret"></span></a>
					<ul class="dropdown-menu logout-button" role="menu">
						<li><a href="<?php echo base_url(); ?>index.php/login/logout">Log Out</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style type="text/css">
	.navbar {
		background: rgba(140, 221, 255, 0.9);
		border: none;
	}
	.brand-icon {
		width: 25px;
		height: 25px;
	}
	.profileicon
	{
		width: 33px;
		height: 33px;
	}
	.profileicon:hover
	{
		opacity: 2.5;
	}
	.profileicon:active
	{
		opacity: 0.5;
	}
	.navbar-default .navbar-nav>.open>a, .navbar-default .navbar-nav>.open>a:hover, .navbar-default .navbar-nav>.open>a:focus{
	    /*color: rgba(255, 255, 255, 0.1);*/
	    background-color: rgba(255, 255, 255, 0.2);
	}
	.logout-button {
		background-color: rgba(255, 0, 0, 0.4);
	}
</style>