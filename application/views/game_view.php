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
				<div class="game-area" style="display: none;">
					<center><canvas id="visual" style="border:2px solid black;"></canvas></center>
				</div>
			</div>
			<!-- <img src="../resources/a.jpg" id="my-image" style="display:none;"> -->
			<audio id="bgmfront"></audio>
			<audio id="voicefront"></audio>
			<audio id="sfxfront"></audio>
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