<?php
Class Common extends CI_Model {
	function __construct() {
		$this->load->database();
	}
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
}
?>