'use strict';

var configuration = [];
var line = [];
// differ from editor, head here means the latest while tail is the oldest
var current = {
	sequence: 0,
	head: 0,
	tail: 0,
	branch: 0,
	limit: 60
};
var cache = {
	head: 0,
	tail: 0,
	limit: 20
};
var game = {
	screen: "title", // title/play/configuration/save/load/backlog/choice
	mode: "normal", // normal, skip, auto
	bgm: ""
}
var font_list = [];

// canvas renderer
// var visual_display = document.getElementsByTagName('canvas')[0];
var visual_display = $('#visual')[0];
// define weifth and height
visual_display.width = 800;
visual_display.height = 600;
visual_display.style.width  = '800px';
visual_display.style.height = '600px';

// second canvas
var text_display = $('#text')[0];
text_display.width = 800;
text_display.height = 600;
text_display.style.width  = '800px';
text_display.style.height = '600px';
var context = text_display.getContext('2d');

var canvas = new fabric.Canvas('visual');
canvas.selection = false;
canvas.backgroundColor = 'rgba(255, 255, 255,1)';



// load configuration
$(document).ready(function() {
	preloadInterface(function() {
		callConfigurationData(function() {
			callSequentialLineData(function() {
				processSequentialResource();
				setTimeout(function() {
					initializeGame();
				}, 100); // DEFAULT 6000
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
			console.log("error");
		}
		callback();
	});
}

function callSequentialLineData(callback) {
	// current.head + current.limit would result line with total number of limit cached ahead
	var process_limit = current.head + current.limit;
	var req = $.ajax({
		url: config.base +'index.php/game/loadLine',
		type: "POST",
		data: {
			head: current.head,
			limit: process_limit
		},
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg.length) {
			// append all line data to line object
			if(current.tail == 0) {
				current.tail = parseInt(msg[0].sequence);
				// same with current tail for resource maintain, keep cache at 0 would lead to error because no 0 sequenced line
				cache.tail = current.tail;
			}
			$.each(msg, function(index, value) {
				line.push(msg[index]);
				if(parseInt(value.sequence) < current.tail) {
					current.tail = parseInt(value.sequence);
				}
			})
			// increase head the same number as retrieved lines
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
	// delete n number of old line cache if reach limit
	if(current.head - current.tail > current.limit) {
		// remove all lines behind after 3 latest current sequence // ((current.sequence - 3) - current.tail) -> number of deleted lines
		for(current.tail; current.tail < current.sequence - 15; current.tail++) {
			var index_to_read = getObjectIndex(line, 'sequence', current.tail);
			line.splice(index_to_read, 1);
		}
		console.log("one remove of current");
	}
	// request moew lines to cache when lines ahead less than n number
	if(current.head - current.sequence < 20) {
		callSequentialLineData();
	}
	if(callback) {
		callback();
	}
}
function maintainCache(callback) {
	// delete old cache
	if(cache.head - cache.tail > cache.limit) {
		for(cache.tail; cache.tail < current.sequence - 5; cache.tail++) {
			var index_to_read = getObjectIndex(line, 'sequence', cache.tail);
			if(line[index_to_read].fk_linetype_id == 1) {
				if(line[index_to_read].bgm_resource_id) {
					$('.audio-cache').find('audio[id='+line[index_to_read].bgm_resource_id+']').remove();
				}
				if(line[index_to_read].sfx_resource_id) {
					$('.audio-cache').find('audio[id='+line[index_to_read].sfx_resource_id+']').remove();
				}
				if(line[index_to_read].voice_resource_id) {
					$('.audio-cache').find('audio[id='+line[index_to_read].voice_resource_id+']').remove();
				}
				if(line[index_to_read].background_resource_id) {
					$('.image-cache').find('img[id='+line[index_to_read].background_resource_id+']').remove();
				}
				if(line[index_to_read].sprite) {
					if(line[index_to_read].sprite.length) {
						$.each(line[index_to_read].sprite, function(index, value) {
							$('.image-cache').find('img[id='+value.sprite_resource_id+']').remove();
						});
					}
				}
			}
			console.log("REMOVED");
		}
	}
	// request new cache
	if(cache.head - current.sequence < 10) {
		processSequentialResource();
	}
	if(callback) {
		callback();
	}
}

// function processSequentialResource() {
// 	var process_limit = cache.head + 5;
// 	for(var i = cache.head; i < process_limit; i++) {
// 		cache.head += 1;
// 		var index_to_read = getObjectIndex(line, 'sequence', cache.head);
// 		if(line[index_to_read].fk_linetype_id == 1) {
// 			if(line[index_to_read].background_resource_id) {
// 				var path_to_background_image = "resources/" + configuration.creator_id + "/" + configuration.game_id + "/background/" + line[index_to_read].background_file_name;
// 				preloadImage(path_to_background_image, function() {
// 					console.log("OKOK");
// 				})
// 			}
// 		}
// 	}
// }

function processSequentialResource() {
	if(cache.head < current.sequence + cache.limit) {
		// console.log(cache.head);
		cache.head++;
		var index_to_read = getObjectIndex(line, 'sequence', cache.head);
		if(line[index_to_read]) {
			// for text line
			if(line[index_to_read].fk_linetype_id == 1) {
				var status = true;
				// if background exist
				if(line[index_to_read].background_resource_id) {
					var path_to_background = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/background/" + line[index_to_read].background_file_name;
					var resource_id = line[index_to_read].background_resource_id;
					preloadImage(path_to_background, resource_id, function(returndata) {
						if(!returndata) {
							status = false;
						}
					});
				}
				if(line[index_to_read].sprite.length) {
					var sprite_to_preload = [];
					$.each(line[index_to_read].sprite, function(index, value) {
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
				setTimeout(function() {
					// if bgm exist
					if(line[index_to_read].bgm_resource_id) {
						var path_to_bgm = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/bgm/" + line[index_to_read].bgm_file_name;
						var resource_id = line[index_to_read].bgm_resource_id;
						preloadAudio(path_to_bgm, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					// if voice exist
					if(line[index_to_read].voice_resource_id) {
						var path_to_voice = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/voice/" + line[index_to_read].voice_file_name;
						var resource_id = line[index_to_read].voice_resource_id;
						preloadAudio(path_to_voice, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					// if sfx exist
					if(line[index_to_read].sfx_resource_id) {
						var path_to_sfx = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/sfx/" + line[index_to_read].sfx_file_name;
						// console.log(path_to_sfx);
						var resource_id = line[index_to_read].sfx_resource_id;
						preloadAudio(path_to_sfx, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					
				if(status == true) {
					processSequentialResource();
				}
				}, 1000);
			}
			else if(line[index_to_read].fk_linetype_id == 2) {
				processSequentialResource();
			}
			else {
				processSequentialResource();
			}
		}
	}
}

function preloadImage(source, resource_id, callback) {
	// console.log(source);
	// check if cache exist
	var is_exist = $('.image-cache').has('img[id='+resource_id+']').length;
	if(is_exist) {
		callback(true);
	}
	else {
		$("<img/>").attr("src", source).attr("id", resource_id).css("display", "none").appendTo('.image-cache');
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
				$('img[id='+value.resource_id+']').on('load', function() {
					if(index == sourcearray.length) {
						callback(true);
					}
				});
			}
		}, index * 3000);
		
	});
}

function preloadAudio(source, resource_id, callback){
	var is_exist = $('.audio-cache').has('audio[id='+resource_id+']').length;
	if(is_exist) {
		// console.log("already cached");
		callback(true);
	}
	else {
		$("<audio/>").attr("src", source).attr("id", resource_id).css("display", "none").appendTo('.audio-cache');
		$('audio[id='+resource_id+']').on('canplaythrough', function() {
			// console.log("cached");
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
		exit_button: "arc_001273.png",
		white: "white.jpg"

	};
	$.each(ui, function(index, value) {
		var path_to_ui = '../../../assets/sys/' + value;
		$("<img/>").attr("src", path_to_ui).attr("id", index).css("display", "none").appendTo('.interface');
	});
	callback();
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
	$('.request-loading').fadeOut(200, function() {
		$('.game-area').fadeIn(100, function() { // DEFAULT 1500
			renderTitleScreen();
		});
	});
}


//canvas.hoverCursor = 'default';
//cnv.setBackgroundImage('http://localhost/cast/resources/a.jpg', function() { cnv.renderAll(); });
//canvas.onFpsUpdate = function(){ /* ... */ };
/*
//basic reference
var rect = new fabric.Rect({
	left: 100,
	top: 100,
	fill: 'red',
	width: 20,
	height: 20,
	angle: -60
});
canvas.add(rect);
rect.set('selectable', false);

rect.set({ fill: 'blue' });
canvas.backgroundColor = 'rgb(200,100,200)';



canvas.renderAll();

fabric.Image.fromURL('../resources/ap.jpg', function(oimg) {
	oimg.scale(0.5).setFlipX(true);
	//cnv.add(oimg);
});
*/

//rect.animate('angle', '+=500', { onChange: canvas.renderAll.bind(canvas) });

function renderTitleScreen() {
	// [0] for dom object instead of jquery object
	var img = $('#title_background')[0];
	// set image
	var ttl_bg = new fabric.Image(img, {
		id: 'title_background',
		top: 0,
		left: 0,
		opacity: 0,
		angle: 0,
		scaleX: 1
	});
	// disable object selection
	ttl_bg.set('selectable', false);
	// render to canvas
	canvas.add(ttl_bg);
	// animate image
	ttl_bg.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 100, //DEFAULT 2000
		easing: fabric.util.ease.easeInOutQuad,
		onComplete: function() {
			renderTitleMenu()
		}
	});
	// start button
	
}

function renderTitleMenu() {
	// render start button
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
	// render load button
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
	// render configuration button
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

canvas.on('mouse:down', function(options) {
	// console.log(options.e);
	if(game.screen === "title") {
		switch(options.target.id) {
			case "start_button":
				renderPlayScreen();
				game.screen = "play";
				break;
			case "load_button":
				renderLoadScreen();
				game.screen = "load";
				// canvas.remove(str_btn);
				// canvas.clear();
				break;
			case "configuration_button":
				renderConfigurationScreen();
				game.screen = "configuration";
				break;
			default:
				// var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'title_background');
				// var bg = canvas.item(index_to_read);
				// bg.animate('left', '+=20', {
				// 	onChange: canvas.renderAll.bind(canvas),
				// 	duration: 1000
				// });
				break;
		}
	}
	else if(game.screen === "load") {
		switch(options.target.id) {
			case "sav_1":
				if(options.target.gamedata != "nodata") {
					//
				}
				break;
			case "exit_button":
				exitLoadScreen();
				game.screen = "title";
				break;
			default:
				break;
		}
	}
	else if((game.screen === "configuration") || (game.screen === "in_game_configuration")) {
		switch(options.target.id) {
			case "font":
				// prepare index
				var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', configuration.fk_fonttype_id);
				// replace selection before
				var topafter = 180;
				for(var i = 0; i < font_list.length; i++) {
					if(font_list[i].fonttype_id == configuration.fk_fonttype_id) {
						var cfg_txt = new fabric.Text(font_list[i].name, {
							id: 'font',
							fonttype_id: font_list[i].fonttype_id,
							fontFamily: font_list[i].name,
							fontSize: 20,
							top: topafter,
							left: 80,
							opacity: 1,
							fill: '#000000',
							textAlign: 'left'
						});
						cfg_txt.set('selectable', false);
						canvas.add(cfg_txt);
					}
					topafter+= 30;
				}
				// remove text behind
				canvas.remove(canvas.item(index_to_read));
				// prepare index before insert a new one with same id
				var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', options.target.fonttype_id);
				// replace selected font
				var topafter = 180;
				for(var i = 0; i < font_list.length; i++) {
					if(font_list[i].fonttype_id == options.target.fonttype_id) {
						var cfg_txt = new fabric.Text(font_list[i].name, {
							id: 'font',
							fonttype_id: options.target.fonttype_id,
							fontFamily: font_list[i].name,
							fontSize: 20,
							top: topafter,
							left: 80,
							opacity: 1,
							fill: '#FEFFB7',
							textAlign: 'left'
						});
						cfg_txt.set('selectable', false);
						canvas.add(cfg_txt);
					}
					topafter+= 30;
				}
				// delete selected font behind
				canvas.remove(canvas.item(index_to_read));
				// change global configuration value
				configuration.fk_fonttype_id = options.target.fonttype_id;
				break;
			case "bgm":
				// replace old selection
				var vol_round = configuration.bgm_volume * 10;
				// console.log(vol_round);
				// prepare index
				var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', vol_round);
				var leftafter = 410 + (30 * vol_round);
				var cfg_txt = new fabric.Text(vol_round.toString(), {
					id: 'bgm',
					bgmvolume_id: vol_round,
					fontFamily: 'Arial',
					fontSize: 25,
					top: 180,
					left: leftafter,
					opacity: 1,
					fill: '#000000',
					textAlign: 'left'
				});
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				canvas.remove(canvas.item(index_to_read));
				// prepare index
				var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', options.target.bgmvolume_id);
				var leftafter = 410 + (30 * options.target.bgmvolume_id);
				var cfg_txt = new fabric.Text(options.target.bgmvolume_id.toString(), {
					id: 'bgm',
					bgmvolume_id: options.target.bgmvolume_id,
					fontFamily: 'Arial',
					fontSize: 25,
					top: 180,
					left: leftafter,
					opacity: 1,
					fill: '#FEFFB7',
					textAlign: 'left'
				});
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				canvas.remove(canvas.item(index_to_read));
				var vol_decimal = options.target.bgmvolume_id / 10;
				configuration.bgm_volume = vol_decimal;
				break;
			case "sfx":
				var vol_round = configuration.sfx_volume * 10;
				var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', vol_round);
				console.log(index_to_read);
				var leftafter = 410 + (30 * vol_round);
				var cfg_txt = new fabric.Text(vol_round.toString(), {
					id: 'sfx',
					sfxvolume_id: vol_round,
					fontFamily: 'Arial',
					fontSize: 25,
					top: 280,
					left: leftafter,
					opacity: 1,
					fill: '#000000',
					textAlign: 'left'
				});
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				canvas.remove(canvas.item(index_to_read));
				var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', options.target.sfxvolume_id);
				var leftafter = 410 + (30 * options.target.sfxvolume_id);
				var cfg_txt = new fabric.Text(options.target.sfxvolume_id.toString(), {
					id: 'sfx',
					sfxvolume_id: options.target.sfxvolume_id,
					fontFamily: 'Arial',
					fontSize: 25,
					top: 280,
					left: leftafter,
					opacity: 1,
					fill: '#FEFFB7',
					textAlign: 'left'
				});
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				canvas.remove(canvas.item(index_to_read));
				var vol_decimal = options.target.sfxvolume_id / 10;
				configuration.sfx_volume = vol_decimal;
				break;
			case "voice":
				var vol_round = configuration.voice_volume * 10;
				var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', vol_round);
				// console.log(index_to_read);
				var leftafter = 410 + (30 * vol_round);
				var cfg_txt = new fabric.Text(vol_round.toString(), {
					id: 'voice',
					voicevolume_id: vol_round,
					fontFamily: 'Arial',
					fontSize: 25,
					top: 380,
					left: leftafter,
					opacity: 1,
					fill: '#000000',
					textAlign: 'left'
				});
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				canvas.remove(canvas.item(index_to_read));
				var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', options.target.voicevolume_id);
				var leftafter = 410 + (30 * options.target.voicevolume_id);
				var cfg_txt = new fabric.Text(options.target.voicevolume_id.toString(), {
					id: 'voice',
					voicevolume_id: options.target.voicevolume_id,
					fontFamily: 'Arial',
					fontSize: 25,
					top: 380,
					left: leftafter,
					opacity: 1,
					fill: '#FEFFB7',
					textAlign: 'left'
				});
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				canvas.remove(canvas.item(index_to_read));
				var vol_decimal = options.target.voicevolume_id / 10;
				configuration.voice_volume = vol_decimal;
				break;
			case "exit_button":
				exitConfigurationScreen();
				callSaveConfiguration();
				if(game.screen === "configuration") {
					game.screen = "title";
				}
				else if(game.screen === "in_game_configuration") {
					// $(text_display).delay(3000).fadeIn(500);
					game.screen = "play";
				}
				break;
			default:
				break;
		}
	}
	else if(game.screen == "play") {
		switch(options.target.id) {
			case "quickload_button":
				break;
			case "quicksave_button":
				break;
			case "load_button":
				break;
			case "save_button":
				break;
			case "auto_button":
				$(text_display).fadeOut(1000);
				break;
			case "skip_button":
				break;
			case "repeat_button":
				$(text_display).fadeIn(1000);
				break;
			case "configuration_button":
				renderConfigurationScreen();
				$(text_display).fadeOut(1000);
				game.screen = "in_game_configuration";
				break;
			case "log_button":
				break;
			default:
				renderNextLine();
				maintainCurrent();
				maintainCache();
				break;
		}
	}
	else if(game.screen == "save") {

	}
	else if(game.screen = "choice") {
		if(options.target.line_choice_id) {
			var choice_id_select = options.target.line_choice_id;
			var index_to_read = getObjectIndex(line, 'sequence', current.sequence);
			var choice_index_to_read = getObjectIndex(line[index_to_read].choice, 'choice_id', choice_id_select);
			if(line[index_to_read].choice[choice_index_to_read].jumpto_line_id && line[index_to_read].choice[choice_index_to_read].jumpto_line_id != current.sequence+1) {
					// jump_to = parseInt(line[index_to_read].choice[choice_index_to_read].jumpto_line_id);
					// shiftCurrent(jump_to);
					shiftCurrent(choice_index_to_read);
			}
			else {
				exitChoice(function() {
					renderNextLine(function() {
						game.screen = "play";
					});
				});
			}
		}
	}
	// console.log(options.e.layerX, options.e.layerY);
});

	// var ldi = getObjectIndex(canvas.getObjects(), 'id', 'start_button');
	// console.log(ldi);
	// canvas.remove(canvas.getObjects()[ldi]);

// canvas.on('mouse:move', function(options) {
// 	console.log(options.e.layerX, options.e.layerY);
// });

function shiftCurrent(choice_index, callback) {
	// get index of next line
	var index_to_write = getObjectIndex(line, 'sequence', current.sequence + 1);
	// get index of current line
	var index_to_write = getObjectIndex(line, 'sequence', current.sequence);
	// remove all line cache ahead and fill with look_ahead in choice 
	line.splice(index_to_write, current.head - current.sequence, line[index_to_read].choice[choice_index_to_read].look_ahead);
	// change current line to jump seq - 1?
	
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
function renderLoadScreen() {
	// render background
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
	// render text
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
	// ajax load data
	// if done
	
	var img_nodata = $('#save_data_box_nodata')[0];
	// var img_data = "<<<";
	// var data_details = "array of data details here";
	// render quickload slot
	var qld_dat = new fabric.Image(img_nodata, {
		id: 'quickload_slot',
		qsve_slot_id: (i+1),
		top: -200,
		left: 350,
		opacity: 0.8,
		angle: 0
	});
	qld_dat.set('selectable', false);
	canvas.add(qld_dat);
	qld_dat.animate('top', 30, {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing:fabric.util.ease.easeInOutBack
	});
	// render save data group
	var top_after = 130;
	for(var i = 0; i < 5; i++) {
		var ld_dat = new fabric.Image(img_nodata, {
			id: 'load_slot',
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
	// render exit button
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
}
// exit and remove object of load screen
function exitLoadScreen() {
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
	index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'quickload_slot');
	canvas.item(index_to_read).animate('top', '-600', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutBack,
		onComplete: function() {
			index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'quickload_slot');
			canvas.remove(canvas.item(index_to_read));
		}
	});
}

function renderConfigurationScreen() {
	// render background
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
	// render head text
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
	//render font head
	var cfg_txt = new fabric.Text("Font", {
		id: 'font_head',
		fontFamily: 'Arial',
		fontSize: 30,
		top: -60,
		left: 60,
		opacity: 1
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '130', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 800,
		easing:fabric.util.ease.easeInOutBack,
		onComplete: function() {
			// render font  config
			var topafter = 180;
			for(var i = 0; i < font_list.length; i++) {
				var cfg_txt = new fabric.Text(font_list[i].name, {
					id: 'font',
					fonttype_id: font_list[i].fonttype_id,
					fontFamily: font_list[i].name,
					fontSize: 20,
					top: topafter,
					left: -300,
					opacity: 1,
					fill: '#000000',
					textAlign: 'left'
				});
				if(configuration.fk_fonttype_id == font_list[i].fonttype_id) {
					cfg_txt.set('fill', '#FEFFB7');
				}
				cfg_txt.set('selectable', false);
				canvas.add(cfg_txt);
				cfg_txt.animate('left', '80', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					easing:fabric.util.ease.easeInOutBack
				});
				topafter+= 30;
			}
		}
	});
	
	// render bgm head
	var cfg_txt = new fabric.Text("BGM Volume", {
		id: 'bgm_head',
		fontFamily: 'Arial',
		fontSize: 30,
		top: -60,
		left: 420,
		opacity: 1
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '130', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1400,
		easing:fabric.util.ease.easeInOutBack,
		onComplete: function() {
			// render bgm volume config 
			var leftafter = 410;
			for(var i = 0; i <= 10; i++) {
				var vol = i / 10;
				var cfg_txt = new fabric.Text(i.toString(), {
				id: 'bgm',
				bgmvolume_id: i,
				fontFamily: 'Arial',
				fontSize: 25,
				top: 180,
				left: 810,
				opacity: 1,
				fill: '#000000',
				textAlign: 'left'
				});
				if(configuration.bgm_volume == vol) {
					cfg_txt.set('fill', '#FEFFB7');
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
		}
	});

	// render sfx head
	var cfg_txt = new fabric.Text("SFX Volume", {
		id: 'sfx_head',
		fontFamily: 'Arial',
		fontSize: 30,
		top: -60,
		left: 420,
		opacity: 1
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '230', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1700,
		easing:fabric.util.ease.easeInOutBack,
		onComplete: function() {
			// render sfx vol config
			var leftafter = 410;
			for(var i = 0; i <= 10; i++) {
				var vol = i / 10;
				var cfg_txt = new fabric.Text(i.toString(), {
				id: 'sfx',
				sfxvolume_id: i,
				fontFamily: 'Arial',
				fontSize: 25,
				top: 280,
				left: 810,
				opacity: 1,
				fill: '#000000',
				textAlign: 'left'
				});
				if(configuration.sfx_volume == vol) {
					cfg_txt.set('fill', '#FEFFB7');
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
		}
	});

	// render voice head
	var cfg_txt = new fabric.Text("Voice Volume", {
		id: 'voice_head',
		fontFamily: 'Arial',
		fontSize: 30,
		top: -60,
		left: 420,
		opacity: 1
	});
	cfg_txt.set('selectable', false);
	canvas.add(cfg_txt);
	cfg_txt.animate('top', '330', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 2000,
		easing:fabric.util.ease.easeInOutBack,
		onComplete: function() {
			// render voice vol config
			var leftafter = 410;
			for(var i = 0; i <= 10; i++) {
				var vol = i / 10;
				var cfg_txt = new fabric.Text(i.toString(), {
				id: 'voice',
				voicevolume_id: i,
				fontFamily: 'Arial',
				fontSize: 25,
				top: 380,
				left: 810,
				opacity: 1,
				fill: '#000000',
				textAlign: 'left'
				});
				if(configuration.voice_volume == vol) {
					cfg_txt.set('fill', '#FEFFB7');
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
		}
	});

	// render exit button
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
	// remove font list
	for(var i = 0; i < font_list.length; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
		canvas.item(index_to_read).animate('left', '-600', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {
				// remove font config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'font_head');
				canvas.item(index_to_read).animate('top', '-300', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					easing: fabric.util.ease.easeInOutBack,
					onComplete: function() {

						
						
					}
				}); // remove font config
				
			}
		});
	}
	// remove font list end

	// remove voice vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {
				// remove voice config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
				canvas.item(index_to_read).animate('top', '-60', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					easing: fabric.util.ease.easeInOutBack,
					onComplete: function() {
						
						
						
					}
				}); // remove voice vconfig
				
			}
		});
	}
	// remove voice vol end
	// remove sfx vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 600,
			easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {

				// remove sfx config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
				canvas.item(index_to_read).animate('top', '-60', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					easing: fabric.util.ease.easeInOutBack,
					onComplete: function() {
						
						
						
					}

				}); // remove sfx end
				
				
			}
		});
	} // remove sfx vol end
	// remove bgm vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 900,
			easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {
				// remove bgm config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
				canvas.item(index_to_read).animate('top', '-60', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					easing: fabric.util.ease.easeInOutBack,
					onComplete: function() {
						
						// remove config head
						index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_head');
						canvas.item(index_to_read).animate('top', '-60', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 300,
							easing: fabric.util.ease.easeInOutBack,
							onComplete: function() {
								// remove exit btn
								index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
								canvas.item(index_to_read).animate('top', '-200', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 300,
									easing: fabric.util.ease.easeInOutBack,
									onComplete: function() {
										// remove config background
										index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_background');
										canvas.item(index_to_read).animate('top', '-600', {
											onChange: canvas.renderAll.bind(canvas),
											duration: 500,
											easing: fabric.util.ease.easeInOutBack,
											onComplete: function() {
												$(text_display).fadeIn(500);
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'font_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
												canvas.remove(canvas.item(index_to_read));
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
												canvas.remove(canvas.item(index_to_read));
												for(i = 0; i <= 10; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
													canvas.remove(canvas.item(index_to_read));
												}
												for(i = 0; i <= 10; i++) {
													var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
													canvas.remove(canvas.item(index_to_read));
												}
												index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
												canvas.remove(canvas.item(index_to_read));
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
										}); // remove config bg end
										
									}
								}); //remove exit button end
								
							}
						}); // remove config head end
						

					}
				}); // remove bgm config
			}
		});
	}
	// remove bgm vol
	
	
}

function renderPlayScreen() {
	// var img = $('#white')[0];
	// var wht_out = new fabric.Image(img, {
	// 	id: 'white',
	// 	top: 0,
	// 	left: 0,
	// 	opacity: 0,
	// 	angle: 0
	// });
	// wht_out.set('selectable', false);
	// canvas.add(wht_out);
	// wht_out.animate('opacity', '1', {
	// 	onChange: canvas.renderAll.bind(canvas),
	// 	duration: 1000, //5000
	// 	onComplete: function() {
	// 		// canvas.clear();
	// 		renderNextLine();
	// 	}
	// });
	whiteIn(100, function() { //DEFAULT 500
		canvas.clear();
		renderNextLine();
	})
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
		duration: duration, //5000
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

// for sorting
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
	//if before same or something whatever
	current.sequence++;
	var index_to_read = getObjectIndex(line, 'sequence', current.sequence);
	if(line[index_to_read].fk_linetype_id == 1) {
		if(current.sequence > current.tail) {
			// prepare latest index in line which is text type
			var prev_index_to_read = ""; 
			for(var i = current.sequence - 1; i >= current.tail; i--) {
				var j = getObjectIndex(line, 'sequence', i);
				if(line[j].fk_linetype_id == 1) {
					prev_index_to_read = j;
					// stop iteration
					i = -1;
				}
			}
			// var prev_index_to_read = getObjectIndex(line, 'sequence', (current.sequence-1));
			// if(line[prev_index_to_read].fk_linetype_id == 1) {
				if(line[prev_index_to_read].background_resource_id != line[index_to_read].background_resource_id) {
					console.log("different background");
					if(line[index_to_read].background_resource_id) {
						// transiate
						// whiteIn(500, function() {
						// 	whiteOut(500);
						// });
						// render background
						var bg_id = line[index_to_read].background_resource_id;
						var img = $('.image-cache').find('img[id='+bg_id+']')[0];
						var bg = new fabric.Image(img, {
							line_background_resource_id: bg_id,
							top: 0,
							left: 0,
							opacity: 1
						});
						bg.set('selectable', false);
						canvas.add(bg);
						canvas.sendToBack(bg);
						bg.animate('opacity', '1', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 500
						});
					}
					if(line[prev_index_to_read].background_resource_id) {
						var canvas_index = getObjectIndex(canvas.getObjects(), 'line_background_resource_id', line[prev_index_to_read].background_resource_id);
						console.log(canvas_index);
						bg = canvas.item(canvas_index);
						bg.animate('opacity', '0', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 500,
							onComplete: function() {
								canvas_index = getObjectIndex(canvas.getObjects(), 'line_background_resource_id', line[prev_index_to_read].background_resource_id);
								canvas.remove(canvas.item(canvas_index));
							}
						});
					}
					
				}
				
				// render sprites
				if(line[index_to_read].sprite.length > 0) {
					// sort sprite according z-index
					if(line[index_to_read].sprite.length > 1) {
						line[index_to_read].sprite.sort(compareSpriteIndex);
					}
					// get sprite list not passed from prev seq
					var sprite_to_remove = line[prev_index_to_read].sprite.filter(function(list) {
						return line[index_to_read].sprite.indexOf(list) === -1;
					});
					// prepare empty new var
					var sprite_to_remove = [];
					// iterate and add to new var if not found same
					var i = 0
					$.each(line[prev_index_to_read].sprite, function(index, value) {
						var same = false;
						$.each(line[index_to_read].sprite, function(j_index, j_value) {
							if(value.sprite_resource_id == j_value.sprite_resource_id) {
								same = true;
							}
						})
						if(same == false) {
							sprite_to_remove.push(line[prev_index_to_read].sprite[i]);
						}
						i++;
					})
					$.each(line[index_to_read].sprite, function(index, value) {
						// if prev text line has sprite
						if(line[prev_index_to_read].sprite.length > 0){
							var sprite_still = false;
							var sprite_move = false;
							var sprite_passed_index = getObjectIndex(line[prev_index_to_read].sprite, 'sprite_resource_id', value.sprite_resource_id);
							// if sprite is one from previous line
							// console.log(line[prev_index_to_read].sprite[sprite_passed_index]);
							if(line[prev_index_to_read].sprite[sprite_passed_index]) {
								// chack for same sprite and same position
								/*$.each(line[prev_index_to_read].sprite, function(j_index, j_value) {
									if(value.sprite_resource_id == j_value.sprite_resource_id && value.position_x == j_value.position_x && value.position_y == j_value.position_y && value.position_z == j_value.position_z) {
										sprite_still = j_index;
									}
								});*/
								if(value.sprite_resource_id == line[prev_index_to_read].sprite[sprite_passed_index].sprite_resource_id && value.position_x == line[prev_index_to_read].sprite[sprite_passed_index].position_x && value.position_y == line[prev_index_to_read].sprite[sprite_passed_index].position_y && value.position_z == line[prev_index_to_read].sprite[sprite_passed_index].position_z) {
									sprite_still = true;
									console.log("sprite exact same")
								}
								if(sprite_still == false) {
									// check for same sprite (different position)
									/*$.each(line[prev_index_to_read].sprite, function(j_index, j_value) {
										if(value.sprite_resource_id == j_value.sprite_resource_id) {
											sprite_move = j_index;
										}
									});*/
									if(value.sprite_resource_id == line[prev_index_to_read].sprite[sprite_passed_index].sprite_resource_id) {
										sprite_move = true;
									}
									// if sprite_move not null
									if(sprite_move == true) {
										console.log("sprite is moving");
										// get canvas index for sprite to move
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
								}
							}
							else {
								// if new sprite
								var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
								var spr = new fabric.Image(img, {
									line_sprite_resource_id: value.sprite_resource_id,
									top: (value.position_y * 100),
									left: (value.position_x * 100),
									opacity: 0
								});
								// spr.set('selectable', false);>>>DEBUG TEMP
								// get 
								canvas.add(spr);
								spr.animate('opacity', '1', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 500
								});
							}
						}
						// if prev text line has NO sprite
						else {
							console.log("new sprite");
							var img = $('.image-cache').find('img[id='+value.sprite_resource_id+']')[0];
							var spr = new fabric.Image(img, {
								line_sprite_resource_id: value.sprite_resource_id,
								top: (value.position_y * 100),
								left: (value.position_x * 100),
								opacity: 0
							});
							// spr.set('selectable', false);>>>DEBUG TEMP
							canvas.add(spr);
							spr.animate('opacity', '1', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 500
							});
						}
					});
					// remove previous unneeded sprites
					$.each(sprite_to_remove, function(index, value) {
						var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
						var spr = canvas.item(canvas_index);
						spr.animate('opacity', '0', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 500,
							onComplete: function() {
								$.each(sprite_to_remove, function(index, value) {
									var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
									canvas.remove(canvas.item(canvas_index));
									console.log("removed");
								});
							}
						});
					});
				}
				else {
						// var canvas_index = get

				}
			// }
			// readjust game interface to original position after render
			for(var i = 1; i <= 10; i++) {
				var interface_index = getObjectIndex(canvas.getObjects(), 'line_interface_id', i);
				canvas.bringToFront(canvas.item(interface_index));
			}
		}
		else {
			if(line[index_to_read].background_resource_id) {
				// render background
				var bg_id = line[index_to_read].background_resource_id;
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

			if(line[index_to_read].sprite.length > 0) {
				$.each(line[index_to_read].sprite, function(index, value) {
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
		// render bgm
		var bgm_id = line[index_to_read].bgm_resource_id;
		if(bgm_id.length) {
			var path_to_bgm = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/bgm/' + line[index_to_read].bgm_file_name;
			// if(current.sequence > current.tail) {
			// 	var prev_index_to_read = getObjectIndex(line, 'sequence', (current.sequence-1));
			// 	var prev_bgm_id = line[prev_index_to_read].bgm_resource_id;
			// 	if(bgm_id != prev_bgm_id){
			// 		playBgm(path_to_bgm);
			// 	}
			// }
			// else {
			playBgm(path_to_bgm);
			// }

		}
		else {
			stopBgm();
		}
		// render sfx
		var sfx_id = line[index_to_read].sfx_resource_id;
		if(sfx_id.length) {
			var path_to_sfx = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/sfx/' + line[index_to_read].sfx_file_name;
			playSfx(path_to_sfx);
		}
		var voice_id = line[index_to_read].voice_resource_id;
		if(voice_id.length) {
			var path_to_voice = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/voice/' + line[index_to_read].voice_file_name;
			playSfx(path_to_voice);
		}

		// console.log(line[index_to_read].content);
		context.clearRect (0 ,0 ,text_display.width,text_display.height );
		renderLineText(line[index_to_read].content);
		// renderLineText("line sortability add line add capability add line delete capability custom autocomplete interface update interface with fixed control area editor script use strict mode add autocomplete capability on sprite area nterface with fixed control area editor script use strict mode add autocomplete capability on sprite area update interface with fixed and the school burned to pieces just like how time-wasting all the paperwork and presentation craps");
	}
	// render choice
	else if(line[index_to_read].fk_linetype_id == 2) {
		game.screen = "choice";
		var top_after = 200;
		if(line[index_to_read].choice.length == 3) {
			top_after = 180;
		}
		else if(line[index_to_read].choice.length == 4) {
			top_after = 160;
		}
		for(var i = 0; i < line[index_to_read].choice.length; i++) {
			// prepare choice box
			var img = $('.interface').find('img[id=in_choice_box]')[0];
			var chc_box = new fabric.Image(img, {
				originX: 'center',
				originY: 'center',
				opacity: 0,
				scaleX: 0.8
			});
			// prepare text
			var txt = line[index_to_read].choice[i].content;
			var font_index = getObjectIndex(font_list, 'fonttype_id', configuration.fk_fonttype_id);
			var chc_txt = new fabric.Text(txt, {
				fontSize: 20,
				fontFamily: font_list[font_index].name,
				originX: 'center',
				originY: 'center'
			});
			// combine to group
			var chc = new fabric.Group([ chc_box, chc_txt ], {
				line_choice_id: line[index_to_read].choice[i].choice_id,
				top: top_after,
				left: 100
			});
			chc.set('selectable', false);
			canvas.add(chc);
			chc.animate('opacity', '0.9', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 1000
			});
			var option = line[index_to_read].choice.length;
			if(line[index_to_read].choice.length == 2) {
				top_after+= 80;
			}
			else if(line[index_to_read].choice.length == 3) {
				top_after+= 70;
			}
			else if(line[index_to_read].choice.length == 4) {
				top_after+= 60;
			}
		}
	}
	// }
	// if(typeof callback === 'function' && callback()) {
	// 	callback();
	// }
	renderInGameInterface();
	if(callback) {
		callback();
	}
}

// remove choice from canv
function exitChoice(callback) {
	// fade out choice and remove
	var index_to_read = getObjectIndex(line, 'sequence', current.sequence);
	$.each(line[index_to_read].choice, function(index, value) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'line_choice_id', value.choice_id);
		var chc = canvas.item(canvas_index);
		chc.animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			onComplete: function() {
				$.each(line[index_to_read].choice, function(index, value) {
					canvas_index = getObjectIndex(canvas.getObjects(), 'line_choice_id', value.choice_id);
					canvas.remove(canvas.item(canvas_index));
				});
				if(callback) {
					callback();
				}
			}
		});
	});
}


function renderInGameInterface(callback) {
	if(current.sequence == current.tail) {
		// line interface id for looping through the interface
		// text box
		var img = $('.interface').find('img[id=in_text_window]')[0];
		var txt_box = new fabric.Image(img, {
			id: 'text_box',
			line_interface_id: 1,
			top: 420,
			left: 0,
			opacity: 0.9
		});
		txt_box.set('selectable', false);
		canvas.add(txt_box);
		// quickload btn
		var img = $('.interface').find('img[id=in_quickload_button]')[0];
		var qld_btn = new fabric.Image(img, {
			id: 'quickload_button',
			line_interface_id: 2,
			top: 435,
			left: 30,
			opacity: 1
		});
		qld_btn.set('selectable', false);
		canvas.add(qld_btn);
		// quicksave btn
		var img = $('.interface').find('img[id=in_quicksave_button]')[0];
		var qsv_btn = new fabric.Image(img, {
			id: 'quicksave_button',
			line_interface_id: 3,
			top: 438,
			left: 110,
			opacity: 1
		});
		qsv_btn.set('selectable', false);
		canvas.add(qsv_btn);
		// load btn
		var img = $('.interface').find('img[id=in_load_button]')[0];
		var ld_btn = new fabric.Image(img, {
			id: 'load_button',
			line_interface_id: 4,
			top: 435,
			left: 195,
			opacity: 1
		});
		ld_btn.set('selectable', false);
		canvas.add(ld_btn);
		// save btn
		var img = $('.interface').find('img[id=in_save_button]')[0];
		var sav_btn = new fabric.Image(img, {
			id: 'save_button',
			line_interface_id: 5,
			top: 438,
			left: 260,
			opacity: 1
		});
		sav_btn.set('selectable', false);
		canvas.add(sav_btn);
		// log btn
		var img = $('.interface').find('img[id=in_log_button]')[0];
		var log_btn = new fabric.Image(img, {
			id: 'log_button',
			line_interface_id: 6,
			top: 435,
			left: 330,
			opacity: 1
		});
		log_btn.set('selectable', false);
		canvas.add(log_btn);
		// auto btn
		var img = $('.interface').find('img[id=in_auto_button]')[0];
		var auto_btn = new fabric.Image(img, {
			id: 'auto_button',
			line_interface_id: 7,
			top: 470,
			left: 20, // original: 640
			opacity: 0.9
		});
		auto_btn.set('selectable', false);
		canvas.add(auto_btn);
		// skip btn
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
		// repeat voice btn
		var img = $('.interface').find('img[id=in_repeat_button]')[0];
		var repeat_btn = new fabric.Image(img, {
			id: 'repeat_button',
			line_interface_id: 9,
			top: 530,
			left: 15, // original: 635
			opacity: 1
		});
		repeat_btn.set('selectable', false);
		canvas.add(repeat_btn);
		// config btn
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
	}
	if(callback) {
		callback();
	}
}

function playBgm(source) {
	var bgm = $('#bgm_play')[0];
	if(current.bgm != source) {
		bgm.src = source;
		// if paused successfully
		// if(bgm.paused) {
			bgm.volume = configuration.bgm_volume;
			if(typeof bgm.loop == 'boolean') {
				bgm.loop = true;
			}
			else {
				bgm.addEventListener('ended', function() {
					this.currentTime = 0;
					this.play();
				}, false);
			}
			bgm.play();
			current.bgm = source;
		// }
		// else {
		// 	// bgm.pause();
		// }
	}
}

function stopBgm() {
	var bgm = $('#bgm_play')[0];
	bgm.pause();
	bgm.currentTime = 0;
}

function playSfx(source) {
	var sfx = $('#sfx_play')[0];
	if(sfx.paused) {
		sfx.src = source;
		sfx.volume = configuration.sfx_volume;
		sfx.loop = false;
		sfx.play();
		// console.log("sfx played");
	}
}

function playVoice(source) {
	var voice = $('#voice_play')[0];
	if(source.length) {
		if(bgm.src !== source) {
			voice.src = source;
			voice.volume = configuration.voice_volume;
			voice.loop = false;
		}
		voice.play();
	}
	else {
		voice.play();
	}
}



// font_size, point_x, start_y, line_height, right_padding
// 18px, 100, 490, 25, 100 = 390 chars
// 21. 100. 490. 31. 100 = 160 chars
context.font = '21px sans-serif';
function renderLineText(line_content) {
	var cursor_x = 100;
	var cursor_y = 490;
	var line_break = cursor_x;
	var line_height = 31;
	var right_padding = 100;
	var interval_speed = 1.0;
	var line_height = line_height || 32;
	right_padding = right_padding || 10;
	var i = 0;
	var inter = setInterval(function() {
		var rem = line_content.substr(i);
		var space = rem.indexOf(' ');
		if(space == -1) {
			space = line_content.length;
		}
		else {
			space = space;
		}
		// space = (space === -1)?line_content.length:space;
		var wordwidth = context.measureText(rem.substring(0, space)).width;
		var w = context.measureText(line_content.charAt(i)).width;
		if(cursor_x + wordwidth >= text_display.width - right_padding) {
			cursor_x = line_break;
			cursor_y += line_height;
		}
		context.fillText(line_content.charAt(i), cursor_x, cursor_y);
		i++;
		cursor_x += w;
		if(i === line_content.length) {
			clearInterval(inter);
		}
	}, interval_speed);
}