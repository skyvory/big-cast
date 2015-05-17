<div class="container-fluid">
	<div id="notification">
		<?php if(isset($error)) echo($error); ?>
	</div>

	<div class="row">
		<div class="col-md-12">
			<div>
				<center>
					<span class="request-loading" style="margin: 0px auto">
						<img src="../../../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."/>
					</span>
				</center>
				<div class="game-area" style="display: none; position: absolute; top:5%; left: 22%;">
					<!-- <center> --><canvas id="visual" style="border:1px solid #6AE5FF;"><!-- </canvas> --></center>
				</div>
				<div class="text-area" style="display: block; position: absolute; top:5%; left: 22%; pointer-events: none;">
					<!-- <center> --><canvas id="text" style="border:3px solid #000000;"><!-- </canvas> --></center>
				</div>
			</div>
			<!-- <img src="../resources/a.jpg" id="my-image" style="display:none;"> -->
			<audio id="bgm_play"></audio>
			<audio id="voice_play"></audio>
			<audio id="sfx_play"></audio>
		</div>
	</div>
</div>
<div class="interface" style="display: none;">
</div>
<div class="image-cache" style="display: none;">
</div>
<div class="audio-cache" style="display: none;">
</div>
<button id="test">test</button>
<!-- <div class="sprite-cache" style="display: none;">
</div>
<div class="background-cache" style="display: none;">
</div> -->