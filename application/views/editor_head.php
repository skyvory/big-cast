<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>C <?php if(isset($title)) echo " - " . $title; ?></title>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		<link rel="shortcut icon" href="<?= base_url(); ?>assets/images/ap-i9-16.ico" type="image/x-icon" />

		<script type="text/javascript">
		var config = {
			base: "<?php echo base_url(); ?>",
			user: "<?php echo $uid; ?>",
			project: "<?php echo $proj; ?>"
		};
		</script>

		<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="<?= base_url() ?>assets/common_style.css"/>
		<link rel="stylesheet" href="<?= base_url() ?>assets/editor_style.css"/>
		<!-- test -->
		<!-- <link rel="stylesheet" href="<?= base_url() ?>assets/jquery-ui/themes/smoothness/jquery-ui.css"/> -->

		<script type="text/javascript" src="<?= base_url() ?>assets/jquery/jquery.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/bootstrap/dist/js/bootstrap.js"></script>
		<!-- sortable capability -->
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/core.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/widget.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/mouse.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/sortable.js"></script>
		<!-- autocomplete capability -->
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/position.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/menu.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/autocomplete.js"></script>
		<!-- draggable capability -->
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/ui/draggable.js"></script>
		<!-- preview capability -->
		<script type="text/javascript" src="<?= base_url() ?>assets/fabric/dist/fabric.js"></script>
		<!-- custom -->
		<script type="text/javascript" src="<?= base_url() ?>assets/editor_script.js" async></script>
	</head>
	<body>