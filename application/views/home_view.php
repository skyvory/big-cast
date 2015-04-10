
<div class="grid fluid">
<div class="row">
<div class="span3 sidebar-add">
	<nav class="sidebar">
	<ul>
		<li class="title">
			<div class="row logo-title-area">
			<div class="span3"><img src="<?= base_url() ?>images/logo_ukp.png" class="home-logo"/></div>
			<div class="span9">Home<br/><span class="sidebar-title-user">Logged in as <?php echo $user; ?></span></div>
			</div>
		</li>
		<li class="disabled"><a></a></li>
		<li class="tooltip-home-dashboard" title=""><a href="<?= base_url(); ?>index.php/home"><i class="icon-home"></i>Dashboard</a></li>
		<li class="tooltip-home-formta01" title=""><a href="<?= base_url(); ?>index.php/home/formta01"><i class="icon-copy"></i>Form TA-01</a></li>
		<li class="tooltip-home-formmkta" title=""><a href="<?= base_url(); ?>index.php/home/formmkta"><i class="icon-list"></i>Form Mata Kuliah TA</a></li>
		<li class="tooltip-home-profile" title=""><a href="<?= base_url(); ?>index.php/home/mahasiswa"><i class="icon-user"></i>Edit Profile</a></li>
		<li class="divider"></li>
		<li class="disabled"><a></a></li>
		<li class=""><a href="<?= base_url(); ?>index.php/home/logout" class="sidebar-home-logout" style="background-color: #f05050;"><i class="icon-exit"></i>Log Out</a></li>
	</ul>
	</nav>
</div>
<div class="span8 offset3">