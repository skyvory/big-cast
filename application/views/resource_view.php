<div class="container-fluid" style="margin: 30px 10px 20px;">
<div id="notification"></div>
<!-- <div id="dropshade"></div> -->
<div class="row">
	<div class="col-md-10 resource-area">

		<?php if(isset($error)) echo($error); ?>
		<?php echo form_open_multipart('home/do_upload'); ?>
		<!--input type="file" multiple name="userfile[]"/-->
		<h3>Select the resource type & upload.</h3>
		<p>You can drop multiple files anywhere or use browse button below.</p>
		<input type="file" id="fileupload" name="userfile" multiple />
		<input type="hidden" id="resourcetype" name="resourcetype" value="1" />
		<!-- <input type="submit" id="upload" value="upload" /> -->
		</form>
		
		<div id="progress">
		<div class="bar" style="width: 0%;"></div>
		</div>

		<p>Select type of rsource 
		<div>
		<ul class="nav nav-tabs resource-navbar">
			<li role="presentation" class="active"><a href="#" id="spritebutton">Sprites</a></li>
			<li role="presentation"><a href="#" id="backgroundbutton">Background</a></li>
			<li role="presentation"><a href="#" id="bgmbutton">BGM</a></li>
			<li role="presentation"><a href="#" id="sfxbutton">SFX</a></li>
			<li role="presentation"><a href="#" id="voicebutton">Voice</a></li>
			<li role="presentation"><a href="#" id="videobutton">Video</a></li>
		</ul>
		</div>
		<div class="resource-preinput">
		</div>
		<span class="request-loading request-loading-resourcelist" style="">
			<img src="../../../assets/images/spinner-rosetta-gray-32x32.gif" alt="Loading..."/>
		</span>
		<div class="resource-list">
		</div>
	</div>

</div>
</div>


<!-- sprite form template
<div class="media sprite-media">
	<div class="media-left sprite-thumbnail-area">
		<img src="'+file.url+'" class="media-object resource-thumbnail" />
	</div>
	<div class="media-body">
		<div class="resource-property">
			<form class="form-horizontal sprite-form">
				<div class="form-group">
					<label for="spritecharactername_'+file.id+'" class="col-sm-3 control-label">Character Name</label>
					<div class="col-sm-5">
					<input type="text" id="spritecharactername_'+file.id+'" name="sprite_character" class="form-control input-sm" value="'+file.character_name+'" />
					</div>
				</div>
				<div class="form-group">
					<label for="spritefigurename_'+file.id+'" class="col-sm-3 control-label">Pose Name</label>
					<div class="col-sm-5">
					<input type="text" id="spritefigurename_'+file.id+'" name="sprite_figure" class="form-control input-sm" value="'+file.figure_name+'" />
					</div>
				</div>
				<div class="form-group">
					<label for="spriteexpressionname_'+file.id+'" class="col-sm-3 control-label">Expression Name</label>
					<div class="col-sm-5">
					<input type="text" id="spriteexpressionname_'+file.id+'" name="sprite_expression" class="form-control input-sm" />
					</div>
				</div>
				<input type="hidden" id="spriteid_'+file.id+'" name="sprite_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary sprite-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger sprite-form-delete-button" tabindex="-1">Delete</button>
			</form>
		</div>
	</div>
</div>
 -->

<!-- background form template
<div class="media background-media">
	<div class="media-left background-thumbnail-area">
		<img src="'+file.url+'" class="media-object resource-thumbnail" />
	</div>
	<div class="media-body">
		<div class="resource-property">
			<form class="form-inline background-form">
				<div class="form-group">
				<label for="backgroundname_'+file.id+'">Name &nbsp;</label>
				<input type="text" id="backgroundname_'+file.id+'" name="background_name" class="form-control input-sm" value="'+file.name+'" />
				</div>
				<input type="hidden" id="backgroundid_'+file.id+'" name="background_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary background-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger background-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
 -->

<!-- bgm form template
<tr><td>
<div class="media bgm-media">
	<div class="media-left audio-thumbnail-area">
		<img src="../../../assets/images/musical_note-512.png" class="media-object resource-thumbnail"/>
	</div>
	<div class="media-body">
		<div class="resource-property">
			<div class="audio-player-area">
				<audio controls preload="none">
					<source src="'+file.url+'">
				</audio>
			</div>
			<form class="form-inline audio-inline-form">
				<div class="form-group bgm-form">
					<label for="bgmname_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="bgmname_'+file.id+'" name="bgm_name" class="form-control input-xs" value="'+file.name+'" />
				</div>
				<input type="hidden" id="bgmid_'+file.id+'" name="bgm_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary bgm-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger bgm-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<!-- sfx form template
<tr><td>
<div class="media sfx-media">
	<div class="media-left audio-thumbnail-area">
		<img src="../../../assets/images/Audio-512.png" class="media-object resource-thumbnail"/>
	</div>
	<div class="media-body">
		<div class="resource-property">
			<div class="audio-player-area">
				<audio controls preload="none">
					<source src="'+file.url+'">
				</audio>
			</div>
			<form class="form-inline audio-inline-form">
				<div class="form-group sfx-form">
					<label for="sfxname_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="sfxname_'+file.id+'" name="sfx_name" class="form-control input-xs" value="'+file.name+'" />
				</div>
				<input type="hidden" id="sfxid_'+file.id+'" name="sfx_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary sfx-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger sfx-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<!-- voice form template
<tr><td>
<div class="media voice-media">
	<div class="media-left audio-thumbnail-area">
		<img src="../../../assets/images/microphone-2-512.png" class="media-object resource-thumbnail"/>
	</div>
	<div class="media-body">
		<div class="resource-property">
			<div class="audio-player-area">
				<audio controls  preload="none">
					<source src="'+file.url+'">
				</audio>
			</div>
			<form class="form-inline audio-inline-form">
				<div class="form-group">
					<label for="voicename_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="voicename_'+file.id+'" name="voice_name" class="form-control input-xs" value="'+file.name+'" />
				</div>
				<div class="form-group">
					<label for="voicecharactername_'+file.id+'">Character Name &nbsp;</label>
					<input type="text" id="voicecharactername_'+file.id+'" name="voicecharacter_name" class="form-control input-xs" value="'+file.character_name+'" />
				</div>
				<input type="hidden" id="voiceid_'+file.id+'" name="voice_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary voice-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger voice-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->

<!-- video form template
<tr><td>
<div class="media video-media">
	<div class="media-left video-player-area">
		<video controls width="300" height="225" class="video-player" preload="none">
			<source src="'+file.url+'">
		</video>
	</div>
	<div class="media-body media-middle">
		<div class="resource-property">
			<form class="form-inline">
				<div class="form-group">
					<label for="videoname_'+file.id+'">Name &nbsp;</label>
					<input type="text" id="videoname_'+file.id+'" name="video_name" class="form-control input-sm" value="'+file.name+'" />
				</div>
				<input type="hidden" id="videoid_'+file.id+'" name="video_id" value="'+file.id+'" />
				<button type="button" class="btn btn-primary video-form-submit-button">Change</button>
				<button type="button" class="btn btn-danger video-form-delete-button">Delete</button>
			</form>
		</div>
	</div>
</div>
</td></tr>
 -->
