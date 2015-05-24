<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Admin extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',TRUE);
		$this->load->helper('url');
		if($this->session->userdata('user_auth')) {
			$sess = $this->session->userdata('user_auth');
			if($sess['perm'] == 2) {
				redirect('home', 'refresh');
			}
		} 
		else {
			redirect('login', 'refresh');
		}
	}

	function userList() {
		$this->load->helper('url');
		$this->load->helper('form');
		$this->load->library('pagination');
		
		$user = $this->session->userdata('user_auth');
		$head['title'] = "Project";
		
		$self['user'] = $user;
		$page = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$config['base_url'] = base_url() . 'index.php/admin/userList';
		$config['total_rows'] = $this->common->countUserAll();
		$config['per_page'] = 25;
		$config['uri_segment'] = 3;
		$config['num_links'] = 5;
		$config['use_page_numbers'] = false;
		$config['full_tag_open'] = '<nav><ul class="pagination">';
		$config['full_tag_close'] = ' </ul></nav>';
		$config['first_tag_open'] = '<li>';
		$config['first_link'] = '&laquo; First';
		$config['first_tag_close'] = '</li>';
		$config['prev_tag_open'] = ' <li>';
		$config['prev_link'] = '&larr; Prev';
		$config['prev_tag_close'] = '</li>';
		$config['cur_tag_open'] = '<li class="active"><a href="">';
		$config['cur_tag_close'] = '</a></li>';
		$config['num_tag_open'] = '<li>';
		$config['num_tag_close'] = '</li>';
		$config['next_tag_open'] = '<li>';
		$config['next_link'] = 'Next &rarr;';
		$config['next_tag_close'] = '</li>';
		$config['last_tag_open'] = '<li>';
		$config['last_link'] = 'Last &raquo;';
		$config['last_tag_close'] = '</li>';
		$this->pagination->initialize($config);
		$data['page'] = $this->pagination->create_links();
		$data['user'] = $this->common->getUserAll($config['per_page'], $page);

		$this->load->view('admin_head', $head);
		$this->load->view('admin_menu_view', $self);
		$this->load->view('admin_user_view', $data);
		$this->load->view('foot');
	}

	function projectList() {
		$this->load->helper('url');
		$this->load->library('pagination');
		
		$user = $this->session->userdata('user_auth');
		$head['title'] = "Project";
		$self['user'] = $user;
		$page = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$config['base_url'] = base_url() . 'index.php/admin/projectList';
		$config['total_rows'] = $this->common->countProjectAll();
		$config['per_page'] = 25;
		$config['uri_segment'] = 3;
		$config['num_links'] = 5;
		$config['use_page_numbers'] = false;
		$config['full_tag_open'] = '<nav><ul class="pagination">';
		$config['full_tag_close'] = ' </ul></nav>';
		$config['first_tag_open'] = '<li>';
		$config['first_link'] = '&laquo; First';
		$config['first_tag_close'] = '</li>';
		$config['prev_tag_open'] = ' <li>';
		$config['prev_link'] = '&larr; Prev';
		$config['prev_tag_close'] = '</li>';
		$config['cur_tag_open'] = '<li class="active"><a href="">';
		$config['cur_tag_close'] = '</a></li>';
		$config['num_tag_open'] = '<li>';
		$config['num_tag_close'] = '</li>';
		$config['next_tag_open'] = '<li>';
		$config['next_link'] = 'Next &rarr;';
		$config['next_tag_close'] = '</li>';
		$config['last_tag_open'] = '<li>';
		$config['last_link'] = 'Last &raquo;';
		$config['last_tag_close'] = '</li>';
		$this->pagination->initialize($config);
		$data['page'] = $this->pagination->create_links();
		$data['project'] = $this->common->getProjectAll($config['per_page'], $page);

		$this->load->view('admin_head', $head);
		$this->load->view('admin_menu_view', $self);
		$this->load->view('admin_project_view', $data);
		$this->load->view('foot');
	}
	public function viewProject() {
		$this->load->helper('url');
		$this->load->library('pagination');
		
		$user = $this->session->userdata('user_auth');
		$head['title'] = "Project";
		$self['user'] = $user;
		$project_id = $this->uri->segment(3);
		$data['project'] = $this->common->getProjectDetails($project_id);

		$this->load->view('admin_head', $head);
		$this->load->view('admin_menu_view', $self);
		$this->load->view('admin_project_details_view', $data);
		$this->load->view('foot');
	}

	public function register(){
		$this->load->helper('form');
		$this->load->library('form_validation');

		$this->form_validation->set_rules('username', 'Username', 'required|is_unique[user.username]|min_length[4]|max_length[16]|alpha_numeric|trim');
		$this->form_validation->set_rules('password', 'Password', 'required|min_length[4]|max_length[32]');

		$head['title'] = "New User";
		$user = $this->session->userdata('user_auth');
		$self['user'] = $user;
		$this->load->vars($self);

		if($this->form_validation->run() == false){
			$this->load->view('admin_head', $head);
			$this->load->view('admin_menu_view');
			$this->load->view('admin_user_register_view');
			$this->load->view('foot');
		}
		else{
			$username = $this->input->post('username');
			$password = $this->input->post('password');
			$password_repeat = $this->input->post('password_repeat');

			if($password != $password_repeat){
				$data['notification'] = "Password doesn't match. Please re-type your password!";
				$this->load->view('admin_head', $head);
				$this->load->view('admin_menu_view');
				$this->load->view('admin_user_register_view', $data);
				$this->load->view('foot');
			}
			else{
				$reg = $this->registerUser($username, $password);
				if($reg){
					redirect('admin/user');
				}
			}
		}
	}

	private function registerUser($username, $password){
		$salt = $this->generateSalt($username);
		if(CRYPT_BLOWFISH == 1){
			$password_hash = crypt($password, $salt);
		}
		$pass = $this->common->createUser($username, $password_hash, $salt);
		//pass would hold user_id if success
		if($pass != NULL) {
			$path_to_resource = './resources/';
			$new_directory = $path_to_resource . $pass;
			if(!is_dir($new_directory)){
				$make = mkdir($new_directory, 777);
			}
		}
		return $pass;
	}

	public function editUser(){
		$this->load->helper('form');
		$this->load->library('form_validation');

		$user = $this->session->userdata('user_auth');
		$head['title'] = "Edit User";
		$self['user'] = $user;

		if($this->input->post('edit_view')) {
			$head['title'] = "Edit User";
			$user_id = $this->input->post('user_id');
			$data['userdata'] = $this->common->getUserById($user_id);
			$this->load->view('admin_head', $head);
			$this->load->view('admin_menu_view', $self);
			$this->load->view('admin_user_edit_view', $data);
			$this->load->view('foot');
		}
		else {
			$this->form_validation->set_rules('username', 'Username', 'required|min_length[4]|max_length[16]|alpha_numeric|trim');
			if(!empty($password)) {
				$this->form_validation->set_rules('password', 'Password', 'required|min_length[4]|max_length[32]');
			}

			if($this->form_validation->run() == false){
				$user_id = $this->input->post('user_id');
				$data['userdata'] = $this->common->getUserById($user_id);
				$this->load->view('admin_head', $head);
				$this->load->view('admin_menu_view', $self);
				$this->load->view('admin_user_edit_view', $data);
				$this->load->view('foot');
			}
			else{
				$user_id = $this->input->post('user_id');
				$username = $this->input->post('username');
				$password = $this->input->post('password');
				$password_repeat = $this->input->post('password_repeat');
				if(empty($password)) {
					$this->fb->log($user_id);
					$pass = $this->common->updateUserName($user_id, $username);
					if($pass) {
						redirect('admin/user', 'location');
					}
					// error else
				}
				else {
					if($password != $password_repeat){
						$data['error'] = array('error' => "Passwords don't match. Please re-type your password!");
						$data['userdata'] = $this->common->getUserById($user_id);
						$this->load->view('admin_head', $head);
						$this->load->view('admin_menu_view', $self);
						$this->load->view('admin_user_edit_view', $data);
						$this->load->view('foot');
					}
					else{
						$reg = $this->updateUser($user_id, $username, $password);
						if($reg){
							redirect('admin/user', 'location');
						}
					}
				}
			}
		}
	}

	private function updateUser($user_id, $username, $password){
		$salt = $this->generateSalt($username);
		if(CRYPT_BLOWFISH == 1){
			$password_hash = crypt($password, $salt);
		}
		$pass = $this->common->updateUser($user_id, $username, $password_hash, $salt);
		return $pass;
	}

	private function generateSalt($username){
		$prehash = '6f4097b653b5a46bf3e704c292f56c51d0debd834cbb87ce3c9e4d15b79c0f4bc6f99c8b294db3c8aae5aa7bdf1a0435f2ff5aceca5377f8e9c0350e53778206';
		$presalt = $prehash.$username;
		//use whirlpool hash for salt
		$rawsalt = hash('whirlpool', $presalt);
		//prefix for blowfish hash
		$salt = '$2a$07$' . $rawsalt . '$';
		return $salt;
	}

	public function deleteUser() {
		$user_id = $this->input->post('user_id');
		$pass = $this->common->deleteUser($user_id);
		redirect('admin/user', 'location');
	}












	public function setting() {
		$this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('form_validation');
		
		$user = $this->session->userdata('user_auth');
		$project_id = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$this->session->set_userdata('active', $project_id);

		$head['title'] = "Project";
		$self['user'] = $user;
		$data['project'] = $this->common->getProject($project_id);
		
		$this->load->vars($self);
		$this->load->view('project_head', $head);
		$this->load->view('menu_view');
		$this->load->view('project_setting_view', $data);
		$this->load->view('foot');
	}

	public function changeSetting() {
		$this->load->helper('form');
		$this->load->helper('url');

		$this->load->library('form_validation');
		$user = $this->session->userdata('user_auth');
		$project_id = $this->session->userdata('active');
		// $this->fb->log($project_id);

		$self['user'] = $user;
		$head['title'] = "Project";

		// if(is_uploaded_file($_FILES['userfile']['tmp_name'])) {
		if(isset($_FILES['userfile']['tmp_name']) && is_uploaded_file($_FILES['userfile']['tmp_name'])) {
			$config['upload_path'] = './resources/' . $user['id'] . '/' . $project_id . '/';
			$config['allowed_types'] = 'jpg';
			$config['file_name']  = 'cover.jpg';
			$config['overwrite']  = 'true';
			$config['max_size'] = '16000';
			$this->load->library('upload', $config);
			$cover_file = true;
		}
		else {
			$cover_file = false;
			// $this->fb->log($project_id);
		}

		if($this->input->post('status') == true) {
			$publish_check = true;
		}
		else {
			$publish_check = false;
		}

		$this->load->vars($self);
		$this->form_validation->set_rules('title', 'Title', 'required');

		if($this->form_validation->run() == false) {
			$data['project'] = $this->common->getProject($project_id);
			$this->load->view('project_head', $head);
			$this->load->view('menu_view');
			$this->load->view('project_setting_view', $data);
			$this->load->view('foot');
		}
		else if($publish_check == true && $this->checkPublishability($project_id) == false) {
			$publishability = $this->checkPublishability($project_id);
			if($publishability == false) {
				$data['error'] = array('error' => "Your project is not suitable for publishing yet!", 'list' => $this->session->userdata('publishability_error'));
				$data['project'] = $this->common->getProject($project_id);
				$this->load->view('project_head', $head);
				$this->load->view('menu_view');
				$this->load->view('project_setting_view', $data);
				$this->load->view('foot');
			}
		}
		else if($cover_file == true && $this->upload->do_upload() == false) {
			$data['project'] = $this->common->getProject($project_id);
			$data['error'] = array('error' => $this->upload->display_errors());
			$this->load->view('project_head', $head);
			$this->load->view('menu_view');
			$this->load->view('project_setting_view', $data);
			$this->load->view('foot');
		}
		else {
			$title = $this->input->post('title');
			$description = $this->input->post('description');
			$publish = $this->input->post('status');
			if($publish_check == true) {
				$status = 2;
				$published_date = date('Y-m-d H:i:s');
			}
			else {
				$status = 1;
				$published_date = null;
			}
			if($cover_file == true) {
				$cover = 1;
				$this->common->updateCover($cover, $project_id);
			}

			// $this->fb->log($project_id);
			$pass = $this->common->updateProject($title, $description, $status, $published_date, $project_id);
			if($pass) {
				redirect('project', 'location');
			}
			else {
				$data['error'] = array('error' => "error writing to database");
				$this->load->view('project_head', $head);
				$this->load->view('menu_view');
				$this->load->view('project_setting_view', $data);
				$this->load->view('foot');
			}
		}
	}

	private function checkPublishability($project_id) {
		$validity = true;
		$error = array();
		$end_sequence = array();
		$jump_sequence = array();
		// list of line_id where choices jump to
		$jump_point = array();
		// first checking for nomral sequence, then cheking branch
		// branch checked is considered end and valid in place of end (looping problem)
		$line_check = $this->common->getLineForChecking($project_id);
		// $sequential_end = false;
		$temp_sequence = array();
		foreach ($line_check as $key => $value) {
			// echo $value['line_id'] . " ";
			$temp_sequence[] = $value['line_id'];
			// if line jump to another
			if(!empty($value['jumpto_line_id'])) {
				// valid sequence merge
				$jump_sequence = array_merge($jump_sequence, $temp_sequence);
				// clear temp
				$temp_sequence = array();
				// if not a duplicate, add for chekcing later
				if(!in_array($value['jumpto_line_id'], $jump_point)) {
					$jump_point[] = $value['line_id'];
				}
			}
			if($value['fk_linetype_id'] == 2) {
				// valid sequence merge
				$jump_sequence = array_merge($jump_sequence, $temp_sequence);
				// clear temp
				$temp_sequence = array();
				//get list of choice on the line
				$choice_check = $this->common->getChoiceForChecking($value['line_id']);
				foreach ($choice_check as $j_key => $j_value) {
					// if not a duplicate, add for chekcing later
					if(!empty($j_value['jumpto_line_id']) && !in_array($j_value['jumpto_line_id'], $jump_point)) {
						$jump_point[] = $j_value['jumpto_line_id'];
					}
				}
			}
			if($value['fk_linetype_id'] == 4) {
				// $sequential_end = true;
				$end_sequence = array_merge($end_sequence, $temp_sequence);
				$temp_sequence = array();
			}
		}
		// echo "<BR>";
		// check if jump destination is in valid sequence 
		foreach ($jump_point as $key => $value) {
			if(!in_array($value, $end_sequence) && !in_array($value, $jump_sequence)) {
				$seq = $this->common->getLineSequence($value);
				$error[] = "sequence " . $seq . " jump to invalid line";
				$validity = false;
			}
			// echo $value .".<br/>";
		}

		if($end_sequence <= 1) {
			$validity = false;
			$error[] = "you do not have enough lines";
		}
		// check if there's actually ending
		// if(!$end_sequence) {
		// 	$validity = false;
		// 	$error[] = "your visual novel has no ending";
		// }

		// debugging!
		// foreach ($end_sequence as $key => $value) {
		// 	echo $value . " ";
		// }
		// print_r($end_sequence);
		// echo "<BR>";
		// foreach ($jump_sequence as $key => $value) {
		// 	echo $value . " ";
		// }
		// print_r($jump_sequence);
		// echo "<BR>";
		$this->session->set_userdata('publishability_error', $error);
		return $validity;
	}
	

	public function resource($project_id = FALSE) {
		//url helper for redirect
		$this->load->helper('url');
		
		$proj = $this->common->getProject($project_id);
		if($proj) {
			$sess_array = array(
				'id' => $proj['project_id'],
				'title' => $proj['title'],
				'description' => $proj['description'],
				'user' => $proj['fk_user_id'],
				'status' => $proj['fk_projectstatus_id']
			);
			$this->session->set_userdata('active_project', $sess_array);

			redirect('resource/manage/' . $project_id, 'location');
		}
	}

	public function editor($project_id = FALSE) {
		$this->load->helper('url');
		$proj = $this->common->getProject($project_id);
		if($proj) {
			$sess_array = array(
				'id' => $proj['project_id'],
				'title' => $proj['title'],
				'description' => $proj['description'],
				'user' => $proj['fk_user_id'],
				'status' => $proj['fk_projectstatus_id']
			);
			$this->session->set_userdata('active_project', $sess_array);

			redirect('editor/manage/' . $project_id, 'location');
		}
	}


	//in placeholder
	public function loadPublishedProject() {
		$page = 1;
		$sess = $this->session->userdata('user_auth');
		$project_data = $this->common->getUserProject($sess['id']);
	}

}

?>