<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Release extends CI_Controller {

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

	// function index() {}

	function latest() {
		// $this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('pagination');
		
		$user = $this->session->userdata('user_auth');
		$head['title'] = "Release";
		$self['user'] = $user;
		$page = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$config['base_url'] = base_url() . 'index.php/release/new';
		$config['total_rows'] = $this->common->countPublishedProject();
		$config['per_page'] = 10;
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

		$data['release'] = $this->common->getPublishedProjectLatest($config['per_page'], $page);
		$data['order'] = "latest";
		$this->load->vars($self);
		$this->load->view('release_head', $head);
		$this->load->view('menu_view');
		$this->load->view('release_view', $data);
		$this->load->view('foot');
	}

	function alphabetical() {
		// $this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('pagination');
		
		$user = $this->session->userdata('user_auth');
		$head['title'] = "Release";
		$self['user'] = $user;
		$page = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$config['base_url'] = base_url() . 'index.php/release/new';
		$config['total_rows'] = $this->common->countUserProject($user['id']);
		$config['per_page'] = 10;
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

		$data['release'] = $this->common->getPublishedProjectAlphabetical($config['per_page'], $page);
		$data['order'] = "alphabetical";
		$this->load->vars($self);
		$this->load->view('release_head', $head);
		$this->load->view('menu_view');
		$this->load->view('release_view', $data);
		$this->load->view('foot');
	}
}

?>