<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>C <?php if(isset($title)) echo " - " . $title; ?></title>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">

		<script type="text/javascript">
		var config = {
			base: "<?php echo base_url(); ?>"
		};
		</script>

		<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="<?= base_url() ?>assets/common_style.css"/>

		<script type="text/javascript" src="<?= base_url() ?>assets/jquery/jquery.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/bootstrap/dist/js/bootstrap.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-ui/jquery-ui.js"></script>
		<script type="text/javascript" src="<?= base_url() ?>assets/project_script.js" async></script>
		<style type="text/css">
			.request-loading {
				display:none;
				position: relative;
				opacity: 0.8;
				color: #333;
			}
			.project-cover {
				width: 200px;
				height: 150px;
			}
			.newproject-notification {
				position: fixed;
				z-index: 3;
				top: 15%;
				right: 5%;
			}
		</style>
	</head>
	<body>