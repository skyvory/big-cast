<?php
Class Game_model extends CI_Model {
	public function __construct() {
		$this->load->database();
	}
	
	function getConfiguration($user_id, $project_id) {
		$this->db->select('configuration_id, fk_fonttype_id, text_speed, bgm_volume, voice_volume, sfx_volume');
		$this->db->from('configuration');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getProject($project_id) {
		// $this->db->select('project_id, title, description, cover, created_date, published_date, updated_date, fk_user_id, fk_projectstatus_id');
		$this->db->from('project');
		$this->db->where('project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getLine($project_id, $limit, $offset) {
		$this->db->select('line_id, sequence, speaker, content, jumpto_line_id, fk_linetype_id');
		$this->db->from('line');
		$this->db->where('fk_project_id', $project_id);
		$this->db->order_by('sequence', 'ASC');
		$this->db->limit($limit, $offset);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getBackground($line_id) {
		$this->db->select('resource_id, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 2);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getBgm($line_id) {
		$this->db->select('resource_id, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 3);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getSfx($line_id) {
		$this->db->select('resource_id, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 4);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getVoice($line_id) {
		$this->db->select('resource_id, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 5);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getSprite($line_id) {
		$this->db->select('sprite_id, character_name, position_x, position_y, position_z, fk_effect_id');
		$this->db->select('resource_id, file_name, character_name, figure_name, expression_name');
		$this->db->from('sprite');
		$this->db->join('resource', 'resource_id = fk_resource_id');
		$this->db->where('fk_line_id', $line_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getChoice($line_id)  {
		$this->db->select('choice_id, content, jumpto_line_id');
		$this->db->from('choice');
		$this->db->where('fk_line_id', $line_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getVideo($line_id) {
		$this->db->select('resource_id, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 6);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getLineSequence($line_id) {
		$this->db->select('sequence');
		$this->db->from('line');
		$this->db->where('line_id', $line_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result['sequence'];
	}
	function getFonttypeAll() {
		$this->db->select('fonttype_id, name');
		$this->db->from('fonttype');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function isExistUserConfiguration($user_id, $project_id) {
		$this->db->from('configuration');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$query = $this->db->get();
		if($query->num_rows() > 0) {
			return TRUE;
		}
		else {
			return FALSE;
		}
	}
	function createConfiguration($fonttype_id, $text_speed, $bgm_volume, $voice_volume, $sfx_volume, $user_id, $project_id) {
		$data = array('fk_fonttype_id' => $fonttype_id, 'text_speed' => $text_speed, 'bgm_volume' => $bgm_volume, 'voice_volume' => $voice_volume, 'sfx_volume' => $sfx_volume, 'fk_user_id' => $user_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('configuration', $data);
		return $exec;
	}
	function updateConfiguration($fonttype_id, $text_speed, $bgm_volume, $voice_volume, $sfx_volume, $user_id, $project_id) {
		$data = array('fk_fonttype_id' => $fonttype_id, 'text_speed' => $text_speed, 'bgm_volume' => $bgm_volume, 'voice_volume' => $voice_volume, 'sfx_volume' => $sfx_volume);
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$exec = $this->db->update('configuration', $data);
		return $exec;
	}
	function getSaveData($user_id, $project_id) {
		$this->db->select('savedata_id, save_date, fk_line_id, fk_savedatatype_id');
		$this->db->from('savedata');
		$this->db->where('fk_savedatatype_id', 1);
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->limit(10);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function createSaveData($line_id, $user_id, $save_data_type_id, $project_id) {
		$now = date("Y-m-d H:i:s");
		$data = array('save_date' => $now, 'fk_line_id' => $line_id, 'fk_user_id' => $user_id, 'fk_savedatatype_id' => $save_data_type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('savedata', $data);
		return $exec;
	}
	function updateSaveData($save_data_id, $line_id, $user_id, $save_data_type_id, $project_id) {
		$now = date("Y-m-d H:i:s");
		$data = array('save_date' => $now, 'fk_line_id' => $line_id, 'fk_user_id' => $user_id, 'fk_savedatatype_id' => $save_data_type_id, 'fk_project_id' => $project_id);
		$this->db->where('savedata_id', $save_data_id);
		$exec = $this->db->update('savedata', $data);
		return $exec;
	}
	function isQuickSaveDataExist($user_id, $project_id) {
		$this->db->from('savedata');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$query = $this->db->get();
		if($query->num_rows() > 0) {
			return TRUE;
		}
		else {
			return FALSE;
		}
	}
	function createQuickSaveData($line_id, $user_id, $project_id) {
		$now = date("Y-m-d H:i:s");
		$data = array('save_date' => $now, 'fk_line_id' => $line_id, 'fk_user_id' => $user_id, 'fk_savedatatype_id' => "2",'fk_project_id'  => $project_id);
		$exec = $this->db->insert('savedata', $data);
		return $exec;
	}
	function updateQuickSaveData($line_id, $user_id, $project_id) {
		$now = date("Y-m-d H:i:s");
		$data = array('save_date' => $now, 'fk_line_id' => $line_id);
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$exec = $this->db->update('savedata', $data);
		return $exec;
	}
	function getQuickSaveData($user_id, $project_id) {
		$this->db->from('savedata');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
}
?>