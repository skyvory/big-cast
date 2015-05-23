
var configuration = [];
var line = [];
// differ from editor, head here means the latest while tail is the oldest
var current = {
	sequence: -1,
	head: -1,
	// tail: 0,
	// branch: 0,
	limit: 100
};
var cache = {
	head: -1,
	// tail: 0,
	limit: 60, // 20
	count: 0
};
var game = {
	screen: "title", // title/play/configuration/save/load/backlog/choice
	mode: "normal", // normal, skip, auto
	bgm: "",
	voice: "",
	sfx: "",
	status: {
		// idle | busy
		text: "idle",
		voice: "idle"
	}
}
var font_list = [];

// var bgm_glob;
// var sfx_glob;
// var voice_glob;

// var electro; // Create the Sound 
// (function(){
	
// 	var context = new AudioContext(); // Create and Initialize the Audio Context
// 	var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
// 	getSound.open("GET", "../../../resources/~gentle.mp3", true); // Path to Audio File
// 	getSound.responseType = "arraybuffer"; // Read as Binary Data
// 	getSound.onload = function() {
// 		context.decodeAudioData(getSound.response, function(buffer){
// 			electro = buffer; // Decode the Audio Data and Store it in a Variable
// 		});
// 	}
// 	getSound.send(); // Send the Request and Load the File
	
// 	window.addEventListener("keydown",onKeyDown); // Create Event Listener for KeyDown
	
// 	function onKeyDown(e){
// 		switch (e.keyCode) {
// 			// X
// 			case 88:
// 				var playSound = context.createBufferSource(); // Declare a New Sound
// 				playSound.buffer = electro; // Attatch our Audio Data as it's Buffer
// 				playSound.connect(context.destination);  // Link the Sound to the Output
// 				playSound.start(0); // Play the Sound Immediately
// 			break;
// 			case 13:
// 			var playSound = context.createBufferSource(); // Declare a New Sound
// 				playSound.buffer = electro; // Attatch our Audio Data as it's Buffer
// 				playSound.connect(context.destination);  
// 				playSound.noteOff(0);
// 				break;
// 		}
//  	}
// }());


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
			callSequentialLineData(0, function() {
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
		}
		callback();
	});
}

function callSequentialLineData(offset, callback) {
	// current.head + current.limit would result line with total number of limit cached ahead
	//var process_limit = current.head + current.limit;
	var process_limit = 30;
	// var offset = 0;
	// if(current.head > 0) {
	// 	offset = parseInt(line[current.head].sequence) + 1;
	// 	console.log(offset);
	// }
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
			// append all line data to line object
			// if(current.tail == 0) {
				// current.tail = parseInt(msg[0].sequence);
				// same with current tail for resource maintain, keep cache at 0 would lead to error because no 0 sequenced line
				// cache.tail = current.tail;
			// }
			$.each(msg, function(index, value) {
				line.push(msg[index]);
				// if(parseInt(value.sequence) < current.tail) {
				// 	current.tail = parseInt(value.sequence);
				// }
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
	if(current.head > current.limit) {
		console.log("current removed");
		// remove all lines behind after 3 latest current sequence // ((current.sequence - 3) - current.tail) -> number of deleted lines
		for(var i = 0; i < current.sequence - 10; i++) {
			// var index_to_read = getObjectIndex(line, 'sequence', current.tail);
			line.splice(0, 1);
			current.head--;
			current.sequence--;
			cache.head--;
		}
	}
	// if(current.sequence % 20 == 0) {
	// request new lines after reach head - 20, using mod so if no more line, line won't bwe called continuously
	if(current.sequence % current.head - 20 == 0) {
		// var is_dead_end = true;
		// for(var i = current.sequence; i < current.head; i++) {
		// 	if(parseInt(line[i].fk_linetype_id) != 2 && line[i].jumpto_line_id.length > 0) {
		// 		is_dead_end = false;
		// 	}
		// 	else if(parseInt(line[i].fk_linetype_id) == 2) {
		// 		is_dead_end = false;
		// 	}
		// }
		console.log("more line call");
		// if(is_dead_end == false) {
			callSequentialLineData(parseInt(line[current.head].sequence));
		// }
	}
	if(callback) {
		callback();
	}
}
function maintainCache(callback) {
	// delete old cache
	if(cache.count > cache.limit) {
		$('image-cache').children('img').each(function() {
			var id = $(this).find('id').val();
			var bg_del = true;
			var spr_del = true;
			for(var i = current.sequence; i < current.sequence + 10; i++) {
				var j = 0;
				// var index_to_read = getObjectIndex(line, 'sequence', cache.tail);
				if(line[i].fk_linetype_id == 1) {
					// checking ahead to resolve resource missing
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
				console.log(this);
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
				// var index_to_read = getObjectIndex(line, 'sequence', cache.tail);
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
				console.log(this);
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
	// request new cache
	if(cache.head - current.sequence < 10) {
		processSequentialResource();
	}
	if(callback) {
		callback();
	}
}

// function removeOldCache(callback) {
// 	// delete old cache
// 	for(; cache.head > current.sequence; cache.head--) {
// 		if(line[0].fk_linetype_id == 1) {
// 			if(line[0].bgm_resource_id) {
// 				$('.audio-cache').find('audio[id='+line[0].bgm_resource_id+']').remove();
// 			}
// 			if(line[0].sfx_resource_id) {
// 				$('.audio-cache').find('audio[id='+line[0].sfx_resource_id+']').remove();
// 			}
// 			if(line[0].voice_resource_id) {
// 				$('.audio-cache').find('audio[id='+line[0].voice_resource_id+']').remove();
// 			}
// 			if(line[0].background_resource_id) {
// 				$('.image-cache').find('img[id='+line[0].background_resource_id+']').remove();
// 			}
// 			if(line[0].sprite) {
// 				if(line[0].sprite.length) {
// 					$.each(line[0].sprite, function(index, value) {
// 						$('.image-cache').find('img[id='+value.sprite_resource_id+']').remove();
// 					});
// 				}
// 			}
// 		}
// 	}
// 	if(callback) {
// 		callback();
// 	}
// }

// function processSequentialResource() {
// 	var process_limit = cache.head + 5;
// 	for(var i = cache.head; i < process_limit; i++) {
// 		cache.head += 1;
// 		var index_to_read = getObjectIndex(line, 'sequence', cache.head);
// 		if(line[index_to_read].fk_linetype_id == 1) {
// 			if(line[index_to_read].background_resource_id) {
// 				var path_to_background_image = "resources/" + configuration.creator_id + "/" + configuration.game_id + "/background/" + line[index_to_read].background_file_name;
// 				preloadImage(path_to_background_image, function() {
// 				})
// 			}
// 		}
// 	}
// }

function processSequentialResource() {
	if(cache.head - current.sequence < 10) {
		cache.head++;
		// var index_to_read = getObjectIndex(line, 'sequence', cache.head);
		if(line[cache.head]) {
			// for text line
			if(line[cache.head].fk_linetype_id == 1) {
				var status = true;
				// if background exist
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
				// setTimeout(function() {
					// if bgm exist
					if(line[cache.head].bgm_resource_id) {
						var path_to_bgm = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/bgm/" + line[cache.head].bgm_file_name;
						var resource_id = line[cache.head].bgm_resource_id;
						preloadAudio(path_to_bgm, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					// if voice exist
					if(line[cache.head].voice_resource_id) {
						var path_to_voice = "../../../resources/" + configuration.creator_id + "/" + configuration.game_id + "/voice/" + line[cache.head].voice_file_name;
						var resource_id = line[cache.head].voice_resource_id;
						preloadAudio(path_to_voice, resource_id, function(returndata) {
							if(!returndata) {
								status = false;
							}
						});
					}
					// if sfx exist
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
						// cache.head++;
						processSequentialResource();
					}
				// }, 1000);
			}
			else if(line[cache.head].fk_linetype_id == 2) {
				// cache.head++;
				processSequentialResource();
			}
			else {
				// cache.head++;
				processSequentialResource();
			}
		}
	}
}

function preloadImage(source, resource_id, callback) {
	// check if cache exist
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
		$('.game-area').fadeIn(1500, function() { // DEFAULT 1500
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
		duration: 2000, //DEFAULT 2000
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

// $(document).keypress(function(e){
// 	if(game.screen == play) {
// 		switch(e.which){
// 			case 13:
// 				renderNextLine();
// 				maintainCurrent();
// 				maintainCache();
// 				break;
// 			case 
// 		}
		
// 	}
// });
// var key_enable = true;
// $(document).bind('keydown', function(e){
// 	if(key_enable == true) {
// 		if(game.screen == "play") {
// 			switch(e.which) {
// 				// enter key
// 				case 13:
// 						key_enable = false;
// 						renderNextLine();
// 						maintainCurrent();
// 						maintainCache();
// 					break;
// 				// ctrl key
// 				case 17:
// 					game.screen = "skip";
// 					playSkip();
// 					break;
// 				// a key
// 				case 65:
// 					// toggle
// 					game.screen = "auto";
// 					playAuto();
// 					break;
// 				// f key
// 				case 70:
// 					// toggle skip
// 					game.screen = "skip";
// 					playSkip();
// 					break;
// 				// s key
// 				case 83:
// 					// open save
// 					game.screen = "save";
// 					$('.text-area').fadeOut(1000);
// 					renderSaveScreen();
// 					break;
// 				// l key
// 				case 76:
// 					// open load
// 					game.screen = "load";
// 					renderLoadScreen();
// 					break;
// 				// r key
// 				case 82:
// 					playVoice();
// 					// repeat voice
					
// 				default:
// 					break;
// 			}
// 		}
// 		else if(game.screen == "auto") {
// 			switch(e.which) {
// 				// return to normal play
// 				case 13:
// 					game.screen = "play";
// 					break;
// 				// toggle auto
// 				case 65:
// 					game.screen = "play";
// 					break
// 				default:
// 					break;
// 			}
// 		}
// 	}
// });
// $(document).bind('keyup', function(e){
// 	if(game.screen == "play") {
// 		switch(e.keyCode) {
// 			// toggle skip
// 			case 17:
// 				game.screen = "play";
// 				break;
// 			default:
// 				break;
// 		}
// 		key_enable = true;
// 	}
// });

var key_enable = true;
$(document).bind('keydown', function(e){
	if(key_enable == true) {
		if(game.screen == "play") {
			switch(e.which) {
				// enter key
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
			// toggle skip
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
	else if((game.screen == "configuration") || (game.screen == "on_play_configuration")) {
		// console.log(options.target.bgmvolume_id);
		switch(options.target.id) {
			case "font":
				// prepare index
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
				// change global configuration value
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
				game.screen = "configuration";
				break;
			case "sound_head":
				toSoundConfiguration();
				game.screen = "configuration";
				break;
			case "exit_button":
				exitConfigurationScreen();
				callSaveConfiguration();
				if(game.screen === "configuration") {
					game.screen = "title";
				}
				else if(game.screen === "on_play_configuration") {
					// $(text_display).delay(3000).fadeIn(500);
					game.screen = "play";
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
					game.screen = "skip";
					playSkip();
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
			// canvas background has no target (undefined)
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
					// game.screen = "stall";
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
			// var index_to_read = getObjectIndex(line, 'sequence', current.sequence);
			var choice_index_to_read = getObjectIndex(line[current.sequence].choice, 'choice_id', choice_id_select);
			// console.log(line);
			if(line[current.sequence].choice[choice_index_to_read].jumpto_line_id && line[current.sequence].choice[choice_index_to_read].jumpto_line_id != line[current.sequence+1].line_id) {
					// jump_to = parseInt(line[index_to_read].choice[choice_index_to_read].jumpto_line_id);
					// shiftCurrent(jump_to);
					// shiftCurrent(choice_index_to_read);
					//change to unresponsive game screen for loading line resource
					var index_to_remove = current.sequence + 1;
					// line.splice(index_to_remove, current.head - current.sequence, line[current.sequence].choice[choice_index_to_read].look_ahead[0]);
					line.splice(index_to_remove, current.head - current.sequence);
					// removeOldCache(function() {
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
					// });
					
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
					game.screen = "auto";
					playAuto();
					break;
				case "skip_button":
					game.screen = "skip";
					playSkip();
					break;
				case "repeat_button":
					playVoice();
					break;
				case "configuration_button":
					renderConfigurationScreen();
					$(text_display).fadeOut(1000);
					game.screen = "on_play_configuration";
					break;
				case "log_button":
					break;
			}
		}
	}
	// when click on video play
	else if(game.screen == "video") {
		// get element
		game.screen = "stall";
		var vidx = $('#video_play');
		// fade out volume
		vidx.animate({volume: 0}, 3000, function() {
			var vid = $('#video_play')[0];
			// pause video
			vid.pause();
			
		});
		whiteIn(1000, function() {
			// hide video area
			$('.video-area').fadeOut(2000);
			setTimeout(function() {
				renderNextLine();
				$('.text-area').fadeIn(2500);
				whiteOut(2000, function() {
					$('.text-area').fadeIn(1000);
					// change game screen
					game.screen = "play";
				});
			}, 3000);
		});
	}
	// during autoplay
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
	// console.log(options.e.layerX, options.e.layerY);
});

// canvas.on('mouse:move', function(options) {
// 	console.log(options.e.layerX, options.e.layerY);
// });


// function shiftCurrent(choice_index, callback) {

	// get index of next line
	// var index_to_remove = current.sequence + 1;
	// get index of current line
	// var index_to_read = getObjectIndex(line, 'sequence', current.sequence);
	// remove all line cache ahead and fill with look_ahead in choice 
	// line.splice(index_to_remove, current.head - current.sequence, line[current.sequence].choice[choice_index].look_ahead);
	// current.head+= line[current.sequence].choice[choice_index].look_ahead.length;
	// loadLine
	// change current line to jump seq - 1?
	// index_to_read + 1 is jumped line
	// var jump_index = index_to_read + 1;
	// delete all previous cache
	// removeOldCache();
	// removeOldLine();

	// change current sequence
	// current.sequence = line[jump_index].sequence;
// } 

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
		// render text
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
					// originX: 'center',
					// originY: 'center',
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
			// render save data group
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
						// originX: 'center',
						// originY: 'center',
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
				// render save data group
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
	});
}
// exit and remove object of load screen
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
	// index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'quickload_slot');
	// canvas.item(index_to_read).animate('top', '-600', {
	// 	onChange: canvas.renderAll.bind(canvas),
	// 	duration: 1000,
	// 	easing: fabric.util.ease.easeInOutBack,
	// 	onComplete: function() {
	// 		index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'quickload_slot');
	// 		canvas.remove(canvas.item(index_to_read));
	// 	}
	// });
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
	//render text head
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
	// render sound head
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
		// render font  config
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
		// render bgm head
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
		// render text speed config 
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

	setTimeout(function() {
		// render bgm head
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

		// render bgm volume config 
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
		

		// render sfx head
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

		// render sfx vol config
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
		

		// render voice head
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
	
		// render voice vol config
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

	// slide out bgm vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack
		});
	} // slide out bgm vol end
	// slide out sfx vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack
		});
	} // slide out sfx vol end
	// slide out voice vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack
		});
	} // slide out voice vol end
	
	setTimeout(function() {
		// slide out bgm head
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack
		}); // slide out bgm config
		// slide out sfx head
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack
		}); // slide out sfx config
		// slide out voice head
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
		canvas.item(index_to_read).animate('left', '810', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack
		}); // slide out voice config

		

		// slide in font config
		for(var i = 0; i < font_list.length; i++) {
			var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
			var cfg = canvas.item(index_to_read);
			cfg.animate('left', '80', {
				onChange: canvas.renderAll.bind(canvas),
				duration: 500,
				// easing:fabric.util.ease.easeInOutBack
			});
		}
		// slide in text speed head
		var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
		var cfg = canvas.item(index_to_read);
		cfg.animate('left', '400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			easing:fabric.util.ease.easeInOutBack
		});
		// slide in speed txt conf
		var leftafter = 420;
		for(var i = 0; i <= 10; i++) {
			var canvas_index = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
			var cfg = canvas.item(canvas_index)
			cfg.animate('left', leftafter, {
				onChange: canvas.renderAll.bind(canvas),
				duration: 500,
				// easing: fabric.util.ease.easeInOutBack
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

	// slide out font list
	for(var i = 0; i < font_list.length; i++) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
		var cfg = canvas.item(canvas_index)
		cfg.animate('left', '-400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			// easing: fabric.util.ease.easeInOutBack
		});
	}
	// slide out font list end

	// slide out txt speed
	for(var i = 0; i <= 10; i++) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
		var cfg = canvas.item(canvas_index)
		cfg.animate('left', '-400', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			// easing: fabric.util.ease.easeInOutBack
		});
	}
	// slide out txt speed end
	
	// slide out txtpeed head
	var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
	var cfg = canvas.item(canvas_index)
	cfg.animate('left', '-100', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 300,
		// easing: fabric.util.ease.easeInOutBack
	});
	// slide out txtpeed config


	// SLIDE IN SOUND CONFIG
	setTimeout(function() {
		/// slide in bgm head
		var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
		canvas.item(canvas_index).animate('left', '50', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				// render bgm volume config 
				var leftafter = 70;
				for(var i = 0; i <= 10; i++) {
					var canvas_index = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
					var cfg = canvas.item(canvas_index)
					cfg.animate('left', leftafter, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 300,
						// easing: fabric.util.ease.easeInOutBack
					});
					leftafter+= 30;
				}
			}
		});
		// slide in sfx config
		/// slide in sfx head
		var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
		canvas.item(canvas_index).animate('left', '50', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				// render sfx volume config 
				var leftafter = 70;
				for(var i = 0; i <= 10; i++) {
					var canvas_index = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
					var cfg = canvas.item(canvas_index)
					cfg.animate('left', leftafter, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 300,
						// easing: fabric.util.ease.easeInOutBack
					});
					leftafter+= 30;
				}
			}
		});
		// slide in sfx config
		/// slide in voice head
		var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
		canvas.item(canvas_index).animate('left', '50', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			onComplete: function() {
				// render voice volume config 
				var leftafter = 70;
				for(var i = 0; i <= 10; i++) {
					var canvas_index = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
					var cfg = canvas.item(canvas_index)
					cfg.animate('left', leftafter, {
						onChange: canvas.renderAll.bind(canvas),
						duration: 300,
						// easing: fabric.util.ease.easeInOutBack
					});
					leftafter+= 30;
				}
			}
		});
		// slide in voice config
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
	// remove font list
	for(var i = 0; i < font_list.length; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'fonttype_id', font_list[i].fonttype_id);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			// easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {

				// remove text head
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
				}); // remove text head
				// remove sound head
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sound_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
				}); // remove sound head
				
			}
		});
	}
	// remove font list end

	// remove voice vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'voicevolume_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 300,
			// easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {

				// remove voice config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'voice_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
				}); // remove voice vconfig
				
			}
		});
	}
	// remove voice vol end
	// remove sfx vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'sfxvolume_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 600,
			// easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {

				// remove sfx config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'sfx_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
				}); // remove sfx end
				
			}
		});
	} // remove sfx vol end
	// remove text speed
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'textspeed_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 600,
			// easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {

				// remove text head
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'text_speed_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300
				}); // remove text head end
				
			}
		});
	} // remove text speed end
	// remove bgm vol
	for(var i = 0; i <= 10; i++) {
		var index_to_read = getObjectIndex(canvas.getObjects(), 'bgmvolume_id', i);
		canvas.item(index_to_read).animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 900,
			// easing: fabric.util.ease.easeInOutBack,
			onComplete: function() {
				// remove bgm config
				var index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'bgm_head');
				canvas.item(index_to_read).animate('opacity', '0', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 300,
					// easing: fabric.util.ease.easeInOutBack,
					onComplete: function() {
						
						// remove config head
						index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'configuration_head');
						canvas.item(index_to_read).animate('opacity', '0', {
							onChange: canvas.renderAll.bind(canvas),
							duration: 300,
							// easing: fabric.util.ease.easeInOutBack,
							onComplete: function() {
								// remove exit btn
								index_to_read = getObjectIndex(canvas.getObjects(), 'id', 'exit_button');
								canvas.item(index_to_read).animate('opacity', '0', {
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
		duration: duration, //5000
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
	context.clearRect (0 ,0 ,text_display.width,text_display.height );
	//if before same or something whatever
	current.sequence++;

	// for line jump
	if(line[current.sequence].fk_linetype_id == 1 || line[current.sequence].fk_linetype_id == 3) {
		if(line[current.sequence].jumpto_line_id) {
			game.screen = "stall";
			console.log("has jump to");
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

	console.log(current.sequence);
	// render text line
	if(parseInt(line[current.sequence].fk_linetype_id) === 1) {
		if(current.sequence > 0) {
			// prepare latest index in line which is text type
			var prev_index_to_read = -1; 
			for(var i = current.sequence - 1; i >= 0; i--) {
				if(parseInt(line[i].fk_linetype_id) === 1) {
					prev_index_to_read = i;
					// stop iteration
					i = -1;
				}
			}
			// console.log("prev index", prev_index_to_read);
			// console.log("prev bg res id", line[prev_index_to_read].background_resource_id);
			// console.log("current sequence", current.sequence);
			if(prev_index_to_read > -1) {
				if(line[prev_index_to_read].background_resource_id === line[current.sequence].background_resource_id) {
					console.log("same background");
				}
				else {
					console.log("different background");

					

					if(line[current.sequence].background_resource_id > 0) {
						line[current.sequence].background_resource_id;
						var bg_id = line[current.sequence].background_resource_id;
						console.log("bg added", bg_id);
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
									//
								}
							});
						}
					}
					// console.log("prev", prev_index_to_read);
					if(line[prev_index_to_read].background_resource_id.length > 0) {
						var canvas_index = getObjectIndex(canvas.getObjects(), 'line_background_resource_id', line[prev_index_to_read].background_resource_id);
						console.log("canvas index to delete", canvas_index);
						var bg_bottom = canvas.item(canvas_index);
						// console.log("bg bottom element", bg_bottom);
						if(game.screen == "skip") {
							canvas.remove(canvas.item(canvas_index));
						}
						else {
							bg_bottom.animate('opacity', '0', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 500,
								onComplete: function() {
									canvas.remove(canvas.item(canvas_index));
									// console.log("bg removed at index", canvas_index);
								}
							});
						}
					}
				
				}
				
				// render sprites
				if(line[current.sequence].sprite.length > 0) {
					// sort sprite according z-index
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
						// get sprite list not passed from prev seq
						// prepare empty new var
						var sprite_to_remove = [];
						// iterate and add to new var if not found same
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
							// if prev text line has sprite
							if(line[prev_index_to_read].sprite.length > 0){
								var sprite_still = false;
								var sprite_move = false;
								var sprite_passed_index = getObjectIndex(line[prev_index_to_read].sprite, 'sprite_resource_id', value.sprite_resource_id);
								// if sprite is one from previous line
								if(line[prev_index_to_read].sprite[sprite_passed_index]) {
									// chack for same sprite and same position
									if(value.sprite_resource_id == line[prev_index_to_read].sprite[sprite_passed_index].sprite_resource_id && value.position_x == line[prev_index_to_read].sprite[sprite_passed_index].position_x && value.position_y == line[prev_index_to_read].sprite[sprite_passed_index].position_y && value.position_z == line[prev_index_to_read].sprite[sprite_passed_index].position_z) {
										sprite_still = true;
									}
									if(sprite_still == false) {
										// check for same sprite (different position)
										if(value.sprite_resource_id == line[prev_index_to_read].sprite[sprite_passed_index].sprite_resource_id) {
											sprite_move = true;
										}
										// if sprite_move not null
										if(sprite_move == true) {
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
										else
											console.log("ugh");
									}
									else {
										console.log("aww");
									}
								}
								else {
									// if new sprite
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
									else if(value.fk_effect_id == 5) {
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
									else if(value.fk_effect_id == 7) {
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
									else if(value.fk_effect_id == 9) {
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
									else if(value.fk_effect_id == 11) {
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
							// if prev text line has NO sprite
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
								else if(value.fk_effect_id == 5) {
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
								else if(value.fk_effect_id == 7) {
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
								else if(value.fk_effect_id == 9) {
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
								else if(value.fk_effect_id == 11) {
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
						// remove previous unneeded sprites
						$.each(sprite_to_remove, function(index, value) {
							var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
							var spr = canvas.item(canvas_index);
							if(value.fk_effect_id == 1 || game.screen == "skip") {
								var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
								canvas.remove(canvas.item(canvas_index));
							}
							else if(value.fk_effect_id == 6) {
								spr.animate('left', '-1000', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else if(value.fk_effect_id == 8) {
								spr.animate('left', '1000', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else if(value.fk_effect_id == 10) {
								spr.animate('top', '-800', {
									onChange: canvas.renderAll.bind(canvas),
									duration: 1000,
									onComplete: function() {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
									}
								});
							}
							else if(value.fk_effect_id == 12) {
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
									duration: 500,
									onComplete: function() {
										// $.each(sprite_to_remove, function(j_index, j_value) {
											var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
											canvas.remove(canvas.item(canvas_index));
										// });
									}
								});
							}
						});
					}
					
				}
				// if no sprite on current line
				else {
					$.each(line[prev_index_to_read].sprite, function(index, value) {
						var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
						var spr = canvas.item(canvas_index);
						if(value.fk_effect_id == 1 || game.screen == "skip") {
							var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
							canvas.remove(canvas.item(canvas_index));
						}
						else if(value.fk_effect_id == 6) {
							spr.animate('left', '-1000', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else if(value.fk_effect_id == 8) {
							spr.animate('left', '1000', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else if(value.fk_effect_id == 10) {
							spr.animate('top', '-800', {
								onChange: canvas.renderAll.bind(canvas),
								duration: 1000,
								onComplete: function() {
										var canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
										canvas.remove(canvas.item(canvas_index));
								}
							});
						}
						else if(value.fk_effect_id == 12) {
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
								duration: 500,
								onComplete: function() {
									// repeat get index because canvas index value would change after each and result in wrong index, since function is executed after completion of transition
									canvas_index = getObjectIndex(canvas.getObjects(), 'line_sprite_resource_id', value.sprite_resource_id);
									canvas.remove(canvas.item(canvas_index));
								}
							});
						}
					});
				}
			}
			// if no previous reference, this is happen after load a data
			else {
				if(line[current.sequence].background_resource_id > 0) {
					line[current.sequence].background_resource_id;
					var bg_id = line[current.sequence].background_resource_id;
					console.log("bg added", bg_id);
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
								//
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
						else if(value.fk_effect_id == 5) {
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
						else if(value.fk_effect_id == 7) {
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
						else if(value.fk_effect_id == 9) {
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
						else if(value.fk_effect_id == 11) {
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
				// mark prone
			}
			// }
			// readjust game interface to original position after render
			for(var i = 1; i <= 10; i++) {
				var interface_index = getObjectIndex(canvas.getObjects(), 'line_interface_id', i);
				canvas.bringToFront(canvas.item(interface_index));
			}
		}
		else {
			//>>>>
			console.log("curent sequence is 0");
			if(line[current.sequence].background_resource_id > 0) {
				// render background
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
				console.log('ren");');
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
			// render bgm
			var bgm_id = line[current.sequence].bgm_resource_id;
			if(bgm_id.length) {
				var path_to_bgm = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/bgm/' + line[current.sequence].bgm_file_name;
				playBgm(bgm_id);
			}
			else {
				stopBgm();
			}
			// render sfx
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

			// render voice
			var voice_id = line[current.sequence].voice_resource_id;
			if(voice_id.length) {
				var path_to_voice = '../../../resources/' + configuration.creator_id + '/' + configuration.game_id + '/voice/' + line[current.sequence].voice_file_name;
				// reset voice playing status, explicitly using stopVoice function because differs from other 2, voice isn't carry-through type and has to be stopped immediately even if next line producing the same voice
				stopVoice();
				// game.status.voice = "idle";
				setTimeout(function() {
					playVoice(voice_id);
				},200);
			}
			else{
				// uncomment for "playing voice through the next line" option
				// if(game.status.voice == "busy") {
					stopVoice();
				// }
			}
		}

		// console.log(line[current.sequence].content);
		context.clearRect (0 ,0 ,text_display.width,text_display.height );
		if(line[current.sequence].content.length > 0) {
			renderLineText(line[current.sequence].content);
		}
		// render interface
		if(current.sequence == 0 || line[current.sequence].fk_linetype_id == 1 || line[current.sequence].fk_linetype_id == 2) {
			renderInGameInterface();
		}
		if(line[current.sequence].speaker.length > 0) {
			renderSpeaker();
		}
		// renderLineText("line sortability add line add capability add line delete capability custom autocomplete interface update interface with fixed control area editor script use strict mode add autocomplete capability on sprite area nterface with fixed control area editor script use strict mode add autocomplete capability on sprite area update interface with fixed and the school burned to pieces just like how time-wasting all the paperwork and presentation craps");

	}
	// render choice line
	else if(parseInt(line[current.sequence].fk_linetype_id) === 2) {
		game.screen = "choice";
		var top_after = 200;
		if(line[current.sequence].choice.length == 3) {
			top_after = 180;
		}
		else if(line[current.sequence].choice.length == 4) {
			top_after = 160;
		}
		for(var i = 0; i < line[current.sequence].choice.length; i++) {
			// prepare choice box
			var img = $('.interface').find('img[id=in_choice_box]')[0];
			var chc_box = new fabric.Image(img, {
				originX: 'center',
				originY: 'center',
				opacity: 0,
				scaleX: 0.8
			});
			// prepare text
			var txt = line[current.sequence].choice[i].content;
			var font_index = getObjectIndex(font_list, 'fonttype_id', configuration.fk_fonttype_id);
			var chc_txt = new fabric.Text(txt, {
				fontSize: 20,
				fontFamily: font_list[font_index].name,
				opacity: 0,
				originX: 'center',
				originY: 'center'
			});
			// combine to group
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
	// render video line
	else if(parseInt(line[current.sequence].fk_linetype_id) === 3) {
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
				// after video end
				op.onended = function() {
					$('.video-area').fadeOut(2000);
					setTimeout(function() {
						$('.text-area').fadeIn(1000);
						game.screen = "play";
					}, 1000);
				}
				blackOut(1000, function() {
					// canvas.clear();
					
					// var vid = $('#videoclip')[0];
					// var op = new fabric.Image(vid, {
					// 	left: 300,
					// 	top: 300,
					// 	angle: 0,
					// 	originX: 'center',
					// 	originY: 'center'
					// });
					// canvas.add(op);
					// // canvas.bringToFront(op);
					// op.getElement().play();
					// fabric.util.requestAnimFrame(function render() {
					// 	canvas.renderAll();
					// 	fabric.util.requestAnimFrame(render);
					// });


					
				});
			}, 3000);
		});

	}
	// render end line
	else if(parseInt(line[current.sequence].fk_linetype_id) === 4) {
		console.log("END");
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
				// whiteIn(500, function() {
				// 	whiteOut(2000);
				// 	renderTitleScreen();
				// });
			}, 5000);
		});
	}

	// keep white transition in top
	// var is_white = getObjectIndex(canvas.getObjects(), 'id', 'white');
	// if(is_white) {
	// 	var keep = canvas.item(is_white);
	// 	keep.bringToFront();
	// }



	// // render interface
	// if(current.sequence == 0 || line[current.sequence].fk_linetype_id == 1 || line[current.sequence].fk_linetype_id == 2) {
	// 	renderInGameInterface();
	// }
	if(callback) {
		callback();
	}
}

// split for lighter and smoother canvas processing (maybe)
function renderSpeaker() {
	// remove speaker text
	var canvas_index = getObjectIndex(canvas.getObjects(), 'id', 'speaker');
	canvas.remove(canvas.item(canvas_index));
	// add new speaker
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

	// for(var i = current.sequence; i > count, i>=0; i--) {
		// console.log(i);
		if(line[i].fk_linetype_id == 1) {
			$("<li/>").text(line[i].content).appendTo('.log-area');
		}
		else {
			oldest_limit++;
		}
	}
	// for(i=0;i<50;i++){
	// 	$("<li/>").text("uie agioga dfuigf oagdfiagf doae fdea egwsdkfj fdkj df fjsd fajk fdaj kfsd feiow agioga dfuigf oagdfiagf doae fdea egwsdkfj fdkj df fjsd fajk fdaj kfsd feiow fbv ").appendTo('.log-area');
	// }
	var logdiv = $('.log-area')[0];
	logdiv.scrollTop = logdiv.scrollHeight;
	$('.log-area').slideDown(1000);

}

// remove choice from canv
function exitChoice(callback) {
	// fade out choice and remove
	// var index_to_read = getObjectIndex(line, 'sequence', current.sequence);
	$.each(line[current.sequence].choice, function(index, value) {
		var canvas_index = getObjectIndex(canvas.getObjects(), 'line_choice_id', value.choice_id);
		var chc = canvas.item(canvas_index);
		chc.animate('opacity', '0', {
			onChange: canvas.renderAll.bind(canvas),
			duration: 500,
			onComplete: function() {
				// $.each(line[current.sequence].choice, function(index, value) {
				// 	console.log(value);
				// 	canvas_index = getObjectIndex(canvas.getObjects(), 'line_choice_id', value.choice_id);
				// 	canvas.remove(canvas.item(canvas_index));
				// });
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
	// if(current.sequence == 0) {
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
			left: 480,
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
			left: 545,
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
			left: 615,
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
			left: 670,
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
			left: 720,
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
			opacity: 1
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
	// }
	if(callback) {
		callback();
	}
}

function play(res) {
	var bgm = $('#'+res)[0];
	if(game.bgm != res) {
		// bgm.src = source;
		// if paused successfully
		if(bgm.paused) {
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
			game.bgm = res;
		}
	}
}

function playBgm(res) {
	// if current bgm differ from last one
	if(game.bgm != res) {
		var bgmx = $('#'+game.bgm);
		// get dom direct of jquery
		var bgm = bgmx[0];
		// if not first sequence
		if(game.bgm != "") {
			// fade out
			bgmx.animate({volume: 0}, 500, function() {
				bgm.pause();
				bgm.currentTime = 0;
			});
			
		}
		bgmx_new = $('#'+res);
		bgm_new = bgmx_new[0];
		// if paused successfully
		// if(bgm.paused) {
		bgm_new.volume = 0;
		// fade in
		bgmx_new.animate({volume: configuration.bgm_volume}, 500);
		// possibility of not supporting audio loop
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
		// }
	}

	// HOWLER ALTERNATIVE
	// if(game.bgm != source) {
	// 	console.log("aa");
	// 	// bgm_glob.stop();
	// 	if(bgm_glob) {
	// 		bgm_glob.stop();
	// 		bgm_glob.unload();
	// 		bgm_glob = new Howl({
	// 			loop: true,
	// 			urls: [source],
	// 			volume: configuration.bgm_volume
	// 		});
	// 		// bgm_glob.urls([source]);
	// 		bgm_glob.play();
	// 		console.log("bb");
	// 	}
	// 	else {
	// 		bgm_glob = new Howl({
	// 			loop: true,
	// 			urls: [source],
	// 			volume: configuration.bgm_volume
	// 		});
	// 		bgm_glob.play();
	// 	}
	// 	game.bgm = source;
	// }
}
function stopBgm() {
	var bgmx = $('#'+game.bgm);
	var bgm = bgmx[0];
	if(!bgm.paused) {
		bgmx.animate({volume: 0}, 3000, function() {
			bgm.pause();
			bgm.currentTime = 0;
		});
	}
}
function playSfx(res) {
	if(game.sfx != res) {
		var sfxx = $('#'+game.sfx);
		var sfx = sfxx[0];
		if(game.sfx != "") {
			// possibility long sfx
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
	var sfx = $('#'+game.sfx)[0];
	if(sfx.pused) {
		sfx.pause();
		sfx.currentTime = 0;
	}
}
function playVoice(res) {
	if(game.status.voice == "idle") {
		if(res) {
			var voice = $('#'+res)[0];
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



// font_size, point_x, start_y, line_height, right_padding
// 18px, 100, 490, 25, 100 = 390 chars
// 21. 100. 490. 31. 100 = 160 chars
// context.font = '21px sans-serif';
function renderLineText(line_content) {
	var font_index = getObjectIndex(font_list, 'fonttype_id', configuration.fk_fonttype_id);
	context.font = '21px '+font_list[font_index].name;
	var interval_speed = (parseInt(configuration.text_speed) * 10);
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
			// if no space found
			if(space == -1) {
				space = line_content.length;
			}
			else {
				space = space;
			}
			// space = (space === -1)?line_content.length:space;
			// calculate width of word
			var word_width = context.measureText(rem.substring(0, space)).width;
			// calculate width of char
			var w = context.measureText(line_content.charAt(i)).width;
			// if word exceed width minus right padding, break the line and restore cursor to the left
			if(cursor_x + word_width >= text_display.width - right_padding) {
				cursor_x = line_break;
				cursor_y += line_height;
			}
			// type text to canvas
			context.fillText(line_content.charAt(i), cursor_x, cursor_y);
			// increment i for char pointer on content
			i++;
			// increment cursor with the width of typed char
			cursor_x += w;
			// if all typed, finish interval
			if(i === line_content.length) {
				clearInterval(inter);
				game.status.text = "idle";
			}
		}, interval_speed);
	}
}