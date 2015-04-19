
<div>
	<center><canvas id="visual" style="border:2px solid black;"></canvas></center>
</div>
<img src="../resources/a.jpg" id="my-image" style="display:none;">
<audio id="bgmfront"></audio>
<audio id="chvfront"></audio>
<audio id="sfxfront"></audio>




<script type="text/javascript">

var canvasdisplay = document.getElementsByTagName('canvas')[0];
canvasdisplay.width = 800;
canvasdisplay.height = 600;
canvasdisplay.style.width  = '800px';
canvasdisplay.style.height = '600px';

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

fabric.Image.fromURL('../resources/a.jpg', function(img){
	var imgx = img.scale(1).set({ id: 'bg1', top: 0, left: 0, opacity: 0, angle: 0, scaleX: 1 });
	imgx.set('selectable', false);
	canvas.add(imgx);
	imgx.animate('opacity', '1', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeOutExpo
	});
});
/*
//reference for loading image from page
var img = document.getElementById('my-image');
var ima = new fabric.Image(img, {
	hasControls: false,
	lockMovementX: true,
	id: 'bg1',
	left: 0,
	top: 0,
	angle: 0,
	opacity: 0
});
canvas.add(ima);
ima.animate('opacity', '1', { 
	onChange: canvas.renderAll.bind(canvas),
	duration: 1000,
	easing: fabric.util.ease.easeOutExpo
});
sss="sdhfkahdjkhfakldjhfalsdfjkalshfdsf:";
var textx = new fabric.Text(sss, { 
	id: 'txt1',
	left: 100, top: 100, fontFamily: 'Arial', fontSize: 20 
});
canvas.add(textx);
*/

var linetext = ['.kaslghgraseuoghdrjkshejkghjdf f djkghsd odgios..', 'this is the beginning of the story. Once upon a time there was a princess in the world beyond the sky named Arc de Jeanne and she lived with her kingdom under the deep realm of eternity which then striked through the abyss of lance.', 'the lines continue', 'to the darkeness','the glasses fall to the depth in the bottom', 'the bottom hold the sea', 'the code activated', 'video playback after counter','the sky looks so cloudy', 'treetop on the map to mind'];

canv = document.getElementById('visual');
ctx = canv.getContext('2d');
ctx.font = '24px sans-serif';
var str = ['Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.', 'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat', 'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat', 'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat'];
// typeOut(str, 25, 25, 32, 10 );


var url = '../resources/ap.jpg';
var count = 0;
var x = -0;
var url = ['../resources/BG011Y.bmp', '../resources/bg15_01b.jpg', '../resources/bg15_05s.jpg'];

function txtren(){
	var textx = new fabric.Text(linetext[count], { 
		id: 'txt2',
		opacity: 0, left: 100, top: 100, fontFamily: 'Arial', fontSize: 20 
	});
	canvas.add(textx);
	textx.animate({ left: 200}, {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutCubic
	});
	textx.animate({ opacity: 1}, {
		onChange: canvas.renderAll.bind(canvas),
		duration: 1000,
		easing: fabric.util.ease.easeInOutCubic
	});
}
function txtrenper(){
	setTimeout(typeOut(linetext[count], 25, 25, 32, 10 ), 1000);
}
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

bgmurl = ['../resources/02.Active.mp3', '../resources/01.Gentle.mp3', '../resources/03.Clam.mp3', '../resources/04.Bound.mp3', '../resources/05.Eventide.mp3', '../resources/01.Gentle.mp3', '../resources/02.Active.mp3'];
chvurl = ['../resources/VOICE.arc_000001.ogg', '../resources/VOICE.arc_000002.ogg', '../resources/VOICE.arc_000003.ogg', '../resources/VOICE.arc_000004.ogg', '../resources/VOICE.arc_000005.ogg', '../resources/VOICE.arc_000006.ogg', '../resources/VOICE.arc_000007.ogg', '../resources/VOICE.arc_000008.ogg', '../resources/VOICE.arc_000009.ogg', '../resources/VOICE.arc_000010.ogg', '../resources/VOICE.arc_000011.ogg', '../resources/VOICE.arc_000012.ogg']
sfxurl = ['../resources/se001.ogg', '../resources/se002.ogg', '../resources/se003.ogg', '../resources/se004.ogg', '../resources/se005.ogg', '../resources/se006.ogg', '../resources/se007.ogg', '../resources/se008.ogg'];
var bgmplay = 0;
var bgmobject = document.getElementById('myaudio');
function sndren(){
	var sound = new Howl({
	  //urls: ['../resources/se001.ogg', '../resources/02.Active.mp3'],
	  urls: [bgmurl[count]],
	  autoplay: false
	});
	
	sound.play();
	bgmplay = 1;
}
function sfxren(){
	var sfx = new Howl({
		id: 'aaa',
		urls: [sfxurl[count]],
		autoplay: true
	});
}

function sndren2(){
	if(bgmplay==1){
	//	audio.pause();
		//unnecessary!bgmplay = 0;
	}
	var audio = new Audio(bgmurl[count]);
	if(typeof audio.loop == 'boolean'){
		audio.loop = true;
	}
	else{
		audio.addEventListener('ended', function(){
			this.currentTime = 0;
			this.play();
		}, false);
	}
	audio.play();
}
//var audio = new Audio(bgmurl[count]);
//	audio.play();
//	bgmplay=1;
//	console.dir(audio);

canvas.on('mouse:down', function(nextline){
	console.log(count);
	//canvas.clear();
	imgren();
	
	if(count%2==1)
		playBgm(bgmurl[count-1]);
	else
		playBgm(bgmurl[count]);
	playChv(chvurl[count-1]);
	
	//sfxren();
	
		
	
	

		//textx.set({ text: 'another world another route to accomplished' });
		//textx.set({ text: linetext[count] });
	//	var xx = canvas.getActiveObject().set("fontSize", "30");
		//canvas.renderAll();
//		canvas.getActiveObject().id = 'alx';

//fail canvas.remove(canvas.item('txt1'));
//canvas.remove(canvas.getActiveObject('alx'));
	
	count++;
});



		



$(document).keypress(function(e){
	if(e.which == 13){
		//...from fabric to count
		//setTimeout(typeOut(linetext[count], 25, 25, 32, 10 ), 1000);
		//canvas.remove(obj.get(''));
		//canvas.remove(canvas.getActiveObject('alx'));
		//count++;
		if(bgmplay==1){
			audio.pause();
			bgmplay=0;
		}
		else{
			audio.play();
			bgmplay=1;
		}
	}
});


var intervaltiming = 1.3;
var canv, ctx;
function typeOut(str, startX, startY, lineHeight, padding) {
	"use strict";
	var cursorX = startX || 0;
	var cursorY = startY || 0;
	var lineHeight = lineHeight || 32;
	padding = padding || 10;
	var i = 0;
	var inter = setInterval(function() {
		var rem = str.substr(i);
		var space = rem.indexOf(' ');
		space = (space === -1)?str.length:space;
		var wordwidth = ctx.measureText(rem.substring(0, space)).width;
		var w = ctx.measureText(str.charAt(i)).width;
		if(cursorX + wordwidth >= canv.width - padding) {
			cursorX = startX;
			cursorY += lineHeight;
		}
		ctx.fillText(str.charAt(i), cursorX, cursorY);
		i++;
		cursorX += w;
		if(i === str.length) {
			clearInterval(inter);
		}
	}, intervaltiming);
}


// Global variable to track current file name.
var bgmnowplaying, chvnowplaying, sfxnowplaying;

function playBgm(bgmurl) {
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var bgm = $("#bgmfront")[0];
			//confusing!var audiosource = bgmurl;

			//Skip loading if current file hasn't changed
			if (bgmurl !== bgmnowplaying) {
				bgm.src = bgmurl;
				bgmnowplaying = bgmurl;
				console.log(bgmnowplaying);
			


				// Tests the paused attribute and set state. 
				if (bgm.paused) {
					bgm.volume = 1;
					//for looping
					if(typeof bgm.loop == 'boolean'){
						bgm.loop = true;
					}
					else{
						bgm.addEventListener('ended', function(){
							this.currentTime = 0;
							this.play();
						}, false);
					}
					bgm.play();
				}
				else {
					bgm.pause();
				}
			}
			else{
				//keep playing
			}
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
		}
	}
}

function playChv(chvurl) {
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var chv = $("#chvfront")[0];
			//confusing!var audiosource = chvurl;

			//Skip loading if current file hasn't changed
			if (chvurl !== chvnowplaying) {
				chv.src = chvurl;
				chvnowplaying = chvurl;
				console.log(chvnowplaying);
			}


			// Tests the paused attribute and set state. 
				chv.volume = 1;
				chv.play();
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
		}
	}
}


</script>