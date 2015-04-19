<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',true);
/*
		if($this->session->logged_in) {
			$sess = $this->session->logged_in;
			if($sess['perm']==1)
				redirect('admin', 'refresh');
			else if($sess['perm']==2)
				redirect('home', 'refresh');
		}*/
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
					$sess_array = array('id' => $auth['user_id'], 'user' => $auth['username'], 'perm' => $auth['fk_permission_id']);
					$this->session->set_userdata('logged_in', $sess_array);
					redirect('home', 'refresh');
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

		$head['titles'] = "Register";

		if($this->form_validation->run() == false){
			$this->load->view('head', $head);
			$this->load->view('register_view');
			$this->load->view('foot');
		}
		else{
			$username = $this->input->post('username');
			$password = $this->input->post('password');
			$passwordrepeat = $this->input->post('passwordrepeat');

			if($password != $passwordrepeat){
				$data['notification'] = "Password doesn't match. Please re-type your password!";
				$this->load->view('login', $head);
				$this->load->view('register');
				$this->load->view('foot');
			}
			else{
				$reg = $this->registerUser($username, $password);
				if($reg){
					$data['notification'] = "Successfully registered. You can now log in.";
					$this->load->view('login', $head);
					$this->load->view('login');
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
		$rawsalt = hash('whirlpool', $presalt);//use whirlpool hash for salt
		$salt = '$2a$07$' . $rawsalt . '$';//prefix for blowfish hash
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
			$passwordhash = crypt($password, $salt);
		}
		
		$pass = $this->common->createUser($username, $passwordhash, $salt);
	}


	




	function check_database($password) {
		$username = $this->input->post('username');
		$server = $this->input->post('server');
		$imap = $this->user->login($username, $password, $server);
		if($imap) {
			$result = $this->user->authexistence($imap['username'],$imap['server']);
			if(!$result) {
				$reg = $this->user->registeruser($imap['username'],$imap['server']);
				if(!$reg) {
					$this->load->view('login_view');
				}
			}
			$result2 = $this->user->authselect($imap['username'],$imap['server']);
			if($result2) {
				$sess_array = array();
				if($imap['server'] == 'peter') {
					$sess_array = array(
						'user' => $imap['username'],
						'serv' => 'peter'
					);
					$this->session->set_userdata('logged_in', $sess_array);
				}
				else if($imap['server'] == 'john') {
					$sess_array = array(
						'user' => $imap['username'],
						'serv' => 'john',
						'name' => $result2['nama_mhs']
					);
					$this->session->set_userdata('logged_in', $sess_array);
				}
				return true;
			}
		}
		else {
			return false;
			$this->form_validation->set_message('check_database', 'Username atau password tidak valid');
		}
	}

}

?>