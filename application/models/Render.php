<?php
Class Render extends CI_Model {
	public function __construct() {
		$this->load->database();
	}
	
	public function start($projectid){
		$id = $projectid;
	}
}
?>