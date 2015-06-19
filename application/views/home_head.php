<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>C <?php if(isset($title)) echo " - " . $title; ?></title>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		<link rel="shortcut icon" href="<?= base_url(); ?>assets/images/ap-i9-16.ico" type="image/x-icon" />

		<script type="text/javascript">
		var config = {
			base: "<?php echo base_url(); ?>"
		};
		</script>

		<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="<?= base_url() ?>assets/common_style.css"/>

		<!--script type="text/javascript" src="<?= base_url() ?>assets/rescript.js"></script-->

		<script type="text/javascript" src="<?= base_url() ?>assets/jquery/jquery.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/bootstrap/dist/js/bootstrap.js"></script>

		<style type="text/css">
			.project-cover {
				width: 100px;
				height: 75px;
			}
			.page-header {
				margin-top: 0px;
				margin-bottom: 0px;
			}
			.media-heading {
				font-size: 1.5em;
			}
			dt, dd {
				font-size: 0.9em;
			}
		</style>
	</head>
	<body>