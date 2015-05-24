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

	/*.n1 a, .n2 a, .n3 a {
		display: block;
		text-decoration: none;
		width: 100%;
		height: 100%;
	}
	.navi {
		list-style: none;
		padding: 0;
		width: 130px;
		height: 30px;
		margin: 10px 20px;
		position: relative;
		background: #CCCCCC;
	}
	.navi, a.navi-main {
		display: block;
		height: 30px;
		text-align: center;
		text-decoration: none;
		-webkit-transition: 0.2s ease-in-out;
		-o-transition: 0.2s ease-in-out;
		transition: 0.2s ease-in-out;
		position: relative;
		font: bold 15px/30px arial, sans-serif; 
	}
	.navi li {
		width: 130px;
		height: 30px;
		text-align: center;
		margin: 0;
		-webkit-transform-origin: 50% 0%;
		-o-transform-origin: 50% 0%;
		transform-origin: 50% 0%;
		-webkit-transform: perspective(350px) rotateX(-90deg);
		-o-transform: perspective(350px) rotateX(-90deg);
		transform: perspective(350px) rotateX(-90deg);
		box-shadow: 0px 2px 10px rgba(0,0,0,0.05);
		-webkit-box-shadow: 0px 2px 10px rgba(0,0,0,0.05);
		-moz-box-shadow: 0px 2px 10px rgba(0,0,0,0.05);
		font: normal 12px/30px arial, sans-serif !important; 
	}
	.navi li:nth-child(even) {
		background: #EEE;
		border: 0.2px solid rgba(0, 255, 255, .3);
	}
	.navi li:nth-child(odd) {
		background: #EEE;
		border: 0.2px solid rgba(0, 255, 255, .3);
	}
	.navi li.n1 { 
		-webkit-transition: 0.2s linear 0.8s;
		-o-transition: 0.2s linear 0.8s;
		transition: 0.2s linear 0.8s;
	}
	.navi li.n2 {
		-webkit-transition: 0.2s linear 0.6s;
		-o-transition: 0.2s linear 0.6s;
		transition: 0.2s linear 0.6s;
	}
	.navi li.n3 {
		-webkit-transition: 0.2s linear 0.4s;
		-o-transition: 0.2s linear 0.4s;
		transition: 0.2s linear 0.4s;
	}
	.navi li.n4 { 
		-webkit-transition: 0.2s linear 0.2s;
		-o-transition: 0.2s linear 0.2s;
		transition: 0.2s linear 0.2s;
	}
	.navi li.n5 {
		border-radius: 0px 0px 4px 4px;
		-webkit-transition: 0.2s linear 0s;
		-o-transition: 0.2s linear 0s;
		transition: 0.2s linear 0s;
	}

	.navi:hover li {
		-webkit-transform: perspective(350px) rotateX(0deg);
		-o-transform: perspective(350px) rotateX(0deg);
		transform: perspective(350px) rotateX(0deg);
		-webkit-transition:0.2s linear 0s;
		-o-transition:0.2s linear 0s;
		transition:0.2s linear 0s;
	}
	.navi:hover .n2 {
		-webkit-transition-delay: 0.2s;
		-o-transition-delay: 0.2s;
		transition-delay: 0.2s;
	}
	.navi:hover .n3 {
		-webkit-transition-delay: 0.4s;
		-o-transition-delay: 0.4s;
		transition-delay: 0.4s;
	}
	.navi:hover .n4 {
		transition-delay: 0.6s;
		-o-transition-delay: 0.6s;
		transition-delay: 0.6s;
	}
	.navi:hover .n5 {
		-webkit-transition-delay: 0.8s;
		-o-transition-delay: 0.8s;
		transition-delay: 0.8s;
	}*/
	.navbar-default .navbar-nav>.open>a, .navbar-default .navbar-nav>.open>a:hover, .navbar-default .navbar-nav>.open>a:focus{
	    /*color: rgba(255, 255, 255, 0.1);*/
	    background-color: rgba(255, 255, 255, 0.2);
	}
	.logout-button {
		background-color: rgba(255, 0, 0, 0.4);
	}
	.dropdown-menu li > a:hover, .dropdown-menu li > a:focus, .dropdown-submenu:hover > a {
		background-image: none;
		background-color: rgba(250,251,206,0.3);
	}
</style>