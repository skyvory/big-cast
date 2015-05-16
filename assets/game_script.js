'use strict';

var configuration = [];
var line = [];
// differ from editor, head here means the latest while tail is the oldest
var current = {
	sequence: 0,
	head: 0,
	tail: 0,
	branch: 0,
	limit: 30
};
var cache = {
	head: 0,
	tail: 0,
	limit: 10
};

var canvasdisplay = document.getElementsByTagName('canvas')[0];
// define weifth and height
canvasdisplay.width = 800;
canvasdisplay.height = 600;
canvasdisplay.style.width  = '800px';
canvasdisplay.style.height = '600px';

// load configuration
$(document).ready(function() {
	preloadInterface(function() {
		callConfigurationData(function() {
			callSequentialLineData(function(output) {
				processSequentialResource();
				initializeGame();
			});
		});
	});
	callFontData();
});

$('#test').click(function() {
	console.log(line);
})

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

function callSequentialLineData(returndata) {
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
			$.each(msg, function(index, value) {
				line.push(msg[index]);
			})
			// increase head the same number as retrieved lines
			current.head+=msg.length;
			returndata(msg.length);
		}
		else {
			if(current.sequence == 0) {
				callFailureNotification("No data retrieved.");
			}
		}
	});
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

function processSequentialResource(callback) {
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
				}, 500);
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
		in_text_window: "arc_000770.png",
		in_choice_box: "arc_001255.png",
		save_data_box_nodata: "arc_000951.png",
		exit_button: "arc_001273.png"

	};
	$.each(ui, function(index, value) {
		var path_to_ui = '../../../assets/sys/' + value;
		$("<img/>").attr("src", path_to_ui).attr("id", index).css("display", "none").appendTo('.interface');
	});
	callback();
}

var font_list = [];
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

function getObjectIndex2(array, attr, value, attr2, value2) {
	for(var i = 0; i < array.length; i++) {
		if(array[i][attr] == value && array[i][attr2] == value2) {
			return i;
		}
	}
	return false;
}

function initializeGame() {
	$('.request-loading').fadeOut(200, function() {
		$('.game-area').fadeIn(200, renderTitleScreen());
	});
}

// canvas renderer
var game = {
	screen: "title", // title/play/configuration/save/load/backlog
	mode: "normal", // normal, skip, auto
}
var canvas = new fabric.Canvas('visual');
canvas.selection = false;
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
		duration: 1000,
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
	if(game.screen == "title") {
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
				console.log(options.target.id);
				break;
		}
	}
	else if(game.screen == "load") {
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
				console.log(options.target.id);
				break;
		}
	}
	else if(game.screen == "configuration") {
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
				console.log(vol_round);
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
				console.log(index_to_read);
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
				game.screen = "title";
				
			default:
				console.log(options.target.id);
				break;
		}
	}
});

	// var ldi = getObjectIndex(canvas.getObjects(), 'id', 'start_button');
	// console.log(ldi);
	// canvas.remove(canvas.getObjects()[ldi]);

// canvas.on('mouse:move', function(options) {
// 	console.log(options.e.layerX, options.e.layerY);
// });

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
	// render save data group
	var top_after = 100;
	for(var i = 0; i < 5; i++) {
		var sav_dat = new fabric.Image(img_nodata, {
			id: 'save_slot',
			save_slot_id: (i+1),
			top: -200,
			left: 30,
			opacity: 0.8,
			angle: 0
		});
		sav_dat.set('selectable', false);
		canvas.add(sav_dat);
		sav_dat.animate('top', top_after, {
			onChange: canvas.renderAll.bind(canvas),
			duration: 1000,
			easing:fabric.util.ease.easeInOutBack
		});
		top_after+=90;
	}
	var top_after = 100;
	for(i = i; i < 10; i++) {

		var sav_dat = new fabric.Image(img_nodata, {
			id: 'save_slot',
			save_slot_id: (i+1),
			top: -200,
			left: 420,
			opacity: 0.8,
			angle: 0
		});
		sav_dat.set('selectable', false);
		canvas.add(sav_dat);
		sav_dat.animate('top', top_after, {
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

// !unnecessary
// fabric.Canvas.prototype.getItemByName = function(name) {
// 	var object = null,
// 		objects = this.getObjects();

// 		for (var i = 0, len = this.size(); i < len; i++) {
// 			if (objects[i].name && objects[i].name === name) {
// 			object = objects[i];
// 			break;
// 		}
// 	}

// 	return object;
// };

function imgren(){
	fabric.Image.fromURL(url[count], function(img){
			var imgx = img.scale(2).set({ top: x, left: 0, opacity: 0, angle: 0, scaleY: 2 });
			imgx.set('selectable', false);
			canvas.add(imgx);
			imgx.animate('opacity', '1', { 
				onChange: canvas.renderAll.bind(canvas),
				duration: 1000,
				easing: fabric.util.ease.easeInOutCubic
			});
			imgx.animate('left', '-=300', { 
				onChange: canvas.renderAll.bind(canvas),
				duration: 5000,
				easing: fabric.util.ease.easeOutSine,
				onComplete: txtren()
			});
		});
	//move to another line!count++;
}