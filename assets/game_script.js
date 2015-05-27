
var configuration = [];
var line = [];
var current = {
	sequence: -1,
	head: -1,
	limit: 100
};
var cache = {
	head: -1,
	limit: 60,
	count: 0
};
var game = {
	screen: "title",
	mode: "normal",
	bgm: "",
	voice: "",
	sfx: "",
	status: {
		text: "idle",
		voice: "idle"
	}
}
var font_list = [];
var visual_display = $('#visual')[0];
visual_display.width = 800;
visual_display.height = 600;
visual_display.style.width  = '800px';
visual_display.style.height = '600px';
var text_display = $('#text')[0];
text_display.width = 800;
text_display.height = 600;
text_display.style.width  = '800px';
text_display.style.height = '600px';
var context = text_display.getContext('2d');
var canvas = new fabric.Canvas('visual');
canvas.selection = false;
canvas.backgroundColor = 'rgba(255, 255, 255,1)';
$(document).ready(function() {
	preloadInterface(function() {
		callConfigurationData(function() {
			callSequentialLineData(0, function() {
				processSequentialResource();
				setTimeout(function() {
					initializeGame();
				}, 6000);
			});
		});
	});
	callFontData();
});
function callConfigurationData(callback) {
	var req = $.ajax({
		url: config.base + 'index.php/game/loadConfiguration',
		type: "POST",
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg) {
			configuration = msg;
		}
		else {
		}
		callback();
	});
}
function callSequentialLineData(offset, callback) {
	var process_limit = current.limit;
	var req = $.ajax({
		url: config.base +'index.php/game/loadLine',
		type: "POST",
		data: {
			offset: offset,
			limit: process_limit
		},
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg.length) {
			$.each(msg, function(index, value) {
				line.push(msg[index]);
			})
			current.head+=msg.length;
			if(callback) {
				callback();
			}
		}
		else {
			if(current.sequence == 0) {
				callFailureNotification("No data retrieved.");
			}
		}
	});
}
function maintainCurrent(callback) {
	if(current.head > current.limit) {
		for(var i = 0; i < current.sequence - 10; i++) {
			line.splice(0, 1);
			current.head--;
			current.sequence--;
			cache.head--;
		}
	}
	if(current.sequence % (current.head - 20) == 0) {
			callSequentialLineData(parseInt(line[current.head].sequence));
	}
	if(callback) {
		callback();
	}
}
function maintainCache(callback) {
	if(cache.count > cache.limit) {
		$('image-cache').children('img').each(function() {
			var id = $(this).find('id').val();
			var bg_del = true;
			var spr_del = true;
			for(var i = current.sequence; i < current.sequence + 10; i++) {
				var j = 0;
				if(line[i].fk_linetype_id == 1) {
					if(line[i].background_resource_id) {
						if(id == line[i].background_resource_id) {
							bg_del = false;
						}
					}
					if(line[i].sprite.length) {
						$.each(line[i].sprite, function(j_index, j_value) {
							if(id == j_value.sprite_resource_id) {
								spr_del = true;
							}
						});
					}
				}
			}
			if(bg_del == true) {
				$(this).remove();
				cache.count--;
			}
			if(spr_del == true) {
				$(this).remove();
				cache.count--;
			}
		});
		$('audio-cache').children('audio').each(function() {
			var id = $(this).find('id').val();
			var bgm_del = true;
			var sfx_del = true;
			var voice_del = true;
			for(var i = current.sequence; i < current.sequence + 10; i++) {
				var j = 0;
				if(line[i].fk_linetype_id == 1) {
					if(line[i].bgm_resource_id) {
						if(id == line[i].bgm_resource_id) {
							bgm_del = false;
						}
					}
					if(line[i].sfx_resource_id) {
						if(id == line[i].sfx_resource_id) {
							sfx_del = false;
						}
					}
					if(line[i].voice_resource_id) {
						if(id == line[i].voice_resource_id) {
							voice_del = false;
						}
					}
				}
			}
			if(bgm_del == true) {
				$(this).remove();
				cache.count--;
			}
			if(sfx_del == true) {
				$(this).remove();
				cache.count--;
			}
			if(voice_del == true) {
				$(this).remove();
				cache.count--;
			}
		});
	}
	if(cache.head - current.sequence < 10) {
		processSequentialResource();
	}
	if(callback) {
		callback();
	}
}
function processSequentialResource() {
	if(cache.head - current.sequence < 10) {
		cache.head++;
		if(line[cache.head]) {
			if(line[cache.head].fk_linetype_id == 1) {
				var status = true;
				if(line[cache.head].background_resource_id) {
					var path_to_background = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/background/" + line[cache.head].background_file_name;
					var resource_id = line[cache.head].background_resource_id;
					preloadImage(path_to_background, resource_id, function(returndata) {
						if(!returndata) {
							status = false;
						}
					});
				}
				if(line[cache.head].sprite.length) {
					var sprite_to_preload = [];
					$.each(line[cache.head].sprite, function(index, value) {
						var path_to_sprite = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/sprite/" + value.sprite_file_name;
						var resource_id = value.sprite_resource_id;
						sprite_to_preload.push({
							source: path_to_sprite,
							resource_id: resource_id
						})
					})
					preloadSprite(sprite_to_preload, function(returndata) {
						if(!returndata) {
							status = false;
						}
					});
				}
					if(line[cache.head].bgm_resource_id) {
						var path_to_bgm = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/bgm/" + line[cache.head].bgm_file_name;
						var resource_id = line[cache.head].bgm_resource_id;
						preloadAudio(path_to_bgm, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					if(line[cache.head].voice_resource_id) {
						var path_to_voice = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/voice/" + line[cache.head].voice_file_name;
						var resource_id = line[cache.head].voice_resource_id;
						preloadAudio(path_to_voice, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					if(line[cache.head].sfx_resource_id) {
						var path_to_sfx = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/sfx/" + line[cache.head].sfx_file_name;
						var resource_id = line[cache.head].sfx_resource_id;
						preloadAudio(path_to_sfx, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					if(status == true) {
						processSequentialResource();
					}
			}
			else if(line[cache.head].fk_linetype_id == 2) {
				processSequentialResource();
			}
			else {
				processSequentialResource();
			}
		}
	}
}
function preloadImage(source, resource_id, callback) {
	var is_exist = $('.image-cache').has('img[id='+resource_id+']').length;
	if(is_exist) {
		callback(true);
	}
	else {
		$("<img/>").attr("src", source).attr("id", resource_id).css("display", "none").appendTo('.image-cache');
		cache.count++;
		$('img[id='+resource_id+']').on('load', function() {
			callback(true);
		});
	}
}
function preloadSprite(sourcearray, callback) {
	$.each(sourcearray, function(index, value) {
		setTimeout(function() {
			var is_exist = $('.image-cache').has('img[id='+value.resource_id+']').length;
			if(is_exist) {
				callback(true);
			}
			else {
				$("<img/>").attr("src", value.source).attr("id", value.resource_id).css("display", "none").appendTo('.image-cache');
				cache.count++;
				$('img[id='+value.resource_id+']').on('load', function() {
					if(index == sourcearray.length) {
						callback(true);
					}
				});
			}
		}, index * 1000);
		
	});
}
function preloadAudio(source, resource_id, callback){
	var is_exist = $('.audio-cache').has('audio[id='+resource_id+']').length;
	if(is_exist) {
		callback(true);
	}
	else {
		$("<audio/>").attr("src", source).attr("id", resource_id).attr("preload", "auto").css("display", "none").appendTo('.audio-cache');
		cache.count++;
		$('audio[id='+resource_id+']').on('canplaythrough', function() {
			callback(true);
		});
	}
}
function preloadInterface(callback) {
	var ui = {
		title_background: "arc_000135c.png",
		configuration_background: "arc_000018c.png",
		start_button: "arc_001261.png",
		load_button: "arc_001264.png",
		configuration_button: "arc_001267.png",
		in_configuration_button: "arc_001113.png",
		in_repeat_button: "arc_001119.png",
		in_auto_button: "arc_001131.png",
		in_skip_button: "arc_001125.png",
		in_log_button: "arc_001140.png",
		in_save_button: "arc_001143.png",
		in_load_button: "arc_001146.png",
		in_quicksave_button: "arc_001149.png",
		in_quickload_button: "arc_001152.png",
		in_text_window: "arc_000770c.png",
		in_choice_box: "arc_001255.png",
		save_data_box_nodata: "arc_000951.png",
		save_data_box: "arc_000951e.png",
		text_button: "arc_000573.png",
		sound_button: "arc_000572.png",
		exit_button: "arc_001273.png",
		white: "white.jpg",
		black: "black.jpg"
	};
	$.each(ui, function(index, value) {
		var path_to_ui = '../../../assets/sys/' + value;
		$("<img/>").attr("src", path_to_ui).attr("id", index).css("display", "none").appendTo('.interface');
	});
	if(callback) {
		callback();
	}
}
function callFontData() {
	var req = $.ajax({
		url: config.base + 'index.php/game/loadFontList',
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg) {
			font_list = msg;
		}
	})
}
function failureNotification(message) {
	$('.game-area').html("<p/>"+message).show();
}
function getObjectIndex(array, attr, value) {
	for(var i = 0; i < array.length; i++) {
		if(array[i][attr] == value) {
			return i;
		}
	}
	return false;
}
function initializeGame() {
	$('.request-loading').fadeOut(500, function() {
		$('.game-area').fadeIn(1500, function() {
			renderTitleScreen();
		});
	});
}
function renderTitleScreen() {
	var img = $('#title_background')[0];
	var ttl_bg = new fabric.Image(img, {
		id: 'title_background',
		top: 0,
		left: 0,
		opacity: 0,
		angle: 0,
		scaleX: 1
	});
	ttl_bg.set('selectable', false);
	canvas.add(ttl_bg);
	ttl_bg.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		easing: fabric.util.ease.easeInOutQuad,
		onComplete: function() {
			renderTitleMenu()
		}
	});
}
function renderTitleMenu() {
	var img = $('#start_button')[0];
	var str_btn = new fabric.Image(img, {
		id: 'start_button',
		top: 380,
		left: 350,
		opacity: 0,
		angle: 0
	});
	str_btn.set('selectable', false);
	canvas.add(str_btn);
	str_btn.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500
	});
	str_btn.animate('top', '400', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500,
		easing: fabric.util.ease.easeInOutCubic
	});
	var img = $('#load_button')[0];
	var str_btn = new fabric.Image(img, {
		id: 'load_button',
		top: 380,
		left: 500,
		opacity: 0,
		angle: 0
	});
	str_btn.set('selectable', false);
	canvas.add(str_btn);
	str_btn.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500
	});
	str_btn.animate('top', '395', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500,
		easing: fabric.util.ease.easeInOutCubic
	});
	var img = $('#configuration_button')[0];
	var cfg_btn = new fabric.Image(img, {
		id: 'configuration_button',
		top: 380,
		left: 650,
		opacity: 0,
		angle: 0
	});
	cfg_btn.set('selectable', false);
	canvas.add(cfg_btn);
	cfg_btn.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500
	});
	cfg_btn.animate('top', '395', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500,
		easing: fabric.util.ease.easeInOutCubic
	});
}
		
					
var key_enable = true;
$(document).bind('keydown', function(e){
	if(key_enable == true) {
		if(game.screen == "play") {
			switch(e.which) {
				case 13:
					key_enable = false;
					if(game.status.text != "busy") {
						renderNextLine();
						maintainCurrent();
						maintainCache();
					}
					break;
				default:
					break;
			}
		}
	}
});
$(document).bind('keyup', function(e){
	if(game.screen == "play") {
		switch(e.keyCode) {
			case 13:
				key_enable = true;
				break;
			default:
				break;
		}
	}
});
canvas.on('mouse:down', function(options) {
	if(game.screen == "title") {
		switch(options.target.id) {
			case "start_button":
				renderPlayScreen();
				game.screen = "play";
				break;
			case "load_button":
				renderLoadScreen();
				game.screen = "load";
				break;
			case "configuration_button":
				renderConfigurationScreen();
				game.screen = "configuration";
				break;
			default:
				break;
		}
	}
	else if((game.screen == "configuration") || (game.screen == "on_play_configuration" || (game.screen == "on_choice_configuration"))) {
		switch(options.target.id) {
			case "font":
				var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', configuration.fk_fonttype_id);
				cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '1', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', options.target.fonttype_id);
				cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '0.5', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				configuration.fk_fonttype_id = options.target.fonttype_id;
				break;
			case "text":
				var index_to_read = getObjectIndex(canvas.getObjects(), 'textspeed_id', configuration.text_speed);
				var cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '1', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var index_to_read = getObjectIndex(canvas.getObjects(), 'textspeed_id', options.target.textspeed_id);
				cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '0.5', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				configuration.text_speed = options.target.textspeed_id;
				break;
			case "bgm":
				var vol_round = configuration.bgm_volume * 10;
				var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', vol_round);
				var cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '1', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', options.target.bgmvolume_id);
				cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '0.5', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var vol_decimal = options.target.bgmvolume_id / 10;
				configuration.bgm_volume = vol_decimal;
				break;
			case "sfx":
				var vol_round = configuration.sfx_volume * 10;
				var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', vol_round);
				var cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '1', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', options.target.sfxvolume_id);
				cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '0.5', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var vol_decimal = options.target.sfxvolume_id / 10;
				configuration.sfx_volume = vol_decimal;
				break;
			case "voice":
				var vol_round = configuration.voice_volume * 10;
				var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', vol_round);
				var cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '1', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', options.target.voicevolume_id);
				cfg = canvas.item(index_to_read);
				cfg.animate('opacity', '0.5', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 100
				});
				var vol_decimal = options.target.voicevolume_id / 10;
				configuration.voice_volume = vol_decimal;
				break;
			case "text_head":
				toTextConfiguration();
				break;
			case "sound_head":
				toSoundConfiguration();
				break;
			case "exit_button":
				exitConfigurationScreen();
				callSaveConfiguration();
				if(game.screen == "configuration") {
					game.screen = "title";
				}
				else if(game.screen == "on_play_configuration") {
					game.screen = "play";
				}
				else if(game.screen == "on_choice_configuration") {
					game.screen = "choice";
				}
				break;
			default:
				break;
		}
	}
	else if(game.screen == "play") {
		if(options.target != undefined) {
			switch(options.target.id) {
				case "quickload_button":
					quickLoad();
					break;
				case "quicksave_button":
					quickSave();
					break;
				case "load_button":
					game.screen = "on_play_load";
					$('.text-area').fadeOut(1000);
					renderLoadScreen();
					break;
				case "save_button":
					game.screen = "save";
					$('.text-area').fadeOut(1000);
					renderSaveScreen();
					break;
				case "auto_button":
					game.screen = "auto";
					playAuto();
					break;
				case "skip_button":
					if(game.status.text != "busy") {
						game.screen = "skip";
						playSkip();
					}
					break;
				case "repeat_button":
					playVoice();
					break;
				case "configuration_button":
					game.screen = "on_play_configuration";
					renderConfigurationScreen();
					$(text_display).fadeOut(1000);
					break;
				case "log_button":
					game.screen = "log";
					renderLogScreen();
					break;
				default:
					if(game.status.text != "busy") {
						renderNextLine();
						maintainCurrent();
						maintainCache();
					}
					break;
			}
		}
		else {
			if(game.status.text != "busy") {
				renderNextLine();
				maintainCurrent();
				maintainCache();
			}
		}
	}
	else if(game.screen == "save" || game.screen == "on_choice_save") {
		switch(options.target.id) {
			case "save_slot":
				if(options.target.save_data_line_id) {
					saveGame(options.target.save_data_id, function() {
						exitSaveScreen(function() {
							$('.text-area').fadeIn(1000);
							if(game.screen == "on_choice_save") {
								game.screen = "choice";
							}
							else {
								game.screen = "play";
							}
						})
					});
				}
				else  {
					game.screen = "stall";
					saveGame(options.target.save_data_id, function() {
						exitSaveScreen(function() {
							if(game.screen == "on_choice_save") {
								game.screen = "choice";
							}
							else {
								game.screen = "play";
							}
						});
					});
				}
				break;
			case "exit_button":
				$('.text-area').fadeIn(2000);
				exitSaveScreen(function() {
					if(game.screen == "on_choice_save") {
						game.screen = "choice";
					}
					else {
						game.screen = "play";
					}
				});
				break;
			default:
				break;
		}
		
	}
	else if(game.screen == "load" || game.screen == "on_play_load" || game.screen == "on_choice_load") {
		switch(options.target.id) {
			case "save_slot":
				if(options.target.save_data_line_id) {
					game.screen = "stall";
					loadGame(options.target.save_data_line_id);
				}
				break;
			case "exit_button":
				$('.text-area').fadeIn(2000);
				exitLoadScreen(function() {
					if(game.screen == "on_choice_load") {
						game.screen = "choice";
					}
					else if(game.screen == "on_play_load") {
						game.screen = "play";
					}
					else {
						game.screen = "title";
					}
				});
				break;
			default:
				break;
		}
	}
	else if(game.screen == "choice") {
		if(options.target.line_choice_id) {
			var choice_id_select = options.target.line_choice_id;
			var choice_index_to_read = getObjectIndex(line[current.sequence].choice, 'choice_id', choice_id_select);
			if(line[current.sequence].choice[choice_index_to_read].jumpto_line_id && line[current.sequence].choice[choice_index_to_read].jumpto_line_id != line[current.sequence+1].line_id) {
					var index_to_remove = current.sequence + 1;
					line.splice(index_to_remove, current.head - current.sequence);
						current.head = current.sequence;
						var offset_jump = line[current.sequence].choice[choice_index_to_read].look_ahead[0].sequence;
						callSequentialLineData(parseInt(offset_jump)-1, function() {
							processSequentialResource();
							exitChoice();
							setTimeout(function() {
								game.screen = "play";
								renderNextLine();
							}, 500);
						});
					
			}
			else {
				exitChoice();
				setTimeout(function() {
					renderNextLine();
					game.screen = "play";
				}, 500);
			}
		}
		else {
			switch(options.target.id) {
				case "quickload_button":
					quickLoad();
					break;
				case "quicksave_button":
					quickSave();
					break;
				case "load_button":
					game.screen = "on_choice_load";
					$('.text-area').fadeOut(1000);
					renderLoadScreen();
					break;
				case "save_button":
					game.screen = "on_choice_save";
					$('.text-area').fadeOut(1000);
					renderSaveScreen();
					break;
				case "auto_button":
					break;
				case "skip_button":
					break;
				case "repeat_button":
					playVoice();
					break;
				case "configuration_button":
					renderConfigurationScreen();
					$(text_display).fadeOut(1000);
					game.screen = "on_choice_configuration";
					break;
				case "log_button":
					break;
			}
		}
	}
	else if(game.screen == "video") {
		game.screen = "stall";
		var vidx = $('#video_play');
		vidx.animate({volume: 0}, 3000, function() {
			var vid = $('#video_play')[0];
			vid.pause();
			
		});
		whiteIn(1000, function() {
			$('.video-area').fadeOut(2000);
			setTimeout(function() {
				renderNextLine();
				$('.text-area').fadeIn(2500);
				whiteOut(2000, function() {
					$('.text-area').fadeIn(1000);
					game.screen = "play";
				});
			}, 3000);
		});
	}
	else if(game.screen == "auto") {
		game.screen = "play";
	}
	else if(game.screen == "skip") {
		game.screen = "play";
	}
	else if(game.screen == "log") {
		$('.log-area').slideUp(1000);
		game.screen = "play";
	}
});
function renderNotification(message) {
	var notify = new fabric.Text(message, {
		fontFamily: 'Arial',
		fontSize: 20,
		fill: '#FF0000',
		opacity: 0,
		top: 380,
		left: 801
	});
	notify.set('selectable', false);
	canvas.add(notify);
	notify.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500,
		onComplete: function() {
			notify.animate('opacity', '0', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 2000
			});
		}
	});
	notify.animate('left', '500', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 2500,
		onComplete: function() {
			canvas.remove(notify);
		}
	});
}
function saveGame(save_data_id, callback) {
	if(save_data_id) {
		save_data_id = save_data_id;
	}
	else {
		save_data_id = "new";
	}
	var req = $.ajax({
		url: config.base + 'index.php/game/saveGame',
		data: {
			saveid: save_data_id,
			lineid: line[current.sequence].line_id
		},
		type: "POST",
		dataType: 'html'
	});
	req.done(function(msg) {
		if(callback) {
			callback();
		}
	})
}
function callSaveConfiguration() {
	var configuration_json = JSON.stringify(configuration);
	var req = $.ajax({
		url: config.base + 'index.php/game/saveConfiguration',
		type: "POST",
		data: {
			configdata: configuration_json
		}
	});
}
function loadGame(save_data_line_id) {
	var req = $.ajax({
		url: config.base + 'index.php/game/getSequenceById',
		type: 'POST',
		data: { lineid: save_data_line_id },
		dataType: 'html'
	});
	req.done(function(msg) {
		whiteIn(1000);
		stopBgm();
		line = [];
		canvas.clear();
		context.clearRect (0 ,0 ,text_display.width,text_display.height );
		$('.text-area').show();
		current.sequence = -1;
		current.head = -1;
		cache.head = -1;
		callSequentialLineData((msg-1), function() {
			processSequentialResource();
			setTimeout(function() {
				game.screen = "play";
				renderNextLine();
			}, 4000);
		});
	});
}
function quickSave() {
	var req = $.ajax({
		url: config.base + 'index.php/game/quickSave',
		type: 'POST',
		data: { lineid: line[current.sequence].line_id },
		dataType: 'html'
	});
	req.done(function(msg) {
		if(msg == 1) {
			renderNotification('Saved!');
		}
	})
}
function quickLoad() {
	var req = $.ajax({
		url: config.base + 'index.php/game/quickLoad',
		type: 'POST',
		dataType: 'html'
	});
	req.done(function(msg) {
		game.screen = "stall";
		whiteIn(1000);
		stopBgm();
		line = [];
		canvas.clear();
		context.clearRect (0 ,0 ,text_display.width,text_display.height );
		$('.text-area').show();
		current.sequence = -1;
		current.head = -1;
		callSequentialLineData(msg-1, function() {
			processSequentialResource();
			setTimeout(function() {
				game.screen = "play";
				renderNextLine();
			}, 4000);
		});
	})
}
function renderSaveScreen() {
	var req = $.ajax({
		url: config.base + 'index.php/game/loadSaveData',
		type: 'POST',
		dataType: 'json'
	});
	req.done(function(msg) {
		var dat = msg;
		var img = $('#configuration_background')[0];
		var cfg_bg = new fabric.Image(img, {
			id: 'configuration_background',
			top: -600,
			left: 0,
			opacity: 1,
			angle: 0
		});
		cfg_bg.set('selectable', false);
		canvas.add(cfg_bg);
		cfg_bg.animate('top', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 1000,
			easing:fabric.util.ease.easeInOutBack
		});
		var load_txt = new fabric.Text("Save Data", {
			id: 'save_head',
			fontFamily: 'Arial',
			fontSize: 40,
			top: -60,
			left: 100,
			opacity: 1
		});
		load_txt.set('selectable', false);
		canvas.add(load_txt);
		load_txt.animate('top', '40', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 1000,
			easing:fabric.util.ease.easeInOutBack
		});
		var img_nodata = $('#save_data_box_nodata')[0];
		var img = $('#save_data_box')[0];
		if(dat.length){
			var i = 0;
			var top_after, left_after;
			$.each(dat, function(index, value) {
				top_after = 130 + (90 * (i % 5));
				left_after = 30;
				if(i >= 5) {
					left_after = 420;
				}
				var sav_img = new fabric.Image(img, {
					opacity: 1,
					angle: 0
				});
				var sav_txt_1 = new fabric.Text((i+1).toString(), {
					fontSize: 35,
					fontWeight: 'bold',
					fontFamily: 'Arial',
					fill: '#0000FF',
					stroke: '#333333',
					strokewidth: 3,
					opacity: 1,
					top: 18,
					left: 50
				});
				var sav_txt_2 = new fabric.Text((value.save_date).toString(), {
					fontSize: 20,
					fontFamily: 'Arial',
					opacity: 1,
					top: 40,
					left: 140
				});
				var sav_obj = new fabric.Group([ sav_img, sav_txt_1, sav_txt_2 ], {
					id: 'save_slot',
					save_slot_id: (i+1),
					save_data_id: value.savedata_id,
					save_data_line_id: value.fk_line_id,
					top: -200,
					left: left_after
				});
				sav_obj.set('selectable', false);
				canvas.add(sav_obj);
				sav_obj.animate('top', top_after, {
					onChange: canvas.renderAll.bind(canvas),
					duration: 1000,
					easing:fabric.util.ease.easeInOutBack
				});
				i++;
			});
			for(i = i ;i < 10; i++) {
				top_after = 130 + (90 * (i % 5));
				left_after = 30;
				if(i >= 5) {
					left_after = 420;
				}
				var sav_obj = new fabric.Image(img_nodata, {
					id: 'save_slot',
					save_slot_id: (i+1),
					top: -200,
					left: left_after,
					opacity: 1,
					angle: 0
				});
				sav_obj.set('selectable', false);
				canvas.add(sav_obj);
				sav_obj.animate('top', top_after, {
					onChange: canvas.renderAll.bind(canvas),
					duration: 1000,
					easing:fabric.util.ease.easeInOutBack
				});
			}
		}
		else {
			var top_after = 130;
			for(var i = 0; i < 5; i++) {
				var ld_dat = new fabric.Image(img_nodata, {
					id: 'save_slot',
					save_slot_id: (i+1),
					top: -200,
					left: 30,
					opacity: 0.8,
					angle: 0
				});
				ld_dat.set('selectable', false);
				canvas.add(ld_dat);
				ld_dat.animate('top', top_after, {
					onChange: canvas.renderAll.bind(canvas),
					duration: 1000,
					easing:fabric.util.ease.easeInOutBack
				});
				top_after+=90;
			}
			var top_after = 130;
			for(i = i; i < 10; i++) {
				var ld_dat = new fabric.Image(img_nodata, {
					id: 'save_slot',
					save_slot_id: (i+1),
					top: -200,
					left: 420,
					opacity: 0.8,
					angle: 0
				});
				ld_dat.set('selectable', false);
				canvas.add(ld_dat);
				ld_dat.animate('top', top_after, {
					onChange: canvas.renderAll.bind(canvas),
					duration: 1000,
					easing:fabric.util.ease.easeInOutBack
				});
				top_after+=90;
			}
		}
		var img = $('#exit_button')[0];
		var ext_btn = new fabric.Image(img, {
			id: 'exit_button',
			top: -600,
			left: 730,
			opacity: 1,
			angle: 0
		});
		ext_btn.set('selectable', false);
		canvas.add(ext_btn);
		ext_btn.animate('top', '10', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 1000,
			easing:fabric.util.ease.easeInOutBack
		});
	});
}
function renderLoadScreen(callback) {
	var req = $.ajax({
		url: config.base + 'index.php/game/loadSaveData',
		type: 'POST',
		dataType: 'json'
	});
	req.done(function(dat) {
			var img = $('#configuration_background')[0];
			var cfg_bg = new fabric.Image(img, {
				id: 'configuration_background',
				top: -600,
				left: 0,
				opacity: 1,
				angle: 0
			});
			cfg_bg.set('selectable', false);
			canvas.add(cfg_bg);
			cfg_bg.animate('top', '0', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 1000,
				easing:fabric.util.ease.easeInOutBack
			});
			var load_txt = new fabric.Text("Load Data", {
				id: 'load_head',
				fontFamily: 'Arial',
				fontSize: 40,
				top: -60,
				left: 100,
				opacity: 1
			});
			load_txt.set('selectable', false);
			canvas.add(load_txt);
			load_txt.animate('top', '40', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 1000,
				easing:fabric.util.ease.easeInOutBack
			});
			var img_nodata = $('#save_data_box_nodata')[0];
			var img = $('#save_data_box')[0];
			if(dat.length){
				var i = 0;
				var top_after, left_after;
				$.each(dat, function(index, value) {
					top_after = 130 + (90 * (i % 5));
					left_after = 30;
					if(i >= 5) {
						left_after = 420;
					}
					var sav_img = new fabric.Image(img, {
						opacity: 1,
						angle: 0
					});
					var sav_txt_1 = new fabric.Text((i+1).toString(), {
						fontSize: 35,
						fontWeight: 'bold',
						fontFamily: 'Arial',
						fill: '#0000FF',
						stroke: '#333333',
						strokewidth: 3,
						opacity: 1,
						top: 18,
						left: 50
					});
					var sav_txt_2 = new fabric.Text((value.save_date).toString(), {
						fontSize: 20,
						fontFamily: 'Arial',
						opacity: 1,
						top: 40,
						left: 140
					});
					var sav_obj = new fabric.Group([ sav_img, sav_txt_1, sav_txt_2 ], {
						id: 'save_slot',
						save_slot_id: (i+1),
						save_data_id: value.savedata_id,
						save_data_line_id: value.fk_line_id,
						top: -200,
						left: left_after
					});
					sav_obj.set('selectable', false);
					canvas.add(sav_obj);
					sav_obj.animate('top', top_after, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 1000,
						easing:fabric.util.ease.easeInOutBack
					});
					i++;
				});
				for(i = i ;i < 10; i++) {
					top_after = 130 + (90 * (i % 5));
					left_after = 30;
					if(i >= 5) {
						left_after = 420;
					}
					var sav_obj = new fabric.Image(img_nodata, {
						id: 'save_slot',
						save_slot_id: (i+1),
						top: -200,
						left: left_after,
						opacity: 0.7,
						angle: 0
					});
					sav_obj.set('selectable', false);
					canvas.add(sav_obj);
					sav_obj.animate('top', top_after, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 1000,
						easing:fabric.util.ease.easeInOutBack
					});
				}
			}
			else {
				var top_after = 130;
				for(var i = 0; i < 5; i++) {
					var ld_dat = new fabric.Image(img_nodata, {
						id: 'save_slot',
						save_slot_id: (i+1),
						top: -200,
						left: 30,
						opacity: 0.8,
						angle: 0
					});
					ld_dat.set('selectable', false);
					canvas.add(ld_dat);
					ld_dat.animate('top', top_after, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 1000,
						easing:fabric.util.ease.easeInOutBack
					});
					top_after+=90;
				}
				var top_after = 130;
				for(i = i; i < 10; i++) {
					var ld_dat = new fabric.Image(img_nodata, {
						id: 'save_slot',
						save_slot_id: (i+1),
						top: -200,
						left: 420,
						opacity: 0.8,
						angle: 0
					});
					ld_dat.set('selectable', false);
					canvas.add(ld_dat);
					ld_dat.animate('top', top_after, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 1000,
						easing:fabric.util.ease.easeInOutBack
					});
					top_after+=90;
				}
			}
			var img = $('#exit_button')[0];
			var ext_btn = new fabric.Image(img, {
				id: 'exit_button',
				top: -600,
				left: 730,
				opacity: 1,
				angle: 0
			});
			ext_btn.set('selectable', false);
			canvas.add(ext_btn);
			ext_btn.animate('top', '10', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 1000,
				easing:fabric.util.ease.easeInOutBack
			});
	});
}
function exitLoadScreen(callback) {
	for(var i = 0; i < 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'save_slot_id', (i+1));
		canvas.item(index_to_read).animate('top', '-200', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 1000,
			easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {
				for(i = 0; i < 10; i++) {
					var index_to_read = getObjectIndex(canvas.getObjects(), 'save_slot_id', (i+1));
					canvas.remove(canvas.item(index_to_read));
				}
			}
		});
	}
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'load_head');
	canvas.item(index_to_read).animate('top', '-200', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'load_head');
			canvas.remove(canvas.item(index_to_read));
		}
	});
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
	canvas.item(index_to_read).animate('top', '-600', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
			canvas.remove(canvas.item(index_to_read));
		}
	});
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
	canvas.item(index_to_read).animate('top', '-600', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
			canvas.remove(canvas.item(index_to_read));
		}
	});
	setTimeout(function() {
		if(callback) {
			callback();
		}
	}, 1000);
}
function exitSaveScreen(callback) {
	for(var i = 0; i < 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'save_slot_id', (i+1));
		canvas.item(index_to_read).animate('top', '-200', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 1000,
			easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {
				for(i = 0; i < 10; i++) {
					var index_to_read = getObjectIndex(canvas.getObjects(), 'save_slot_id', (i+1));
					canvas.remove(canvas.item(index_to_read));
				}
			}
		});
	}
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'save_head');
	canvas.item(index_to_read).animate('top', '-200', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'save_head');
			canvas.remove(canvas.item(index_to_read));
		}
	});
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
	canvas.item(index_to_read).animate('top', '-600', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
			canvas.remove(canvas.item(index_to_read));
		}
	});
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
	canvas.item(index_to_read).animate('top', '-600', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
			canvas.remove(canvas.item(index_to_read));
		}
	});
	setTimeout(function() {
		if(callback) {
			callback();
		}
	}, 1000);
}
function renderConfigurationScreen(callback) {
	var img = $('#configuration_background')[0];
	var cfg_bg = new fabric.Image(img, {
		id: 'configuration_background',
		top: -600,
		left: 0,
		opacity: 1,
		angle: 0
	});
	cfg_bg.set('selectable', false);
	canvas.add(cfg_bg);
	cfg_bg.animate('top', '0', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing:fabric.util.ease.easeInOutBack
	});
	var cfg_txt = new fabric.Text("Configuration", {
		id: 'configuration_head',
		fontFamily: 'Arial',
		fontSize: 40,
		top: -60,
		left: 100,
		opacity: 1
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '40', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing:fabric.util.ease.easeInOutBack
	});
	var img = $('.interface').find('img[id=text_button]')[0];
	var cfg_txt = new fabric.Image(img, {
		id: 'text_head',
		top: -60,
		left: 130,
		opacity: 0.8,
		originX: 'center'
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '130', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 800,
		easing:fabric.util.ease.easeInOutBack
	});
	var img = $('.interface').find('img[id=sound_button]')[0];
	var cfg_txt = new fabric.Image(img, {
		id: 'sound_head',
		top: -60,
		left: 360,
		opacity: 1,
		originX: 'center'
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '125', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 800,
		easing:fabric.util.ease.easeInOutBack
	});
	setTimeout(function() {
		var topafter = 220;
		for(var i = 0; i < font_list.length; i++) {
			var cfg_txt = new fabric.Text(font_list[i].name, {
				id: 'font',
				fonttype_id: font_list[i].fonttype_id,
				fontFamily: font_list[i].name,
				fontSize: 28,
				top: topafter,
				left: -300,
				opacity: 1,
				fill: '#000000',
				textAlign: 'left'
			});
			if(configuration.fk_fonttype_id == font_list[i].fonttype_id) {
				cfg_txt.set('opacity', 0.5);
			}
			cfg_txt.set('selectable', false);
			canvas.add(cfg_txt);
			cfg_txt.animate('left', '80', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 500,
				easing:fabric.util.ease.easeInOutBack
			});
			topafter+= 45;
		}
	}, 1000);
	setTimeout(function() {
		var cfg_txt = new fabric.Text("Speed", {
			id: 'text_speed_head',
			fontFamily: 'Arial',
			fontSize: 30,
			top: 230,
			left: -80,
			opacity: 1
		});
		cfg_txt.set('selectable', false);
		canvas.add(cfg_txt);
		cfg_txt.animate('left', '400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			easing:fabric.util.ease.easeInOutBack
		});
		var leftafter = 420;
		for(var i = 0; i <= 10; i++) {
			var cfg_txt = new fabric.Text(i.toString(), {
			id: 'text',
			textspeed_id: i,
			fontFamily: 'Arial',
			fontSize: 30,
			top: 300,
			left: -400,
			opacity: 1,
			fill: '#000000',
			textAlign: 'left'
			});
			if(configuration.text_speed == i) {
				cfg_txt.set('opacity', 0.5);
			}
			cfg_txt.set('selectable', false);
			canvas.add(cfg_txt);
			cfg_txt.animate('left', leftafter, {
				onChange: canvas.renderAll.bind(canvas),
				duration: 300,
				easing:fabric.util.ease.easeInOutBack
			});
			leftafter+= 30;
		}
	}, 1500);
	var img = $('#exit_button')[0];
	var ext_btn = new fabric.Image(img, {
		id: 'exit_button',
		top: -600,
		left: 730,
		opacity: 1,
		angle: 0
	});
	ext_btn.set('selectable', false);
	canvas.add(ext_btn);
	ext_btn.animate('top', '10', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing:fabric.util.ease.easeInOutBack
	});
	setTimeout(function() {
		var cfg_txt = new fabric.Text("BGM Volume", {
			id: 'bgm_head',
			fontFamily: 'Arial',
			fontSize: 30,
			top: 230,
			left: 810,
			opacity: 1
		});
		cfg_txt.set('selectable', false);
		canvas.add(cfg_txt);
		var leftafter = 70;
		for(var i = 0; i <= 10; i++) {
			var vol = i / 10;
			var cfg_txt = new fabric.Text(i.toString(), {
			id: 'bgm',
			bgmvolume_id: i,
			fontFamily: 'Arial',
			fontSize: 30,
			top: 280,
			left: 810,
			opacity: 1,
			fill: '#000000',
			textAlign: 'left'
			});
			if(configuration.bgm_volume == vol) {
				cfg_txt.set('opacity', 0.5);
			}
			cfg_txt.set('selectable', false);
			canvas.add(cfg_txt);
			leftafter+= 30;
		} 
		
		var cfg_txt = new fabric.Text("SFX Volume", {
			id: 'sfx_head',
			fontFamily: 'Arial',
			fontSize: 30,
			top: 330,
			left: 810,
			opacity: 1
		});
		cfg_txt.set('selectable', false);
		canvas.add(cfg_txt);
		var leftafter = 70;
		for(var i = 0; i <= 10; i++) {
			var vol = i / 10;
			var cfg_txt = new fabric.Text(i.toString(), {
			id: 'sfx',
			sfxvolume_id: i,
			fontFamily: 'Arial',
			fontSize: 30,
			top: 380,
			left: 810,
			opacity: 1,
			fill: '#000000',
			textAlign: 'left'
			});
			if(configuration.sfx_volume == vol) {
				cfg_txt.set('opacity', 0.5);
			}
			cfg_txt.set('selectable', false);
			canvas.add(cfg_txt);
			
			leftafter+= 30;
		}
		
		var cfg_txt = new fabric.Text("Voice Volume", {
			id: 'voice_head',
			fontFamily: 'Arial',
			fontSize: 30,
			top: 430,
			left: 810,
			opacity: 1
		});
		cfg_txt.set('selectable', false);
		canvas.add(cfg_txt);
		var leftafter = 70;
		for(var i = 0; i <= 10; i++) {
			var vol = i / 10;
			var cfg_txt = new fabric.Text(i.toString(), {
			id: 'voice',
			voicevolume_id: i,
			fontFamily: 'Arial',
			fontSize: 30,
			top: 480,
			left: 810,
			opacity: 1,
			fill: '#000000',
			textAlign: 'left'
			});
			if(configuration.voice_volume == vol) {
				cfg_txt.set('opacity', 0.5);
			}
			cfg_txt.set('selectable', false);
			canvas.add(cfg_txt);
		
			leftafter+= 30;
		}
		
	}, 2000);
	setTimeout(function() {
		if(callback) {
			callback();
		}
	}, 2000);
}
function toTextConfiguration() {
	var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'text_head');
	var cfg = canvas.item(canvas_index);
	cfg.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 100
	});
	canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'sound_head');
	cfg = canvas.item(canvas_index);
	cfg.animate('opacity', '0.8', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 100
	});
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
		});
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
		});
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
		});
	setTimeout(function() {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
		
		for(var i = 0; i < font_list.length; i++) {
			var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
			var cfg = canvas.item(index_to_read);
			cfg.animate('left', '80', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 500,
			});
		}
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
		var cfg = canvas.item(index_to_read);
		cfg.animate('left', '400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			easing:fabric.util.ease.easeInOutBack
		});
		var leftafter = 420;
		for(var i = 0; i <= 10; i++) {
			var canvas_index = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
			var cfg = canvas.item(canvas_index)
			cfg.animate('left', leftafter, {
				onChange: canvas.renderAll.bind(canvas),
				duration: 500,
			});
			leftafter+= 30;
		}
	}, 2000);
}
function toSoundConfiguration() {
	var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'text_head');
	var cfg = canvas.item(canvas_index);
	cfg.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 100
	});
	canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'sound_head');
	cfg = canvas.item(canvas_index);
	cfg.animate('opacity', '0.8', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 100
	});
	for(var i = 0; i < font_list.length; i++) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
		var cfg = canvas.item(canvas_index)
		cfg.animate('left', '-400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
		});
	}
	for(var i = 0; i <= 10; i++) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
		var cfg = canvas.item(canvas_index)
		cfg.animate('left', '-400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
		});
	}
	var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
	var cfg = canvas.item(canvas_index)
	cfg.animate('left', '-100', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 300,
	});
	setTimeout(function() {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
		canvas.item(canvas_index).animate('left', '50', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				var leftafter = 70;
				for(var i = 0; i <= 10; i++) {
					var canvas_index = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
					var cfg = canvas.item(canvas_index)
					cfg.animate('left', leftafter, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 300,
					});
					leftafter+= 30;
				}
			}
		});
		var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
		canvas.item(canvas_index).animate('left', '50', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				var leftafter = 70;
				for(var i = 0; i <= 10; i++) {
					var canvas_index = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
					var cfg = canvas.item(canvas_index)
					cfg.animate('left', leftafter, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 300,
					});
					leftafter+= 30;
				}
			}
		});
		var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
		canvas.item(canvas_index).animate('left', '50', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				var leftafter = 70;
				for(var i = 0; i <= 10; i++) {
					var canvas_index = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
					var cfg = canvas.item(canvas_index)
					cfg.animate('left', leftafter, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 300,
					});
					leftafter+= 30;
				}
			}
		});
	}, 1500);
}
for(var i = 0; i < font_list.length; i++) {
	var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
	canvas.remove(canvas.item(index_to_read));
}
for(i = 0; i <= 10; i++) {
	var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
	canvas.remove(canvas.item(index_to_read));
}
function exitConfigurationScreen() {
	for(var i = 0; i < font_list.length; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			onComplete: function() {
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sound_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
			}
		});
	}
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
			}
		});
	}
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 600,
			onComplete: function() {
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
			}
		});
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 600,
			onComplete: function() {
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
			}
		});
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 900,
			onComplete: function() {
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					onComplete: function() {
						
						index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_head');
						canvas.item(index_to_read).animate('opacity', '0', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 300,
							onComplete: function() {
								index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
								canvas.item(index_to_read).animate('opacity', '0', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 300,
									easing: fabric.util.ease.easeInOutBack,
									onComplete: function() {
										index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
										canvas.item(index_to_read).animate('top', '-600', {
											onChange: canvas.renderAll.bind(canvas),
											duration: 500,
											easing: fabric.util.ease.easeInOutBack,
											onComplete: function() {
												$(text_display).fadeIn(500);
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sound_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
												canvas.remove(canvas.item(index_to_read));
												for(i = 0; i <= 10; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
													canvas.remove(canvas.item(index_to_read));
												}
												for(i = 0; i <= 10; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
													canvas.remove(canvas.item(index_to_read));
												}
												for(i = 0; i <= 10; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
													canvas.remove(canvas.item(index_to_read));
												}
												for(i = 0; i <= 10; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
													canvas.remove(canvas.item(index_to_read));
												}
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
												canvas.remove(canvas.item(index_to_read));
												for(var i = 0; i < font_list.length; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
													canvas.remove(canvas.item(index_to_read));
												}
											}
									}
							}
					}
			}
		});
	}
}
function renderPlayScreen() {
		canvas.clear();
		renderNextLine();
	});
}
function whiteIn(duration, callback) {
	var img = $('#white')[0];
	var wht = new fabric.Image(img, {
		id: 'white',
		top: 0,
		left: 0,
		opacity: 0,
		angle: 0
	});
	wht.set('selectable', false);
	canvas.add(wht);
	wht.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		onComplete: function() {
			if(callback) {
				callback();
			}
		}
	});
}
function whiteOut(duration, callback) {
	var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'white');
	var wht = canvas.item(index_to_read);
	wht.animate('opacity', '0', {
		onChange: canvas.renderAll.bind(canvas),
		duration: duration,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'white');
			canvas.remove(canvas.item(index_to_read));
			if(callback) {
				callback();
			}
		}
	});
}
function blackIn(duration, callback) {
	var img = $('#black')[0];
	var wht = new fabric.Image(img, {
		id: 'black',
		top: 0,
		left: 0,
		opacity: 0,
		angle: 0
	});
	wht.set('selectable', false);
	canvas.add(wht);
	wht.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		onComplete: function() {
			if(callback) {
				callback();
			}
		}
	});
}
function blackOut(duration, callback) {
	var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'black');
	var blk = canvas.item(index_to_read);
	blk.animate('opacity', '0', {
		onChange: canvas.renderAll.bind(canvas),
		duration: duration,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'black');
			canvas.remove(canvas.item(index_to_read));
			if(callback) {
				callback();
			}
		}
	});
}
function compareSpriteIndex(a, b) {
	if(a.position_z < b.position_z) {
		return -1;
	}
	if(a.position_z > b.position_z) {
		return 1;
	}
	return 0;
}
function renderNextLine(callback) {
	context.clearRect (0 ,0 ,text_display.width,text_display.height );
	current.sequence++;
	if(line[current.sequence].fk_linetype_id == 1 || line[current.sequence].fk_linetype_id == 3) {
		if(line[current.sequence].jumpto_line_id) {
			game.screen = "stall";
			if(line[current.sequence].jumpto_line_id && line[current.sequence].jumpto_line_id != line[current.sequence+1].line_id) {
					var index_to_remove = current.sequence + 1;
					line.splice(index_to_remove, current.head - current.sequence);
					current.head = current.sequence;
					var offset_jump = line[current.sequence].look_ahead[0].sequence;
					callSequentialLineData(parseInt(offset_jump)-1, function() {
						processSequentialResource();
						setTimeout(function() {
							game.screen = "play";
						}, 1000);
					});
			}
		}
	}
	if(parseInt(line[current.sequence].fk_linetype_id) === 1) {
		if(current.sequence > 0) {
			var prev_index_to_read = -1; 
			for(var i = current.sequence - 1; i >= 0; i--) {
				if(parseInt(line[i].fk_linetype_id) === 1) {
					prev_index_to_read = i;
					i = -1;
				}
			}
			if(prev_index_to_read > -1) {
				if(line[prev_index_to_read].background_resource_id === line[current.sequence].background_resource_id) {
				}else {
					if(line[current.sequence].background_resource_id > 0) {
						line[current.sequence].background_resource_id;
						var bg_id = line[current.sequence].background_resource_id;
						var img = $('.image-cache').find('img[id='+bg_id+']')[0];
						if(game.screen == "skip") {
							var bg = new fabric.Image(img, {
								line_background_resource_id: bg_id,
								top: 0,
								left: 0,
								opacity: 1
							});
							bg.set('selectable', false);
							canvas.add(bg);
							canvas.sendToBack(bg);
						}else {
							var bg = new fabric.Image(img, {
								line_background_resource_id: bg_id,
								top: 0,
								left: 0,
								opacity: 0
							});
							bg.set('selectable', false);
							canvas.add(bg);
							canvas.sendToBack(bg);
							bg.animate('opacity', '1', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 500,
								onComplete: function() {
								}
							});
						}
					}
					if(line[prev_index_to_read].background_resource_id.length > 0) {
						var canvas_index = getObjectIndex(canvas.getObjects(), 'line_background_resource_id', line[prev_index_to_read].background_resource_id);
						var bg_bottom = canvas.item(canvas_index);
						if(game.screen == "skip") {
							canvas.remove(canvas.item(canvas_index));
						}
						else {
							bg_bottom.animate('opacity', '0', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 500,
								onComplete: function() {
									canvas.remove(canvas.item(canvas_index));
								}
							});
						}
					}
				}
				if(line[current.sequence].sprite.length > 0) {
					if(line[current.sequence].sprite.length > 1) {
						line[current.sequence].sprite.sort(compareSpriteIndex);
					}
					if(game.screen == "skip") {
						if(line[prev_index_to_read].sprite.length > 0) {
							$.each(line[prev_index_to_read].sprite, function(index, value) {
								var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
								canvas.remove(canvas.item(canvas_index));
							});
						}
						if(line[current.sequence].sprite.length > 0) {
							$.each(line[current.sequence].sprite, function(index, value) {
								var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
								var spr = new fabric.Image(img, {
									line_sprite_resource_id: value.sprite_resource_id,
									top: (value.position_y * 100),
									left: (value.position_x * 100),
									opacity: 1
								});
								spr.set('selectable', false);
								canvas.add(spr);
							});
						}
					}
					else {
						var sprite_to_remove = [];
						var i = 0;
						$.each(line[prev_index_to_read].sprite, function(index, value) {
							var same = false;
							$.each(line[current.sequence].sprite, function(j_index, j_value) {
								if(value.sprite_resource_id == j_value.sprite_resource_id) {
									same = true;
								}
							});
							if(same == false) {
								sprite_to_remove.push(line[prev_index_to_read].sprite[i]);
							}
							i++;
						});
						$.each(line[current.sequence].sprite, function(index, value) {
							if(line[prev_index_to_read].sprite.length > 0){
								var sprite_still = false;
								var sprite_move = false;
								var sprite_passed_index = getObjectIndex(line[prev_index_to_read].sprite, 'sprite_resource_id', value.sprite_resource_id);
								if(line[prev_index_to_read].sprite[sprite_passed_index]) {
									if(value.sprite_resource_id == line[prev_index_to_read].sprite[sprite_passed_index].sprite_resource_id && value.position_x == line[prev_index_to_read].sprite[sprite_passed_index].position_x && value.position_y == line[prev_index_to_read].sprite[sprite_passed_index].position_y && value.position_z == line[prev_index_to_read].sprite[sprite_passed_index].position_z) {
										sprite_still = true;
									}
									if(sprite_still == false) {
										if(value.sprite_resource_id == line[prev_index_to_read].sprite[sprite_passed_index].sprite_resource_id) {
											sprite_move = true;
										}
										if(sprite_move == true) {
											var j_index_to_read = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											var spr = canvas.item(j_index_to_read);
											if(value.position_x != line[prev_index_to_read].sprite[sprite_passed_index].position_x) {
												spr.animate('left', (value.position_x * 100), {
													onChange: canvas.renderAll.bind(canvas),
													duration: 500
												});
											}
											if(value.position_y != line[prev_index_to_read].sprite[sprite_passed_index].position_y) {
												spr.animate('top', (value.position_y * 100), {
													onChange: canvas.renderAll.bind(canvas),
													duration: 500
												});
											}
										}
										else
									}
									else {
									}
								}
								else {
									var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
									if(value.fk_effect_id == 1) {
										var spr = new fabric.Image(img, {
											line_sprite_resource_id: value.sprite_resource_id,
											top: (value.position_y * 100),
											left: (value.position_x * 100),
											opacity: 1
										});
										spr.set('selectable', false);
										canvas.add(spr);
									}
									else if(value.fk_effect_id == 4) {
										var spr = new fabric.Image(img, {
											line_sprite_resource_id: value.sprite_resource_id,
											top: (value.position_y * 100),
											left: -1000,
											opacity: 1
										});
										spr.set('selectable', false);
										canvas.add(spr);
										spr.animate('left', (value.position_x * 100), {
											onChange: canvas.renderAll.bind(canvas),
											duration: 1000
										});
									}
									else if(value.fk_effect_id == 6) {
										var spr = new fabric.Image(img, {
											line_sprite_resource_id: value.sprite_resource_id,
											top: (value.position_y * 100),
											left: 1000,
											opacity: 1
										});
										spr.set('selectable', false);
										canvas.add(spr);
										spr.animate('left', (value.position_x * 100), {
											onChange: canvas.renderAll.bind(canvas),
											duration: 1000
										});
									}
									else if(value.fk_effect_id == 8) {
										var spr = new fabric.Image(img, {
											line_sprite_resource_id: value.sprite_resource_id,
											top: -800,
											left: (value.position_x * 100),
											opacity: 1
										});
										spr.set('selectable', false);
										canvas.add(spr);
										spr.animate('top', (value.position_y * 100), {
											onChange: canvas.renderAll.bind(canvas),
											duration: 1000
										});
									}
									else if(value.fk_effect_id == 10) {
										var spr = new fabric.Image(img, {
											line_sprite_resource_id: value.sprite_resource_id,
											top: 800,
											left: (value.position_x * 100),
											opacity: 1
										});
										spr.set('selectable', false);
										canvas.add(spr);
										spr.animate('top', (value.position_y * 100), {
											onChange: canvas.renderAll.bind(canvas),
											duration: 1000
										});
									}
									else {
										var spr = new fabric.Image(img, {
											line_sprite_resource_id: value.sprite_resource_id,
											top: (value.position_y * 100),
											left: (value.position_x * 100),
											opacity: 0
										});
										spr.set('selectable', false);
										canvas.add(spr);
										spr.animate('opacity', '1', {
											onChange: canvas.renderAll.bind(canvas),
											duration: 500
										});
									}
								}
							}
							else {
								var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
								if(value.fk_effect_id == 1) {
									var spr = new fabric.Image(img, {
										line_sprite_resource_id: value.sprite_resource_id,
										top: (value.position_y * 100),
										left: (value.position_x * 100),
										opacity: 1
									});
									spr.set('selectable', false);
									canvas.add(spr);
								}
								else if(value.fk_effect_id == 4) {
									var spr = new fabric.Image(img, {
										line_sprite_resource_id: value.sprite_resource_id,
										top: (value.position_y * 100),
										left: -1000,
										opacity: 1
									});
									spr.set('selectable', false);
									canvas.add(spr);
									spr.animate('left', (value.position_x * 100), {
										onChange: canvas.renderAll.bind(canvas),
										duration: 1000
									});
								}
								else if(value.fk_effect_id == 6) {
									var spr = new fabric.Image(img, {
										line_sprite_resource_id: value.sprite_resource_id,
										top: (value.position_y * 100),
										left: 1000,
										opacity: 1
									});
									spr.set('selectable', false);
									canvas.add(spr);
									spr.animate('left', (value.position_x * 100), {
										onChange: canvas.renderAll.bind(canvas),
										duration: 1000
									});
								}
								else if(value.fk_effect_id == 8) {
									var spr = new fabric.Image(img, {
										line_sprite_resource_id: value.sprite_resource_id,
										top: -800,
										left: (value.position_x * 100),
										opacity: 1
									});
									spr.set('selectable', false);
									canvas.add(spr);
									spr.animate('top', (value.position_y * 100), {
										onChange: canvas.renderAll.bind(canvas),
										duration: 1000
									});
								}
								else if(value.fk_effect_id == 10) {
									var spr = new fabric.Image(img, {
										line_sprite_resource_id: value.sprite_resource_id,
										top: 800,
										left: (value.position_x * 100),
										opacity: 1
									});
									spr.set('selectable', false);
									canvas.add(spr);
									spr.animate('top', (value.position_y * 100), {
										onChange: canvas.renderAll.bind(canvas),
										duration: 1000
									});
								}
								else {
									var spr = new fabric.Image(img, {
										line_sprite_resource_id: value.sprite_resource_id,
										top: (value.position_y * 100),
										left: (value.position_x * 100),
										opacity: 0
									});
									spr.set('selectable', false);
									canvas.add(spr);
									spr.animate('opacity', '1', {
										onChange: canvas.renderAll.bind(canvas),
										duration: 500
									});
								}
							}
						});
						$.each(sprite_to_remove, function(index, value) {
							var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
							var spr = canvas.item(canvas_index);
							if(value.fk_effect_id == 1 || game.screen == "skip") {
								var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
								canvas.remove(canvas.item(canvas_index));
							}
							else if(value.fk_effect_id == 5) {
								spr.animate('left', '-1000', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else if(value.fk_effect_id == 7) {
								spr.animate('left', '1000', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else if(value.fk_effect_id == 9) {
								spr.animate('top', '-800', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else if(value.fk_effect_id == 11) {
								spr.animate('top', '800', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else {
								spr.animate('opacity', '0', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 965,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
						});
					}
					
				}
				else {
					$.each(line[prev_index_to_read].sprite, function(index, value) {
						var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
						var spr = canvas.item(canvas_index);
						if(value.fk_effect_id == 1 || game.screen == "skip") {
							var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
							canvas.remove(canvas.item(canvas_index));
						}
						else if(value.fk_effect_id == 5) {
							spr.animate('left', '-1000', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else if(value.fk_effect_id == 7) {
							spr.animate('left', '1000', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else if(value.fk_effect_id == 8) {
							spr.animate('top', '-800', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else if(value.fk_effect_id == 11) {
							spr.animate('top', '800', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else {
							spr.animate('opacity', '0', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 965,
								onComplete: function() {
									canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
									canvas.remove(canvas.item(canvas_index));
								}
							});
						}
					});
				}
			}
			else {
				if(line[current.sequence].background_resource_id > 0) {
					line[current.sequence].background_resource_id;
					var bg_id = line[current.sequence].background_resource_id;
					var img = $('.image-cache').find('img[id='+bg_id+']')[0];
					if(game.screen == "skip") {
						var bg = new fabric.Image(img, {
							line_background_resource_id: bg_id,
							top: 0,
							left: 0,
							opacity: 1
						});
						bg.set('selectable', false);
						canvas.add(bg);
						canvas.sendToBack(bg);
					}
					else {
						var bg = new fabric.Image(img, {
							line_background_resource_id: bg_id,
							top: 0,
							left: 0,
							opacity: 0
						});
						bg.set('selectable', false);
						canvas.add(bg);
						canvas.sendToBack(bg);
						bg.animate('opacity', '1', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 500,
							onComplete: function() {
							}
						});
					}
				}
				if(line[current.sequence].sprite.length > 0) {
					$.each(line[current.sequence].sprite, function(index, value) {
						var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
						if(value.fk_effect_id == 1) {
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: (value.position_y * 100),
								left: (value.position_x * 100),
								opacity: 1
							});
							spr.set('selectable', false);
							canvas.add(spr);
						}
						else if(value.fk_effect_id == 4) {
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: (value.position_y * 100),
								left: -1000,
								opacity: 1
							});
							spr.set('selectable', false);
							canvas.add(spr);
							spr.animate('left', (value.position_x * 100), {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000
							});
						}
						else if(value.fk_effect_id == 6) {
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: (value.position_y * 100),
								left: 1000,
								opacity: 1
							});
							spr.set('selectable', false);
							canvas.add(spr);
							spr.animate('left', (value.position_x * 100), {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000
							});
						}
						else if(value.fk_effect_id == 8) {
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: -800,
								left: (value.position_x * 100),
								opacity: 1
							});
							spr.set('selectable', false);
							canvas.add(spr);
							spr.animate('top', (value.position_y * 100), {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000
							});
						}
						else if(value.fk_effect_id == 10) {
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: 800,
								left: (value.position_x * 100),
								opacity: 1
							});
							spr.set('selectable', false);
							canvas.add(spr);
							spr.animate('top', (value.position_y * 100), {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000
							});
						}
						else {
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: (value.position_y * 100),
								left: (value.position_x * 100),
								opacity: 0
							});
							spr.set('selectable', false);
							canvas.add(spr);
							spr.animate('opacity', '1', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 500
							});
						}
					});
				}
			}
			for(var i = 1; i <= 10; i++) {
				var interface_index = getObjectIndex(canvas.getObjects(), 'line_interface_id', i);
				canvas.bringToFront(canvas.item(interface_index));
			}
		}
		else {
			if(line[current.sequence].background_resource_id > 0) {
				var bg_id = line[current.sequence].background_resource_id;
				var img = $('.image-cache').find('img[id='+bg_id+']')[0];
				var bg = new fabric.Image(img, {
					line_background_resource_id: bg_id,
					top: 0,
					left: 0,
					opacity: 0
				});
				bg.set('selectable', false);
				canvas.add(bg);
				bg.animate('opacity', '1', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 3000
				});
			}
			if(line[current.sequence].sprite.length > 0) {
				$.each(line[current.sequence].sprite, function(index, value) {
					var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
					var spr = new fabric.Image(img, {
						line_sprite_resource_id: value.sprite_resource_id,
						top: (value.position_y * 100),
						left: (value.position_x * 100),
						opacity: 0
					});
					spr.set('selectable', false);
					canvas.add(spr);
					spr.animate('opacity', '1', {
						onChange: canvas.renderAll.bind(canvas),
						duration: 500
					});
				});
			}
		}
		
		if(game.screen != "skip") {
			var bgm_id = line[current.sequence].bgm_resource_id;
			if(bgm_id.length) {
				var path_to_bgm = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/bgm/' + line[current.sequence].bgm_file_name;
				playBgm(bgm_id);
			}
			else {
				stopBgm();
			}
			var sfx_id = line[current.sequence].sfx_resource_id;
			if(sfx_id.length) {
				var path_to_sfx = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/sfx/' + line[current.sequence].sfx_file_name;
				setTimeout(function() {
					playSfx(sfx_id);
				},100);
			}
			else{
				stopSfx();
			}
			var voice_id = line[current.sequence].voice_resource_id;
			if(voice_id.length) {
				var path_to_voice = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/voice/' + line[current.sequence].voice_file_name;
				stopVoice();
				setTimeout(function() {
					playVoice(voice_id);
				},200);
			}
			else{
					stopVoice();
			}
		}
		context.clearRect (0 ,0 ,text_display.width,text_display.height );
		if(line[current.sequence].content.length > 0) {
			renderLineText(line[current.sequence].content);
		}
		if(current.sequence == 0 || line[current.sequence].fk_linetype_id == 1 || line[current.sequence].fk_linetype_id == 2) {
			renderInGameInterface();
		}
		if(line[current.sequence].speaker.length > 0) {
			renderSpeaker();
		}
	}
	else if(parseInt(line[current.sequence].fk_linetype_id) === 2) {
		if(line[current.sequence].choice.length > 0) {
			game.screen = "choice";
			var top_after = 200;
			if(line[current.sequence].choice.length == 3) {
				top_after = 180;
			}
			else if(line[current.sequence].choice.length == 4) {
				top_after = 160;
			}
			for(var i = 0; i < line[current.sequence].choice.length; i++) {
				var img = $('.interface').find('img[id=in_choice_box]')[0];
				var chc_box = new fabric.Image(img, {
					originX: 'center',
					originY: 'center',
					opacity: 0,
					scaleX: 0.8
				});
				var txt = line[current.sequence].choice[i].content;
				var font_index = getObjectIndex(font_list, 'fonttype_id', configuration.fk_fonttype_id);
				var chc_txt = new fabric.Text(txt, {
					fontSize: 20,
					fontFamily: font_list[font_index].name,
					opacity: 0,
					originX: 'center',
					originY: 'center'
				});
				var chc = new fabric.Group([ chc_box, chc_txt ], {
					line_choice_id: line[current.sequence].choice[i].choice_id,
					top: top_after,
					left: 100
				});
				chc.set('selectable', false);
				canvas.add(chc);
				chc.animate('opacity', '0.9', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 1000
				});
				var option = line[current.sequence].choice.length;
				if(line[current.sequence].choice.length == 2) {
					top_after+= 80;
				}
				else if(line[current.sequence].choice.length == 3) {
					top_after+= 70;
				}
				else if(line[current.sequence].choice.length == 4) {
					top_after+= 60;
				}
			}
		}
	}
	else if(parseInt(line[current.sequence].fk_linetype_id) === 3) {
		if(line[current.sequence].video_resource_id > 0) {
			game.screen = "stall";
			var path_to_video = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/video/' + line[current.sequence].video_file_name;
			$('.video-area').html("");
			$("<video/>").attr("src", path_to_video).attr("id", "video_play").attr("width", 800).attr("height", 600).appendTo('.video-area');
			stopBgm();
			blackIn(2000, function() {
				setTimeout(function() {
					var op = $('#video_play')[0];
					$('.text-area').fadeOut(1000);
					$('.video-area').fadeIn(1000, function() {
						game.screen = "video";
					});
					op.play();
					op.onended = function() {
						$('.video-area').fadeOut(2000);
						setTimeout(function() {
							$('.text-area').fadeIn(1000);
							game.screen = "play";
						}, 1000);
					}
					blackOut(1000, function() {
						
						
					});
				}, 3000);
			});
		}
	}
	else if(parseInt(line[current.sequence].fk_linetype_id) === 4) {
		game.screen = "stall";
		$('.text-area').fadeOut(1000);
		whiteIn(2000, function() {
			context.clearRect (0 ,0 ,text_display.width,text_display.height );
			stopBgm();
			canvas.clear();
			current.sequence = -1;
			current.head = -1;
				line = [];
			callSequentialLineData(0, function() {
				processSequentialResource();
			});
			setTimeout(function() {
				$('.text-area').show();
				renderTitleScreen();
				game.screen = "title";
			}, 5000);
		});
	}
	if(callback) {
		callback();
	}
}
function renderSpeaker() {
	var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'speaker');
	canvas.remove(canvas.item(canvas_index));
	var font_index = getObjectIndex(font_list, 'fonttype_id', configuration.fk_fonttype_id);
	var speaker = new fabric.Text(line[current.sequence].speaker, {
		id: 'speaker',
		fontSize: 22,
		fontFamily: font_list[font_index].name,
		fill: '#000000',
		opacity: 1,
		top: 460,
		left: 230,
		originX: 'center',
		originY: 'bottom'
	});
	speaker.set('selectable', false);
	canvas.add(speaker);
}
function playAuto() {
	var wait = 1000;
	if(game.screen == "auto") {
		if(game.status.text == "idle" && game.status.voice == "idle") {
			renderNextLine();
			maintainCurrent();
			maintainCache();
		}
		setTimeout(function() {
			playAuto();
		}, wait);
	}
}
function playSkip() {
	var wait = 200;
	if(game.screen == "skip") {
		renderNextLine();
		maintainCurrent();
		maintainCache();
		setTimeout(function() {
			playSkip();
		}, wait);
	}
}
function renderLogScreen() {
	var oldest_limit = current.sequence - 50;
	var i;
	if(oldest_limit < 0) {
		i = 0;
	}
	else {
		i = oldest_limit;
	}
	$('.log-area').html("<h2>Backlog</h2>");
	for(i; i < (oldest_limit + 50), i < current.sequence; i++) {
		if(line[i].fk_linetype_id == 1) {
			$("<li/>").text(line[i].content).appendTo('.log-area');
		}
		else {
			oldest_limit++;
		}
	}
	var logdiv = $('.log-area')[0];
	logdiv.scrollTop = logdiv.scrollHeight;
	$('.log-area').slideDown(1000);
}
function exitChoice(callback) {
	$.each(line[current.sequence].choice, function(index, value) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'line_choice_id', value.choice_id);
		var chc = canvas.item(canvas_index);
		chc.animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			onComplete: function() {
				canvas_index = getObjectIndex(canvas.getObjects(), 'line_choice_id', value.choice_id);
				canvas.remove(canvas.item(canvas_index));
				if(callback) {
					callback();
				}
			}
		});
	});
}
function renderInGameInterface(callback) {
		var img = $('.interface').find('img[id=in_text_window]')[0];
		var txt_box = new fabric.Image(img, {
			id: 'text_box',
			line_interface_id: 1,
			top: 420,
			left: 0,
			opacity: 1
		});
		txt_box.set('selectable', false);
		canvas.add(txt_box);
		var img = $('.interface').find('img[id=in_quickload_button]')[0];
		var qld_btn = new fabric.Image(img, {
			id: 'quickload_button',
			line_interface_id: 2,
			top: 435,
			left: 480,
			opacity: 1
		});
		qld_btn.set('selectable', false);
		canvas.add(qld_btn);
		var img = $('.interface').find('img[id=in_quicksave_button]')[0];
		var qsv_btn = new fabric.Image(img, {
			id: 'quicksave_button',
			line_interface_id: 3,
			top: 438,
			left: 545,
			opacity: 1
		});
		qsv_btn.set('selectable', false);
		canvas.add(qsv_btn);
		var img = $('.interface').find('img[id=in_load_button]')[0];
		var ld_btn = new fabric.Image(img, {
			id: 'load_button',
			line_interface_id: 4,
			top: 435,
			left: 615,
			opacity: 1
		});
		ld_btn.set('selectable', false);
		canvas.add(ld_btn);
		var img = $('.interface').find('img[id=in_save_button]')[0];
		var sav_btn = new fabric.Image(img, {
			id: 'save_button',
			line_interface_id: 5,
			top: 438,
			left: 670,
			opacity: 1
		});
		sav_btn.set('selectable', false);
		canvas.add(sav_btn);
		var img = $('.interface').find('img[id=in_log_button]')[0];
		var log_btn = new fabric.Image(img, {
			id: 'log_button',
			line_interface_id: 6,
			top: 435,
			left: 720,
			opacity: 1
		});
		log_btn.set('selectable', false);
		canvas.add(log_btn);
		var img = $('.interface').find('img[id=in_auto_button]')[0];
		var auto_btn = new fabric.Image(img, {
			id: 'auto_button',
			line_interface_id: 7,
			top: 470,
			opacity: 1
		});
		auto_btn.set('selectable', false);
		canvas.add(auto_btn);
		var img = $('.interface').find('img[id=in_skip_button]')[0];
		var skip_btn = new fabric.Image(img, {
			id: 'skip_button',
			line_interface_id: 8,
			top: 468,
			left: 720,
			opacity: 1
		});
		skip_btn.set('selectable', false);
		canvas.add(skip_btn);
		var img = $('.interface').find('img[id=in_repeat_button]')[0];
		var repeat_btn = new fabric.Image(img, {
			id: 'repeat_button',
			line_interface_id: 9,
			top: 530,
			opacity: 1
		});
		repeat_btn.set('selectable', false);
		canvas.add(repeat_btn);
		var img = $('.interface').find('img[id=in_configuration_button]')[0];
		var configuration_btn = new fabric.Image(img, {
			id: 'configuration_button',
			line_interface_id: 10,
			top: 526,
			left: 715,
			opacity: 1
		});
		configuration_btn.set('selectable', false);
		canvas.add(configuration_btn);
	if(callback) {
		callback();
	}
}
function playBgm(res) {
	if(game.bgm != res) {
		var bgmx = $('#'+game.bgm);
		var bgm = bgmx[0];
		if(game.bgm != "") {
			bgmx.animate({volume: 0}, 500, function() {
				bgm.pause();
				bgm.currentTime = 0;
			});
		}
		bgmx_new = $('#'+res);
		bgm_new = bgmx_new[0];
		bgm_new.volume = 0;
		bgmx_new.animate({volume: configuration.bgm_volume}, 500);
		if(typeof bgm_new.loop == 'boolean') {
			bgm_new.loop = true;
		}
		else {
			bgm_new.addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
		}
		bgm_new.play();
		game.bgm = res;
	}
}
function stopBgm() {
	if(game.bgm != "") {
		var bgmx = $('#'+game.bgm);
		var bgm = bgmx[0];
		if(!bgm.paused) {
			bgmx.animate({volume: 0}, 3000, function() {
				bgm.pause();
				bgm.currentTime = 0;
			});
		}
	}
}
function playSfx(res) {
	if(game.sfx != res) {
		var sfxx = $('#'+game.sfx);
		var sfx = sfxx[0];
		if(game.sfx != "") {
			if(!sfx.paused) {
				sfx.pause();
				sfx.currentTime = 0;
			}
		}
		sfx = $('#'+res)[0];
		sfx.play();
		game.sfx = res;
	}
}
function stopSfx() {
	if(game.sfx != "") {
		var sfx = $('#'+game.sfx)[0];
		if(sfx.pused) {
			sfx.pause();
			sfx.currentTime = 0;
		}
	}
}
function playVoice(res) {
	if(game.status.voice == "idle") {
		if(res) {
			var voice = $('#'+res)[0];
			game.voice = res;
		}
		else {
			var voice = $('#'+game.voice)[0];
		}
		voice.volume = configuration.voice_volume;
		voice.loop = false;
		game.status.voice = "busy";
		voice.play();
		voice.onended = function() {
			game.status.voice = "idle";
		}
	}
}
function stopVoice() {
	if(game.voice != "") {
		var voice = $('#'+game.voice)[0];
		if(!voice.paused) {
			voice.pause();
			voice.currentTime = 0;
			game.status.voice = "idle";
		}
	}
}
function renderLineText(line_content) {
	var font_index = getObjectIndex(font_list, 'fonttype_id', configuration.fk_fonttype_id);
	context.font = '21px '+font_list[font_index].name;
	var interval_speed = (parseInt(configuration.text_speed) * 5);
	var cursor_x = 100;
	var cursor_y = 490;
	var line_break = cursor_x;
	var line_height = 31;
	var right_padding = 100;
	var line_height = line_height || 32;
	right_padding = right_padding || 10;
	var i = 0;
	if(game.screen == "skip" || interval_speed == 0) {
		var index = 0;
		for(var i = 0; i <= line_content.length; i++) {
			var rem = line_content.substr(i);
			var space = rem.indexOf(' ');
			if(space == -1) {
				space = line_content.length;
			}
			else {
				space = space;
			}
			var word_width = context.measureText(rem.substring(0, space)).width;
			var w = context.measureText(line_content.charAt(i)).width;
			if(cursor_x + word_width >= text_display.width - right_padding) {
				cursor_x = line_break;
				cursor_y += line_height;
			}
			context.fillText(line_content.charAt(i), cursor_x, cursor_y);
			cursor_x += w;
		}
	}
	else {
		game.status.text = "busy";
		var inter = setInterval(function() {
			var rem = line_content.substr(i);
			var space = rem.indexOf(' ');
			if(space == -1) {
				space = line_content.length;
			}
			else {
				space = space;
			}
			var word_width = context.measureText(rem.substring(0, space)).width;
			var w = context.measureText(line_content.charAt(i)).width;
			if(cursor_x + word_width >= text_display.width - right_padding) {
				cursor_x = line_break;
				cursor_y += line_height;
			}
			context.fillText(line_content.charAt(i), cursor_x, cursor_y);
			i++;
			cursor_x += w;
			if(i === line_content.length) {
				clearInterval(inter);
				game.status.text = "idle";
			}
		}, interval_speed);
	}
}