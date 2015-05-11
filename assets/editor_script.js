'use strict';
$(document).ready( callLineData() );

var line_obj = [];
var delete_obj = [];
var head = 0;
var tail = 0;
// newarray = {id: 1, type: "rand"};
// line_obj.push(newarray);

// var last = {
// 	speaker: "",
// 	background_resource_id: "",
// 	background: "",
// 	bgm_resource_id: "",
// 	bgm: "",
// 	sprite: []
// };

$('#test').click(function() {
	console.log(line_obj);
});

function getLastLineObjectBySequence(seq) {
	// var select_form = $('.line-list tr td form').has('input[name=sequence][value='+seq+']');
	var select_index = getObjectIndex(line_obj, 'sequence', seq);
	var select_obj = {
		speaker: line_obj[select_index].speaker,
		background_resource_id: line_obj[select_index].background_resource_id,
		background: line_obj[select_index].background_name,
		bgm_resource_id: line_obj[select_index].bgm_resource_id,
		bgm: line_obj[select_index].bgm_name,
		sprite: line_obj[select_index].sprite
	}
	return select_obj;

}

function callLineData() {
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
			var obj =  $.parseJSON(msg);
			if(obj.length > 0) {
				line_obj = obj;
				head = obj[0]['sequence'];
				$.each(obj, function(index, value) {
					if(value.sequence < head) {
						head = parseInt(value.sequence);
					}
					if(parseInt(value.sequence) > tail) {
						tail = parseInt(value.sequence);
					}
					var block = '<tr> <td> <form class="form-horizontal text-line-form"> <div class="row"> <div class="col-md-1"> <span class="line-sequence">'+value.sequence+'</span> <br /> <br /> <span class="glyphicon glyphicon-resize-vertical"></span> </div> <div class="col-md-10"> <div class="form-group"> <div class="form-inline"> <input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+value.speaker+'" /> <input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+value.background_name+'" /> <input type="hidden" name="background_resource_id" value="'+value.background_resource_id+'" /> <input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+value.bgm_name+'" /> <input type="hidden" name="bgm_resource_id" value="'+value.bgm_resource_id+'" /> <input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="'+value.voice_name+'" /> <input type="hidden" name="voice_resource_id" value="'+value.voice_resource_id+'" /> </div> </div> <div class="form-group" style="margin-top: -10px; margin-bottom: 5px;"> <textarea name="content" class="form-control input-sm" maxlength="256" rows="1" placeholder="text content">'+value.content+'</textarea> </div> <div class="row"> <div class="collapse"> <div class="col-md-12"> <div class="form-group"> <div class="form-inline"> <input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value="'+value.sfx_name+'"/> <input type="hidden" name="sfx_resource_id" value="'+value.sfx_resource_id+'" /> <input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" title="jump to another line instead by sequence order" value="'+value.jumpto_line_id+'" /> <input type="hidden" name="jumpto_line_id" value="'+value.jumpto_line_id+'" /> <input type="text" name="label" class="form-control input-xs" placeholder="label" value="'+value.label+'" /> </div> </div> </div> </div> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-danger btn-xs pull-right line-delete-button"><span class="glyphicon glyphicon-remove"></span></button> <br /> <button type="button" class="btn btn-default btn-xs pull-right line-project-button"><span class="glyphicon glyphicon-chevron-right"></span></button> <br /> <button type="button" class="btn btn-default btn-xs pull-right line-collapse-button"><span class="glyphicon glyphicon-option-horizontal"></span></button> </div> </div> <input type="hidden" name="sequence" value="'+value.sequence+'" /> <input type="hidden" name="line_id" value="'+value.line_id+'" /> </form> </td> </tr>';
					$(block).appendTo('.line-list');
				});
			}
			else {
				console.log("no result fetched");
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

//initialize array
$('#addlinetextbutton').click(function() {
	var select_form = $('.select-line');
	// get value of which radio is selected for line insertion position
	var insert_position = $('.line-command-area').find('input:radio[name=line_insert_position]:checked').val();
	console.log(insert_position);
	// add new line in the middle
	if(insert_position == "after") {
		// get sequence value of selected line
		var form_sequence = $(select_form).find('input[name=sequence]').val();
		form_sequence = parseInt(form_sequence);
		// throw error if no line selected
		if(!form_sequence) {
			callErrorNotification("select line first!");
		}
		else {
			// get object consist of value from selected line
			var last = getLastLineObjectBySequence(form_sequence);
			console.log(last);
			
			console.log(last);

			var sequence_to_insert = form_sequence + 1;
			console.log(typeof sequence_to_insert);
			var req = $.ajax({
				url: config.base + 'index.php/editor/newLine',
				type: "POST",
				data: {
					linetype: 1,
					sequence: sequence_to_insert
				},
				dataType: "json",
				beforeSend: function() {
					//placeholder
				}
			});
			req.done(function(msg) {
				if(msg) {
					var new_line_id = msg;

					//increment sequence after selected line by 1
					console.log('sequence ' + form_sequence);
					console.log('tail ' + tail);
					if(tail > form_sequence) {
						console.log("OK");
						for(var i = tail; i > form_sequence; i--) {
							var i_index = getObjectIndex(line_obj, 'sequence', i);
							var i_sequence = parseInt(line_obj[i_index].sequence) + 1;
							line_obj[i_index].sequence = i_sequence.toString();
							console.log(i);
						}
					}

					//insert new line to line_obj
					var index_to_write = getObjectIndex(line_obj, 'sequence', form_sequence) + 1;
					var new_line = {
						line_id: new_line_id.toString(),
						sequence: sequence_to_insert.toString(),
						label: "",
						speaker: last.speaker,
						content: "",
						fk_effect_id: "",
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
						sprite: []
					}
					// insert new line data in middle of line_obj
					line_obj.splice(index_to_write, 0, new_line);
					console.log(line_obj);

					tail++;
					var block = '<tr> <td> <form class="form-horizontal text-line-form"> <div class="row"> <div class="col-md-1"> <span class="line-sequence">'+sequence_to_insert+'</span> <br /> <br /> <span class="glyphicon glyphicon-resize-vertical"></span> </div> <div class="col-md-10"> <div class="form-group"> <div class="form-inline"> <input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+last.speaker+'" /> <input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+last.background+'" /> <input type="hidden" name="background_resource_id" value="'+last.background_resource_id+'" /> <input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+last.bgm+'" /> <input type="hidden" name="bgm_resource_id" value="'+last.bgm_resource_id+'" /> <input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="" /> <input type="hidden" name="voice_resource_id" value="" /> </div> </div> <div class="form-group" style="margin-top: -10px; margin-bottom: 5px;"> <textarea name="content" class="form-control input-sm" maxlength="256" rows="1" placeholder="text content"></textarea> </div> <div class="row"> <div class="collapse"> <div class="col-md-12"> <div class="form-group"> <div class="form-inline"> <input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value=""/> <input type="hidden" name="sfx_resource_id" value="" /> <input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" title="jump to another line instead by sequence order" value="" /> <input type="hidden" name="jumpto_line_id" value="" /> <input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> </div> </div> </div> </div> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-danger btn-xs pull-right line-delete-button"><span class="glyphicon glyphicon-remove"></span></button> <br /> <button type="button" class="btn btn-default btn-xs pull-right line-project-button"><span class="glyphicon glyphicon-chevron-right"></span></button> <br /> <button type="button" class="btn btn-default btn-xs pull-right line-collapse-button"><span class="glyphicon glyphicon-option-horizontal"></span></button> </div> </div> <input type="hidden" name="sequence" value="'+sequence_to_insert+'" /> <input type="hidden" name="line_id" value="'+new_line_id+'" /> </form> </td> </tr>';

					// append block of new line after selected line
					var element_before_insert = $('.line-list tr').has('input[name=sequence][value='+form_sequence+']');
					$(block).insertAfter( $(element_before_insert) );
//					console.log(element_before_insert);

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
		var last = getLastLineObjectBySequence(tail);
		var temp_tail = tail+1;
		var req = $.ajax({
			url: config.base + 'index.php/editor/newLine',
			type: "POST",
			data: {
				linetype: 1,
				sequence: temp_tail
			},
			dataType: "json",
			beforeSend: function() {
				//placeholder
			}
		});
		req.done(function(msg) {
			if(msg) {
				var new_line_id = msg;
				tail++;
				line_obj.push({
					line_id: msg.toString(),
					sequence: tail.toString(),
					label: "",
					speaker: last.speaker,
					content: "",
					fk_effect_id: "",
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
					sprite: []
				});
				var block = '<tr> <td> <form class="form-horizontal text-line-form"> <div class="row"> <div class="col-md-1"> <span class="line-sequence">'+tail+'</span> <br /> <br /> <span class="glyphicon glyphicon-resize-vertical"></span> </div> <div class="col-md-10"> <div class="form-group"> <div class="form-inline"> <input type="text" name="speaker" class="form-control input-sm main-line-input" placeholder="speaker" value="'+last.speaker+'" /> <input type="text" name="background" class="form-control input-sm main-line-input" placeholder="background" value="'+last.background+'" /> <input type="hidden" name="background_resource_id" value="'+last.background_resource_id+'" /> <input type="text" name="bgm" class="form-control input-sm main-line-input" placeholder="bgm" value="'+last.bgm+'" /> <input type="hidden" name="bgm_resource_id" value="'+last.bgm_resource_id+'" /> <input type="text" name="voice" class="form-control input-sm main-line-input" placeholder="voice" value="" /> <input type="hidden" name="voice_resource_id" value="" /> </div> </div> <div class="form-group" style="margin-top: -10px; margin-bottom: 5px;"> <textarea name="content" class="form-control input-sm" maxlength="256" rows="1" placeholder="text content"></textarea> </div> <div class="row"> <div class="collapse"> <div class="col-md-12"> <div class="form-group"> <div class="form-inline"> <input type="text" name="sfx" class="form-control input-xs" placeholder="sfx"  value=""/> <input type="hidden" name="sfx_resource_id" value="" /> <input type="text" name="jumpto" class="form-control input-xs" placeholder="jump to" title="jump to another line instead by sequence order" value="" /> <input type="hidden" name="jumpto_line_id" value="" /> <input type="text" name="label" class="form-control input-xs" placeholder="label" value="" /> </div> </div> </div> </div> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-danger btn-xs pull-right line-delete-button"><span class="glyphicon glyphicon-remove"></span></button> <br /> <button type="button" class="btn btn-default btn-xs pull-right line-project-button"><span class="glyphicon glyphicon-chevron-right"></span></button> <br /> <button type="button" class="btn btn-default btn-xs pull-right line-collapse-button"><span class="glyphicon glyphicon-option-horizontal"></span></button> </div> </div> <input type="hidden" name="sequence" value="'+tail+'" /> <input type="hidden" name="line_id" value="'+new_line_id+'" /> </form> </td> </tr>';
				$(block).appendTo('.line-list');
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

//show sprite management area on text line hover
$('.line-list').on('mouseenter', '.text-line-form', function() {
	//unnecessary! var select_form = $(this.form);
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
			var block = '<tr> <td> <form class="form-inline sprite-form"> <div class="row"> <div class="col-md-1"> <span class="sprite-index">'+count+'</span> </div> <div class="col-md-9"> <div class="form-group"> <input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="'+value.sprite_name+'" /> <input type="hidden" name="sprite_resource_id" value="'+value.sprite_resource_id+'" /> <input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="'+value.position_x+'" /> <input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="'+value.position_y+'" /> <input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="'+value.position_z+'" /> <input type="text" name="effect" class="form-control input-xs sprite-input" placeholder="transition" value="" /> <input type="hidden" name="effect_id" value="" /> <span class="glyphicon glyphicon-resize-vertical"></span> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button"><span class="glyphicon glyphicon-remove"></span></button> </div> </div> <input type="hidden" name="sprite_id" value="'+value.sprite_id+'" /> <input type="hidden" name="sprite_temp_index" value="'+(count-1)+'" /> </form> </td> </tr>';
			// append nothing if line has no sprite
			if(value.sprite_id != "") {
				$(block).appendTo('.sprite-list');
			}
		});
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
	sortLineObjectBySequence();
	saveLine();
});

function saveLine() {
	var simple_line_obj = [];
	var simple_sprite_obj = [];
	var i = 0;
	// extract important value from line_obj
	$.each(line_obj, function(index, value) {
		simple_line_obj.push({
			line_id: value.line_id,
			sequence: value.sequence,
			label: value.label,
			speaker: value.speaker,
			content: value.content,
			fk_effect_id: value.fk_effect_id,
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
					sprite_temp_index: value.sprite_temp_index,
					sprite_id: value.sprite_id,
					fk_resource_id: value.sprite_resource_id,
					position_x: value.position_x,
					position_y: value.position_y,
					position_z: value.position_z,
					fk_line_id: i_line_id
				})
			}
			else {
				simple_sprite_obj.push({
					sprite_id: value.sprite_id,
					fk_resource_id: value.sprite_resource_id,
					position_x: value.position_x,
					position_y: value.position_y,
					position_z: value.position_z,
					fk_line_id: i_line_id
				});
			}
		});

		// $.each(line_obj[i].sprite, function(index, value) {
		// 	simple_line_obj[i].sprite.push({
		// 		sprite_id: value.sprite_id,
		// 		fk_resource_id: value.fk_resource_id,
		// 		position_x: value.position_x,
		// 		position_y: value.position_y,
		// 		position_z: value.position_z
		// 	});
		// });
		i++;
	});
var delete_json = JSON.stringify(delete_obj);
	var simple_line_json = JSON.stringify(simple_line_obj);
	var simple_sprite_json = JSON.stringify(simple_sprite_obj);
	// send update data to server
	var req = $.ajax({
		url: config.base + 'index.php/editor/saveLineData',
		type: "POST",
		data: {
			deletedata: delete_json,
			linedata: simple_line_json,
			spritedata: simple_sprite_json
		},
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg) {
			console.log(msg);
			var sprite_update_obj = msg;
			$.each(sprite_update_obj, function(index, value) {
				var line_index_to_write = getObjectIndex(line_obj, 'line_id', value.fk_line_id);
				var index_to_write = getObjectIndex(line_obj[line_index_to_write].sprite, 'sprite_temp_index', value.sprite_temp_index);
				line_obj[line_index_to_write].sprite[index_to_write].sprite_id = value.sprite_id;
				var line_form_id = $('.select-line').find('input[name=line_id]').val();
				// if newly created sprite is listed on active sprite area, its id will be updated so no duplicate creation when changing sprite property value after save
				if(line_form_id == value.fk_line_id) {
					var select_form = $('.sprite-list tr td form').has('input[name=sprite_temp_index][value='+value.sprite_temp_index+']');
					$(select_form).find('input[name=sprite_id]').val(value.sprite_id);
				}
			});
			callSuccessNotification("work saved!");
		}
		else {
			callErrorNotification("failed to save!");
		}
	})
}

$('.line-list').on('change', 'input[type=text], textarea', function() {
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
			$.each(background_list, function(index, value) {
				if(input_id == value.resource_id && input_value == value.name) {
					verify++;
				}
			});
			console.log(input_id);
			if(verify == 1) {
				line_obj[index_to_write].background_resource_id = input_id;
				$(this).css("color", "");
				console.log("OK");
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
				$(this).css("color", "");
				console.log("OK");
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
				console.log("OK");
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
				console.log("OK");
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
				console.log("OK");
			}
			else {
				line_obj[index_to_write].jumpto_line_id = "";
				$(this).css("color", "rgba(255, 90, 90, 1)");
				callErrorNotification("label doesn't exist!");
			}
			break;

		case "label":
			var input_value = $(this).val();
			line_obj[index_to_write].label = input_value;
			break;
	}
});

$('.sprite-list').on('change', 'input[type=text]', function() {
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
				if(input_id == value.resource_id && input_value == value.name) {
					verify++;
				}
			});
			if(verify == 1) {
				line_obj[line_index_to_write].sprite[index_to_write].sprite_resource_id = input_id;
				line_obj[line_index_to_write].sprite[index_to_write].sprite_name = input_value;
				$(this).css("color", "");
				console.log("OK");
			}
			else {
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

		case "effect":
			break;
	}
});

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
// 			console.log(index_to_write);
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
		var sprite_count_limit = 2;
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
				sprite_resource_id: "",
				sprite_name: "",
				sprite_file_name: "",
				sprite_character_name: "",
				sprite_figure_name: "",
				sprite_expression_name: ""
			});
			var block = '<tr> <td> <form class="form-inline sprite-form"> <div class="row"> <div class="col-md-1"> <span class="sprite-index">'+(count+1)+'</span> </div> <div class="col-md-9"> <div class="form-group"> <input type="text" name="sprite" class="form-control input-xs sprite-input sprite-menu" placeholder="sprite" value="" /> <input type="hidden" name="sprite_resource_id" value="" /> <input type="text" name="position_x" class="form-control input-xs sprite-number-input" placeholder="x" value="0" /> <input type="text" name="position_y" class="form-control input-xs sprite-number-input" placeholder="y" value="0" /> <input type="text" name="position_z" class="form-control input-xs sprite-number-input" placeholder="z" value="0" /> <input type="text" name="effect" class="form-control input-xs sprite-input" placeholder="transition" value="" /> <input type="hidden" name="effect_id" value="" /> <span class="glyphicon glyphicon-resize-vertical"></span> </div> </div> <div class="col-md-1"> <button type="button" class="btn btn-danger btn-xs pull-left sprite-delete-button"><span class="glyphicon glyphicon-remove"></span></button> </div> </div> <input type="hidden" name="sprite_id" value="new" /> <input type="hidden" name="sprite_temp_index" value="'+count+'"/></form> </td> </tr>';
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

callCharacterAutocompleteData();
callBackgroundAutocompleteData();
callBgmAutocompleteData();
callVoiceAutocompleteData();
callSfxAutocompleteData();
callLabelAutocompleteData();
callSpriteAutocompleteData();
callEffectAutocompleteData();

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
		// ! NEED ENHANCEMENT !
		$.each(msg, function(index, value) {
			sprite_name_list.push(value.name);
		});
		sprite_list = msg;
	});
}
function callEffectAutocompleteData() {
	var req = $.ajax({
		url: config.base + 'index.php/editor/loadEffectList',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		// ! NEED ENHANCEMENT !
		$.each(msg, function(index, value) {
			effect_name_list.push({
				label: value.name,
				value: value.resource_id
			});
		});
		effect_list = msg;
	});
}

// autocomplete speaker input
$('.line-list').on('keydown', 'input[name=speaker]', function() {
	$(this).autocomplete({
		source: character_list,
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
		// source: function(request, response) {
		// 	var list = [];
		// 	$.each(background_list, function(index, value) {
		// 		list.push(value.name);
		// 	});
		// 	console.log(list);
		// 	response(list);
		// },
		source: background_name_list,
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=background]').val(ui.item.label);
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
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=background_resource_id]').val(ui.item.value);
			$(this.form).find('input[name=background]').val(ui.item.label);
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
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=bgm]').val(ui.item.label);
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
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
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
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=voice]').val(ui.item.label);
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
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
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
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=sfx]').val(ui.item.label);
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
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
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
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=jumpto]').val(ui.item.label);
			// change id on hidden input
			$(this.form).find('input[name=jumpto_line_id]').val(ui.item.value);
			// for disabling change value on input
			return false;
		},
		// autosuggest capability
		open: function(event, ui) {
			var top = $(this).data('uiAutocomplete').menu.element[0].children[0], 
			input = $(this),
			original = input.val(),
			top_value = $(top).text();
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=jumpto_line_id]').val(ui.item.value);
			$(this.form).find('input[name=jumpto]').val(ui.item.label);
			return false;
		},
		autoFocus: true
	});
});

// autocomplete sprite input
$('.sprite-list').on('keydown', 'input[name=sprite]', function() {
	$(this).autocomplete({
		source: sprite_list,
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=sprite]').val(ui.item.name);
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
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
			if(top_value.toLowerCase().indexOf(original.toLowerCase()) === 0) {
				input.val(top_value);
				input[0].selectionStart = original.length;
				input[0].selectionEnd = top_value.length;
			}
		},
		select: function(event, ui) {
			// get this input element
			var input = $(this);
			$(this.form).find('input[name=sprite_resource_id]').val(ui.item.resource_id);
			$(this.form).find('input[name=sprite]').val(ui.item.name);
			return false;
		},
		autoFocus: true,
		
	})
	.autocomplete('instance')._renderItem = function(ul, item) {
		return $('<li>')
			.append("<a>" + item.character_name + "<br>" + item.figure_name + " - " + item.expression_name + "</a>")
			.appendTo(ul);
	};
});

// autocomplete transition input
$('.sprite-list').on('keydown', 'input[name=effect]', function() {
	$(this).autocomplete({
		source: effect_name_list,
		minLength: 1,
		focus: function(event, ui) {
			var input = $(this);
			// chang value on input
			$(this.form).find('input[name=effect]').val(ui.item.label);
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
			var x = $(this).data('uiAutocomplete').menu.element[0].children[0];
			var xx = $(x).text();
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
			return false;
		},
		autoFocus: true
	});
});

// line delete capability
$('.line-list').on('click', '.line-delete-button', function(e) {
	e.preventDefault();
	var select_form = (this.form);
	var form_id = $(select_form).find('input[name=line_id]').val();
	var index_to_write = getObjectIndex(line_obj, 'line_id', form_id);
	// delete line data on active line object
	// delete line_obj[index_to_write];
	// assign delete_obj with value from line_obj about to be deleted
	delete_obj.push({
		object: "line",
		id: line_obj[index_to_write].line_id
	});
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

// unfocus button after click, bootstrap bug on some browser?
$(document.body).on('mouseup', '.btn', function(){
    $(this).blur();
});



var canvasdisplay = document.getElementsByTagName('canvas')[0];
canvasdisplay.width = 800;
canvasdisplay.height = 600;
canvasdisplay.style.width  = '240px';
canvasdisplay.style.height = '180px';