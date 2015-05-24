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
				<img alt="Cast" src="<?php echo base_url(); ?>assets/images/ap-8.0m.jpg" class="brand-icon" />
			</a>
		</div>

		<div id="navbar-collapse" class="collapse navbar-collapse">
			<ul class="nav navbar-nav">
				<li class=""><a href="<?php echo base_url(); ?>index.php/home">Home <span class="sr-only">(current)</span></a></li>
				<li><a href="<?php echo base_url(); ?>index.php/project">Project</a></li>
				<li><a href="<?php echo base_url(); ?>index.php/release">Release</a></li>
				
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
