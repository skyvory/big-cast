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
	callConfigurationData(function() {
		callSequentialLineData(function(output) {
			processSequentialResource();
		});
	});
	
	// 
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
			}
			else {
				console.log("NOT A TEXT LINE");
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
		console.log("already cached");
		callback(true);
	}
	else {
		$("<audio/>").attr("src", source).attr("id", resource_id).css("display", "none").appendTo('.audio-cache');
		$('audio[id='+resource_id+']').on('canplaythrough', function() {
			console.log("cached");
			callback(true);
		});
	}
}

function callInitialData() {
	//ajax get necessary initial resource
	var req = $.ajax({
		url: config.base + 'index.php/game/loadInitial',
		dataType: "json"
	});
	req.done(function(msg) {
		if(msg.length) {
			line = msg;
			
		}
		else {
			callFailureNotification("No data retrieved.");
		}
	});
	preloadImage(['link.jpg', 'jpg', 'jgp'], function() {
		//>>>start interface function
	});
}

function failureNotification(message) {
	$('.game-area').html("<p/>"+message);
}

function preloadResource() {
	//
}

// function preloadImage(source, callback) {
	// if(source.length) {
	// 	$.each(source, function(index, value) {
	// 		$("<img/>").attr("src", value.file_name).attr("id", value.resource_id).css("display", "none").appendTo('.image-cache');
	// 		$('img[id='+value.resource_id+']').one('load', function() {
	// 			console.log("OK");
	// 		}).each(function() {
	// 			if(this.complete) $(this).load();
	// 		});
	// 	});
	// }
	// else {
	// 	if(callback) {
	// 		callback();
	// 	}
	// }
	
// }

function getObjectIndex(array, attr, value) {
	for(var i = 0; i < array.length; i++) {
		if(array[i][attr] == value) {
			return i;
		}
	}
	return false;
}

