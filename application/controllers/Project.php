<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Project extends CI_Controller {

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
		$head['title'] = "Project";

		$this->load->vars($data);
		
		$this->load->view('project_head', $head);
		$this->load->view('menu_view');
		$this->load->view('project_view');
		$this->load->view('foot');
	}

	public function newProject() {
		if($this->input->is_ajax_request()) {
			$sess = $this->session->userdata('user_auth');
			$title = $this->input->post('title');
			if(!empty($title)) {
				$new = $this->common->createProject($title, $sess['id']);
				//new would hold project_id if success
				if($new != NULL) {
					$path_to_resource = './resources/';
					$new_directory = $path_to_resource . '/' . $sess['id'] . '/' . $new . '/';
					if(!is_dir($new_directory)) {
						mkdir($new_directory, 777);
						//make each type of resource and their thumbs directory
						mkdir($new_directory . 'background/', 777);
						mkdir($new_directory . 'background/thumbs/', 777);
						mkdir($new_directory . 'sprite/', 777);
						mkdir($new_directory . 'sprite/thumbs/', 777);
						mkdir($new_directory . 'bgm/', 777);
						mkdir($new_directory . 'voice/', 777);
						mkdir($new_directory . 'sfx/', 777);
						mkdir($new_directory . 'video/', 777);
					}
					echo "success";
				}
			}
		}
		else {
			exit('No direct script access allowed');
		}
	}

	// for function testing!
	public function alpha() {
		$sess = $this->session->userdata('user_auth');
		
		$new = 1;
		//new would hold project_id if success
		if($new != NULL) {
			$path_to_resource = './resources/';
			$new_directory = $path_to_resource . '/' . $sess['id'] . '/' . $new . '/';
			if(is_dir($new_directory)) {
				mkdir($new_directory, 777);
				mkdir($new_directory . 'background/', 777);
				mkdir($new_directory . 'background/thumbs/', 777);
				mkdir($new_directory . 'sprite/', 777);
				mkdir($new_directory . 'sprite/thumbs/', 777);
				mkdir($new_directory . 'bgm/', 777);
				mkdir($new_directory . 'bgm/thumbs/', 777);
				mkdir($new_directory . 'voice/', 777);
				mkdir($new_directory . 'voice/thumbs/', 777);
				mkdir($new_directory . 'sfx/', 777);
				mkdir($new_directory . 'sfx/thumbs/', 777);
				mkdir($new_directory . 'video/', 777);
				mkdir($new_directory . 'video/thumbs/', 777);
			}
			echo "success";
		}
	
	}

	public function loadProject() {
		$this->load->helper('url');
		$sess = $this->session->userdata('user_auth');
		$project_data = $this->common->getUserProject($sess['id']);
		foreach ($project_data as $value) {
			?>
				<div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;">
					<div class="media-left">
					<!-- directory: reource/(user id)/(project id)/(filename) -->
						<img src="../resources/<?php echo $sess['id']; ?>/<?php echo $value['project_id']; ?>/<?php echo $value['cover']; ?>" class="media-object project-cover" />
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h3 class="media-heading"><?php echo $value['title']; ?></h3>
						</div>
						<div>
							<dl class="dl-horizontal" style="margin-left:-50px;">
							<dt>Description: </dt>
							<dd><?php echo $value['description']; ?></dd>
							<dt>Created: </dt>
							<dd><?php echo $value['created_date']; ?></dd>
							<dt>Last update: </dt>
							<dd><?php echo $value['updated_date']; ?></dd>
							<dt>Status: </dt>
							<dd><?php echo $value['status']; ?></dd>
							</dl>
						</div>
						<div class="project-action pull-right">
							<a href="<?php echo base_url(); ?>index.php/project/resource/<?php echo $value['project_id']; ?>" class="btn btn-warning">Resource Editor</a>
							<a href="<?php echo base_url(); ?>index.php/project/editor/<?php echo $value['project_id']; ?>" class="btn btn-warning">VN Editor</a>
							<a href="<?php echo base_url(); ?>index.php/game/play/<?php echo $value['project_id']; ?>" class="btn btn-default <?php if($value['fk_projectstatus_id']!=2) echo "disabled"; ?>">Play</a>
						</div>
					</div>
				</div>
			<?php
		}
	}

	public function resource($project_id = FALSE) {
		//url helper for redirect
		$this->load->helper('url');
		
		$proj = $this->common->getProject($project_id);
		if($proj) {
			$sess_array = array(
				'id' => $proj['project_id'],
				'title' => $proj['title'],
				'description' => $proj['description'],
				'user' => $proj['fk_user_id'],
				'status' => $proj['fk_projectstatus_id']
			);
			$this->session->set_userdata('active_project', $sess_array);

			redirect('resource/manage/' . $project_id, 'location');
		}
	}

	//placehoder
	public function editor($project_id = FALSE) {
		$this->load->helper('url');
		$proj = $this->common->getProject($project_id);
		if($proj) {
			$sess_array = array(
				'id' => $proj['project_id'],
				'title' => $proj['title'],
				'description' => $proj['description'],
				'user' => $proj['fk_user_id'],
				'status' => $proj['fk_projectstatus_id']
			);
			$this->session->set_userdata('active_project', $sess_array);

			redirect('editor/manage/' . $project_id, 'location');
		}
	}


	//in placeholder
	public function loadPublishedProject() {
		$page = 1;
		$sess = $this->session->userdata('user_auth');
		$project_data = $this->common->getUserProject($sess['id']);
		foreach ($project_data as $value) {
			?>
				<div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;">
					<div class="media-left">
						<img src="../resources/<?php echo $sess['id']; ?>/cover.jpg" class="media-object project-cover"/>
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h3 class="media-heading"><?php echo $value['title']; ?></h3>
						</div>
						<div class="project-date">
							<p><?php echo $value['published_date']; ?></p>
						</div>
						<div class="project-description">
							<p><?php echo $value['description']; ?></p>
						</div>
						<div class="project-action" style="position: absolute; right: 50px; bottom: 20px;">
							<button type="button" class="btn btn-primary">Play</button>
						</div>
					</div>
				</div>
			<?php
		}
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
		$this->fb->log("accessed");
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
/*			$config = array(
				'source_image' => $data['full_path'],
				'new_image' => $upload_path_url . '/thumbs',
				'maintain_ratio' => TRUE,
				'width' => 80,
				'height' => 80
			);*/
			$this->load->library('image_lib', $config);
			if($this->image_lib->resize() == FALSE){
				$this->fb->log($this->image_lib->display_errors());
			}

			$info->name = $data['file_name'];
			$info->size = $data['file_size'];
			$info->type = $data['file_type'];
			$info->url = $upload_path_url . $data['file_name'];
			$info->delete_type = 'DELETE';
			//possible that original template only  acknowledge json object
			/*$info['name'] = $data['file_name'];
			$info['size'] = $data['file_size'];
			$info['type'] = $data['file_type'];
			$info['url'] = $upload_path_url . $data['file_name'];
			$info['delete_type'] = 'DELETE';*/
			//just for checking!$this->fb->log($info);
			if($this->input->is_ajax_request()){
				//checking!$this->fb->log(json_encode(array($info)));
				echo json_encode(array($info));
			}
			else{
				exit('No direct script access allowed');
			}
			//unnecessary?$this->input->is_ajax_request();
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

}

?>