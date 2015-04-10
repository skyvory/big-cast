<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
session_start(); //we need to call PHP's session object to access it through CI
class Home extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->model('user','',TRUE);
		$this->load->library('session');

		if($this->session->userdata('logged_in'))
		{
			$sess = $this->session->userdata('logged_in');
			if($sess['perm']=="librarian") {
				redirect('librarian/search', 'refresh');
			}
		}
		else
		{
			$sess = $this->session->userdata('logged_in');
			redirect('login', 'refresh');
		}
	}

	function index() {
		$sess = $this->session->userdata('logged_in');
		$this->load->view('head');
		$this->load->view('home_view');
		$this->load->view('foot');
	}

	function formsuggestion() {
		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		$sess = $this->session->userdata('logged_in');

		$this->form_validation->set_rules('title', 'Title', 'required');
		$this->form_validation->set_rules('author', 'Author', 'required');
		$this->form_validation->set_rules('publisher', 'Publisher', 'required');
		$this->form_validation->set_rules('isbn', 'ISBN', 'required');
		$this->form_validation->set_rules('edition', 'Edition', 'required');
		$this->form_validation->set_error_delimiters('<div class="error">', '</div>');
		
		if ($this->form_validation->run() == false) {
			$this->load->view('head');
			$this->load->view('formsuggestion_view');
			$this->load->view('foot');
		} else {
			$title = $this->input->post('title');
			$author = $this->input->post('author');
			$publisher = $this->input->post('publisher');
			$isbn = $this->input->post('isbn');
			$edition = $this->input->post('edition');
			$exist = $this->user->checkInventory($isbn);
			if($exist) {
				$this->session->set_flashdata('flashnotification', 'The book you suggested is already exist!');
					redirect('home/formsuggestion', 'refresh');
			}
			else {
				$result = $this->user->insertSuggestion($title, $author, $publisher, $isbn, $edition, $sess['id']);
				if($result) {
					$this->session->set_flashdata('flashnotification', 'Suggestion Submitted!');
					redirect('home/suggestionhistory', 'refresh');
				} else {
					$signature = 'svry';
					$this->form_validation->set_message('formsuggestion', 'Invalid Input Data');
					$this->load->view('head');
					$this->load->view('formsuggestion_view');
					$this->load->view('foot');
				}
			}
		}

	}

	function suggestionhistory() {
		$sess = $this->session->userdata('logged_in');
		$data['sugg'] = $this->user->getSuggestionByUserid($sess['id']);
		$this->load->view('head');
		$this->load->view('suggestionhistory_view', $data);
		$this->load->view('foot');
	}

	function checkifexist() {
		$isbn = $this->input->post('isbn');
		$result = $this->user->checkInventory($isbn);
		$result2 = $this->user->checkSuggestion($isbn);
		if($result) {
			echo "This book is already exist in database!";
		}
		else if($result2) {
			echo "This book is already exist in suggestion data!";
		}
	}
}

?>