<div class="container-fluid editor-container">
	<div id="notification">
		<?php if(isset($error)) echo($error); ?>
	</div>

	<div class="row draggable line-command-row" data-step="17" data-intro="This is your draggable line control to add new lines.<br>" data-position="top">
		<div class="col-md-12 line-command-col">
			<div class="line-command-area">
				<span class="pull-left">Add line</span><br />
					<div class="btn-group btn-group-sm" role="group">
						<button type="button" id="addtextlinebutton" data-loading-text="text" class="btn btn-default" data-toggle="tooltip" title="you can use ctrl+enter key as alternative">text</button>
						<button type="button" id="addchoicelinebutton" data-loading-text="choice" class="btn btn-default">choice</button>
						<button type="button" id="addvideolinebutton" data-loading-text="video" class="btn btn-default">video</button>
						<button type="button" id="addendlinebutton" data-loading-text="end" class="btn btn-default">end</button>
					</div>
					<button type="button" id="savebutton" data-loading-text="Saving..." class="btn btn-success pull-right" data-step="18" data-intro="Always remember to save your work before closing this page." data-position="left">Save</button>
					<div class="row">
						<div class="col-md-8">
							<div class="btn-group btn-group-sm" role="group">
								<div class="radio">
									<label>
										<input type="radio" name="line_insert_position" value="after" />
											<span data-toggle="tooltip" data-placement="left" title="you can select a line by pointing your mouse on that line" />after selected line</span>
									</label>
									<label>
										<input type="radio" name="line_insert_position" value="end" checked  />
											<span>at end of this section</span>
									</label>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<br />
							<button type="button" class="btn btn-default btn-sm list-refresh-button" data-toggle="tooltip" title="refresh autocomplete list" data-step="19" data-intro="This button is for refreshing auto-complete list. Particularly useful when you add a new resource and want to assign it here, but don't want to refresh this page. Just hit this button after successfully uploading your resource files and see it's here suggested in the list." data-position="left"><span class="glyphicon glyphicon-refresh"></span></button>
							<button type="button" class="btn btn-warning btn-sm pull-right play-button" data-step="20" data-intro="Lastly, you can test how your visual novel looks when played with this button, which will direct you to visual novel page." data-position="left">Play</button>
						</div>
					</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-7">
			<!-- <div class="row draggable" style="position:fixed; z-index: 10;">
				<div class="col-md-12" style="background-color: rgba(78, 23, 234, 0.1); padding: 10px; margin: 0px 0px 10px;" >
					<div class="line-command-area">
						<span class="pull-left">Add line</span><br />
						<div class="btn-toolbar" role="toolbar">
							<div class="btn-group btn-group-sm" role="group">
								<button type="button" id="addtextlinebutton" class="btn btn-default">text</button>
								<button type="button" id="addchoicelinebutton"  class="btn btn-default">choice</button>
								<button type="button" id="addvideolinebutton"  class="btn btn-default">video</button>
								<button type="button" id="addendlinebutton"  class="btn btn-default">end</button>
							</div>
							<div class="btn-group btn-group-sm" role="group">
								<div class="radio">
									<label>
										<input type="radio" name="line_insert_position" value="after" checked />
											<span title="you can select line by pointing you mouse on that line" />after selected line</span>
									</label>
									<label>
										<input type="radio" name="line_insert_position" value="end"  />
											<span>at end of this section</span>
									</label>
								</div>
							</div>
							<button type="button" id="savebutton" class="btn btn-default pull-right">Save</button>
						</div>
					</div>
				</div>
			</div> -->
			<div class="row draggable pagination-row" data-step="6" data-intro="This is your draggable page control to navigate between groups of lines.">
				<div class="col-md-12 pagination-col">
					<div class="pagination-area">
							<div class="btn-group">
								<button id="firstpagebutton" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="go to first page"><span class="glyphicon glyphicon-step-backward"></span></button>
								<button id="previouspagebutton" class="btn btn-default"><span class="glyphicon glyphicon-backward"></span> prev</button>
							</div>
							<form class="form-inline" style="display:inline-block; width:20%;">
								<div class="form-group">
									<div class="input-group">
										<input type="text" id="currentpage" name="current_page" class="form-control" value="<?php echo $page['current_page']; ?>" autocomplete="off">
										<div class="input-group-addon total-page">/ <span id="totalpage"><?php echo $page['total_page']; ?></span></div>
									</div>
								</div>
							</form>
						<!-- 	<input type="number" style="width:25%;"/>
							/ 999 -->
								
							<div class="btn-group">
								<button id="nextpagebutton" class="btn btn-default">next <span class="glyphicon glyphicon-forward"></span></button>
								<button id="lastpagebutton" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="go to last page"><span class="glyphicon glyphicon-step-forward"></span> </button>
							</div>
							<button type="button" class="btn btn-default collapse-all-button" data-toggle="tooltip" data-placement="bottom" title="collapse all details"><span class="glyphicon glyphicon-menu-hamburger"></span> </button>
							<form class="form-inline pull-right pagination-search-input">
								<div class="form-group">
									<div class="input-group" data-toggle="tooltip" data-placement="bottom" title="load lines by label">
										<div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>
										<input type="search" id="searchpage" class="form-control" placeholder="search">
									</div>
								</div>
							</form>
					</div>
				</div>
			</div>
			<div class="row" data-step="21" data-intro="This is where all the lines displayed. There's nothing here at the moment, so why don't you try adding some resource first and fiddling with features here. Have fun!">
				<div class="col-md-12 line-area line-col">
						<span class="request-loading">
							<img src="<?php echo base_url(); ?>assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."  />
						</span>
						<table class="table">
							<tbody class="line-list">









<!-- text line form template new
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
							<span class="glyphicon glyphicon-user"></span> 
							<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+last.speaker+'" />
							<span class="glyphicon glyphicon-picture"></span> 
							<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+last.background+'" />
								<input type="hidden" name="background_resource_id" value="'+last.background_resource_id+'" />
							<span class="glyphicon glyphicon-headphones"></span> 
							<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+last.bgm+'" />
								<input type="hidden" name="bgm_resource_id" value="'+last.bgm_resource_id+'" />
							<span class="glyphicon glyphicon-volume-down"></span> 
							<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="" />
								<input type="hidden" name="voice_resource_id" value="" />
						</div>
					</div>
					<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;">
						<textarea name="content" class="form-control input-sm" maxlength="160" rows="1" placeholder="text content"></textarea>
					</div>
				
					<div class="row">
						<div class="collapse">
							<div class="col-md-12">
								<div class="form-group">
									<div class="form-inline">
										<span class="glyphicon glyphicon-bullhorn"></span> 
										<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value=""/>
											<input type="hidden" name="sfx_resource_id" value="" />
										<span class="glyphicon glyphicon-share-alt"></span> 
										<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="" />
											<input type="hidden" name="jumpto_line_id" value="" />
										<span class="glyphicon glyphicon-tag"></span> 
										<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+tail+'" />
			<input type="hidden" name="line_id" value="'+new_line_id+'" />
		</form>
	</td>
</tr>
 -->

 <!--############################################################################-->

<!-- text line form template filled
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
							<span class="glyphicon glyphicon-user"></span> 
							<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+value.speaker+'" />
							<span class="glyphicon glyphicon-picture"></span> 
							<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+value.background_name+'" />
								<input type="hidden" name="background_resource_id" value="'+value.background_resource_id+'" />
							<span class="glyphicon glyphicon-headphones"></span> 
							<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+value.bgm_name+'" />
								<input type="hidden" name="bgm_resource_id" value="'+value.bgm_resource_id+'" />
							<span class="glyphicon glyphicon-volume-down"></span> 
							<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="'+value.voice_name+'" />
								<input type="hidden" name="voice_resource_id" value="'+value.voice_resource_id+'" />
						</div>
					</div>
					<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;">
						<textarea name="content" class="form-control input-sm" maxlength="160" rows="1" placeholder="text content">'+value.content+'</textarea>
					</div>
				
					<div class="row">
						<div class="collapse">
							<div class="col-md-12">
								<div class="form-group">
									<div class="form-inline">
										<span class="glyphicon glyphicon-bullhorn"></span> 
										<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value="'+value.sfx_name+'"/>
											<input type="hidden" name="sfx_resource_id" value="'+value.sfx_resource_id+'" />
										<span class="glyphicon glyphicon-share-alt"></span> 
										<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="'+value.jumpto_line_label+'" />
											<input type="hidden" name="jumpto_line_id" value="'+value.jumpto_line_id+'" />
										<span class="glyphicon glyphicon-tag"></span> 
										<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+value.sequence+'" />
			<input type="hidden" name="line_id" value="'+value.line_id+'" />
		</form>
	</td>
</tr>
 -->













<!-- choice line form new
 <tr>
	<td>
		<form class="form-horizontal choice-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+tail+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-10">
					<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;">
						<label class="col-md-1 control-label">1</label>
						<div class="col-md-8">
							<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/>
								<input type="hidden" name="choice_id" value="new" />
								<input type="hidden" name="choice_temp_index" value="1" />
						</div>
						<div class="col-md-3" style="margin-left:-25px;">
							<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump to" value=""/>
								<input type="hidden" name="jumpto_line_id" value="" />
						</div>
					</div>
					<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;">
						<label class="col-md-1 control-label">1</label>
						<div class="col-md-8">
							<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/>
								<input type="hidden" name="choice_id" value="new" />
								<input type="hidden" name="choice_temp_index" value="2" />
						</div>
						<div class="col-md-3" style="margin-left:-25px;">
							<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump to" value=""/>
								<input type="hidden" name="jumpto_line_id" value="" />
						</div>
					</div>

					<div class="collapse">
						<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;">
							<label class="col-md-1 control-label">1</label>
							<div class="col-md-8">
								<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/>
									<input type="hidden" name="choice_id" value="new" />
									<input type="hidden" name="choice_temp_index" value="3" />
							</div>
							<div class="col-md-3" style="margin-left:-25px;">
								<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump to" value=""/>
									<input type="hidden" name="jumpto_line_id" value="" />
							</div>
						</div>
						<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;">
							<label class="col-md-1 control-label">1</label>
							<div class="col-md-8">
								<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/>
									<input type="hidden" name="choice_id" value="new" />
									<input type="hidden" name="choice_temp_index" value="4" />
							</div>
							<div class="col-md-3" style="margin-left:-25px;">
								<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump to" value=""/>
									<input type="hidden" name="jumpto_line_id" value="" />
							</div>
						</div>
						<div class="col-md-4 col-md-offset-7">
							<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" />
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+tail+'" />
			<input type="hidden" name="line_id" value="'+new_line_id+'" />
		</form>
	</td>
</tr>
 -->

 <!--############################################################################-->

 <!-- choice line form fill
 <tr>
	<td>
		<form class="form-horizontal choice-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+value.sequence+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-10">



					<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;">
						<label class="col-md-1 control-label">'+i+'</label>
						<div class="col-md-8">
							<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value="'+j_value.content+'"/>
								<input type="hidden" name="choice_id" value="'+j_value.choice_id+'" />
								<input type="hidden" name="choice_temp_index" value="'+j_value.choice_temp_index+'" />
						</div>
						<div class="col-md-3" style="margin-left:-25px;">
							<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump to" value="'+j_value.jumpto_line_label+'"/>
								<input type="hidden" name="jumpto_line_id" value="'+j_value.jumpto_line_id+'" />
						</div>
					</div>



					<div class="collapse">
						
						

						<div class="col-md-4 col-md-offset-7">
							<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" />
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+value.sequence+'" />
			<input type="hidden" name="line_id" value="'+value.line_id+'" />
		</form>
	</td>
</tr>
 -->


















<!-- video line form new
 <tr>
	<td>
		<form class="form-horizontal video-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+tail+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-2">
					<span class="glyphicon glyphicon-film pull-left" style="font-size: 5em;"></span>
				</div>
				<div class="col-md-8">
					<div class="form-group">
						<div class="col-md-9">
							<input type="text" name="video" class="form-control input-sm" placeholder="video" value="" />
								<input type="hidden" name="video_resource_id" value="" />
						</div>
					</div>
					<div class="collapse">
						<div class="form-inline">
							<div class="form-group">
								<div class="col-md-3">
									<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="" />
										<input type="hidden" name="jumpto_line_id" value="" />
								</div>
							</div>
							<div class="form-group">
								<div class="col-md-3">
									<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+tail+'" />
			<input type="hidden" name="line_id" value="'+new_line_id+'" />
		</form>
	</td>
</tr>
 -->

 <!--############################################################################-->

<!-- video line form fill
 <tr>
	<td>
		<form class="form-horizontal video-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+value.sequence+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-2">
					<span class="glyphicon glyphicon-film pull-left" style="font-size: 5em;"></span>
				</div>
				<div class="col-md-8">
					<div class="form-group">
						<div class="col-md-9">
							<input type="text" name="video" class="form-control input-sm" placeholder="video" value="'+value.video_name+'" />
								<input type="hidden" name="video_resource_id" value="'+value.video_resource_id+'" />
						</div>
					</div>
					<div class="collapse">
						<div class="form-inline">
							<div class="form-group">
								<div class="col-md-3">
									<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="'+value.jumpto_line_id+'" />
										<input type="hidden" name="jumpto_line_id" value="'+value.jumpto_line_id+'" />
								</div>
							</div>
							<div class="form-group">
								<div class="col-md-3">
									<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"><span class="glyphicon glyphicon-option-horizontal"></span></button>
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+value.sequence+'" />
			<input type="hidden" name="line_id" value="'+value.line_id+'" />
		</form>
	</td>
</tr>
 -->








<!-- end line form new
<tr>
	<td>
		<form class="form-horizontal end-line-form">
			<div class="row">
				<div class="col-md-1">
					<span class="line-sequence">'+tail+'</span>
					<br /> <br />
					<span class="glyphicon glyphicon-resize-vertical"></span>
				</div>
				<div class="col-md-2">
					<span class="glyphicon glyphicon-step-forward pull-right" style="font-size: 4em;"></span>
				</div>
				<div class="col-md-8" style="padding-top: 15px;">
					<p>End mark.</p>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
					<br />
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"><span class="glyphicon glyphicon-chevron-right"></span></button>
					<br />
					
				</div>
			
			</div>
			<input type="hidden" name="sequence" value="'+tail+'" />
			<input type="hidden" name="line_id" value="'+new_line_id+'" />
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
			<!-- <div class="row">
				<div class="col-md-5" style="position: fixed;">
					<button type="button" class="btn btn-xs btn-info pull-right rotate" data-toggle="modal" data-target="#more_setting">more</button>
				</div>
			</div> -->
			<div class="row">
				<div class="col-md-11 col-md-offset-1 preview-area" style="position: fixed; width: 30%; margin-left: 6%;">
					<div class="line-preview">
						<center><canvas id="preview" style="border:2px solid black;"></canvas></center>
					</div>
				</div>
			</div>
			
			<div class="row" data-step="16" data-intro="Sprites for text line will be displayed here when you point your mouse cursor to the line.">
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
					<span class="sprite-index">'+(count+1)+'</span>
				</div>
				<div class="col-md-9">
					<div class="form-group">
						<input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="" />
							<input type="hidden" name="sprite_resource_id" value="" />
						<br />
						x 
						<input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="0" />
						y 
						<input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="0" />
						z 
						<input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="0" />
						<input type="text" name="effect" class="form-control input-xs sprite-effect-input" placeholder="transition" value="" />
							<input type="hidden" name="effect_id" value="" />
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
				</div>
			</div>
			<input type="hidden" name="sprite_id" value="new" />
			<input type="hidden" name="sprite_temp_index" value="'+count+'" />
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
						<input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="'+value.sprite_name+'" />
							<input type="hidden" name="sprite_resource_id" value="'+value.sprite_resource_id+'" />
						<br />
						x 
						<input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="'+value.position_x+'" />
						y 
						<input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="'+value.position_y+'" />
						z 
						<input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="'+value.position_z+'" />
						<input type="text" name="effect" class="form-control input-xs sprite-effect-input" placeholder="transition" value="'+eff+'" />
							<input type="hidden" name="effect_id" value="'+value.fk_effect_id+'" />
					</div>
				</div>
				<div class="col-md-1">
					<button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button" tabindex="-1"><span class="glyphicon glyphicon-remove"></span></button>
				</div>
			</div>
			<input type="hidden" name="sprite_id" value="'+value.sprite_id+'" />
			<input type="hidden" name="sprite_temp_index" value="'+(count-1)+'" />
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




<!-- 
<div class="modal fade" id="more_setting" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Modal title</h4>
			</div>
			<div class="modal-body">
			<form class="form-horizontal">
				<div class="form-group">
					<label for="title_background" class="col-md-2 control-label">Ttitle screen background</label>
					<div class="col-md-10">
						<input type="text" id="title_background" name="title_background" class="form-control" />
						<input type="hidden" id="title_background_id" name="title_background_id" />
					</div>
				</div>
				<div class="form-group">
					<label for="savedata_background" class="col-md-2 control-label">Save data screen background</label>
					<div class="col-md-10">
						<input type="text" id="savedata_background" name="savedata_background" class="form-control" />
						<input type="hidden" id="savedata_background_id" name="savedata_background_id" />
					</div>
				</div>
				<div class="form-group">
					<label for="configuration_background" class="col-md-2 control-label">Configuration screen background</label>
					<div class="col-md-10">
						<input type="text" id="configuration_background" name="configuration_background" class="form-control" />
						<input type="hidden" id="configuration_background_id" name="configuration_background_id" />
					</div>
				</div>
			</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button id="save_background_setting_button" type="button" class="btn btn-primary">Save changes</button>
			</div>
		</div>
	</div>
</div> -->



<script type="text/javascript">
	var dummy_id;
	var req = $.ajax({
		url: config.base + 'index.php/project/idDummy',
		type: 'POST',
		dataType: "html"
	});
	req.done(function(msg) {
		dummy_id = msg;
	});
	if(RegExp('multipage', 'gi').test(window.location.search)) {
		introJs().setOption('doneLabel', 'Next page').goToStep(5).start().oncomplete(function() {
			window.location.href = '../project/resource/'+dummy_id;
		});
	}
</script>