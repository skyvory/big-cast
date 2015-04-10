<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',true);

		if($this->session->logged_in) {
			$sess = $this->session->logged_in;
			if($sess['perm']==1)
				redirect('admin', 'refresh');
			else if($sess['perm']==2)
				redirect('home', 'refresh');
		}
	}
	public function index() {
		$this->load->helper('form');
		$this->load->library('form_validation');
		$this->load->helper('url');

		$this->form_validation->set_rules('username', 'Username', 'required');
		$this->form_validation->set_rules('password', 'Password', 'required');

		$data['title'] = "Login";

		if($this->form_validation->run() == false){
			$this->load->view('head', $data);
			$this->load->view('login_view');
			$this->load->view('foot');
		}
		else{
			$username = $this->input->post('username');
			$password = $this->input->post('password');
			$auth = $this->verifyUser($username, $password);
			if($auth){
				$sess_array = array();
				$sess_array = array('id' => $auth['user_id'], 'user' => $auth['username'], 'perm' => $auth['FK_permission_id']);
				$this->session->set_userdata('logged_in', $sess_array);
				redirect('home', 'refresh');
			}
			else{
				$data['notification'] = "Username or Password is not valid!";
				$this->load->view('head', $data);
				$this->load->view('login_view', $data);
				$this->load->view('foot');
			}

		}
		//$this->load->view('head', $data);
		//$this->load->view('login_view');
		//$this->load->view('foot');
	}
	public function GenerateSalt($username){
		$prehash = '6f4097b653b5a46bf3e704c292f56c51d0debd834cbb87ce3c9e4d15b79c0f4bc6f99c8b294db3c8aae5aa7bdf1a0435f2ff5aceca5377f8e9c0350e53778206';
		$presalt = $prehash.$username;
		$rawsalt = hash('whirlpool', $presalt);
		$salt = '$2a$07$' . $rawsalt . '$';//use whirlpool hash for salt
		return $salt;
	}
	public function verifyUser($username, $password){
		$user = $this->common->getUser($username);
		if($user){
			//if(crypt($password, $user['salt']) == $user[])
			echo $user['salt'];
		}
		else echo "error";
	}

	public function register($username, $password){
		$salt = $this->GenerateSalt($username);
		if(CRYPT_BLOWFISH == 1){
			$passwordhash = crypt($password, $salt);
		}
		
		$this->common->createUser($username, $passwordhash, $salt);
	}


	public function verifylogin() {
		$username = $this->input->post('username');
		$password = $this->input->post('password');
		$server = $this->input->post('server');

		$filter = $this->user->authfilter($username, $server);
		if(!$filter) {
			$data['redirectnotification'] = 'Failed to log in. You are not authorized.';
			$this->load->view('notification_view', $data);
			$this->output->set_header('refresh:3;url=login');
		}
		else {
			$this->load->library('form_validation');
			$this->form_validation->set_rules('server', 'Server', 'required');
			$this->form_validation->set_rules('username', 'Username', 'trim|required|xss_clean');
			$this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean|callback_check_database');

			if($this->form_validation->run() == false) {
				$loginnotification = 'Username atau password tidak valid.';
				$this->session->set_flashdata('loginnotification', $loginnotification);
				redirect('login', 'refresh');
			}
			else {
				redirect('home', 'refresh');
			}
		}
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