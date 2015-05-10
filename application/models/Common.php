<?php
Class Common extends CI_Model {
	function __construct() {
		$this->load->database();
	}
	// LOGIN FUNCTION
	function createUser($username, $password_hash, $salt) {
		$now = date('Y-m-d H:i:s');
		$data = array('username' => $username, 'password' => $password_hash, 'salt' => $salt, 'created_date' => $now, 'fk_permission_id' => "2");
		$exec = $this->db->insert('user', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else{
			return FALSE;
		}
	}
	function getUser($username) {
		$this->db->select('*');
		$this->db->from('user');
		$this->db->where('username', $username);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function isUserExist($username) {
		$this->db->select('username');
		$this->db->from('user');
		$this->db->where('username', $username);
		$result = $this->db->get();
		if($result->num_rows() > 0) {
			return TRUE;
		}
		else {
			return FALSE;
		}
	}
	// PROJECT FUNCTION
	function createProject($title, $user_id) {
		$now = date('Y-m-d H:i:s');
		$data = array('title' => $title, 'created_date' => $now, 'fk_user_id' => $user_id, 'fk_projectstatus_id' => 1);
		$exec =  $this->db->insert('project', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getUserProject($user_id) {
		$this->db->select('*, projectstatus.name as status');
		$this->db->from('project');
		$this->db->join('projectstatus', 'projectstatus_id = fk_projectstatus_id');
		$this->db->where('fk_user_id', $user_id);
		$query = $this->db->get();
		$result = $query->result_array();
		//$result[] = $this->db->get()->row_array();
		return $result;
	}
	function getProject($project_id) {
		$this->db->select('*');
		$this->db->from('project');
		$this->db->where('project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	// RESOURCE FUNCTION
	function createBackgroundResource($name, $file_name, $type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function updateBackgroundResource($id, $name) {
		$data = array('name' => $name);
		$this->db->where('resource_id', $id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function getBackgroundResource($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name, fk_resourcetype_id, fk_project_id');
		//unnecessary!$this->db->select('fk_user_id');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_project_id', $project_id);
		//check user_id for resource authenticity
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_resourcetype_id', 2);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function createSpriteResource($name, $file_name, $character_name, $figure_name, $type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'character_name' => $character_name, 'figure_name' => $figure_name, 'fk_resourcetype_id' => $type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getSpriteResource($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name, character_name, figure_name, expression_name, fk_resourcetype_id, fk_project_id');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_resourcetype_id', 1);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	function updateSpriteResource($resource_id, $character_name, $figure_name, $expression_name) {
		$data = array('character_name' => $character_name, 'figure_name' => $figure_name, 'expression_name' => $expression_name);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function deleteResource($resource_id) {
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->delete('resource');
		return $exec;
	}
	function getResource($resource_id) {
		$this->db->from('resource');
		$this->db->where('resource_id', $resource_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function createAudioResource($name, $file_name, $type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getAudioResource($user_id, $project_id, $type_id) {
		$this->db->select('resource_id, name, file_name, fk_resourcetype_id, fk_project_id');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_resourcetype_id', $type_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function updateAudioResource($resource_id, $name) {
		$data = array('name' => $name);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function createVoiceResource($name, $file_name, $character_name, $type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'character_name' => $character_name, 'fk_resourcetype_id' => $type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource',$data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getVoiceResource($user_id, $project_id, $type_id) {
		$this->db->select('resource_id, name, file_name, character_name, fk_resourcetype_id, fk_project_id');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', $type_id);
		$this->db->where('fk_user_id', $user_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function updateVoiceResource($resource_id, $name, $character_name) {
		$data = array('name' => $name, 'character_name' => $character_name);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function createVideoResource($name, $file_name, $type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getVideoResource($user_id, $project_id, $type_id) {
		$this->db->select('resource_id, name, file_name, fk_resourcetype_id, fk_project_id');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', $type_id);
		$this->db->where('fk_user_id', $user_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function updateVideoResource($resource_id, $name) {
		$data = array('name' => $name);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	// EDITOR FUNCTION
	function getLine($user_id, $project_id, $limit, $offset) {
		$this->db->select('line.line_id, line.sequence, line.label, line.speaker, line.content, line.fk_effect_id, line.jumpto_line_id, line.fk_linetype_id');
		$this->db->from('line');
		$this->db->join('project', 'project.project_id = line.fk_project_id');
		$this->db->where('project.fk_user_id', $user_id);
		$this->db->where('line.fk_project_id', $project_id);
		// join background resource
		$this->db->join('lineres as bgres', 'bgres.fk_line_id = line.line_id', 'left');
		$this->db->select('bg.resource_id as background_resource_id, bg.name as background_name, bg.file_name as background_file_name, bg.fk_resourcetype_id as background_resourcetype');
		$this->db->join('resource as bg', 'bg.resource_id = bgres.fk_resource_id AND bg.fk_resourcetype_id = 2', 'left');
		// join bgm resource
		$this->db->join('lineres as bgmres', 'bgmres.fk_line_id = line.line_id', 'left');
		$this->db->select('bgm.resource_id as bgm_resource_id, bgm.name as bgm_name, bgm.file_name as bgm_file_name, bgm.fk_resourcetype_id as bgm_resourcetype_id');
		$this->db->join('resource as bgm', 'bgm.resource_id = bgmres.fk_resource_id AND bgm.fk_resourcetype_id = 3', 'left');
		// join sfx resource
		$this->db->join('lineres as sfxres', 'sfxres.fk_line_id = line.line_id', 'left');
		$this->db->select('sfx.resource_id as sfx_resource_id, sfx.name as sfx_name, sfx.file_name as sfx_file_name, sfx.fk_resourcetype_id as sfx_resourcetype_id');
		$this->db->join('resource as sfx', 'sfx.resource_id = sfxres.fk_resource_id AND sfx.fk_resourcetype_id = 4', 'left');
		// join voice resource
		$this->db->join('lineres as voiceres', 'voiceres.fk_line_id = line.line_id', 'left');
		$this->db->select('voice.resource_id as voice_resource_id, voice.name as voice_name, voice.file_name as voice_file_name, voice.fk_resourcetype_id as voice_resourcetype_id');
		$this->db->join('resource as voice', 'voice.resource_id = voiceres.fk_resource_id AND voice.fk_resourcetype_id = 5', 'left');
		// join sprite
		$this->db->select('sprite.sprite_id, sprite.fk_resource_id, sprite.position_x, sprite.position_y, sprite.position_z');
		$this->db->join('sprite', 'sprite.fk_line_id = line.line_id', 'left');
		// join sprite resource
		$this->db->select('spriteres.resource_id as sprite_resource_id, spriteres.name as sprite_name, spriteres.file_name as sprite_file_name, spriteres.character_name as sprite_character_name, spriteres.figure_name as sprite_figure_name, spriteres.expression_name as sprite_expression_name');
		$this->db->join('resource as spriteres', 'spriteres.resource_id = sprite.fk_resource_id AND spriteres.fk_resourcetype_id = 1', 'left');
		$this->db->order_by('sequence', 'ASC');
		$this->db->limit($limit, $offset);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getResourceCharacter($user_id, $project_id) {
		$this->db->select('character_name');
		$this->db->distinct();
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 1);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getResourceBackground($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 1);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getResourceBgm($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 3);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getResourceVoice($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 5);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getResourceSfx($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 4);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getLineLabel($user_id, $project_id) {
		$this->db->select('line_id, sequence, label, fk_linetype_id');
		$this->db->from('line');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('label !=', null);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getResourceSprite($user_id, $project_id) {
		$this->db->select('resource_id, name, file_name, character_name, figure_name, expression_name');
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 1);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getEffect() {
		$this->db->select('effect_id, name');
		$this->db->from('effect');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function createLine($project_id, $sequence, $line_type) {
		$this->db->trans_begin();
		$this->db->set('sequence', 'sequence+1', FALSE);
		$this->db->where('sequence >=', $sequence);
		$this->db->update('line');

		$data = array('fk_project_id' => $project_id, 'sequence' => $sequence, 'fk_linetype_id' => $line_type);
		$exec = $this->db->insert('line', $data);
		$insert_id = $this->db->insert_id();
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return $insert_id;
		}
	}
	function createSprite($line_id) {
		$this->db->set('fk_line_id', $line_id);
		$exec = $this->db->insert('sprite');
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
}
?>