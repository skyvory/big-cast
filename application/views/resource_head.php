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
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
		<!--script type="text/javascript" src="<?= base_url() ?>assets/jquery-file-upload/js/jquery.iframe-transport.js"></script-->
		<script type="text/javascript" src="<?= base_url() ?>assets/jquery-file-upload/js/jquery.fileupload.js"></script>
		<!-- <script type="text/javascript" src="<?= base_url() ?>assets/fabric/dist/fabric.js"></script> -->
		<style type="text/css">
		.resource-area {
			background-color: rgba(0, 0, 0, 0.1); 
			padding: 20px;
		</style>
	</head>
	<body>