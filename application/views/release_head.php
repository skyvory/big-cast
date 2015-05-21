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
		<style type="text/css">
		.cover-container {
			width: 100%;
			height: auto;
			text-align: center;
			overflow: hidden;
			max-height: 400px;
		}
		.release-cover {
			max-width: 100%;
			max-height: 100%;
			/*min-width: 100%;
			min-height: 100%;*/
			vertical-align: middle;
			margin: auto;
			padding: auto;
		}
		.thumbnail {
			min-height: 500px;
			/*height: auto;*/
		}
		dt {
			font-size: 1.3em;
		}
		dd {
			font-size: 1.3em;
		}
		</style>
	</head>
	<body>