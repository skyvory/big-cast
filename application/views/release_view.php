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
		<div class="col-md-4 release-area">
			<div class="thumbnail" style="display: none;">
				<div class="cover-container">
						<img src="<?php if(isset($value['cover']) && $value['cover'] == 1) { echo base_url() . 'resources/' . $value['fk_user_id'] . '/' . $value['project_id'] .'/cover.jpg'; } else { echo base_url() . '/assets/images/no_image.png'; } ?>" class="release-cover" />
				</div>
				<div class="caption">
					<h2><?php echo $value['title']; ?></h2>
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
						<div class="col-md-8">
							<dl>
								<dt>Description</dt>
								<dd><?php if(!empty($value['description'])) { echo $value['description']; } else { echo " - "; }?></dd>
							</dl>
						</div>
								
								
						<div class="col-md-4">
						<p>
							<center>
								<a href="<?php echo base_url() . 'index.php/game/play/' . $value['project_id']; ?>" class="btn btn-primary btn-block">Play</a>
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

