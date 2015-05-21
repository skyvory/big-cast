<div class="container-fluid">
	<div id="notification">
		<?php if(isset($error)) echo($error); ?>
	</div>

	<div class="row">
		<div class="col-md-12">
			<div style="position: fixed; left: 50%; top: 50%;">
				<span class="request-loading">
					<img src="../../../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."/>
				</span>
			</div>
			<div style="width: 800px; margin: 0 auto;">
				<div class="log-outer">
					<div class="log-area" style="display: none;">
					</div>
				</div>
				<div class="game-area" style="display: none; position: fixed;">
					<!-- <center> --><canvas id="visual"></canvas><!-- </center> -->
				</div>
				<div class="text-area" style="display: block; position: fixed; pointer-events: none;">
					<!-- <center> --><canvas id="text" style="border: none;"></canvas><!-- </center> -->
				</div>
				<div class="video-area" style="display: none; position: fixed; background-color: black; pointer-events: none;"></div>
			</div>
			<button id="test">test</button>
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
