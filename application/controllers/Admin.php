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
public function userList() {
	$this->load->helper('url');
	$this->load->helper('form');
	$this->load->library('pagination');		
	$user = $this->session->userdata('user_auth');
	$head['title'] = "Project";		
	$self['user'] = $user;
	$page = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
	$config['base_url'] = base_url() . 'index.php/admin/userList';
	$config['total_rows'] = $this->common->countUserAllMember();
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
	$data['user'] = $this->common->getUserAllMember($config['per_page'], $page);
	$this->load->view('admin_head', $head);
	$this->load->view('admin_menu_view', $self);
	$this->load->view('admin_user_view', $data);
	$this->load->view('foot');
}
public function projectList() {
	$this->load->helper('url');
	$this->load->helper('form');
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
	$this->load->helper('form');
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
	$rawsalt = hash('whirlpool', $presalt);
	$salt = '$2a$07$' . $rawsalt . '$';
	return $salt;
}
public function deleteUser() {
	$user_id = $this->input->post('user_id');
	$pass = $this->common->deleteUser($user_id);
	if($pass) {
		$dirPath = FCPATH . 'resources/' . $user_id . '/';
		$this->deleteDir($dirPath);
	}
	redirect('admin/userList', 'location');
}
public function deleteProject() {
	$project_id = $this->input->post('project_id');
	$project = $this->common->getProjectById($project_id);
	if($project) {
		$pass = $this->common->deleteProject($project['fk_user_id'], $project['project_id']);
		if($pass) {
			$dirPath = FCPATH . 'resources/' . $project['fk_user_id'] . '/' . $project['project_id'] . '/';
			$this->deleteDir($dirPath);
			redirect('project');
		}
		redirect('admin/projectList', 'location');
	}
}
private function deleteDirectory($directory_path) {
	if (! is_dir($directory_path)) {
		throw new InvalidArgumentException("Directory not found!");
	}
	if (substr($directory_path, strlen($directory_path) - 1, 1) != '/') {
		$directory_path .= '/';
	}
	$files = glob($directory_path . '*', GLOB_MARK);
	foreach ($files as $file) {
		if (is_dir($file)) {
			self::deleteDirectory($file);
		}
		else {
			unlink($file);
		}
	}
	rmdir($directory_path);
}
}
?>