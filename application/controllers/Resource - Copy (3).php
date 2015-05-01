<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Resource extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('common','',TRUE);
		/*
		if($this->session->userdata('user_auth')) {
			$sess = $this->session->userdata('user_auth');
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
		
		$data['sess'] = $this->session->userdata('user_auth');
		$head['title'] = "Resource";

		$this->load->vars($data);
		
		$this->load->view('resource_head', $head);
		$this->load->view('menu_view');
		$this->load->view('resource_view');
		$this->load->view('foot');
		$this->fb->log("init okay");
	}

	function manage($project_id = FALSE) {
		$this->load->helper('form');
		$this->load->helper('url');
		
		$data['sess'] = $this->session->userdata('user_auth');
		$head['title'] = "Resource";

		$this->load->vars($data);
		
		$this->load->view('resource_head', $head);
		$this->load->view('menu_view');
		$this->load->view('resource_view');
		$this->load->view('foot');
		$this->fb->log("init okay");
	}

	public function do_upload() {
		//unnecesary?
		// header('Vary: Accept');
		// if (isset($_SERVER['HTTP_ACCEPT']) &&
		// 	(strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) {
		// 	header('Content-type: application/json');
		// }
		// else {
		// 	header('Content-type: text/plain');
		// }

		//disabled because return empty json object
		//$this->load->library('UploadHandler');
		$this->load->helper('url');
		//unnecesary?!$this->load->helper('file');

		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$resource_type = $this->input->post('restype');
		$path_to_project = 'resources/' . $sess['id'] . '/' . $proj['id'] . '/';

		if($resource_type == "background") {
			$upload_path_url = base_url() . $path_to_project . 'background/';
			$config['upload_path'] = FCPATH . $path_to_project . 'background/';
			$config['allowed_types'] = 'jpg|jpeg|png|bmp';
			$config['max_size'] = '60000';
			$this->load->library('upload', $config);

			if($this->upload->do_upload() == FALSE){
				//no output due to ajax request,
				//unfinished error display to json
				// $error = array('error' => $this->upload->display_errors());
				// $this->load->view('resource_view', $error);
				$this->fb->log($this->upload->display_errors());
			}
			else{
				$data = $this->upload->data();
				$config['source_image'] = $data['full_path'];
				$config['new_image'] =  FCPATH . $path_to_project . 'background/thumbs/';
				//$this->fb->log($config['new_image']);
				$config['maintain_ratio'] = TRUE;
				$config['width'] = 80;
				$config['height'] = 80;
				$this->load->library('image_lib', $config);
				//resize original image for thumbnail
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
				$files[] = $info;
				if($this->input->is_ajax_request()){
					//alternative echo! $this->output->set_content_type('application/json')->set_output(json_encode(array("files" => $files)));
					// $this->fb->log(json_encode(array("files" => $files)));
					echo json_encode(array("files" => $files));
					// echo "yes";
				}
				else{
					exit('No direct script access allowed');
				}
			}
		}
		else if($resource_type == "sprite") {
			$upload_path_url = base_url() . $path_to_project . 'sprite/';
			$config['upload_path'] = FCPATH . $path_to_project . 'sprite/';
			$config['allowed_types'] = 'jpg|jpeg|png|bmp';
			$config['max_size'] = '60000';
			$this->load->library('upload', $config);

			if($this->upload->do_upload() == FALSE){
				//no output due to ajax request,
				//unfinished error display to json
				// $error = array('error' => $this->upload->display_errors());
				// $this->load->view('resource_view', $error);
				$this->fb->log($this->upload->display_errors());
			}
			else{
				$data = $this->upload->data();
				$config['source_image'] = $data['full_path'];
				$config['new_image'] =  FCPATH . $path_to_project . 'sprite/thumbs/';
				//$this->fb->log($config['new_image']);
				$config['maintain_ratio'] = TRUE;
				$config['width'] = 80;
				$config['height'] = 80;
				$this->load->library('image_lib', $config);
				//resize original image for thumbnail
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
				$files[] = $info;
				if($this->input->is_ajax_request()){
					//alternative echo! $this->output->set_content_type('application/json')->set_output(json_encode(array("files" => $files)));
					// $this->fb->log(json_encode(array("files" => $files)));
					echo json_encode(array("files" => $files));
					// echo "yes";
				}
				else{
					exit('No direct script access allowed');
				}
			}
		}
		else if($resource_type == "music") {
			//$this->load->library('UploadHandler');
			$upload_path_url = base_url() . $path_to_project . 'bgm/';

			$config['upload_path'] = FCPATH . $path_to_project . 'bgm/';
			$config['allowed_types'] = 'mp3|ogg|mp4';
			// $config['max_size'] = 20 * 1024 * 1024;
			$config['max_size'] = '600000000';
			$this->load->library('upload', $config);

			if($this->upload->do_upload() == FALSE){
				//no output due to ajax request,
				//unfinished error display to json
				// $error = array('error' => $this->upload->display_errors());
				// $this->load->view('resource_view', $error);
				$this->fb->log($this->upload->display_errors());
			}
			else{
				$data = $this->upload->data();

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
				$files[] = $info;
				if($this->input->is_ajax_request()){
					//alternative echo! $this->output->set_content_type('application/json')->set_output(json_encode(array("files" => $files)));
					// $this->fb->log(json_encode(array("files" => $files)));
					echo json_encode(array("files" => $files));
					// echo "yes";
				}
				else{
					exit('No direct script access allowed');
				}
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

	//not yet tested!
	public function uploadmusic() {
		error_reporting(E_ALL | E_STRICT);
		$this->load->library("UploadHandler");
	}





}

?>