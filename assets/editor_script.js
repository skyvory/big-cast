'use strict';
$(document).ready(function() {
	callLineData("last"); 
});

var current_page = "last";
var line_obj = [];
var delete_obj = [];
var head = 0;
var tail = 0;

function getLastLineObjectBySequence(seq) {
	// var select_form = $('.line-list tr td form').has('input[name=sequence][value='+seq+']');
	if(seq != 0) {
		var select_index = getObjectIndex(line_obj, 'sequence', seq);
		// prepare sprite duplication
		var sprite_duplicate = [];
		var count = 0;
		// duplicate sprite with fresh id
		$.each(line_obj[select_index].sprite, function(index, value) {
			sprite_duplicate.push({
				sprite_temp_index: count,
				sprite_id: "new",
				position_x: value.position_x,
				position_y: value.position_y,
				position_z: value.position_z,
				emphasize: "0",
				fk_effect_id: value.fk_effect_id,
				sprite_resource_id: value.sprite_resource_id,
				sprite_name: value.sprite_name,
				sprite_file_name: value.sprite_file_name,
				sprite_character_name: value.sprite_character_name,
				sprite_figure_name: value.sprite_figure_name,
				sprite_expression_name: value.sprite_expression_name
			});
			count++;
		})
		var select_obj = {
			speaker: line_obj[select_index].speaker,
			background_resource_id: line_obj[select_index].background_resource_id,
			background: line_obj[select_index].background_name,
			bgm_resource_id: line_obj[select_index].bgm_resource_id,
			bgm: line_obj[select_index].bgm_name,
			sprite: sprite_duplicate
		}
	}
	else {
		var select_obj = {
			speaker: "",
			background_resource_id: "",
			background: "",
			bgm_resource_id: "",
			bgm: "",
			sprite: []
		}
	}
	return select_obj;
}

function callLineData(page, by) {
	by = by || 0;
	current_page = $('#currentpage').val();
	var req = $.ajax({
		url: config.base + "index.php/editor/loadLineData",
		type: "POST",
		data: {
			current: current_page,
			to: page,
			by: by
		},
		dataType: "json",
		beforeSend: function() {
			$('.line-list').fadeOut(100);
			$('.request-loading').show();
		}
	});
	req.done(function(msg) {
		$('.request-loading').hide();
		$('.line-list').fadeIn(500);
		if(msg) {
			if(msg.length > 0) {
				line_obj = msg;
				head = msg[0]['sequence'];
				tail = head;
				var block = "";
				$('.line-list').html("");
				$.each(msg, function(index, value) {
					if(parseInt(value.sequence) < head) {
						head = parseInt(value.sequence);
					}
					if(parseInt(value.sequence) > tail) {
						tail = parseInt(value.sequence);
					}
					if(value.fk_linetype_id == "1") {
						block = ' \
						<tr> \
							<td> \
								<form class="form-horizontal text-line-form"> \
									<div class="row"> \
										<div class="col-md-1"> \
											<span class="line-sequence">'+value.sequence+'</span> \
											<br /><br /> \
											<span class="glyphicon glyphicon-resize-vertical"></span> \
										</div> \
										<div class="col-md-10"> \
											<div class="form-group"> \
												<div class="form-inline"> \
													<span class="glyphicon glyphicon-user"></span> \
													<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+value.speaker+'" /> \
													<span class="glyphicon glyphicon-picture"></span> \
													<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+value.background_name+'" /> \
													<input type="hidden" name="background_resource_id" value="'+value.background_resource_id+'" /> \
													<span class="glyphicon glyphicon-headphones"></span> \
													<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+value.bgm_name+'" /> \
													<input type="hidden" name="bgm_resource_id" value="'+value.bgm_resource_id+'" /> \
													<span class="glyphicon glyphicon-volume-down"></span> \
													<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="'+value.voice_name+'" /> \
													<input type="hidden" name="voice_resource_id" value="'+value.voice_resource_id+'" /> \
												</div> \
											</div> \
											<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;"> \
												<textarea name="content" class="form-control input-sm" maxlength="200" rows="1" placeholder="text content">'+value.content+'</textarea> \
											</div> \
											<div class="row"> \
												<div class="collapse"> \
													<div class="col-md-12"> \
														<div class="form-group"> \
															<div class="form-inline"> \
																<span class="glyphicon glyphicon-bullhorn"></span> \
																<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value="'+value.sfx_name+'"/> \
																<input type="hidden" name="sfx_resource_id" value="'+value.sfx_resource_id+'" /> \
																<span class="glyphicon glyphicon-share-alt"></span> \
																<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="'+value.jumpto_line_label+'" /> \
																<input type="hidden" name="jumpto_line_id" value="'+value.jumpto_line_id+'" /> \
																<span class="glyphicon glyphicon-tag"></span> \
																<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" /> \
															</div> \
														</div> \
													</div> \
												</div> \
											</div> \
										</div> \
										<div class="col-md-1"> \
											<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
												<span class="glyphicon glyphicon-remove"></span> \
											</button> \
											<br /> \
											<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"> \
												<span class="glyphicon glyphicon-chevron-right"></span> \
											</button> \
											<br /> \
											<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
												<span class="glyphicon glyphicon-option-horizontal"></span> \
											</button> \
										</div> \
									</div> \
									<input type="hidden" name="sequence" value="'+value.sequence+'" /> \
									<input type="hidden" name="line_id" value="'+value.line_id+'" /> \
								</form> \
							</td> \
						</tr> \
						';
						$(block).appendTo('.line-list');
					}
					else if(value.fk_linetype_id == "2") {
						block = ' \
						<tr> \
							<td> \
								<form class="form-horizontal choice-line-form"> \
								<div class="row"> \
									<div class="col-md-1"> \
										<span class="line-sequence">'+value.sequence+'</span> \
										<br /><br /> \
										<span class="glyphicon glyphicon-resize-vertical"></span> \
									</div> \
									<div class="col-md-10">\
						';
						var i = 0;
						$.each(value.choice, function(j_index, j_value) {
							i++;
							if(i == 3) {
								block = block + '<div class="collapse">';
							}
							block = block + ' \
											<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
												<label class="col-md-1 control-label">'+i+'</label> \
												<div class="col-md-8"> \
													<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value="'+j_value.content+'"/> \
													<input type="hidden" name="choice_id" value="'+j_value.choice_id+'" /> \
													<input type="hidden" name="choice_temp_index" value="'+j_value.choice_temp_index+'" /> \
												</div> \
												<div class="col-md-3" style="margin-left:-25px;"> \
													<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump to" value="'+j_value.jumpto_line_label+'"/> \
													<input type="hidden" name="jumpto_line_id" value="'+j_value.jumpto_line_id+'" /> \
												</div> \
											</div> \
							 ';
						});
						block = block + ' \
											<div class="col-md-4 col-md-offset-7"> \
												<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" /> \
											</div> \
										</div> \
									</div> \
									<div class="col-md-1"> \
										<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
											<span class="glyphicon glyphicon-remove"></span> \
										</button> \
										<br /> \
										<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
											<span class="glyphicon glyphicon-option-horizontal"></span> \
										</button> \
									</div> \
								</div> \
								<input type="hidden" name="sequence" value="'+value.sequence+'" /> \
								<input type="hidden" name="line_id" value="'+value.line_id+'" /> \
								</form> \
							</td> \
						</tr> \
						';
						$(block).appendTo('.line-list');
					}
					else if(value.fk_linetype_id == "3") {
						block = ' \
						<tr> \
							<td> \
								<form class="form-horizontal video-line-form"> \
									<div class="row"> \
										<div class="col-md-1"> \
											<span class="line-sequence">'+value.sequence+'</span> \
											<br /><br /> \
											<span class="glyphicon glyphicon-resize-vertical"></span> \
										</div> \
										<div class="col-md-2"> \
											<span class="glyphicon glyphicon-film pull-left" style="font-size: 5em;"></span> \
										</div> \
										<div class="col-md-8"> \
											<div class="form-group"> \
												<div class="col-md-9"> \
													<input type="text" name="video" class="form-control input-sm" placeholder="video" value="'+value.video_name+'" /> \
													<input type="hidden" name="video_resource_id" value="'+value.video_resource_id+'" /> \
												</div> \
											</div> \
											<div class="collapse"> \
												<div class="form-inline"> \
													<div class="form-group"> \
														<div class="col-md-3"> \
															<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="'+value.jumpto_line_label+'" /> \
															<input type="hidden" name="jumpto_line_id" value="'+value.jumpto_line_id+'" /> \
														</div> \
													</div> \
													<div class="form-group"> \
														<div class="col-md-3"> \
															<input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" /> \
														</div> \
													</div> \
												</div> \
											</div> \
										</div> \
										<div class="col-md-1"> \
											<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
												<span class="glyphicon glyphicon-remove"></span> \
											</button> \
											<br /> \
											<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
												<span class="glyphicon glyphicon-option-horizontal"></span> \
											</button> \
										</div> \
									</div> \
									<input type="hidden" name="sequence" value="'+value.sequence+'" /> \
									<input type="hidden" name="line_id" value="'+value.line_id+'" /> \
								</form> \
							</td> \
						</tr> \
						';
						$(block).appendTo('.line-list');
					}
					else if (value.fk_linetype_id == 4) {
						block = ' \
						<tr> \
							<td> \
								<form class="form-horizontal end-line-form"> \
									<div class="row"> \
										<div class="col-md-1"> \
											<span class="line-sequence">'+value.sequence+'</span> \
											<br /><br /> \
											<span class="glyphicon glyphicon-resize-vertical"></span> \
										</div> \
										<div class="col-md-2"> \
											<span class="glyphicon glyphicon-step-forward pull-right" style="font-size: 4em;"></span> \
										</div> \
										<div class="col-md-8" style="padding-top: 15px;"> \
											<p>End mark.</p> \
										</div> \
										<div class="col-md-1"> \
											<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
												<span class="glyphicon glyphicon-remove"></span> \
											</button> \
											<br /> \
										</div> \
									</div> \
									<input type="hidden" name="sequence" value="'+value.sequence+'" /> \
									<input type="hidden" name="line_id" value="'+value.line_id+'" /> \
								</form> \
							</td> \
						</tr> \
						';
						$(block).appendTo('.line-list');
					}
				});
			}
			else {
				head = 0;
				tail = 0;
				$('.line-list').html(' \
					<p class="no-line">No line to display.</p> \
					<p class="no-line">You can add lines by using add line buttons.</p> \
				');
			}
		}
	});
}


$(function() {
	$('.line-list').sortable({
		// enable only vertical sort
		axis: 'y',
		// do something after mouse up on sort
		stop: function (event, ui) {
			var count = head;
			// do something for each sortable data
			$(this).children('tr').each(function() {
				// get line id of current iteration
				var form_id = $(this).find('[name=line_id]').val();
				// get index of line object with found id
				var index_to_write = getObjectIndex(line_obj, 'line_id', form_id);
				// change sequence value pointed object with current count iteration 
				line_obj[index_to_write].sequence = count.toString();
				// write proper index to line
				$(this).find('.line-sequence').html(count);
				// change hidden value of sequence
				$(this).find('input[name=sequence]').val(count);
				count++;
			});
		}
	});
});

$(function() {
	$('.draggable').draggable();
});

$(function() {
	$('.sprite-list').sortable({
		axis: 'y',
		stop: function (event, ui) {
			var count = 0;
			$(this).children('tr').each(function() {
				count++;
				$(this).find('.sprite-index').html(count);
			})
		}
	});
});

// new text line
$('#addtextlinebutton').click(function() {
	var select_form = $('.select-line');
	// get value of which radio is selected for line insertion position
	var insert_position = $('.line-command-area').find('input:radio[name=line_insert_position]:checked').val();
	// add new line in the middle
	if(insert_position == "after") {
		// get sequence value of selected line
		var form_sequence = $(select_form).find('input[name=sequence]').val();
		form_sequence = parseInt(form_sequence);
		var index_to_write = getObjectIndex(line_obj, 'sequence', form_sequence);
		var form_line_type = line_obj[index_to_write].fk_linetype_id;
		// throw error if no line selected
		if(!form_sequence) {
			callErrorNotification("select line first!");
		}
		else {
			// get object consist of value from selected line
			if(form_line_type != 1) {
				var last = getLastLineObjectBySequence(0);
			}
			else {
				var last = getLastLineObjectBySequence(form_sequence);
			}
			var sequence_to_insert = form_sequence + 1;
			var req = $.ajax({
				url: config.base + 'index.php/editor/newLine',
				type: "POST",
				data: {
					linetype: 1,
					sequence: sequence_to_insert
				},
				dataType: "html",
				beforeSend: function() {
					$('#addtextlinebutton').button('loading');
				}
			});
			req.done(function(msg) {
				$('#addtextlinebutton').button('reset');
				if(msg) {
					var new_line_id = msg;

					//increment all sequence after selected line by 1 starting from end to up
					if(tail > form_sequence) {
						for(var i = tail; i > form_sequence; i--) {
							var i_index = getObjectIndex(line_obj, 'sequence', i);
							var i_sequence = parseInt(line_obj[i_index].sequence) + 1;
							line_obj[i_index].sequence = i_sequence.toString();
						}
					}

					//insert new text line to line_obj
					var index_to_write = getObjectIndex(line_obj, 'sequence', form_sequence) + 1;
					var new_line = {
						line_id: new_line_id.toString(),
						sequence: sequence_to_insert.toString(),
						label: "",
						speaker: last.speaker,
						content: "",
						jumpto_line_id: "",
						fk_linetype_id: "1",
						background_resource_id: last.background_resource_id,
						background_name: last.background,
						background_file_name: "",
						bgm_resource_id: last.bgm_resource_id,
						bgm_name: last.bgm,
						bgm_file_name: "",
						sfx_resource_id: "",
						sfx_name: "",
						sfx_file_name: "",
						voice_resource_id: "",
						voice_name: "",
						voice_file_name: "",
						sprite: last.sprite
					}
					// insert new text line data in middle of line_obj
					line_obj.splice(index_to_write, 0, new_line);
					tail++;
					var block = ' \
					<tr> \
					<td> \
					<form class="form-horizontal text-line-form"> \
					<div class="row"> \
					<div class="col-md-1"> \
					<span class="line-sequence"> \
					'+sequence_to_insert+'</span> \
					<br /><br /> \
					<span class="glyphicon glyphicon-resize-vertical"></span> \
					</div> \
					<div class="col-md-10"> \
						<div class="form-group"> \
							<div class="form-inline"> \
								<span class="glyphicon glyphicon-user"></span> \
								<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+last.speaker+'" /> \
								<span class="glyphicon glyphicon-picture"></span> \
								<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+last.background+'" /> \
								<input type="hidden" name="background_resource_id" value="'+last.background_resource_id+'" /> \
								<span class="glyphicon glyphicon-headphones"></span> \
								<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+last.bgm+'" /> \
								<input type="hidden" name="bgm_resource_id" value="'+last.bgm_resource_id+'" /> \
								<span class="glyphicon glyphicon-volume-down"></span> \
								<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="" /> \
								<input type="hidden" name="voice_resource_id" value="" /> \
							</div> \
						</div> \
						<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;"> \
							<textarea name="content" class="form-control input-sm" maxlength="200" rows="1" placeholder="text content"></textarea> \
						</div> \
						<div class="row"> \
							<div class="collapse"> \
								<div class="col-md-12"> \
									<div class="form-group"> \
										<div class="form-inline"> \
											<span class="glyphicon glyphicon-bullhorn"></span> \
											<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value=""/> \
											<input type="hidden" name="sfx_resource_id" value="" /> \
											<span class="glyphicon glyphicon-share-alt"></span> \
											<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="" /> \
											<input type="hidden" name="jumpto_line_id" value="" /> \
											<span class="glyphicon glyphicon-tag"></span> \
											<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> \
										</div> \
									</div> \
								</div> \
							</div> \
						</div> \
					</div> \
					<div class="col-md-1"> \
					<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
					<span class="glyphicon glyphicon-remove"></span> \
					</button> \
					<br /> \
					<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"> \
					<span class="glyphicon glyphicon-chevron-right"></span> \
					</button> \
					<br /> \
					<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
					<span class="glyphicon glyphicon-option-horizontal"></span> \
					</button> \
					</div> \
					</div> \
					<input type="hidden" name="sequence" value="'+sequence_to_insert+'" /> \
					<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
					</form> \
					</td> \
					</tr> \
					';
					// append block of new text line after selected line
					var element_before_insert = $('.line-list tr').has('input[name=sequence][value='+form_sequence+']');
					$(block).insertAfter( $(element_before_insert) );
					// reorder sequence number and hidden input value on view end
					var count = head;
					$('.line-list').children('tr').each(function() {
						var form_id = $(this).find('[name=line_id]').val();
						$(this).find('.line-sequence').html(count);
						$(this).find('input[name=sequence]').val(count);
						count++;
					});
					var mid_line = $('.line-list').find('form').has('input[name=sequence][value='+sequence_to_insert+']');
					var text_area = $(mid_line).find('textarea[name=content]');
					$(text_area).focus();
				}
			});
		}
	}
	// add text line at end section
	else if(insert_position == "end") {
		var index_to_write = getObjectIndex(line_obj, 'sequence', tail);
		var form_line_type = -1;
		if(line_obj.length) {
			var form_line_type = line_obj[index_to_write].fk_linetype_id;
		}
		if(form_line_type != 1) {
			var last = getLastLineObjectBySequence(0);
		}
		else {
			var last = getLastLineObjectBySequence(tail);
		}
		var temp_tail = tail+1;
		var req = $.ajax({
			url: config.base + 'index.php/editor/newLine',
			type: "POST",
			data: {
				linetype: 1,
				sequence: temp_tail
			},
			dataType: "html",
			beforeSend: function() {
				$('#addtextlinebutton').button('loading');
			}
		});
		req.done(function(msg) {
			$('#addtextlinebutton').button('reset');
			if(msg) {
				var new_line_id = msg;
				if(head == 0) {
					head++;
					$('.line-list').html("");
				}
				tail++;
				line_obj.push({
					line_id: msg.toString(),
					sequence: tail.toString(),
					label: "",
					speaker: last.speaker,
					content: "",
					jumpto_line_id: "",
					fk_linetype_id: "1",
					background_resource_id: last.background_resource_id,
					background_name: last.background,
					background_file_name: "",
					bgm_resource_id: last.bgm_resource_id,
					bgm_name: last.bgm,
					bgm_file_name: "",
					sfx_resource_id: "",
					sfx_name: "",
					sfx_file_name: "",
					voice_resource_id: "",
					voice_name: "",
					voice_file_name: "",
					sprite: last.sprite
				});
				var block = ' \
				<tr> \
				<td> \
				<form class="form-horizontal text-line-form"> \
				<div class="row"> \
				<div class="col-md-1"> \
				<span class="line-sequence"> \
				'+tail+'</span> \
				<br /><br /> \
				<span class="glyphicon glyphicon-resize-vertical"></span> \
				</div> \
				<div class="col-md-10"> \
				<div class="form-group"> \
				<div class="form-inline"> \
				<span class="glyphicon glyphicon-user"></span> \
				<input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+last.speaker+'" /> \
				<span class="glyphicon glyphicon-picture"></span> \
				<input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+last.background+'" /> \
				<input type="hidden" name="background_resource_id" value="'+last.background_resource_id+'" /> \
				<span class="glyphicon glyphicon-headphones"></span> \
				<input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+last.bgm+'" /> \
				<input type="hidden" name="bgm_resource_id" value="'+last.bgm_resource_id+'" /> \
				<span class="glyphicon glyphicon-volume-down"></span> \
				<input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="" /> \
				<input type="hidden" name="voice_resource_id" value="" /> \
				</div> \
				</div> \
				<div class="form-group" style="margin-top: -10px; margin-bottom: 5px;"> \
				<textarea name="content" class="form-control input-sm" maxlength="200" rows="1" placeholder="text content"> \
				</textarea> \
				</div> \
				<div class="row"> \
				<div class="collapse"> \
				<div class="col-md-12"> \
				<div class="form-group"> \
				<div class="form-inline"> \
				<span class="glyphicon glyphicon-bullhorn"></span> \
				<input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value=""/> \
				<input type="hidden" name="sfx_resource_id" value="" /> \
				<span class="glyphicon glyphicon-share-alt"></span> \
				<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="" /> \
				<input type="hidden" name="jumpto_line_id" value="" /> \
				<span class="glyphicon glyphicon-tag"></span> \
				<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> \
				</div> \
				</div> \
				</div> \
				</div> \
				</div> \
				</div> \
				<div class="col-md-1"> \
				<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
				<span class="glyphicon glyphicon-remove"></span> \
				</button> \
				<br /> \
				<button type="button" class="btn btn-default btn-xs pull-right line-project-button" tabindex="-1"> \
				<span class="glyphicon glyphicon-chevron-right"></span> \
				</button> \
				<br /> \
				<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
				<span class="glyphicon glyphicon-option-horizontal"></span> \
				</button> \
				</div> \
				</div> \
				<input type="hidden" name="sequence" value="'+tail+'" /> \
				<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
				</form> \
				</td> \
				</tr> \
				';
				$(block).appendTo('.line-list');
				window.scrollTo(0,document.body.scrollHeight);
				var end_line = $('.line-list').find('form').has('input[name=sequence][value='+tail+']');
				var text_area = $(end_line).find('textarea[name=content]');
				$(text_area).focus();
			}
		});
	}
});

// new choice line
$('#addchoicelinebutton').click(function() {
	var select_form = $('.select-line');
	// get value of which radio is selected for line insertion position
	var insert_position = $('.line-command-area').find('input:radio[name=line_insert_position]:checked').val();
	// add new choice in the middle
	if(insert_position == "after") {
		// get sequence value of selected line
		var form_sequence = $(select_form).find('input[name=sequence]').val();
		form_sequence = parseInt(form_sequence);
		// throw error if no line selected
		if(!form_sequence) {
			callErrorNotification("select line first!");
		}
		else {
			var sequence_to_insert = form_sequence + 1;
			var req = $.ajax({
				url: config.base + 'index.php/editor/newLine',
				type: "POST",
				data: {
					linetype: 2,
					sequence: sequence_to_insert
				},
				dataType: "html",
				beforeSend: function() {
					$('#addchoicelinebutton').button('loading');
				}
			});
			req.done(function(msg) {
				$('#addchoicelinebutton').button('reset');
				if(msg) {
					var new_line_id = msg;
					//increment all sequence after selected line by 1 starting from end to up
					if(tail > form_sequence) {
						for(var i = tail; i > form_sequence; i--) {
							var i_index = getObjectIndex(line_obj, 'sequence', i);
							var i_sequence = parseInt(line_obj[i_index].sequence) + 1;
							line_obj[i_index].sequence = i_sequence.toString();
						}
					}
					//insert new choice line to line_obj
					var index_to_write = getObjectIndex(line_obj, 'sequence', form_sequence) + 1;
					var new_line = {
						line_id: new_line_id.toString(),
						sequence: sequence_to_insert.toString(),
						label: "",
						fk_linetype_id: "2",
						choice: [
							{
								choice_id: "new",
								content: "",
								jumpto_line_id: "",
								choice_temp_index: "1"
							}, {
								choice_id: "new",
								content: "",
								jumpto_line_id: "",
								choice_temp_index: "2"
							}, {
								choice_id: "new",
								content: "",
								jumpto_line_id: "",
								choice_temp_index: "3"
							}, {
								choice_id: "new",
								content: "",
								jumpto_line_id: "",
								choice_temp_index: "4"
							}
						]
					}
					// insert new choice line data in middle of line_obj
					line_obj.splice(index_to_write, 0, new_line);

					tail++;
					var block = ' \
					<tr> \
						<td> \
							<form class="form-horizontal choice-line-form"> \
								<div class="row"> \
									<div class="col-md-1"> \
										<span class="line-sequence">'+sequence_to_insert+'</span> \
										<br /><br /> \
										<span class="glyphicon glyphicon-resize-vertical"></span> \
									</div> \
									<div class="col-md-10"> \
										<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
											<label class="col-md-1 control-label">1</label> \
											<div class="col-md-8"> \
												<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
												<input type="hidden" name="choice_id" value="new" /> \
												<input type="hidden" name="choice_temp_index" value="1" /> \
											</div> \
											<div class="col-md-3" style="margin-left:-25px;"> \
												<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
												<input type="hidden" name="jumpto_line_id" value="" /> \
											</div> \
										</div> \
										<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
											<label class="col-md-1 control-label">2</label> \
											<div class="col-md-8"> \
												<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
												<input type="hidden" name="choice_id" value="new" /> \
												<input type="hidden" name="choice_temp_index" value="2" /> \
											</div> \
											<div class="col-md-3" style="margin-left:-25px;"> \
												<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
												<input type="hidden" name="jumpto_line_id" value="" /> \
											</div> \
										</div> \
										<div class="collapse"> \
											<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
												<label class="col-md-1 control-label">3</label> \
												<div class="col-md-8"> \
													<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
													<input type="hidden" name="choice_id" value="new" /> \
													<input type="hidden" name="choice_temp_index" value="3" /> \
												</div> \
												<div class="col-md-3" style="margin-left:-25px;"> \
													<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
													<input type="hidden" name="jumpto_line_id" value="" /> \
												</div> \
											</div> \
											<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
												<label class="col-md-1 control-label">4</label> \
												<div class="col-md-8"> \
													<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
													<input type="hidden" name="choice_id" value="new" /> \
													<input type="hidden" name="choice_temp_index" value="4" /> \
												</div> \
												<div class="col-md-3" style="margin-left:-25px;"> \
													<input type="text" name="choice_jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
													<input type="hidden" name="jumpto_line_id" value="" /> \
												</div> \
											</div> \
											<div class="col-md-4 col-md-offset-7"> \
												<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> \
											</div> \
										</div> \
									</div> \
									<div class="col-md-1"> \
										<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
											<span class="glyphicon glyphicon-remove"></span> \
										</button> \
										<br /> \
										<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
											<span class="glyphicon glyphicon-option-horizontal"></span> \
										</button> \
									</div> \
								</div> \
								<input type="hidden" name="sequence" value="'+sequence_to_insert+'" /> \
								<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
							</form> \
						</td> \
					</tr> \
					';

					// append block of new choice line after selected line
					var element_before_insert = $('.line-list tr').has('input[name=sequence][value='+form_sequence+']');
					$(block).insertAfter( $(element_before_insert) );

					// reorder sequence number and hidden input value on view end
					var count = head;
					$('.line-list').children('tr').each(function() {
						var form_id = $(this).find('[name=line_id]').val();
						$(this).find('.line-sequence').html(count);
						$(this).find('input[name=sequence]').val(count);
						count++;
					});
				}
			});
		}
	}
	// add choice at end section
	else if(insert_position == "end") {
		var temp_tail = tail+1;
		var req = $.ajax({
			url: config.base + 'index.php/editor/newLine',
			type: "POST",
			data: {
				linetype: 2,
				sequence: temp_tail
			},
			dataType: "html",
			beforeSend: function() {
				$('#addchoicelinebutton').button('loading');
			}
		});
		req.done(function(msg) {
			$('#addchoicelinebutton').button('reset');
			if(msg) {
				var new_line_id = msg;
				if(head == 0) {
					head++;
					$('.line-list').html("");
				}
				tail++;
				line_obj.push({
					line_id: new_line_id.toString(),
					sequence: tail.toString(),
					label: "",
					fk_linetype_id: "2",
					choice: [
						{
							choice_id: "new",
							content: "",
							jumpto_line_id: "",
							choice_temp_index: "1"
						}, {
							choice_id: "new",
							content: "",
							jumpto_line_id: "",
							choice_temp_index: "2"
						}, {
							choice_id: "new",
							content: "",
							jumpto_line_id: "",
							choice_temp_index: "3"
						}, {
							choice_id: "new",
							content: "",
							jumpto_line_id: "",
							choice_temp_index: "3"
						}
					]
				});
				var block = ' \
				<tr> \
					<td> \
						<form class="form-horizontal choice-line-form"> \
							<div class="row"> \
								<div class="col-md-1"> \
									<span class="line-sequence">'+tail+'</span> \
									<br /><br /> \
									<span class="glyphicon glyphicon-resize-vertical"></span> \
								</div> \
								<div class="col-md-10"> \
									<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
										<label class="col-md-1 control-label">1</label> \
										<div class="col-md-8"> \
											<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
											<input type="hidden" name="choice_id" value="new" /> \
											<input type="hidden" name="choice_temp_index" value="1" /> \
										</div> \
										<div class="col-md-3" style="margin-left:-25px;"> \
											<input type="text" name="jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
											<input type="hidden" name="jumpto_line_id" value="" /> \
										</div> \
									</div> \
									<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
										<label class="col-md-1 control-label">2</label> \
										<div class="col-md-8"> \
											<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
											<input type="hidden" name="choice_id" value="new" /> \
											<input type="hidden" name="choice_temp_index" value="2" /> \
										</div> \
										<div class="col-md-3" style="margin-left:-25px;"> \
											<input type="text" name="jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
											<input type="hidden" name="jumpto_line_id" value="" /> \
										</div> \
									</div> \
									<div class="collapse"> \
										<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
											<label class="col-md-1 control-label">1</label> \
											<div class="col-md-8"> \
												<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
												<input type="hidden" name="choice_id" value="new" /> \
												<input type="hidden" name="choice_temp_index" value="3" /> \
											</div> \
											<div class="col-md-3" style="margin-left:-25px;"> \
												<input type="text" name="jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
												<input type="hidden" name="jumpto_line_id" value="" /> \
											</div> \
										</div> \
										<div class="form-group per-choice" style="margin: 0px 5px 5px 0px;"> \
											<label class="col-md-1 control-label">1</label> \
											<div class="col-md-8"> \
												<input type="text" name="choice_content" class="form-control input-sm" placeholder="choice" value=""/> \
												<input type="hidden" name="choice_id" value="new" /> \
												<input type="hidden" name="choice_temp_index" value="4" /> \
											</div> \
											<div class="col-md-3" style="margin-left:-25px;"> \
												<input type="text" name="jumpto" class="form-control input-sm" placeholder="jump_to" value=""/> \
												<input type="hidden" name="jumpto_line_id" value="" /> \
											</div> \
										</div> \
										<div class="col-md-4 col-md-offset-7"> \
											<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> \
										</div> \
									</div> \
								</div> \
								<div class="col-md-1"> \
									<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
										<span class="glyphicon glyphicon-remove"></span> \
									</button> \
									<br /> \
									<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
										<span class="glyphicon glyphicon-option-horizontal"></span> \
									</button> \
								</div> \
							</div> \
							<input type="hidden" name="sequence" value="'+tail+'" /> \
							<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
						</form> \
					</td> \
				</tr> \
				';
				$(block).appendTo('.line-list');
				window.scrollTo(0,document.body.scrollHeight);
			}
		});
	}
});

// new video line
$('#addvideolinebutton').click(function() {
	var select_form = $('.select-line');
	var insert_position = $('.line-command-area').find('input:radio[name=line_insert_position]:checked').val();
	if(insert_position == "after") {
		var form_sequence = $(select_form).find('input[name=sequence]').val();
		form_sequence = parseInt(form_sequence);
		if(!form_sequence) {
			callErrorNotification("select line first!");
		}
		else {
			var sequence_to_insert = form_sequence + 1;
			var req = $.ajax({
				url: config.base + 'index.php/editor/newLine',
				type: "POST",
				data: {
					linetype: 3,
					sequence: sequence_to_insert
				},
				dataType: "html",
				beforeSend: function() {
					$('#addvideolinebutton').button('loading');
				}
			});
			req.done(function(msg) {
				$('#addvideolinebutton').button('reset');
				if(msg) {
					var new_line_id = msg;
					//increment all sequence after selected line by 1 starting from end to up
					if(tail > form_sequence) {
						for(var i = tail; i > form_sequence; i--) {
							var i_index = getObjectIndex(line_obj, 'sequence', i);
							var i_sequence = parseInt(line_obj[i_index].sequence) + 1;
							line_obj[i_index].sequence = i_sequence.toString();
						}
					}

					//insert new video line to line_obj
					var index_to_write = getObjectIndex(line_obj, 'sequence', form_sequence) + 1;
					var new_line = {
						line_id: new_line_id.toString(),
						sequence: sequence_to_insert.toString(),
						jumpto_line_id: "",
						label: "",
						fk_linetype_id: "3",
						video_name: "",
						video_resource_id: ""
					}
					// insert new video data in middle of line_obj
					line_obj.splice(index_to_write, 0, new_line);

					tail++;
					var block = ' \
					<tr> \
						<td> \
							<form class="form-horizontal video-line-form"> \
								<div class="row"> \
									<div class="col-md-1"> \
										<span class="line-sequence">'+sequence_to_insert+'</span> \
										<br /><br /> \
										<span class="glyphicon glyphicon-resize-vertical"></span> \
									</div> \
									<div class="col-md-2"> \
										<span class="glyphicon glyphicon-film pull-left" style="font-size: 5em;"></span> \
									</div> \
									<div class="col-md-8"> \
										<div class="form-group"> \
											<div class="col-md-9"> \
												<input type="text" name="video" class="form-control input-sm" placeholder="video" value="" /> \
												<input type="hidden" name="video_resource_id" value="" /> \
											</div> \
										</div> \
										<div class="collapse"> \
											<div class="form-inline"> \
												<div class="form-group"> \
													<div class="col-md-3"> \
														<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="" /> \
														<input type="hidden" name="jumpto_line_id" value="" /> \
													</div> \
												</div> \
												<div class="form-group"> \
													<div class="col-md-3"> \
														<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> \
													</div> \
												</div> \
											</div> \
										</div> \
									</div> \
									<div class="col-md-1"> \
										<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
											<span class="glyphicon glyphicon-remove"></span> \
										</button> \
										<br /> \
										<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
											<span class="glyphicon glyphicon-option-horizontal"></span> \
										</button> \
									</div> \
								</div> \
								<input type="hidden" name="sequence" value="'+sequence_to_insert+'" /> \
								<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
							</form> \
						</td> \
					</tr> \
					';

					// append block of new choice line after selected line
					var element_before_insert = $('.line-list tr').has('input[name=sequence][value='+form_sequence+']');
					$(block).insertAfter( $(element_before_insert) );

					// reorder sequence number and hidden input value on view end
					var count = head;
					$('.line-list').children('tr').each(function() {
						var form_id = $(this).find('[name=line_id]').val();
						$(this).find('.line-sequence').html(count);
						$(this).find('input[name=sequence]').val(count);
						count++;
					});
				}
			});
		}
	}
	// add video at end section
	else if(insert_position == "end") {
		var temp_tail = tail+1;
		var req = $.ajax({
			url: config.base + 'index.php/editor/newLine',
			type: "POST",
			data: {
				linetype: 3,
				sequence: temp_tail
			},
			dataType: "html",
			beforeSend: function() {
				$('#addvideolinebutton').button('loading');
			}
		});
		req.done(function(msg) {
			$('#addvideolinebutton').button('reset');
			if(msg) {
				var new_line_id = msg;
				if(head == 0) {
					head++;
					$('.line-list').html("");
				}
				tail++;
				line_obj.push({
					line_id: new_line_id.toString(),
					sequence: tail.toString(),
					jumpto_line_id: "",
					label: "",
					fk_linetype_id: "3",
					video_name: "",
					video_resource_id: ""
				});
				var block = ' \
				<tr> \
					<td> \
						<form class="form-horizontal video-line-form"> \
							<div class="row"> \
								<div class="col-md-1"> \
									<span class="line-sequence">'+tail+'</span> \
									<br /><br /> \
									<span class="glyphicon glyphicon-resize-vertical"></span> \
								</div> \
								<div class="col-md-2"> \
									<span class="glyphicon glyphicon-film pull-left" style="font-size: 5em;"></span> \
								</div> \
								<div class="col-md-8"> \
									<div class="form-group"> \
										<div class="col-md-9"> \
											<input type="text" name="video" class="form-control input-sm" placeholder="video" value="" /> \
											<input type="hidden" name="video_resource_id" value="" /> \
										</div> \
									</div> \
								<div class="collapse"> \
									<div class="form-inline"> \
										<div class="form-group"> \
											<div class="col-md-3"> \
												<input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" value="" /> \
												<input type="hidden" name="jumpto_line_id" value="" /> \
											</div> \
										</div> \
										<div class="form-group"> \
											<div class="col-md-3"> \
												<input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> \
											</div> \
										</div> \
									</div> \
								</div> \
							</div> \
							<div class="col-md-1"> \
								<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
									<span class="glyphicon glyphicon-remove"></span> \
								</button> \
								<br /> \
								<button type="button" class="btn btn-default btn-xs pull-right line-collapse-button" tabindex="-1"> \
									<span class="glyphicon glyphicon-option-horizontal"></span> \
								</button> \
							</div> \
							</div> \
							<input type="hidden" name="sequence" value="'+tail+'" /> \
							<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
						</form> \
					</td> \
				</tr> \
				';
				$(block).appendTo('.line-list');
				window.scrollTo(0,document.body.scrollHeight);
			}
		});
	}
});

// new end line
$('#addendlinebutton').click(function() {
	var select_form = $('.select-line');
	var insert_position = $('.line-command-area').find('input:radio[name=line_insert_position]:checked').val();
	if(insert_position == "after") {
		var form_sequence = $(select_form).find('input[name=sequence]').val();
		form_sequence = parseInt(form_sequence);
		if(!form_sequence) {
			callErrorNotification("select line first!");
		}
		else {
			var sequence_to_insert = form_sequence + 1;
			var req = $.ajax({
				url: config.base + 'index.php/editor/newLine',
				type: "POST",
				data: {
					linetype: 4,
					sequence: sequence_to_insert
				},
				dataType: "html",
				beforeSend: function() {
					$('#addendlinebutton').button('loading');
				}
			});
			req.done(function(msg) {
				$('#addendlinebutton').button('reset');
				if(msg) {
					var new_line_id = msg;
					//increment all sequence after selected line by 1 starting from end to up
					if(tail > form_sequence) {
						for(var i = tail; i > form_sequence; i--) {
							var i_index = getObjectIndex(line_obj, 'sequence', i);
							var i_sequence = parseInt(line_obj[i_index].sequence) + 1;
							line_obj[i_index].sequence = i_sequence.toString();
						}
					}

					//insert new choice line to line_obj
					var index_to_write = getObjectIndex(line_obj, 'sequence', form_sequence) + 1;
					var new_line = {
						line_id: new_line_id.toString(),
						sequence: sequence_to_insert.toString(),
						fk_linetype_id: "4"
					}
					// insert new choice line data in middle of line_obj
					line_obj.splice(index_to_write, 0, new_line);

					tail++;
					var block = ' \
					<tr> \
						<td> \
							<form class="form-horizontal end-line-form"> \
								<div class="row"> \
									<div class="col-md-1"> \
										<span class="line-sequence">'+sequence_to_insert+'</span> \
										<br /><br /> \
										<span class="glyphicon glyphicon-resize-vertical"></span> \
									</div> \
									<div class="col-md-2"> \
										<span class="glyphicon glyphicon-step-forward pull-right" style="font-size: 4em;"></span> \
									</div> \
									<div class="col-md-8" style="padding-top: 15px;"> \
										<p>End mark.</p> \
									</div> \
									<div class="col-md-1"> \
										<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
										<span class="glyphicon glyphicon-remove"></span> \
										</button> \
										<br /> \
									</div> \
								</div> \
								<input type="hidden" name="sequence" value="'+sequence_to_insert+'" /> \
								<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
							</form> \
						</td> \
					</tr> \
					';

					// append block of new choice line after selected line
					var element_before_insert = $('.line-list tr').has('input[name=sequence][value='+form_sequence+']');
					$(block).insertAfter( $(element_before_insert) );

					// reorder sequence number and hidden input value on view end
					var count = head;
					$('.line-list').children('tr').each(function() {
						var form_id = $(this).find('[name=line_id]').val();
						$(this).find('.line-sequence').html(count);
						$(this).find('input[name=sequence]').val(count);
						count++;
					});
				}
			});
		}
	}
	// add line at end section
	else if(insert_position == "end") {
		var temp_tail = tail+1;
		var req = $.ajax({
			url: config.base + 'index.php/editor/newLine',
			type: "POST",
			data: {
				linetype: 4,
				sequence: temp_tail
			},
			dataType: "html",
			beforeSend: function() {
				$('#addendlinebutton').button('loading');
			}
		});
		req.done(function(msg) {
			$('#addendlinebutton').button('reset');
			if(msg) {
				var new_line_id = msg;
				if(head == 0) {
					head++;
					$('.line-list').html("");
				}
				tail++;
				line_obj.push({
					line_id: new_line_id.toString(),
					sequence: tail.toString(),
					fk_linetype_id: "4"
				});
				var block = ' \
				<tr> \
					<td> \
						<form class="form-horizontal end-line-form"> \
							<div class="row"> \
								<div class="col-md-1"> \
									<span class="line-sequence">'+tail+'</span> \
									<br /><br /> \
									<span class="glyphicon glyphicon-resize-vertical"></span> \
								</div> \
								<div class="col-md-2"> \
									<span class="glyphicon glyphicon-step-forward pull-right" style="font-size: 4em;"></span> \
									</div> \
								<div class="col-md-8" style="padding-top: 15px;"> \
									<p>End mark.</p> \
								</div> \
								<div class="col-md-1"> \
									<button type="button" class="btn btn-danger btn-xs pull-right line-delete-button" tabindex="-1"> \
									<span class="glyphicon glyphicon-remove"></span> \
									</button> \
									<br /> \
								</div> \
							</div> \
							<input type="hidden" name="sequence" value="'+tail+'" /> \
							<input type="hidden" name="line_id" value="'+new_line_id+'" /> \
						</form> \
					</td> \
				</tr> \
				';
				$(block).appendTo('.line-list');
				window.scrollTo(0,document.body.scrollHeight);
			}
		});
	}
});

// for button to collapse more line details
$('.line-list').on('click', '.line-collapse-button', function(e) {
	e.preventDefault();
	var element = $(this.form).find('.collapse');
	element.collapse('toggle');
});

$('.pagination-area').on('click', '.collapse-all-button', function(e) {
	e.preventDefault();
	var element = $('.line-list .collapse');
	element.collapse('toggle');
});

//show sprite management area on text line hover
$('.line-list').on('mouseenter', '.text-line-form, .form-horizontal', function() {
	// add select class on pointed line
	$(this).parent('td').addClass("select-line");
	// change selected td background color
	$(this).parent('td').css("background", "rgba(150, 148, 148, 0.3)");
	// remove select class on other line
	$(this).parent('td').parent('tr').siblings('tr').find('td').removeClass("select-line");
	// remove other line selection
	$(this).parent('td').parent('tr').siblings('tr').find('td').css("background", "");
	var seq = $(this).find('input[name=sequence]').val();
	var select_line_obj = getLineBySequence(seq);
	// clear sprite list area
	$('.sprite-list').html("");
	if(select_line_obj[0].sprite) {
		var count = 0;
		// append sprite data to sprite area
		$.each(select_line_obj[0].sprite, function (index, value) {
			count++;
			var index_to_write = getObjectIndex(effect_list, 'effect_id', value.fk_effect_id);
			if(index_to_write) {
				var eff = effect_list[index_to_write].name;
			}
			else {
				var eff = "";
			}
			index_to_write = getObjectIndex(sprite_list, 'resource_id', value.sprite_resource_id);
			if(index_to_write > -1) {
				var spr_label = sprite_list[index_to_write].label;
			}
			else {
				var spr_label = "";
			}
			var is_emphasized = "";
			if(value.emphasize == "1") {
				is_emphasized = "checked";
			}
			var block = ' \
			<tr> \
				<td> \
					<form class="form-inline sprite-form"> \
						<div class="row"> \
							<div class="col-md-1"> \
								<span class="sprite-index">'+count+'</span> \
							</div> \
							<div class="col-md-9"> \
								<div class="form-group"> \
									<div class="checkbox sprite-emphasize-checkbox"> \
										<label> \
											<input type="checkbox" name="emphasize" '+is_emphasized+'/> \
										</label> \
									</div> \
									<input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="'+spr_label+'" /> \
										<input type="hidden" name="sprite_resource_id" value="'+value.sprite_resource_id+'" /> \
									<br /> \
									x <input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="'+value.position_x+'" /> \
									y <input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="'+value.position_y+'" /> \
									z <input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="'+value.position_z+'" /> \
									<input type="text" name="effect" class="form-control input-xs sprite-effect-input" placeholder="transition" value="'+eff+'" /> \
									<input type="hidden" name="effect_id" value="'+value.fk_effect_id+'" /> \
								</div> \
							</div> \
							<div class="col-md-1"> \
								<button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button" tabindex="-1"> \
								<span class="glyphicon glyphicon-remove"> \
								</span> \
								</button> \
							</div> \
						</div> \
						<input type="hidden" name="sprite_id" value="'+value.sprite_id+'" /> \
						<input type="hidden" name="sprite_temp_index" value="'+(count-1)+'" /> \
					</form> \
				</td> \
			</tr> \
			';
			// append nothing if line has no sprite
			if(value.sprite_id != "") {
				$(block).appendTo('.sprite-list');
			}
		});
	}
	// disable sprite area when non-text line selected
	var form_id = $(this).find('input[name=line_id]').val();
	var index_to_write = getObjectIndex(line_obj, 'line_id', form_id);
	var form_line_type = line_obj[index_to_write].fk_linetype_id;
	if(form_line_type != 1) {
		$('.sprite-area').find('input, button').prop("disabled", true);
	}
	else {
		$('.sprite-area').find('input, button').prop("disabled", false);
	}
});

function getLineBySequence(sequence) {
	return line_obj.filter(function(line_obj){
		return line_obj.sequence == sequence
	});
}

function getLineById(id) {
	return line_obj.filter(function(line_obj){
		return line_obj.line_id == id
	});
}

function getObjectIndex(array, attr, value) {
	for(var i = 0; i < array.length; i++) {
		if(array[i][attr] == value) {
			return i;
		}
	}
}

function sortLineObjectBySequence() {
	line_obj.sort(function(a, b) {
		return a.sequence - b.sequence
	});
}

$('#savebutton').click(function() {
	var save_button = $(this).button('loading');
	sortLineObjectBySequence();
	saveLine(function() {
		save_button.button('reset');
	});
});

function saveLine(callback) {
	var simple_line_obj = [];
	var simple_sprite_obj = [];
	var simple_choice_obj = [];
	var i = 0;
	// extract important value from line_obj
	$.each(line_obj, function(index, value) {
		if(value.fk_linetype_id == 1) {
			simple_line_obj.push({
				line_id: value.line_id,
				sequence: value.sequence,
				label: value.label,
				speaker: value.speaker,
				content: value.content,
				jumpto_line_id: value.jumpto_line_id,
				fk_linetype_id: value.fk_linetype_id,
				background_resource_id: value.background_resource_id,
				bgm_resource_id: value.bgm_resource_id,
				sfx_resource_id: value.sfx_resource_id,
				voice_resource_id: value.voice_resource_id,
				sprite: []
			});
			var i_line_id = value.line_id;
			$.each(line_obj[i].sprite, function(index, value) {
				if(value.sprite_id == "new") {
					simple_sprite_obj.push({
						sprite_id: value.sprite_id,
						fk_resource_id: value.sprite_resource_id,
						position_x: value.position_x,
						position_y: value.position_y,
						position_z: value.position_z,
						emphasize: value.emphasize,
						fk_effect_id: value.fk_effect_id,
						fk_line_id: i_line_id,
						sprite_temp_index: value.sprite_temp_index
					})
				}
				else {
					simple_sprite_obj.push({
						sprite_id: value.sprite_id,
						fk_resource_id: value.sprite_resource_id,
						position_x: value.position_x,
						position_y: value.position_y,
						position_z: value.position_z,
						emphasize: value.emphasize,
						fk_effect_id: value.fk_effect_id,
						fk_line_id: i_line_id
					});
				}
			});
		}
		// for choice line
		else if(value.fk_linetype_id == 2) {
			simple_line_obj.push({
				line_id: value.line_id,
				sequence: value.sequence,
				label: value.label,
				fk_linetype_id: value.fk_linetype_id,
				choice: []
			});
			var i_line_id = value.line_id;
			$.each(line_obj[i].choice, function(index, value) {
				if(value.content) {
					simple_choice_obj.push({
						choice_id: value.choice_id,
						content: value.content,
						jumpto_line_id: value.jumpto_line_id,
						fk_line_id: i_line_id,
						choice_temp_index: value.choice_temp_index
					});
				}
			});
		}
		// for video line
		else if(value.fk_linetype_id == 3) {
			simple_line_obj.push({
				line_id: value.line_id,
				sequence: value.sequence,
				label: value.label,
				jumpto_line_id: value.jumpto_line_id,
				fk_linetype_id: value.fk_linetype_id,
				video_resource_id: value.video_resource_id
			});
		}
		else if(value.fk_linetype_id == 4) {
			simple_line_obj.push({
				line_id: value.line_id,
				sequence: value.sequence,
				fk_linetype_id: value.fk_linetype_id
			});
		}
		i++;
	});
	var delete_json = JSON.stringify(delete_obj);
	var simple_line_json = JSON.stringify(simple_line_obj);
	var simple_sprite_json = JSON.stringify(simple_sprite_obj);
	var simple_choice_json = JSON.stringify(simple_choice_obj);
	// send update data to server
	var req = $.ajax({
		url: config.base + 'index.php/editor/saveLineData',
		type: "POST",
		data: {
			deletedata: delete_json,
			linedata: simple_line_json,
			spritedata: simple_sprite_json,
			choicedata: simple_choice_json
		},
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg) {
			var update_obj = msg;
			// update new created sprite in line_obj with insert id
			$.each(update_obj, function(index, value) {
				if(value.object == "sprite") {
					var line_index_to_write = getObjectIndex(line_obj, 'line_id', value.fk_line_id);
					var index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_temp_index', value.sprite_temp_index);
					line_obj[line_index_to_write].sprite[index_to_write].sprite_id = value.sprite_id;
					var line_form_id = $('.select-line').find('input[name=line_id]').val();
					// if newly created sprite is listed on active sprite area, its id will be updated so no duplicate creation when changing sprite property value after save
					if(line_form_id == value.fk_line_id) {
						var select_form = $('.sprite-list tr td form').has('input[name=sprite_temp_index][value='+value.sprite_temp_index+']');
						$(select_form).find('input[name=sprite_id]').val(value.sprite_id);
					}
				}
				else if(value.object == "choice") {
					var line_index_to_write = getObjectIndex(line_obj, 'line_id', value.fk_line_id);
					var index_to_write = getObjectIndex(line_obj[line_index_to_write].choice, 'choice_temp_index', value.choice_temp_index);
					line_obj[line_index_to_write].choice[index_to_write].choice_id = value.choice_id;
				}
			});
			callSuccessNotification("work saved!");
		}
		else {
			callErrorNotification("failed to save!");
		}
		if(callback) {
			callback();
		}
	})
}

function saveLabel(line_id, label) {
	var req = $.ajax({
		url: config.base + 'index.php/editor/saveLabel',
		type: 'POST',
		data: {
			line_id: line_id,
			label: label
		},
		dataType: "html"
	});
	req.done(function() {
		callLabelAutocompleteData();
	});
}

$('.line-list').on('focusout', 'input[type=text], textarea', function() {
	var select_form = $(this.form);
	var input_name = $(this).attr('name');
	var form_id = $(select_form).find('input[name=line_id]').val();
	// index on line_obj of which id used to change its array value
	var index_to_write = getObjectIndex(line_obj, 'line_id', form_id);
	switch(input_name) {

		case "speaker":
			var input_value = $(this).val();
			line_obj[index_to_write].speaker = input_value;
			break;

		case "background":
			var input_id = $(select_form).find('input[name=background_resource_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			for (var i = 0; i< background_list.length; i++) {
				if(input_id == background_list[i].resource_id &&input_value == background_list[i].name) {
					verify++;
				}
			};
			if(verify == 1) {
				line_obj[index_to_write].background_resource_id = input_id;
				line_obj[index_to_write].background_name = input_value;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].background_resource_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].background_resource_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("background resource doesn't exist!");
			}
			break;

		case "bgm":
			var input_id = $(select_form).find('input[name=bgm_resource_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(bgm_list, function(index, value) {
				if(input_id == value.resource_id && input_value == value.name) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[index_to_write].bgm_resource_id = input_id;
				line_obj[index_to_write].bgm_name = input_value;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].bgm_resource_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].bgm_resource_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("bgm resource doesn't exist!");
			}
			break;

		case "content":
			var input_value = $(this).val();
			line_obj[index_to_write].content = input_value;
			break;

		case "sfx":
			var input_id = $(select_form).find('input[name=sfx_resource_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(sfx_list, function(index, value) {
				if(input_id == value.resource_id && input_value == value.name) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[index_to_write].sfx_resource_id = input_id;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].sfx_resource_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].sfx_resource_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("sfx resource doesn't exist!");
			}
			break;

		case "voice":
			var input_id = $(select_form).find('input[name=voice_resource_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(voice_list, function(index, value) {
				if(input_id == value.resource_id && input_value == value.name) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[index_to_write].voice_resource_id = input_id;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].voice_resource_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].voice_resource_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("sfx resource doesn't exist!");
			}
			break;

		// ! NEED ENHANCEMENT !
		case "jumpto":
			var input_id = $(select_form).find('input[name=jumpto_line_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(label_list, function(index, value) {
				if(input_id == value.line_id && input_value == value.label) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[index_to_write].jumpto_line_id = input_id;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].jumpto_line_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].jumpto_line_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("label doesn't exist!");
			}
			break;

		case "choice_jumpto":
			var input_id = $(this).siblings('input[name=jumpto_line_id]').val();
			var input_value = $(this).val();
			var input_temp_index = $(this).parent('div').parent('.per-choice').find('input[name=choice_temp_index]').val();
			var choice_index_to_write = getObjectIndex(line_obj[index_to_write].choice, 'choice_temp_index', input_temp_index);
			var verify = 0;
			$.each(label_list, function(index, value) {
				if(input_id == value.line_id && input_value == value.label) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[index_to_write].choice[choice_index_to_write].jumpto_line_id = input_id;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].choice[choice_index_to_write].jumpto_line_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].choice[choice_index_to_write].jumpto_line_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("label doesn't exist!");
			}
			break;

		case "label":
			var input_value = $(this).val();
			line_obj[index_to_write].label = input_value;
			saveLabel(form_id, input_value);
			break;

		case "choice_content":
			var input_value = $(this).val();
			var input_id = $(this).siblings('input[name=choice_id]').val();
			var choice_index_to_write = getObjectIndex(line_obj[index_to_write].choice, 'choice_id', input_id);
			if(input_id == "new") {
				var input_temp_index = $(this).siblings('input[name=choice_temp_index]').val();
				choice_index_to_write = getObjectIndex(line_obj[index_to_write].choice, 'choice_temp_index', input_temp_index);
			}
			line_obj[index_to_write].choice[choice_index_to_write].content = input_value;
			break;

		case "video":
			var input_id = $(select_form).find('input[name=video_resource_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(video_list, function(index, value) {
				if(input_id == value.resource_id && input_value == value.name) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[index_to_write].video_resource_id = input_id;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[index_to_write].video_resource_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[index_to_write].video_resource_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("sfx resource doesn't exist!");
			}
			break;
	}
});

$('.sprite-list').on('change', 'input[type=text], input[type=checkbox]', function() {
	var select_form = $(this.form);
	var input_name = $(this).attr('name');
	var line_form_id = $('.select-line').find('input[name=line_id]').val();
	var form_id = $(select_form).find('input[name=sprite_id]').val();
	// index on line_obj of which id used to change its array value
	var line_index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
	var index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_id', form_id);
	if(form_id == "new") {
		form_id = $(select_form).find('input[name=sprite_temp_index]').val();
		index_to_write = form_id;
		index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_temp_index', form_id);
	}
	switch(input_name) {

		case "sprite":
			var input_id = $(select_form).find('input[name=sprite_resource_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(sprite_list, function(index, value) {
				if(input_id == value.resource_id && input_value == value.label) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[line_index_to_write].sprite[index_to_write].sprite_resource_id = input_id;
				line_obj[line_index_to_write].sprite[index_to_write].sprite_name = input_value;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[line_index_to_write].sprite[index_to_write].sprite_resource_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[line_index_to_write].sprite[index_to_write].sprite_resource_id = input_id;
				line_obj[line_index_to_write].sprite[index_to_write].sprite_name = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("sprite resource doesn't exist!");
			}
			break;

		case "position_x":
			var input_value = $(this).val();
			line_obj[line_index_to_write].sprite[index_to_write].position_x = input_value;
			break;

		case "position_y":
			var input_value = $(this).val();
			line_obj[line_index_to_write].sprite[index_to_write].position_y = input_value;
			break;

		case "position_z":
			var input_value = $(this).val();
			line_obj[line_index_to_write].sprite[index_to_write].position_z = input_value;
			break;

		case "emphasize":
			if(this.checked) {
				line_obj[line_index_to_write].sprite[index_to_write].emphasize = "1";
			}
			else {
				line_obj[line_index_to_write].sprite[index_to_write].emphasize = "0";
			}
			break;

		case "effect":
			var input_id = $(select_form).find('input[name=effect_id]').val();
			var input_value = $(this).val();
			var verify = 0;
			$.each(effect_list, function(index, value) {
				if(input_id == value.effect_id && input_value == value.name) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[line_index_to_write].sprite[index_to_write].fk_effect_id = input_id;
				$(this).css("color", "");
			}
			else if(input_value == "") {
				line_obj[line_index_to_write].sprite[index_to_write].fk_effect_id = "";
				$(this).css("color", "");
			}
			else {
				line_obj[line_index_to_write].sprite[index_to_write].fk_effect_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("transition isn't supported!");
			}
			break;
	}
});

$('.sprite-list').on('keyup', 'input[name=position_x], input[name=position_y], input[name=position_z], input[name=sprite], input[name=effect]', function() {
	// $(this).trigger('change');
});

// another event so sprite and effect don't clash with verification, for instance, combining if(input == "") together would cause event to call error notification after a word is typed on sprite and effect
$('.sprite-list').on('keyup', 'input[type=text]', function() {
	var select_form = $(this.form);
	var input_name = $(this).attr('name');
	var line_form_id = $('.select-line').find('input[name=line_id]').val();
	var form_id = $(select_form).find('input[name=sprite_id]').val();
	// index on line_obj of which id used to change its array value
	var line_index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
	var index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_id', form_id);
	if(form_id == "new") {
		form_id = $(select_form).find('input[name=sprite_temp_index]').val();
		index_to_write = form_id;
		index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_temp_index', form_id);
	}
	switch(input_name) {

		case "sprite":
			var input_id = $(select_form).find('input[name=sprite_resource_id]').val();
			var input_value = $(this).val();
			if(input_value == "") {
				console.log(line_obj[line_index_to_write].sprite[index_to_write].sprite_resource_id);
				line_obj[line_index_to_write].sprite[index_to_write].sprite_resource_id = "";
				line_obj[line_index_to_write].sprite[index_to_write].sprite_name = "";
				$(this).css("color", "");
			}
			break;

		case "position_x":
			var input_value = $(this).val();
			line_obj[line_index_to_write].sprite[index_to_write].position_x = input_value;
			break;

		case "position_y":
			var input_value = $(this).val();
			line_obj[line_index_to_write].sprite[index_to_write].position_y = input_value;
			break;

		case "position_z":
			var input_value = $(this).val();
			line_obj[line_index_to_write].sprite[index_to_write].position_z = input_value;
			break;

		case "effect":
			var input_id = $(select_form).find('input[name=effect_id]').val();
			var input_value = $(this).val();
			if(input_value == "") {
				line_obj[line_index_to_write].sprite[index_to_write].fk_effect_id = "";
				$(this).css("color", "");
			}
			break;
	}
});

// $('.sprite-list').on('keypress', 'input[name=position_x]', function() {
// 	var select_form = $(this.form);
// 	var input_name = $(this).attr('name');
// 	var line_form_id = $('.select-line').find('input[name=line_id]').val();
// 	var form_id = $(select_form).find('input[name=sprite_id]').val();
// 	// index on line_obj of which id used to change its array value
// 	var line_index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
// 	var index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_id', form_id);
// 	if(form_id == "new") {
// 		form_id = $(select_form).find('input[name=sprite_temp_index]').val();
// 		index_to_write = form_id;
// 		index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_temp_index', form_id);
// 	}
// 	var input_value = $(this).val();
// 	line_obj[line_index_to_write].sprite[index_to_write].position_x = input_value;
// });

//unnecessary!
// $('.sprite-command-area').on('click', '#addspritebutton', function() {
// 	var line_form_id = $('.select-line').find('input[name=line_id]').val();
// 	if(!line_form_id){
// 		callErrorNotification("select line first");
// 	}
// 	else {
// 		// index on line_obj of which id used to change its array value
// 		var req = $.ajax({
// 			url: config.base + 'index.php/editor/newSprite',
// 			type: "POST",
// 			data: {
// 				lineid: line_form_id
// 			},
// 			dataType: "json",
// 			beforeSend: function() {
// 				//...
// 			}
// 		});
// 		req.done(function(msg) {
// 			var spr_id = msg;
// 			var index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
// 			var count = line_obj[index_to_write].sprite.length;	
// 			line_obj[index_to_write]['sprite'].push({
// 				sprite_id: spr_id.toString(),
// 				fk_resource_id: "",
// 				position_x: "0",
// 				position_y: "0",
// 				position_z: "0",
// 				sprite_resource_id: "",
// 				sprite_name: "",
// 				sprite_file_name: "",
// 				sprite_character_name: "",
// 				sprite_figure_name: "",
// 				sprite_expression_name: ""
// 			});
// 			count++;
// 			var block = '<tr> <td> <form class="form-inline sprite-form"> <div class="row"> <div class="col-md-1"> <span class="sprite-index">'+count+'</span> </div> <div class="col-md-9"> <div class="form-group"> <input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="" /> <input type="hidden" name="sprite_resource_id" value="" /> <input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="0" /> <input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="0" /> <input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="0" /> <input type="text" name="effect" class="form-control input-xs sprite-input" placeholder="transition" value="" /> <input type="hidden" name="effect_id" value="" /> <span class="glyphicon glyphicon-resize-vertical"></span> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button"><span class="glyphicon glyphicon-remove"></span></button> </div> </div> <input type="hidden" name="sprite_id" value="'+spr_id+'" /> </form> </td> </tr>';
// 			$(block).appendTo('.sprite-list');
// 		});
// 	}
// });

// sprite add capability
$('.sprite-command-area').on('click', '#addspritebutton', function() {
	var line_form_id = $('.select-line').find('input[name=line_id]').val();
	if(!line_form_id){
		callErrorNotification("select line first");
	}
	else {
		var index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
		var count = line_obj[index_to_write].sprite.length;	
		var sprite_count_limit = 4;
		if(count >= sprite_count_limit) {
			callErrorNotification("can't add more sprite!");
		}
		else {
			line_obj[index_to_write]['sprite'].push({
				sprite_temp_index: count.toString(),
				sprite_id: "new",
				fk_resource_id: "",
				position_x: "0",
				position_y: "0",
				position_z: "0",
				emphasize: "0",
				fk_effect_id: "",
				sprite_resource_id: "",
				sprite_name: "",
				sprite_file_name: "",
				sprite_character_name: "",
				sprite_figure_name: "",
				sprite_expression_name: ""
			});
			var block = ' \
			<tr> \
				<td> \
					<form class="form-inline sprite-form"> \
						<div class="row"> \
							<div class="col-md-1"> \
								<span class="sprite-index">'+(count+1)+'</span> \
							</div> \
							<div class="col-md-9"> \
								<div class="form-group"> \
									<div class="checkbox sprite-emphasize-checkbox"> \
										<label> \
											<input type="checkbox" name="emphasize" /> \
										</label> \
									</div> \
									<input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="" /> \
									<input type="hidden" name="sprite_resource_id" value="" /> \
									<br /> \
									x <input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="0" /> \
									y <input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="0" /> \
									z <input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="0" /> \
									<input type="text" name="effect" class="form-control input-xs sprite-effect-input" placeholder="transition" value="" /> \
									<input type="hidden" name="effect_id" value="" /> \
								</div> \
							</div> \
							<div class="col-md-1"> \
								<button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button"> \
								<span class="glyphicon glyphicon-remove"> \
								</span> \
								</button> \
							</div> \
						</div> \
						<input type="hidden" name="sprite_id" value="new" /> \
						<input type="hidden" name="sprite_temp_index" value="'+count+'" /> \
					</form> \
				</td> \
			</tr> \
			';
			count++;
			$(block).appendTo('.sprite-list');
		}
	}
});

function callErrorNotification(message) {
	var block = '<div class="alert alert-danger error-notification">'+message+'</div>';
	$('#notification').append(block).hide().fadeIn();
	window.setTimeout(function() {
		$('.error-notification').fadeTo(500, 0, function() {
			$(this).remove();
		});
	}, 5000);
}

function callSuccessNotification(message) {
	var block = '<div class="alert alert-success success-notification">'+message+'</div>';
	$('#notification').append(block).hide().fadeIn();
	window.setTimeout(function() {
		$('.success-notification').fadeTo(500, 0, function() {
			$(this).remove();
		});
	}, 5000);
}

// using custom name direcctly from object would render menu item empty, jquery take default label/value only for menu item, hence the separation
// name list for autocomplete and original for validation
var character_list = [];
var background_name_list = [];
var background_list = [];
var bgm_name_list =[];
var bgm_list = [];
var voice_name_list = [];
var voice_list = [];
var sfx_name_list = [];
var sfx_list = [];
var label_name_list = [];
var label_list = [];
var sprite_name_list = [];
var sprite_list = [];
var effect_name_list = [];
var effect_list = [];
var video_name_list = [];
var video_list = [];

$(document).ready(function() {
	callCharacterAutocompleteData();
	callBackgroundAutocompleteData();
	callBgmAutocompleteData();
	callVoiceAutocompleteData();
	callSfxAutocompleteData();
	callLabelAutocompleteData();
	callSpriteAutocompleteData();
	callEffectAutocompleteData();
	callVideoAutocompleteData();
});

$('.list-refresh-button').click(function() {
	callCharacterAutocompleteData();
	callBackgroundAutocompleteData();
	callBgmAutocompleteData();
	callVoiceAutocompleteData();
	callSfxAutocompleteData();
	callLabelAutocompleteData();
	callSpriteAutocompleteData();
	callEffectAutocompleteData();
	callVideoAutocompleteData();
});

function callCharacterAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadCharacterList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		character_list = msg;
	});
}

function callBackgroundAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadBackgroundList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		background_name_list = [];
		$.each(msg, function(index, value) {
			background_name_list.push({
				label: value.name,
				value: value.resource_id
			});
		});
		background_list = msg;
	});
}

function callBgmAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadBgmList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		bgm_name_list = [];
		$.each(msg, function(index, value) {
			bgm_name_list.push({
				label: value.name,
				value: value.resource_id
			});
		});
		bgm_list = msg;
	});
}

function callSfxAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadSfxList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		sfx_name_list = [];
		$.each(msg, function(index, value) {
			sfx_name_list.push({
				label: value.name,
				value: value.resource_id
			});
		});
		sfx_list = msg;
	});
}

function callVoiceAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadVoiceList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		voice_name_list = [];
		$.each(msg, function(index, value) {
			voice_name_list.push({
				label: value.name,
				value: value.resource_id
			});
		});
		voice_list = msg;
	});
}

function callLabelAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadLabelList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		label_name_list = [];
		$.each(msg, function(index, value) {
			label_name_list.push({
				label: value.label,
				value: value.line_id
			});
		});
		label_list = msg;
	});
}

function callSpriteAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadSpriteList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		sprite_list = [];
		// ! NEED ENHANCEMENT !
		$.each(msg, function(index, value) {
			// sprite_name_list.push(value.name);
			sprite_list.push({
				label: value.character_name + ' ' + value.figure_name + ' ' + value.expression_name,
				name: value.name,
				character_name: value.character_name,
				figure_name: value.figure_name,
				expression_name: value.expression_name,
				resource_id: value.resource_id,
				file_name: value.file_name,
				thumb_name: value.thumb_name
			});
		});
		//sprite_list = msg;
	});
}

function callEffectAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadEffectList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		effect_name_list = [];
		$.each(msg, function(index, value) {
			effect_name_list.push({
				label: value.name,
				value: value.effect_id
			});
		});
		effect_list = msg;
	});
}

function callVideoAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadVideoList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		video_name_list = [];
		$.each(msg, function(index, value) {
			video_name_list.push({
				label: value.name,
				value: value.resource_id
			});
		});
		video_list = msg;
	});
}

// autocomplete speaker input
$('.line-list').on('keydown', 'input[name=speaker]', function() {
	$(this).autocomplete({
		source: character_list,
		// min length 0 display autocomplete list on arrowdown key
		minLength: 1,
		focus: function() {
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		}
	});
});

// autocomplete background input
$('.line-list').on('keydown', 'input[name=background]', function() {
	$(this).autocomplete({
		source: background_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=background]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=background_resource_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this.form);
			$(input).find('input[name=background]').val(ui.item.label);
			$(input).find('input[name=background_resource_id]').val(ui.item.value);
			return false;
		},
		autoFocus: true
	});
});


// autocomplete bgm input
$('.line-list').on('keydown', 'input[name=bgm]', function() {
	$(this).autocomplete({
		// source: function(request, response) {
		// 	var list = [];
		// 	$.each(bgm_list, function(index, value) {
		// 		list.push(value.name);
		// 	});
		// 	response(list);
		// },
		source: bgm_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=bgm]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=bgm_resource_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=bgm_resource_id]').val(ui.item.value);
			$(this.form).find('input[name=bgm]').val(ui.item.label);
			return false;
		},
		autoFocus: true
	});
});

// autocomplete voice input
$('.line-list').on('keydown', 'input[name=voice]', function() {
	$(this).autocomplete({
		source: voice_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=voice]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=voice_resource_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
			$(this).autocomplete("widget").css({
		                "width": 300
	  	       });
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=voice_resource_id]').val(ui.item.value);
			$(this.form).find('input[name=voice]').val(ui.item.label);
			return false;
		},
		autoFocus: true
	});
});

// autocomplete sfx input
$('.line-list').on('keydown', 'input[name=sfx]', function() {
	$(this).autocomplete({
		source: sfx_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=sfx]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=sfx_resource_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=sfx_resource_id]').val(ui.item.value);
			$(this.form).find('input[name=sfx]').val(ui.item.label);
			return false;
		},
		autoFocus: true
	});
});

// autocomplete jumpto input
$('.line-list').on('keydown', 'input[name=jumpto]', function() {
	$(this).autocomplete({
		source: label_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			$(this).siblings('input[name=jumpto_line_id]').val(ui.item.value);
			// $(this).val(ui.item.label);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			// $(this.form).find('input[name=jumpto_line_id]').val(ui.item.value);
			// $(this.form).find('input[name=jumpto]').val(ui.item.label);
			$(this).siblings('input[name=jumpto_line_id]').val(ui.item.value);
			$(this).val(ui.item.label);
			return false;
		},
		autoFocus: true
	});
});

// autocomplete jumpto input
$('.line-list').on('keydown', 'input[name=choice_jumpto]', function() {
	$(this).autocomplete({
		source: label_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			$(this).siblings('input[name=jumpto_line_id]').val(ui.item.value);
			// $(this).val(ui.item.label);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			// $(this.form).find('input[name=jumpto_line_id]').val(ui.item.value);
			// $(this.form).find('input[name=jumpto]').val(ui.item.label);
			$(this).siblings('input[name=jumpto_line_id]').val(ui.item.value);
			$(this).val(ui.item.label);
			return false;
		},
		autoFocus: true
	})
});

// autocomplete sprite input
$('.sprite-list').on('keydown', 'input[name=sprite]', function() {
	$(this).autocomplete({
		source: sprite_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=sprite]').val(ui.item.name);
			// change id on hidden input
			$(this.form).find('input[name=sprite_resource_id]').val(ui.item.resource_id);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			$('.ui-menu').css("width", "300px");
			// $('.ui-menu').css("position", "fixed");
			// $('.ui-autocomplete').css("position", "absolute");
			// $('.ui-menu').width(300);
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
			$(this).autocomplete("widget").css({
		                "width": "600px",
		                "top": "18%",
		                "left": "20%",
		                "max-height": "600px"
	  	       });
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=sprite_resource_id]').val(ui.item.resource_id);
			$(this.form).find('input[name=sprite]').val(ui.item.label);
			// trigger on change method to change value immediately
			$(this).trigger('change');
			return false;
		},
		autoFocus: true,
		position: { my : "right top", at: "left bottom", offset: '' }
	})
	.autocomplete('instance')._renderItem = function(ul, item) {
		return $('<li></li>')
			.append('<a>' + '<img src="' + config.base + 'resources/' + config.user + '/' + config.project + '/sprite/thumbs/' + item.thumb_name + '" class="autocomplete-sprite-image" />' + item.character_name + ' ' + item.figure_name + ' ' + item.expression_name + "</a>")
			.appendTo(ul);
	};
});

// autocomplete transition input
$('.sprite-list').on('keydown', 'input[name=effect]', function() {
	$(this).autocomplete({
		source: effect_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=effect]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=effect_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=effect_id]').val(ui.item.value);
			$(this.form).find('input[name=effect]').val(ui.item.label);
			$(this).trigger('change');
			return false;
		},
		autoFocus: true
	});
});

// autocomplete video input
$('.line-list').on('keydown', 'input[name=video]', function() {
	$(this).autocomplete({
		source: video_name_list,
		minLength: 0,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			// $(this.form).find('input[name=video]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=video_resource_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=video_resource_id]').val(ui.item.value);
			$(this.form).find('input[name=video]').val(ui.item.label);
			return false;
		},
		autoFocus: true
	});

});


// $('#more_setting').on('keydown', 'input[name=title_background]', function() {
// 	$(this).autocomplete({
// 		source: background_name_list,
// 		minLength: 0,
// 		focus: function(event, ui) {
// 			var input = $(this);
// 			$(this.form).find('input[name=title_background_id]').val(ui.item.value);
// 			return false;
// 		},
// 		select: function(event, ui) {
// 			// get this input element
// 			var input = $(this.form);
// 			$(input).find('input[name=title_background]').val(ui.item.label);
// 			$(input).find('input[name=title_background_id]').val(ui.item.value);
// 			return false;
// 		},
// 		autoFocus: true
// 	});
// });

// line delete capability
$('.line-list').on('click', '.line-delete-button', function(e) {
	e.preventDefault();
	var select_form = (this.form);
	var form_id = $(select_form).find('input[name=line_id]').val();
	var index_to_write = getObjectIndex(line_obj, 'line_id', form_id);
	// delete line data on active line object
	// delete line_obj[index_to_write];
	// assign delete_obj with value from line_obj about to be deleted
	// delete_obj.push({
	// 	object: "line",
	// 	id: line_obj[index_to_write].line_id
	// });
	var req = $.ajax({
		url: config.base + 'index.php/editor/removeLine',
		type: "POST",
		data: {
			lineid: form_id
		},
		dataType: "html"
	});
	req.done(function(msg) {
		if(msg == "1") {
			line_obj.splice(index_to_write, 1);
			// remove element from page
			$(select_form).closest('tr').remove();

			// revert tail by one
			tail--;

			// reorder line
			var count = head;
			var i = 0;
			// do something for each sortable data
			$('.line-list').children('tr').each(function() {
				// get line id of current iteration
				var form_id = $(this).find('[name=line_id]').val();
				// get index of line object with found id
				var index = getObjectIndex(line_obj, 'line_id', form_id);
				// change sequence value pointed object with current count iteration 
				line_obj[index].sequence = count.toString();
				// write proper index to line
				$(this).find('.line-sequence').html(count);
				// change hidden value of sequence
				$(this).find('[name=sequence]').val(count);
				count++;
			});
		}
		else {
			callErrorNotification("Delete failed!");
		}
	});
	
});

// sprite delete capability
$('.sprite-list').on('click', '.sprite-delete-button', function(e) {
	e.preventDefault();
	var select_form = (this.form);
	var line_form_id = $('.select-line').find('input[name=line_id]').val();
	var line_index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
	var form_id = $(select_form).find('input[name=sprite_id]').val();
	var index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_id', form_id);
	if(form_id == "new") {
		form_id = $(select_form).find('input[name=sprite_temp_index]').val();
		index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_temp_index', form_id);
	}
	// add sprite object to delete_obj if newly created one
	if(line_obj[line_index_to_write].sprite[index_to_write].sprite_id != "new") {
		delete_obj.push({
			object: "sprite",
			id: line_obj[line_index_to_write].sprite[index_to_write].sprite_id
		});
	}
	line_obj[line_index_to_write].sprite.splice(index_to_write, 1);
	// remove element from page
	$(select_form).closest('tr').remove();
});

// sprite clear all capability
$('#clearspritebutton').click(function() {
	var select_form = $('.sprite-list');
	var line_form_id = $('.select-line').find('input[name=line_id]').val();
	var line_index_to_write = getObjectIndex(line_obj, 'line_id', line_form_id);
	var sprite_count = line_obj[line_index_to_write].sprite.length;
	line_obj[line_index_to_write].sprite.splice(0, sprite_count);
	$(select_form).children('tr').remove();
});

// select text on input click
$(document.body).on('click', 'input[type=text]', function () {
	$(this).select();
});

// unfocus button after click, bootstrap bug on some browser?
$(document.body).on('mouseup', '.btn', function(){
    $(this).blur();
});

// pagination
$('#firstpagebutton').click(function() {
	callLineData("first")
	$('#currentpage').val("1");
});

$('#previouspagebutton').click(function() {
	callLineData("previous");
	var current = $('#currentpage').val() - 1;
	if(current < 1) {
		current = 1;
	}
	$('#currentpage').val(current);
});

$('#nextpagebutton').click(function() {
	callLineData("next");
	var total = $('#totalpage').text();
	var current = parseInt($('#currentpage').val()) + 1;
	if(current > total) {
		current = total;
	}
	$('#currentpage').val(current);
});

$('#lastpagebutton').click(function() {
	callLineData("last");
	var total = $('#totalpage').text();
	$('#currentpage').val(total);
});

// delay function
var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

// auto load line on page manual input
$('#currentpage').keyup(function() {
	var input_value = $(this).val();
	delay(function() {
		callLineData(input_value);
	}, 1000);
});

// prevent enter key default submit
$('#currentpage').keypress(function(event) {
	if(event.keyCode == 13) {
		event.preventDefault();
	}
});

// load page by label search
$('#searchpage').keypress(function(event) {
	var input_value = $('#searchpage').val();
	if(event.keyCode == 13) {
		event.preventDefault();
		callLineData(input_value, "label");
	}
});

// trigger enter key to add text line
$(document).bind('keydown', function(e){
	if(e.ctrlKey && e.which == 13) {
		$('#addtextlinebutton').trigger('click');
		// setTimeout(function() {
		// 	var end_line = $('.line-list').find('form').has('input[name=sequence][value='+tail+']');
		// 	var text_area = $(end_line).find('textarea[name=content]');
		// 	$(text_area).focus();
		// }, 500);
	}
});

// tooltip bootstrap
$(function () {
	$('[data-toggle="tooltip"]').tooltip()
});

$('.line-list').on('mouseover', '.line-delete-button, .sprite-delete-button', function() {
	$(this).tooltip({
		title: "remove line"
	});
	$(this).tooltip('show');
});

$('.line-list').on('mouseover', '.line-project-button', function() {
	$(this).tooltip({
		title: "basic preview of this line"
	});
	$(this).tooltip('show');
});

$('.line-list').on('mouseover', '.line-collapse-button', function() {
	$(this).tooltip({
		title: "show more details"
	});
	$(this).tooltip('show');
});

$('.line-list').on('mouseover', 'input[name=jumpto]', function() {
	$(this).tooltip({
		title: "label where this line proceed to without following sequence order"
	});
	$(this).tooltip('show');
});

$('.line-list').on('mouseover', 'input[name=choice_jumpto]', function() {
	$(this).tooltip({
		title: "label where this line proceed to without following sequence order<br />left empty if no jump required",
		html: true
	});
	$(this).tooltip('show');
});

$('.sprite-list').on('mouseover', 'input[name=emphasize]', function() {
	$(this).tooltip({
		title: "Emphasize this sprite.<br>Particularly and rarely used to emphasize the speaker.<br>Recommended only when people complain about your VN being ambiguous and confusing.",
		html: true
	});
	$(this).tooltip('show');
});

$('.sprite-list').on('mouseover', 'input[name=sprite]', function() {
	$(this).tooltip({
		title: "sprite's name"
	});
	$(this).tooltip('show');
});

$('.sprite-list').on('mouseover', 'input[name=position_x]', function() {
	$(this).tooltip({
		title: "horizontal position"
	});
	$(this).tooltip('show');
});

$('.sprite-list').on('mouseover', 'input[name=position_y]', function() {
	$(this).tooltip({
		title: "vertical position"
	});
	$(this).tooltip('show');
});

$('.sprite-list').on('mouseover', 'input[name=position_z]', function() {
	$(this).tooltip({
		title: "depth position<br />leave it at 0 for default",
		html: true
	});
	$(this).tooltip('show');
});

$('.sprite-list').on('mouseover', 'input[name=effect]', function() {
	$(this).tooltip({
		title: "transition default to fade in/out",
		html: true
	});
	$(this).tooltip('show');
});

$('.play-button').click(function() {
	var t = window.open(config.base + 'index.php/game/play/' + config.project, '_blank');
	t.focus();
})

function compareSpriteIndex(a, b) {
	if(a.position_z < b.position_z) {
		return -1;
	}
	if(a.position_z > b.position_z) {
		return 1;
	}
	return 0;
}


var canvasdisplay = document.getElementsByTagName('canvas')[0];
canvasdisplay.width = 240;
canvasdisplay.height = 180;
// canvasdisplay.style.width  = '800px';
// canvasdisplay.style.height = '600px';

var canvas = new fabric.Canvas('preview');
canvas.selection = false;
$(document).ready(function() {
	var txt = new fabric.Text("Preview Pane", {
		fontSize: 20,
		fontFamily: 'Arial',
		top: canvas.height / 2,
		left: canvas.width / 2,
		originX: 'center',
		originY: 'center',
		fontWeight: 'bold',
		opacity: 1,
		fill: '#777'
	});
	txt.set('selectable', false);
	canvas.add(txt);
})

var path_to_project = config.base + 'resources/' + config.user + '/' + config.project + '/';
$('.line-list').on('click', '.line-project-button', function() {
	canvas.clear();
	var seq = $(this.form).find('input[name=sequence]').val();
	var index_to_read = getObjectIndex(line_obj, 'sequence', seq);
	if(index_to_read > -1) {
		line_obj[index_to_read].sprite.sort(compareSpriteIndex);
		if(line_obj[index_to_read].fk_linetype_id == 1) {
			var bg_index = getObjectIndex(background_list, 'resource_id', line_obj[index_to_read].background_resource_id);
			if(bg_index > -1) {
				fabric.Image.fromURL(path_to_project + 'background/' + background_list[bg_index].file_name, function(img){
					var bg = img.scale(0.3).set({
						top: 0,
						left: 0,
						opacity: 0,
						angle: 0
					});
					bg.set('selectable', false);
					canvas.add(bg);
					bg.animate('opacity', '1', {
						onChange: canvas.renderAll.bind(canvas),
						duration: 500,
						easing: fabric.util.ease.easeOutExpo,
						onComplete: function() {
							if(line_obj[index_to_read].sprite.length > 0) {
								$.each(line_obj[index_to_read].sprite, function(index, value) {
									var spr_index = getObjectIndex(sprite_list, 'resource_id', value.sprite_resource_id);
									fabric.Image.fromURL(path_to_project + 'sprite/' + sprite_list[spr_index].file_name, function(img){
										var bg = img.scale(0.3).set({
											top: parseInt(value.position_y) * 30,
											left: parseInt(value.position_x) * 30,
											opacity: 0,
											angle: 0
										});
										// bg.set('selectable', false);
										canvas.add(bg);
										bg.animate('opacity', '1', {
											onChange: canvas.renderAll.bind(canvas),
											duration: 500,
											easing: fabric.util.ease.easeOutExpo
										});
									});
								});
							}
						}
					});
				});
			}
			
		}
	}
});

window.onbeforeunload = function (e) {
	var confirm_close = "Save your work if you haven't done it yet!"
	e = e || window.event;
	if (e) {
		e.returnValue = confirm_close;
	}
	return confirm_close;
};
