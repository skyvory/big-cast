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
		$query = $this->db->get();
		if($query->num_rows() > 0) {
			return TRUE;
		}
		else {
			return FALSE;
		}
	}




	// ADMIN FUNCTION
	function getUserAllMember($limit, $offset) {
		$this->db->from('user');
		$this->db->limit($limit, $offset);
		$this->db->where('fk_permission_id', 2);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function countUserAll() {
		$this->db->from('user');
		$this->db->join('permission', 'permission_id = fk_permission_id');
		$count = $this->db->count_all_results();
		return $count;
	}
	function getProjectAll($limit, $offset) {
		$this->db->from('project');
		$this->db->join('projectstatus', 'projectstatus_id = fk_projectstatus_id');
		$this->db->join('user', 'user_id = fk_user_id');
		$this->db->limit($limit, $offset);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getProjectDetails($project_id) {
		$this->db->from('project');
		$this->db->join('projectstatus', 'projectstatus_id = fk_projectstatus_id');
		$this->db->join('user', 'user_id = fk_user_id');
		$this->db->where('project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function countProjectAll() {
		$this->db->from('project');
		$count = $this->db->count_all_results();
		return $count;
	}
	function getUserById($user_id) {
		$this->db->from('user');
		$this->db->where('user_id', $user_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function updateUserName($user_id, $username) {
		$this->db->set('username', $username);
		$this->db->where('user_id', $user_id);
		$exec = $this->db->update('user');
		return $exec;
	}
	function updateUser($user_id, $username, $password_hash, $salt) {
		$data = array('username' => $username, 'password' => $password_hash, 'salt' => $salt);
		$this->db->where('user_id', $user_id);
		$exec = $this->db->update('user', $data);
		return $exec;
	}
	function deleteUser($user_id) {
		$this->db->where('user_id', $user_id);
		$this->db->delete('user');
		$affect = $this->db->affected_rows();
		if($affect > 0) {
			return true;
		}
		else {
			return false;
		}
	}
	function countUserAllMember() {
		$this->db->from('user');
		$this->db->join('permission', 'permission_id = fk_permission_id');
		$this->db->where('fk_permission_id', 2);
		$count = $this->db->count_all_results();
		return $count;
	}
	function getProjectById($project_id) {
		$this->db->from('project');
		$this->db->where('project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}






	// HOME FUNCTION
	function getRecentProject($user_id) {
		$this->db->select('*, projectstatus.name as status');
		$this->db->from('project');
		$this->db->join('projectstatus', 'projectstatus_id = fk_projectstatus_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->limit(3);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getLatestRelease() {
		$this->db->from('project');
		$this->db->join('user', 'user_id = fk_user_id');
		$this->db->where('fk_projectstatus_id', 2);
		$this->db->limit(3);
		$this->db->order_by('published_date', 'DESC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}






	// PROJECT FUNCTION
	function createProject($title, $description, $user_id) {
		$now = date('Y-m-d H:i:s');
		$data = array('title' => $title, 'description' => $description, 'created_date' => $now, 'fk_user_id' => $user_id, 'fk_projectstatus_id' => 1);
		$exec =  $this->db->insert('project', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getUserProject($user_id, $limit, $offset) {
		$this->db->select('*, projectstatus.name as status');
		$this->db->from('project');
		$this->db->join('projectstatus', 'projectstatus_id = fk_projectstatus_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->limit($limit, $offset);
		$this->db->order_by('project_id', 'ASC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getProject($user_id, $project_id) {
		$this->db->from('project');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('project_id', $project_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function countUserProject($user_id) {
		$this->db->from('project');
		$this->db->where('fk_user_id', $user_id);
		$count = $this->db->count_all_results();
		return $count;
	}
	function updateProject($title, $description, $project_id) {
		$data = array('title' => $title, 'description' => $description);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project', $data);
		return $exec;
	}
	function updateCover($cover, $project_id) {
		$this->db->set('cover', $cover);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project');
		return $exec;
	}
	function getLineForChecking($project_id) {
		$this->db->select('line_id, sequence, jumpto_line_id, fk_linetype_id');
		$this->db->from('line');
		$this->db->where('line.fk_project_id', $project_id);
		$this->db->order_by('sequence', 'ASC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getChoiceForChecking($line_id) {
		$this->db->select('choice_id, choice.jumpto_line_id');
		$this->db->from('choice');
		$this->db->where('fk_line_id', $line_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function updateProjectStatus($project_id, $status_id) {
		$this->db->set('fk_projectstatus_id', $status_id);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project');
		return $exec;
	}
	function deleteProject($user_id, $project_id) {
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('project_id', $project_id);
		$this->db->delete('project');
		$affect = $this->db->affected_rows();
		if($affect > 0) {
			return true;
		}
		else {
			return false;
		}
	}
	function updateProjectToPublish($project_status_id, $published_date, $project_id) {
		$data = array('fk_projectstatus_id' => $project_status_id, 'published_date' => $published_date);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project', $data);
		return $exec;
	}
	function getLineJumpToId($line_id) {
		$this->db->select('sequence');
		$this->db->from('line');
		$this->db->where('jumpto_line_id', $line_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function updateProjectDate($project_id) {
		$now = date('Y-m-d H:i:s');
		$this->db->set('updated_date', $now);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project');
		return $exec;
	}
	function updateTitleBackground($cover, $project_id) {
		$this->db->set('title_background', $cover);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project');
		return $exec;
	}
	function updateSavedataBackground($cover, $project_id) {
		$this->db->set('savedata_background', $cover);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project');
		return $exec;
	}
	function updateConfigurationBackground($cover, $project_id) {
		$this->db->set('configuration_background', $cover);
		$this->db->where('project_id', $project_id);
		$exec = $this->db->update('project');
		return $exec;
	}





	// RELEASE FUNCTION
	function getPublishedProjectLatest($limit, $offset) {
		$this->db->from('project');
		$this->db->join('user', 'user_id = fk_user_id');
		$this->db->where('fk_projectstatus_id', 2);
		$this->db->limit($limit, $offset);
		$this->db->order_by('published_date', 'DESC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	function getPublishedProjectAlphabetical($limit, $offset) {
		$this->db->from('project');
		$this->db->join('user', 'user_id = fk_user_id');
		$this->db->where('fk_projectstatus_id', 2);
		$this->db->limit($limit, $offset);
		$this->db->order_by('title', 'ASC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function countPublishedProject() {
		$this->db->from('project');
		$this->db->where('fk_projectstatus_id', 2);
		$count = $this->db->count_all_results();
		return $count;
	}





	// RESOURCE FUNCTION
	function createBackgroundResource($name, $file_name, $resource_type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $resource_type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function updateBackgroundResource($project_id, $resource_id, $name) {
		$data = array('name' => $name);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function getProjectResourceByType($project_id, $resource_type_id) {
		$this->db->select('resource_id, name, file_name, fk_resourcetype_id, fk_project_id');
		$this->db->from('resource');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', $resource_type_id);
		$this->db->order_by('name', 'ASC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function createSpriteResource($name, $file_name, $character_name, $figure_name, $resource_type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'character_name' => $character_name, 'figure_name' => $figure_name, 'fk_resourcetype_id' => $resource_type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getSpriteResource($project_id) {
		$this->db->select('resource_id, name, file_name, character_name, figure_name, expression_name, fk_resourcetype_id, fk_project_id');
		$this->db->from('resource');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 1);
		$this->db->order_by('character_name, figure_name, expression_name, name', 'ASC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	function updateSpriteResource($project_id, $resource_id, $character_name, $figure_name, $expression_name) {
		$data = array('character_name' => $character_name, 'figure_name' => $figure_name, 'expression_name' => $expression_name);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function deleteResource($project_id, $resource_id) {
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('resource_id', $resource_id);
		$this->db->delete('resource');
		$affect = $this->db->affected_rows();
		$this->fb->log("affect", $affect);
		if($affect > 0) {
			return true;
		}
		else {
			return false;
		}
		return $exec;
	}
	function getResource($project_id, $resource_id) {
		$this->db->from('resource');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('resource_id', $resource_id);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function createAudioResource($name, $file_name, $resource_type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $resource_type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function updateAudioVideoResource($project_id, $resource_id, $name) {
		$data = array('name' => $name);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function createVoiceResource($name, $file_name, $resource_type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $resource_type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource',$data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function updateVoiceResource($resource_id, $name) {
		$data = array('name' => $name);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}
	function createVideoResource($name, $file_name, $resource_type_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $resource_type_id, 'fk_project_id' => $project_id);
		$exec = $this->db->insert('resource', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function updateVideoResource($resource_id, $name) {
		$data = array('name' => $name);
		$this->db->where('resource_id', $resource_id);
		$exec = $this->db->update('resource', $data);
		return $exec;
	}










	// EDITOR FUNCTION
	function getLine($project_id, $limit, $offset) {
		$this->db->select('line.line_id, line.sequence, line.label, line.speaker, line.content, line.jumpto_line_id, line.fk_linetype_id');
		$this->db->from('line');
		$this->db->where('line.fk_project_id', $project_id);
		$this->db->order_by('sequence', 'ASC');
		// join and select for jumpto_line_id label name
		$this->db->select('ref_line.label as jumpto_line_label');
		$this->db->join('line as ref_line', 'ref_line.line_id = line.jumpto_line_id', 'left');
		$this->db->limit($limit, $offset);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getTotalLine($project_id) {
		$this->db->from('line');
		$this->db->where('fk_project_id', $project_id);
		$result = $this->db->count_all_results();
		return $result;
	}
	function getLineSequenceByLabel($project_id, $label) {
		$this->db->select('sequence');
		$this->db->from('line');
		$this->db->where('line.fk_project_id', $project_id);
		$this->db->like('label', $label, 'after');
		$this->db->limit(1);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result['sequence'];
	}
	function getBackground($line_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 2);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getBgm($line_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 3);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getSfx($line_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 4);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getVoice($line_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 5);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	function getSprite($line_id) {
		$this->db->select('sprite_id, fk_resource_id, position_x, position_y, position_z, fk_effect_id, emphasize');
		$this->db->select('name, file_name, character_name, figure_name, expression_name');
		$this->db->from('sprite');
		$this->db->join('resource', 'resource_id = fk_resource_id');
		$this->db->where('fk_line_id', $line_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getChoice($line_id)  {
		$this->db->select('choice_id, choice.content, choice.jumpto_line_id');
		$this->db->from('choice');
		$this->db->where('fk_line_id', $line_id);
		// join and select for jumpto_line_id label name
		$this->db->select('ref_line.label as jumpto_line_label');
		$this->db->join('line as ref_line', 'ref_line.line_id = choice.jumpto_line_id', 'left');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getVideo($line_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->join('lineres', 'fk_resource_id = resource_id');
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', 6);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}
	// AUTOCOMPLETE LIST
	function getResourceCharacter($user_id, $project_id) {
		$this->db->select('character_name');
		$this->db->distinct();
		$this->db->from('resource');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 1);
		$this->db->order_by('name', 'ASC');
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function getSpeakerAll($user_id, $project_id) {
		$this->db->select('speaker');
		$this->db->distinct();
		$this->db->from('line');
		$this->db->join('project', 'project_id = fk_project_id');
		$this->db->where('fk_user_id', $user_id);
		$this->db->where('fk_project_id', $project_id);
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
		$this->db->where('fk_resourcetype_id', 2);
		$this->db->order_by('name', 'ASC');
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
		$this->db->order_by('name', 'ASC');
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
		$this->db->order_by('name', 'ASC');
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
		$this->db->order_by('name', 'ASC');
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
		$this->db->order_by('character_name, figure_name, expression_name, name', 'ASC');
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
	function getResourceVideo($project_id) {
		$this->db->select('resource_id, name, file_name');
		$this->db->from('resource');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_resourcetype_id', 6);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	function createLine($project_id, $sequence, $line_type) {
		$this->db->trans_begin();
		$this->db->set('sequence', 'sequence+1', FALSE);
		$this->db->where('sequence >=', $sequence);
		$this->db->where('fk_project_id', $project_id);
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
	function deleteLine($line_id, $project_id) {
		$this->db->trans_begin();
		$this->db->select('sequence');
		$this->db->from('line');
		$this->db->where('line_id', $line_id);
		$query = $this->db->get();
		$result = $query->row_array();
		$line_sequence = $result['sequence'];

		$this->db->where('line_id', $line_id);
		$this->db->delete('line');

		$this->db->set('sequence', 'sequence-1', FALSE);
		$this->db->where('sequence >', $line_sequence);
		$this->db->where('fk_project_id', $project_id);
		$this->db->update('line');
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return TRUE;
		}
	}
	function updateTextLine($project_id, $line) {
		$this->db->trans_begin();
		foreach ($line as $key => $value) {
			$data = array(
				'sequence' => $value['sequence'],
				'label' => $value['label'],
				'speaker' => $value['speaker'],
				'content' => $value['content'],
				'jumpto_line_id' => $value['jumpto_line_id']
			);
			$this->db->where('fk_project_id', $project_id);
			$this->db->where('line_id', $value['line_id']);
			$exec = $this->db->update('line', $data);
		}
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return TRUE;
		}
	}
	function createSprite($sprite) {
		$this->db->trans_begin();
		$sprite_create_status = array();
		foreach ($sprite as $key => $value) {
			$data = array(
				'fk_resource_id' => $value['fk_resource_id'],
				'position_x' => $value['position_x'],
				'position_y' => $value['position_y'],
				'position_z' => $value['position_z'],
				'emphasize' => $value['emphasize'],
				'fk_effect_id' => $value['fk_effect_id'],
				'fk_line_id' => $value['fk_line_id'],
			);
			$exec = $this->db->insert('sprite', $data);
			$insert_id = $this->db->insert_id();
			if($exec) {
				$sprite_create_status[] = array(
					// in case using sequence as reference, possible of update misplaced if sequence changed during save request
					'fk_line_id' => utf8_encode($value['fk_line_id']),
					'sprite_temp_index' => utf8_encode($value['sprite_temp_index']),
					'sprite_id' => utf8_encode($insert_id)
				);
			}
		}
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return $sprite_create_status;
		}
	}
	function updateSprite($sprite) {
		$this->db->trans_begin();
		foreach ($sprite as $key => $value) {
			$data = array(
				'fk_resource_id' => $value['fk_resource_id'],
				'position_x' => $value['position_x'],
				'position_y' => $value['position_y'],
				'position_z' => $value['position_z'],
				'emphasize' => $value['emphasize'],
				'fk_effect_id' => $value['fk_effect_id'],
				'fk_line_id' => $value['fk_line_id'],
			);
			$this->db->where('sprite_id', $value['sprite_id']);
			$exec = $this->db->update('sprite', $data);
		}
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return TRUE;
		}
	}
	function deleteSprite($sprite_id) {
		$this->db->where_in('sprite_id', $sprite_id);
		$exec = $this->db->delete('sprite');
		return $exec;
	}
	function getLineres($project_id, $line_id, $resource_type_id) {
		$this->db->from('lineres');
		$this->db->join('resource', 'resource_id = fk_resource_id');
		$this->db->where('fk_project_id', $project_id);
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resourcetype_id', $resource_type_id);
		$query = $this->db->get();
		$result = $query->row_array();
		if($query->num_rows() > 0) {
			return $result;
		}
		else {
			return FALSE;
		}
	}
	function updateLineres($line_id, $resource_id, $old_resource_id) {
		$this->db->set('fk_resource_id', $resource_id);
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resource_id', $old_resource_id);
		$exec = $this->db->update('lineres');
		return $exec;
	}
	function createLineres($line_id, $resource_id) {
		$this->db->set('fk_line_id', $line_id);
		$this->db->set('fk_resource_id', $resource_id);
		$exec = $this->db->insert('lineres');
		return $exec;
	}
	function deleteLineres($line_id, $resource_id) {
		$this->db->where('fk_line_id', $line_id);
		$this->db->where('fk_resource_id', $resource_id);
		$exec = $this->db->delete('lineres');
		return $exec;
	}
	function createChoice($choice) {
		$this->db->trans_begin();
		$choice_create_status = array();
		foreach ($choice as $key => $value) {
			$data = array(
				'content' => $value['content'],
				'jumpto_line_id' => $value['jumpto_line_id'],
				'fk_line_id' => $value['fk_line_id']
			);
			$exec = $this->db->insert('choice', $data);
			$insert_id = $this->db->insert_id();
			if($exec) {
				$choice_create_status[] = array(
					// in case using sequence as reference, possible of update misplaced if sequence changed during save request
					'fk_line_id' => $value['fk_line_id'],
					'choice_temp_index' => $value['choice_temp_index'],
					'choice_id' => $insert_id
				);
			}
		}
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return $choice_create_status;
		}
	}
	function updateChoice($choice) {
		$this->db->trans_begin();
		foreach ($choice as $key => $value) {
			$data = array(
				'content' => $value['content'],
				'jumpto_line_id' => $value['jumpto_line_id']
			);
			$this->db->where('choice_id', $value['choice_id']);
			$exec = $this->db->update('choice', $data);
		}
		if($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return FALSE;
		}
		else {
			$this->db->trans_commit();
			return TRUE;
		}
	}
	function updateLineLabel($line_id, $label) {
		$this->db->set('label', $label);
		$this->db->where('line_id', $line_id);
		$exec = $this->db->update('line');
		return $exec;
	}
}
?>