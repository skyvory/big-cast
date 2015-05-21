<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Login extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',true);
		$this->load->helper('url');
	}
	public function index() {
		$this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('form_validation');

		$this->form_validation->set_rules('username', 'Username', 'required|trim');
		$this->form_validation->set_rules('password', 'Password', 'required|trim');

		$head['title'] = "Login";

		if($this->form_validation->run() == false){
			$this->load->view('head', $head);
			$this->load->view('login_view');
			$this->load->view('foot');
		}
		else{
			$username = $this->input->post('username');
			$password = $this->input->post('password');
			$auth = $this->verifyUser($username, $password);
			if($auth){
				if($auth['status'] == "ok"){
					$sess_array = array();
					$sess_array = array('id' => $auth['user_id'], 'name' => $auth['username'], 'perm' => $auth['fk_permission_id']);
					$this->session->set_userdata('user_auth', $sess_array);
					redirect('home', 'location');
				}
				else if($auth['status'] == "useronly"){
					$data['notification'] = "Wrong password!";
					$this->load->view('head', $head);
					$this->load->view('login_view', $data);
					$this->load->view('foot');
				}
				else if($auth['status'] == "nouser"){
					$data['notification'] = "User doesn't exist. Please register!";
					$this->load->view('head', $head);
					$this->load->view('login_view', $data);
					$this->load->view('foot');
				}
			}
			else{
				$data['notification'] = "Access error!";
				$this->load->view('head', $head);
				$this->load->view('login_view', $data);
				$this->load->view('foot');
			}
		}
	}

	public function register(){
		$this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('form_validation');

		$this->form_validation->set_rules('username', 'Username', 'required|is_unique[user.username]|min_length[4]|max_length[16]|alpha_numeric|trim');
		$this->form_validation->set_rules('password', 'Password', 'required|min_length[4]|max_length[32]');

		$head['title'] = "Register";

		if($this->form_validation->run() == false){
			$this->load->view('head', $head);
			$this->load->view('register_view');
			$this->load->view('foot');
		}
		else{
			$username = $this->input->post('username');
			$password = $this->input->post('password');
			$password_repeat = $this->input->post('password_repeat');

			if($password != $password_repeat){
				$data['notification'] = "Password doesn't match. Please re-type your password!";
				$this->load->view('head', $head);
				$this->load->view('register_view', $data);
				$this->load->view('foot');
			}
			else{
				$reg = $this->registerUser($username, $password);
				if($reg){
					$data['notification'] = "Successfully registered. You can now log in.";
					$this->load->view('head', $head);
					$this->load->view('login_view', $data);
					$this->load->view('foot');
				}
			}
		}
	}

	public function checkUsername(){
		$username = $this->input->post('username');
		$match = $this->common->isUserExist($username);
		if($match){
			//return true;
			echo "1";
		}
		else{
			echo "0";
			//return false;
		}
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

	private function verifyUser($username, $password){
		$user = $this->common->getUser($username);
		if($user){
			if(crypt($password, $user['salt']) == $user['password']){
				$user['status'] = "ok";
				return $user;
			}
			else {
				$error['status'] = "useronly";
				return $error;
			}
		}
		else{
			$error['status'] = "nouser";
			return $error;
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

	public function logout() {
		$this->load->helper('url');
		$user_session = $this->session->userdata();
		foreach ($user_session as $key => $value) {
			if($key == 'user_auth') {
				$this->session->unset_userdata($key);
			}
		}
		$this->session->sess_destroy();
		redirect('login', 'refresh');
	}

	// for function testing
	public function alpha() {
		$path_to_resource = './resources/';
		$new_directory = $path_to_resource . '2';
		$make = mkdir($new_directory, 777);
		if($make)
			echo "okay";
		else
			echo "no";
	}

}

?>