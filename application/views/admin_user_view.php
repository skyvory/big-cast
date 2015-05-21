<div class="container-fluid">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">
			<div class="page-header">
				<h2>User List</h2>
				<a href="<?php echo base_url(); ?>index.php/admin/register" class="btn btn-primary">Add New</a>
			</div>
			<div class="row">
				<div class="col-md-1 col-md-offset-1">
					
				</div>
			</div>
			<?php if(isset($error)) { echo ('<div class="alert alert-danger">' . $error . '</div>'); } ?>
			 <table class="table">
				<tr>
					<th>ID</th>
					<th>Username</th>
					<th>Created Date</th>
					<th>Updated Date</th>
				</tr>
				<?php foreach($user as $value): ?>
				<tr>
					<td>
						<?php if(isset($value['user_id'])) echo $value['user_id']; ?>
					</td>
					<td>
						<?php if(isset($value['username'])) echo $value['username']; ?>
					</td>
					<td>
						<?php if(isset($value['created_date'])) echo $value['created_date']; ?>
					</td>
					<td>
						<?php if(isset($value['updated_date'])) echo $value['updated_date']; ?>
					</td>
					<td>
						<?php if(isset($value['name'])) echo $value['name']; ?>
					</td>
					<td>
						<a href="<?= base_url() . 'index.php/admin/editUser/' . $value['user_id']; ?>" class="btn btn-warning">Edit</a>
						<a href="<?= base_url() . 'index.php/admin/deleteUser/' . $value['user_id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
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

