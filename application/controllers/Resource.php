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
	}

	public function do_upload() {
		$this->load->helper('url');

		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$resource_type = $this->input->post('restype');
		$path_to_project = 'resources/' . $sess['id'] . '/' . $proj['id'] . '/';

		if($resource_type == "background") {
			$upload_path_url = base_url() . $path_to_project . 'background/';
			$config['upload_path'] = FCPATH . $path_to_project . 'background/';
			$config['allowed_types'] = 'jpg|jpeg|png|bmp';
			$config['overwrite'] = FALSE;
			$config['max_size'] = '60000';
			$config['encrypt_name'] = TRUE;
			$config['remove_spaces'] = TRUE;
			$this->load->library('upload', $config);

			if($this->upload->do_upload() == FALSE){
				$this->fb->log($this->upload->display_errors());
			}
			else{
				$data = $this->upload->data();
				//config for image resize
				$config['source_image'] = $data['full_path'];
				$config['new_image'] =  FCPATH . $path_to_project . 'background/thumbs/';
				$config['maintain_ratio'] = TRUE;
				$config['create_thumb'] = TRUE;
				$config['thumb_marker'] = '_thumb';
				$config['quality'] = '70%';
				$config['width'] = 80;
				$config['height'] = 80;
				$this->load->library('image_lib', $config);
				//resize original image for thumbnail
				if($this->image_lib->resize() == FALSE){
					$this->fb->log($this->image_lib->display_errors());
				}

				//trim original filename
				$base_file_name = $this->trimExtension($data['orig_name']);
				//write file info to database
				$pass = $this->common->createBackgroundResource($base_file_name, $data['file_name'], '2', $proj['id']);
				if($pass != NULL) {
					$info = new StdClass;
					$info->id = $pass;
					$info->name = $base_file_name;
					$info->size = $data['file_size'];
					$info->type = $data['file_type'];
					// $info->url = $upload_path_url . $data['file_name'];
					//generate url info with thumb file url
					$info->url = $upload_path_url . 'thumbs/' . $data['raw_name'] . '_thumb' . $data['file_ext'];
					$info->error = null;
					//unnecessary!$info->delete_type = 'DELETE';
					$files[] = $info;
					if($this->input->is_ajax_request()){
						$this->output->set_content_type('application/json')->set_output(json_encode(array("files" => $files)));
					}
					else{
						exit('No direct script access allowed');
					}
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
				$this->fb->log($this->upload->display_errors());
			}
			else{
				$data = $this->upload->data();
				$config['source_image'] = $data['full_path'];
				$config['new_image'] =  FCPATH . $path_to_project . 'sprite/thumbs/';
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
				$files[] = $info;
				if($this->input->is_ajax_request()){
					$this->output->set_content_type('application/json')->set_output(json_encode(array("files" => $files)));
					//$this->fb->log(json_encode(array("files" => $files)));
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
			$config['max_size'] = 20 * 1024 * 1024;
			$this->load->library('upload', $config);

			if($this->upload->do_upload() == FALSE){
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
				$files[] = $info;
				if($this->input->is_ajax_request()){
					$this->output->set_content_type('application/json')->set_output(json_encode(array("files" => $files)));
				}
				else{
					exit('No direct script access allowed');
				}
			}
		}
	}

	private function trimExtension($filestring) {
		$string = preg_replace('/\\.[^.\\s]{3,4}$/', '', $filestring);
		return $string;
	}

	public function changeBackgroundProperty() {
		$resource_id = $this->input->post('id');
		$resource_name = $this->input->post('name');
		$pass = $this->common->updateBackgroundResource($resource_id, $resource_name);
		if($pass) {
			echo "1";
		}
		else {
			echo "0";
		}
	}

	public function loadResource() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$resource_type_request = $this->input->post('type');
		$this->fb->log($resource_type_request);
		// $resource_data = $this->common->getBackgroundResource($sess['id'], $proj['id']);
		// foreach ($resource_data as $value) {
			?>
				>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			<?php
		// }
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