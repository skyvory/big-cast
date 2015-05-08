<div class="container-fluid" style="margin: 10px 10px 20px;">
<div id="notification">
	<?php if(isset($error)) echo($error); ?>
</div>
<div class="row">
	<div class="col-md-5" style="background-color: rgba(78, 23, 234, 0.1); padding: 20px; margin: 0px 5px 10px">
	<div class="line-command-area">
		<span class="pull-left">Add line at the end of this section &nbsp;</span><br />
		<div class="btn-toolbar line-command-area" role="toolbar">
			<div class="btn-group btn-group-sm" role="group">
				<button type="button" class="btn btn-default">text</button>
				<button type="button" class="btn btn-default">choice</button>
				<button type="button" class="btn btn-default">video</button>
				<button type="button" class="btn btn-default">end</button>
			</div>
			<button type="button" class="btn btn-default pull-right">Save</button>
		</div>
	</div>
	</div>
</div>
<div class="row">
	<div class="col-md-7" style="background-color: rgba(65, 103, 102, 0.1); padding: 20px;">
	<div class="line-area">
		<span class="request-loading request-loading-resourcelist" style="">
			<img src="../../../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..." style="display:none" />
		</span>
		<ul class="line-list">
			<li class="line-item">
				<form class="form-inline">
					<span class="sequence">1</span> &nbsp;
					<div class="form-group">
					<input type="text" name="sequence" class="form-control input-sm" />
					</div>
					<div class="form-group">
					<input type="text" name="speaker" class="form-control input-sm" />
					</div>
					<div class="form-group">
					<input type="text" name="content" class="form-control input-sm" />
					</div>
					<button type="button" class="btn btn-danger btn-sm line-delete-button">Delete</button>
					&nbsp; <span class="glyphicon glyphicon-resize-vertical"></span>
				</form>
			</li>
			<li class="line-item">
				<form class="form-inline">
					<div class="form-group">
					<input type="text" name="sequence" class="form-control input-sm" />
					</div>
					<div class="form-group">
					<input type="text" name="speaker" class="form-control input-sm" />
					</div>
					<div class="form-group">
					<input type="text" name="content" class="form-control input-sm" />
					</div>
					<button type="button" class="btn btn-danger btn-sm line-delete-button">Delete</button>
				</form>
			</li>
		</ul>
		<table class="table">
			<tbody class="line-list">
				<tr>
				<td>
					<form class="form-inline">
						<span class="sequence">1</span> &nbsp;
						<div class="form-group">
						<input type="text" name="sequence" class="form-control input-sm" />
						</div>
						<div class="form-group">
						<input type="text" name="speaker" class="form-control input-sm" />
						</div>
						<div class="form-group">
						<input type="text" name="content" class="form-control input-sm" />
						</div>
						<button type="button" class="btn btn-danger btn-sm line-delete-button">Delete</button>
						&nbsp; <span class="glyphicon glyphicon-resize-vertical"></span>
					</form>
				</td>
				</tr>
			</tbody>
		</table>
		<div class="line-pagination-area">
		</div>
	</div>
	</div>
	<div class="col-md-4">
		<div class="row">
			<div class="col-md-11 col-md-offset-1" style="background-color: rgba(65, 103, 102, 0.3); padding: 30px;">
			<div class="resource-preview">
			</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-11 col-md-offset-1" style="background-color: rgba(65, 103, 102, 0.4); padding: 40px;">
			<div class="resource-preview">
			</div>
			</div>
		</div>
	</div>
</div>
</div>

<script type="text/javascript">
	$(document).ready( callLineList() );

	var active_line = [];
	var head = 0;
	var tail = 0;
	// newarray = {id: 1, type: "rand"};
	// active_line.push(newarray);

	function callLineList() {
		var req = $.ajax({
			url: config.base + "index.php/editor/loadLineData",
			type: "POST",
			data: {id: 1},
			dataType: "html",
			beforeSend: function() {
				//placehoder
			}
		});
		req.done(function(msg) {
			if(msg) {
				var active =  $.parseJSON(msg);
				// var active = active[0];
				if(active[0].length > 0) {
					console.log(active);
					head = active[0][0]['sequence'];
					$.each(active[0], function() {
						if(this.sequence < head) {
							head = this.sequence;
						}
						if(this.sequence > tail) {
							tail = this.sequence;
						}
					});
				}
				else {
					console.log("no result fetched");
				}
			}
		});
	}

	

	function getActiveLastLineSequence() {
		//placeholder
	}
	
	$(function() {
		$('.line-list').sortable({
			axis: 'y',
			stop: function (event, ui) {
				
			}
		});
	});

	//initialize array
	$('#addtextbutton').click(function() {
		var block = '';
	});


</script>




<style type="text/css">
	.line-item {
		margin: 5px;
	}
	/*remove bullet on ul li*/
	ul {
		list-style-type: none;
	}
</style>