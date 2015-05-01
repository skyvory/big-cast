<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Resource extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',TRUE);
		/*
		if($this->session->userdata('logged_in')) {
			$sess = $this->session->userdata('logged_in');
			if($sess['serv']=='peter')
				redirect('admin', 'refresh');
		} else {
			redirect('login', 'refresh');
		}
		*/
	}

	function index() {
		$this->load->helper('form');
		$this->load->helper('url');
		
		$data['sess'] = $this->session->userdata('logged_in');
		$head['title'] = "Resource";

		$this->load->vars($data);
		
		$this->load->view('resource_head', $head);
		$this->load->view('menu_view');
		$this->load->view('resource_view');
		$this->load->view('foot');
		$this->fb->log("init okay");
	}

	function manage($projectid = FALSE) {
		$this->load->helper('form');
		$this->load->helper('url');
		
		$data['sess'] = $this->session->userdata('logged_in');
		$head['title'] = "Resource";

		$this->load->vars($data);
		
		$this->load->view('resource_head', $head);
		$this->load->view('menu_view');
		$this->load->view('resource_view');
		$this->load->view('foot');
		$this->fb->log("init okay");
	}

	function do_upload(){
		$config['upload_path'] = '../../resources/';
		$config['allowed_types'] = 'jpg|png';
		$config['max_size'] = '3000';
		$config['overwrite'] = TRUE;
		$this->load->library('upload', $config);
		$files = $_FILES;
		$iserror = FALSE;
		$filecount = count($_FILES['userfile']['name']);
		for($i=0; $i<$filecount; $i++){
			$_FILES['userfile']['name'] = $files['userfile']['name'][$i];
			$_FILES['userfile']['type'] = $files['userfile']['type'][$i];
			$_FILES['userfile']['tmp_name']= $files['userfile']['tmp_name'][$i];
			$_FILES['userfile']['error']= $files['userfile']['error'][$i];
			$_FILES['userfile']['size']= $files['userfile']['size'][$i];

			if($this->upload->do_upload() == FALSE){
				$iserror = TRUE;
				$error = array('error' => $this->upload->display_errors());
			}
			else{
				//sweet
			}
		}
		if($isserror == TRUE){
			$this->load->helper(array('url', 'form'));
			$this->load->view('resource_view', $error);
		}
	}
	
	public function uploadto(){
		//$this->fb->log("accessed");
		$resourcetype = $this->input->post('restype');
		$this->fb->log($resourcetype);
		$this->load->library('UploadHandler');
		$this->load->helper('url');
		$upload_path_url = base_url() . 'resources/';

		$config['upload_path'] = FCPATH . 'resources/';
		$config['allowed_types'] = 'jpg';
		$config['max_size'] = '600000';
		

		$this->load->library('upload', $config);

		if($this->upload->do_upload() == FALSE){
			$error = array('error' => $this->upload->display_errors());
			$this->load->view('home_view', $error);
		}
		else{
			$data = $this->upload->data();
			$config['source_image'] = $data['full_path'];
			$config['new_image'] =  FCPATH . 'resources/thumbs/';
			$config['maintain_ratio'] = TRUE;
			$config['width'] = 80;
			$config['height'] = 80;

			$this->load->library('image_lib', $config);
			if($this->image_lib->resize() == FALSE){
				$this->fb->log($this->image_lib->display_errors());
			}

			$info = new StdClass;
			$info->name = $data['file_name'];
			$info->size = $data['file_size'];
			$info->type = $data['file_type'];
			$info->url = $upload_path_url . $data['file_name'];
			$info->error = null;
			$info->delete_type = 'DELETE';
			//possible that original template only  acknowledge json object
			// $info['name'] = $data['file_name'];
			// $info['size'] = $data['file_size'];
			// $info['type'] = $data['file_type'];
			// $info['url'] = $upload_path_url . $data['file_name'];
			// $info['delete_type'] = 'DELETE';
			//just for checking!$this->fb->log($info);
			if($this->input->is_ajax_request()){
				echo json_encode(array($info));
				var_dump(array($info));
				//$this->output->set_content_type('application/json')->set_output(json_encode(array($info)));
				$this->fb->log("ok");
			}
			else{
				exit('No direct script access allowed');
			}
		}
	}
	
	//unnecessary?
	public function deleteImage($file){
		$success = unlink(FCPATH . 'resources/' . $file);
		$info->success = $success;
		$info->path = base_url() . 'resources/' . $file;
		$info->file = is_file(FC_PATH . 'resources/' . $file);

		if($this->input->is_ajax_request()){
			echo json_encode(array($info));
		}
		else{
			exit('No direct script access allowed');
		}
	}

	public function alpha() {
		$this->fb->log("aaa");
	}





}

?>