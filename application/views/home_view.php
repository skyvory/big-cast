<div class="container-fluid">
	<div class="page-header" >
		<h2>Home</h2>
	</div>
	<div class="row" >
		<div class="col-md-6">
			<h4>Your Recent Project</h4>
			<div class="recent-project-list">
				<?php foreach($project as $value): ?>
				 <div class="media" style="background-color: rgba(0, 0, 0, 0.3); margin: 10px 20px; padding: 10px;">
					<div class="media-left">
						<img src="<?php if(isset($value['cover']) && $value['cover'] == 1) { echo base_url() . 'resources/' . $value['fk_user_id'] . '/' . $value['project_id'] .'/cover.jpg'; } else { echo base_url() . '/assets/images/no_image.png'; } ?>" class="media-object project-cover" />
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h2 class="media-heading"><?php echo $value['title']; ?></h2>
						</div>
						<div>
							<dl class="dl-horizontal" style="margin-left:-50px;">
							<dt>Updated: </dt>
							<dd><?php echo $value['updated_date']; ?></dd>
							<dt>Status: </dt>
							<dd><?php echo $value['status']; ?></dd>
							</dl>
						</div>
						<div class="project-action pull-right">
						
							<a href="<?php echo base_url(); ?>index.php/project/resource/<?php echo $value['project_id']; ?>" class="btn btn-warning btn-xs">Resource Editor</a>
							<a href="<?php echo base_url(); ?>index.php/project/editor/<?php echo $value['project_id']; ?>"  
							<?php if($value['fk_projectstatus_id'] == 1) { 
								echo 'class="btn btn-warning btn-xs"'; 
							} 
							else if($value['fk_projectstatus_id'] == 2) {
								echo 'class="btn btn-danger btn-xs" onclick="return confirm(\'Entering editor of a published project will unpublish it. Keep going?\')"'; } ?>
							">VN Editor</a>
							
						</div>
					</div>
				</div>
				<?php endforeach ?>
			</div>
		</div>
		<div class="col-md-6">
		<h4>Latest Release</h4>
			<?php foreach($release as $value): ?>
				 <div class="media" style="background-color: rgba(0, 0, 0, 0.3); margin: 10px 20px; padding: 10px;">
					<div class="media-left">
						<img src="<?php if(isset($value['cover']) && $value['cover'] == 1) { echo base_url() . 'resources/' . $value['fk_user_id'] . '/' . $value['project_id'] .'/cover.jpg'; } ?>" class="media-object project-cover" />
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h2 class="media-heading"><?php echo $value['title']; ?></h2>
						</div>
						<div>
							<dl class="dl-horizontal" style="margin-left:-50px;">
							<dt>Published: </dt>
							<dd><?php echo $value['published_date']; ?></dd>
							<dt>By: </dt>
							<dd><?php echo $value['username']; ?></dd>
							</dl>
						</div>
						<div class="project-action pull-right">
						
							<a href="<?php echo base_url(); ?>index.php/game/play/<?php echo $value['project_id']; ?>" class="btn btn-primary btn-xs">Play</a>
							
						</div>
					</div>
				</div>
			<?php endforeach ?>
		</div>
	</div>
						
</div>

