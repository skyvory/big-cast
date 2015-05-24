<div class="container-fluid">
	<div class="row">
		<div class="col-md-12 ">
			<div class="page-header">
				<h2>Project List</h2>
			</div>
			 <table class="table">
				<tr>
					<th>ID</th>
					<th>User</th>
					<th>Title</th>
					<th>Created Date</th>
					<th>Updated Date</th>
					<th>Published Date</th>
					<th>Status</th>
				</tr>
				<?php foreach($project as $value): ?>
				<tr>
					<td>
						<?php if(isset($value['project_id'])) echo $value['project_id']; ?>
					</td>
					<td>
						<?php if(isset($value['username'])) echo $value['username']; ?>
					</td>
					<td>
						<?php if(isset($value['title'])) echo $value['title']; ?>
					</td>
					<td>
						<?php if(isset($value['created_date'])) echo $value['created_date']; ?>
					</td>
					<td>
						<?php if(isset($value['updated_date'])) echo $value['updated_date']; ?>
					</td>
					<td>
						<?php if(isset($value['published_date'])) echo $value['published_date']; ?>
					</td>
					<td>
						<?php if(isset($value['name'])) echo $value['name']; ?>
					</td>
					<td>
						<a href="<?= base_url() . 'index.php/admin/viewProject/' . $value['project_id']; ?>" class="btn btn-info">Details</a>
					</td>
				</tr>
				<?php endforeach ?>
			</table>


			</div>
			<center>
				<?php echo $page; ?>
			</center>
	</div>
						
</div>

