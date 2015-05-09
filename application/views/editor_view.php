<div class="container-fluid" style="margin: 10px 10px 20px;">
	<div id="notification">
		<?php if(isset($error)) echo($error); ?>
	</div>

	<div class="row">
		<div class="col-md-7">
			<div class="row" style="position:fixed; z-index: 10;">
				<div class="col-md-12" style="background-color: rgba(78, 23, 234, 0.1); padding: 10px; margin: 0px 0px 10px; " >
					<div class="line-command-area">
						<span class="pull-left">Add line at the end of this section &nbsp;</span><br />
						<div class="btn-toolbar" role="toolbar">
							<div class="btn-group btn-group-sm" role="group">
								<button type="button" id="addtextbutton" class="btn btn-default">text</button>
								<button type="button" id="addchoicebutton"  class="btn btn-default">choice</button>
								<button type="button" id="addvideobutton"  class="btn btn-default">video</button>
								<button type="button" id="addendbutton"  class="btn btn-default">end</button>
							</div>
							<button type="button" id="savebutton" class="btn btn-default pull-right">Save</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 line-area" style="margin-top: 80px;">
						<span class="request-loading request-loading-resourcelist">
							<img src="../../../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..." style="display:none" />
						</span>
						<table class="table">
							<tbody class="line-list">
<!-- line form template new
<tr>
	<td>
		<form class="form-horizontal text-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+tail+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-10">
					<div class="form-group">
						<div class="form-inline">
							<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+last.speaker+'" />
							<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+last.background+'" />
								<input type="hidden" name="background_resource_id" value="'+last.background_resource_id+'" />
							<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+last.bgm+'" />
								<input type="hidden" name="bgm_resource_id" value="'+last.bgm_resource_id+'" />
							<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="" />
								<input type="hidden" name="voice_resource_id" value="" />
						</div>
					</div>
					<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;">
						<textarea name="content" class="form-control input-sm" maxlength="256" rows="1" placeholder="text content"></textarea>
					</div>
				
					<div class="row">
						<div class="collapse">
							<div class="col-md-12">
								<div class="form-group">
									<div class="form-inline">
										<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value=""/>
											<input type="hidden" name="sfx_resource_id" value="" />
										<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" title="jump to another line instead by sequence order" value="" />
											<input type="hidden" name="jumpto_line_id" value="" />
										<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+tail+'" />
			<input type="hidden" name="line_id" value="new" />
		</form>
	</td>
</tr>
 -->


<!-- line form template filled
<tr>
	<td>
		<form class="form-horizontal text-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+value.sequence+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-10">
					<div class="form-group">
						<div class="form-inline">
							<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+value.speaker+'" />
							<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+value.background_name+'" />
								<input type="hidden" name="background_resource_id" value="'+value.background_resource_id+'" />
							<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+value.bgm_name+'" />
								<input type="hidden" name="bgm_resource_id" value="'+value.bgm_resource_id+'" />
							<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="'+value.voice_name+'" />
								<input type="hidden" name="voice_resource_id" value="'+value.voice_resource_id+'" />
						</div>
					</div>
					<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;">
						<textarea name="content" class="form-control input-sm" maxlength="256" rows="1" placeholder="text content">'+value.content+'</textarea>
					</div>
				
					<div class="row">
						<div class="collapse">
							<div class="col-md-12">
								<div class="form-group">
									<div class="form-inline">
										<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value="'+value.sfx_name+'"/>
											<input type="hidden" name="sfx_resource_id" value="'+value.sfx_resource_id+'" />
										<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" title="jump to another line instead by sequence order" value="'+value.jumpto_line_id+'" />
											<input type="hidden" name="jumpto_line_id" value="'+value.jumpto_line_id+'" />
										<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+value.sequence+'" />
			<input type="hidden" name="line_id" value="'+value.line_id+'" />
		</form>
	</td>
</tr>
 -->
							</tbody>
						</table>
						<div class="line-pagination-area">
						</div>
				</div>
			</div>
		</div>
		<div class="col-md-5">
			<div class="row">
				<div class="col-md-11 col-md-offset-1 preview-area" style="position: fixed; width: 30%; margin-left: 6%;">
					<div class="line-preview">
						<center><canvas id="preview" style="border:2px solid black;"></canvas></center>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-11 col-md-offset-1 sprite-area"  style="position: fixed; width: 30%; margin-top: 220px; margin-left:6%;">
					<table class="table">
					<thead>
					<tr>
					<th>
					<div class="sprite-command-area">
						<button type="button" id="addspritebutton" class="btn btn-default btn-xs">Add sprite</button>
						<button type="button" id="clearspritebutton" class="btn btn-default btn-xs">Clear all sprites</button>
					</div>
					</th>
					</tr>
					</thead>
					<tbody class="sprite-list">

<!-- sprite form template new
<tr>
	<td>
		<form class="form-inline sprite-form">
			<div class="row">
				<div class="col-md-1">
					<span class="sprite-index">'+count+'</span>
				</div>
				<div class="col-md-9">
					<div class="form-group">
						<input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="'+value.sprite_id+'" />
							<input type="hidden" name="sprite_resource_id" value="'+value.sprite_resource_id+'" />
						<input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="'+value.position_x+'" />
						<input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="'+value.position_y+'" />
						<input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="'+value.position_z+'" />
						<input type="text" name="effect" class="form-control input-xs sprite-input" placeholder="transition" value="" />
							<input type="hidden" name="effect_id" value="" />
					<span class="glyphicon glyphicon-resize-vertical"></span>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button"><span class="glyphicon glyphicon-remove"></span></button>
				</div>
			</div>
			<input type="hidden" name="sprite_id" value="'+value.sprite_id+'" />
		</form>
	</td>
</tr>
 -->

<!-- sprite form template fill
<tr>
	<td>
		<form class="form-inline sprite-form">
			<div class="row">
				<div class="col-md-1">
					<span class="sprite-index">'+count+'</span>
				</div>
				<div class="col-md-9">
					<div class="form-group">
						<input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="'+value.sprite_id+'" />
							<input type="hidden" name="sprite_resource_id" value="'+value.sprite_resource_id+'" />
						<input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="'+value.position_x+'" />
						<input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="'+value.position_y+'" />
						<input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="'+value.position_z+'" />
						<input type="text" name="effect" class="form-control input-xs sprite-input" placeholder="transition" value="" />
							<input type="hidden" name="effect_id" value="" />
					<span class="glyphicon glyphicon-resize-vertical"></span>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button"><span class="glyphicon glyphicon-remove"></span></button>
				</div>
			</div>
			<input type="hidden" name="sprite_id" value="'+value.sprite_id+'" />
		</form>
	</td>
</tr>
 -->
					</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>






<script type="text/javascript">
	
</script>