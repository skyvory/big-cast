<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Home extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',TRUE);
		$this->load->helper('url');
		if($this->session->userdata('user_auth')) {
			$sess = $this->session->userdata('user_auth');
			if($sess['perm'] == 1) {
				redirect('admin', 'refresh');
			}
		} 
		else {
			redirect('login', 'refresh');
		}
	}

function index() {
	$this->load->helper('url');
	$user = $this->session->userdata('user_auth');
	$head['title'] = "Project";
	$self['user'] = $user;
	$data['project'] = $this->common->getRecentProject($user['id']);
	$data['release'] = $this->common->getLatestRelease();
	$this->load->vars($self);
	$this->load->view('home_head', $head);
	$this->load->view('menu_view');
	$this->load->view('home_view', $data);
	$this->load->view('foot');
}

}

?>