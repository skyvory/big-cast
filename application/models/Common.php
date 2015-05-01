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

	function createBackgroundResource($name, $file_name, $resourcetype_id, $project_id) {
		$data = array('name' => $name, 'file_name' => $file_name, 'fk_resourcetype_id' => $resourcetype_id, 'fk_project_id' => $project_id);
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
}
?>