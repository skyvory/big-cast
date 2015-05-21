<div class="container-fluid">
	<div class="page-header">
		<h2>Visual Novel Release</h2>
		<div class="btn-group">
			<a href="<?php echo base_url() . 'index.php/release/latest'; ?>" class="btn btn-default <?php if($order == "latest") echo " active"; ?>">Latest</a>
			<a href="<?php echo base_url() . 'index.php/release/alphabetical'; ?>" class="btn btn-default <?php if($order == "alphabetical") echo " active"; ?>">Alphabetical</a>
		</div>
	</div>
	<div id="notification">
	</div>
	<div class="row">
	</div>
	<div class="row">
	<?php foreach($release as $value): ?>
		<div class="col-md-6">
			<div class="thumbnail">
				<div class="cover-container">
					<img src="<?php if(isset($value['cover']) && $value['cover'] == 1) { echo base_url() . 'resources/' . $value['fk_user_id'] . '/' . $value['project_id'] .'/cover.jpg'; } ?>" class="release-cover" />
				</div>
				<div class="caption">
					<h1><?php echo $value['title']; ?></h1>
					<div class="row">
						<div class="col-md-6">
							<dl>
								<dt>Published</dt>
								<dd><?php echo $value['published_date']; ?></dd>
							</dl>
						</div>
						<div class="col-md-6">
							<dl>
								<dt>By</dt>
								<dd><?php echo $value['username']; ?></dd>
							</dl>
						</div>
					</div>
					<div class="row">
						<div class="col-md-9">
							<dl>
								<dt>Description</dt>
								<dd><?php if(!empty($value['description'])) { echo $value['description']; } else { echo " - "; }?></dd>
							</dl>
						</div>
								
								
						<div class="col-md-3">
						<p>
							<center>
								<a href="<?php echo base_url() . 'index.php/game/play/' . $value['project_id']; ?>" class="btn btn-primary btn-lg btn-block">Play</a>
							</center>
						</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	<?php endforeach ?>			
	</div>

	<center>
		<?php echo $page; ?>
	</center>

</div>

