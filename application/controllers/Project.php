<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Project extends CI_Controller {

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
	function main() {
		// $this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('pagination');
		
		$user = $this->session->userdata('user_auth');
		$head['title'] = "Project";
		$self['user'] = $user;
		$page = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$config['base_url'] = base_url() . 'index.php/project/main';
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

		$data['project'] = $this->common->getUserProject($user['id'], $config['per_page'], $page);

		$this->load->vars($self);
		$this->load->view('project_head', $head);
		$this->load->view('menu_view');
		$this->load->view('project_view', $data);
		$this->load->view('foot');
	}
	public function newProject() {
		$this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('form_validation');
		$user = $this->session->userdata('user_auth');
		$self['user'] = $user;
		$this->load->vars($self);
		$head['title'] = "Project";
		// $config['upload_path'] = './resources/';
		// $config['allowed_types'] = 'jpg|png';
		// $config['overwrite']  = 'true';
		// $config['max_size'] = '16000';
		// $this->load->library('upload', $config);
		$this->form_validation->set_rules('title', 'Title', 'required');
		if ($this->form_validation->run() == false) {
			$this->load->view('project_head', $head);
			$this->load->view('menu_view');
			$this->load->view('project_new_view');
			$this->load->view('foot');
		}
		else {
			$title = $this->input->post('title');
			$description = $this->input->post('description');
			$user = $this->session->userdata('user_auth');
			$pass = $this->common->createProject($title, $description, $user['id']);
			if($pass) {
				$path_to_resource = './resources/';
				$new_directory = $path_to_resource . '/' . $user['id'] . '/' . $pass . '/';
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
				redirect('project', 'refresh');
			}
			else {
				$data['error'] = array('error' => "Failed to create new project!");
				$this->load->view('project_head', $head);
				$this->load->view('menu_view');
				$this->load->view('project_new_view', $data);
				$this->load->view('foot');
			}
		}
	}
	public function setting() {
		$this->load->helper('form');
		$this->load->helper('url');
		$this->load->library('form_validation');
		
		$user = $this->session->userdata('user_auth');
		$project_id = ($this->uri->segment(3)) ? $this->uri->segment(3) : 0;
		$project = $this->common->getProject($user['id'], $project_id);
		if($project) {
			$sess_array = array('project_id' => $project['project_id'], 'user_id' => $project['fk_user_id'], 'status_id' => $project['fk_projectstatus_id']);
			$this->session->set_userdata('active_setting', $sess_array);
			$head['title'] = "Project";
			$self['user'] = $user;
			$data['project'] = $project;
			
			// $this->load->vars($self);
			$this->load->view('project_head', $head);
			$this->load->view('menu_view', $self);
			$this->load->view('project_setting_view', $data);
			$this->load->view('foot');
		}
		else {
			$head['title'] = "Project";
			$self['user'] = $user;
			$data['message'] = "You are not authorized to access this page!";
			$this->load->view('forbidden_head', $head);
			$this->load->view('menu_view', $self);
			$this->load->view('forbidden_view', $data);
			$this->load->view('foot');
		}

		
	}
	public function changeSetting() {
		$this->load->helper('form');
		$this->load->helper('url');

		$this->load->library('form_validation');
		$user = $this->session->userdata('user_auth');
		$sett = $this->session->userdata('active_setting');
		$project = $this->common->getProject($user['id'], $sett['project_id']);
		$self['user'] = $user;
		$data['project'] = $project;
		if($project) {
			$self['user'] = $user;
			$head['title'] = "Project's setting";

			if(isset($_FILES['userfile']['tmp_name']) && is_uploaded_file($_FILES['userfile']['tmp_name'])) {
				$config['upload_path'] = './resources/' . $user['id'] . '/' . $project['project_id'] . '/';
				$config['allowed_types'] = 'jpg';
				$config['file_name']  = 'cover.jpg';
				$config['overwrite']  = 'true';
				$config['max_size'] = '16000';
				$this->load->library('upload', $config);
				$cover_file = true;
			}
			else {
				$cover_file = false;
				// $this->fb->log($project_id);
			}

			if($this->input->post('status') == true && $project['fk_projectstatus_id'] != 2) {
				$publish_check = true;
			}
			else {
				$publish_check = false;
			}

			// $this->load->vars($self);
			$this->form_validation->set_rules('title', 'Title', 'required');

			if($this->form_validation->run() == false) {
				$data['project'] = $this->common->getProject($user['id'], $project['project_id']);
				$this->load->view('project_head', $head);
				$this->load->view('menu_view', $self);
				$this->load->view('project_setting_view', $data);
				$this->load->view('foot');
			}
			else if($publish_check == true && $this->checkPublishability($project['project_id']) == false) {
				// $publishability = $this->checkPublishability($project_id);
				// if($publishability == false) {
					$data['error'] = array('error' => "Your project is not suitable for publishing yet!", 'list' => $this->session->userdata('publishability_error'));
					$this->load->view('project_head', $head);
					$this->load->view('menu_view', $self);
					$this->load->view('project_setting_view', $data);
					$this->load->view('foot');
				// }
			}
			else if($cover_file == true && $this->upload->do_upload() == false) {
				$data['error'] = array('error' => $this->upload->display_errors());
				$this->load->view('project_head', $head);
				$this->load->view('menu_view', $self);
				$this->load->view('project_setting_view', $data);
				$this->load->view('foot');
			}
			else {
				$title = $this->input->post('title');
				$description = $this->input->post('description');
				$publish = $this->input->post('status');
				if($publish_check == true) {
					$status = 2;
					$published_date = date('Y-m-d H:i:s');
					$pass = $this->common->updateProjectToPublish($status, $published_date, $project['project_id']);
				}
				if($cover_file == true) {
					$cover = 1;
					$this->common->updateCover($cover, $project['project_id']);
				}

				// $this->fb->log($project_id);
				$pass = $this->common->updateProject($title, $description, $project['project_id']);
				if($pass) {
					redirect('project', 'location');
				}
				else {
					$data['error'] = array('error' => "error writing to database");
					$this->load->view('project_head', $head);
					$this->load->view('menu_view', $self);
					$this->load->view('project_setting_view', $data);
					$this->load->view('foot');
				}
			}
		}
		else {
			$head['title'] = "Forbidden Access";
			$data['message'] = "You are not authorized to access this page!";
			$this->load->view('forbidden_head', $head);
			$this->load->view('menu_view', $self);
			$this->load->view('forbidden_view', $data);
			$this->load->view('foot');
		}

	}
	private function checkPublishability($project_id) {
		$validity = true;
		$error = array();
		$end_sequence = array();
		$jump_sequence = array();
		// list of line_id where choices jump to
		$jump_point = array();
		// first checking for nomral sequence, then cheking branch
		// branch checked is considered end and valid in place of end (looping problem)
		$line_check = $this->common->getLineForChecking($project_id);
		// $sequential_end = false;
		$temp_sequence = array();
		foreach ($line_check as $key => $value) {
			// echo $value['line_id'] . " ";
			$temp_sequence[] = $value['line_id'];
			// if line jump to another
			if(!empty($value['jumpto_line_id'])) {
				// valid sequence merge
				$jump_sequence = array_merge($jump_sequence, $temp_sequence);
				// clear temp
				$temp_sequence = array();
				// if not a duplicate, add for chekcing later
				if(!in_array($value['jumpto_line_id'], $jump_point)) {
					$jump_point[] = $value['jumpto_line_id'];
				}
			}
			if($value['fk_linetype_id'] == 2) {
				// valid sequence merge
				$jump_sequence = array_merge($jump_sequence, $temp_sequence);
				// clear temp
				$temp_sequence = array();
				//get list of choice on the line
				$choice_check = $this->common->getChoiceForChecking($value['line_id']);
				// cheking for empty choice
				if(count($choice_check) > 0) {
					foreach ($choice_check as $j_key => $j_value) {
						// if not a duplicate, add for chekcing later
						if(!empty($j_value['jumpto_line_id']) && !in_array($j_value['jumpto_line_id'], $jump_point)) {
							$jump_point[] = $j_value['jumpto_line_id'];
						}
					}
				}
				else {
					$validity = 0;
					$error[] = "choice on sequence " . $value['sequence'] . " doesn't have any valid option";
				}
			}
			if($value['fk_linetype_id'] == 4) {
				// $sequential_end = true;
				$end_sequence = array_merge($end_sequence, $temp_sequence);
				$temp_sequence = array();
			}
		}
		// echo "<BR>";
		// check if jump destination is in valid sequence 
		foreach ($jump_point as $key => $value) {
			if(!in_array($value, $end_sequence) && !in_array($value, $jump_sequence)) {
				$seq = $this->common->getLineJumpToId($value);
				foreach ($seq as $key => $value) {
					$error[] = "sequence " . $value['sequence'] . " jumps to invalid chain of sequences";
				}
				$validity = false;
			}
			// echo $value .".<br/>";
		}

		if($end_sequence <= 1) {
			$validity = false;
			$error[] = "you do not have enough lines";
		}
		// check if there's actually ending
		// if(!$end_sequence) {
		// 	$validity = false;
		// 	$error[] = "your visual novel has no ending";
		// }

		// debugging!
		// foreach ($jump_point as $key => $value) {
		// 	echo $value . " ";
		// }
		// echo "<BR>";
		// foreach ($end_sequence as $key => $value) {
		// 	echo $value . " ";
		// }
		// echo "<BR>";
		// foreach ($jump_sequence as $key => $value) {
		// 	echo $value . " ";
		// }
		// echo "<BR>";
		$this->session->set_userdata('publishability_error', $error);
		return $validity;
	}
	public function resource($project_id = FALSE) {
		//url helper for redirect
		if($project_id) {
			$this->load->helper('url');
			$user = $this->session->userdata('user_auth');
			$project = $this->common->getProject($user['id'], $project_id);
			if($project) {
				$sess_array = array(
					'id' => $project['project_id'],
					'title' => $project['title'],
					'description' => $project['description'],
					'user' => $project['fk_user_id'],
					'status' => $project['fk_projectstatus_id']
				);
				$this->session->set_userdata('active_project', $sess_array);

				redirect('resource/manage', 'location');
			}
		}
	}
	public function editor($project_id = FALSE) {
		if($project_id) {
			$this->load->helper('url');
			$user = $this->session->userdata('user_auth');
			$project = $this->common->getProject($user['id'], $project_id);
			if($project['fk_projectstatus_id'] == 2) {
				$pass = $this->common->updateProjectStatus($project['project_id'], 1);
			}
			if($project) {
				$sess_array = array(
					'id' => $project['project_id'],
					'title' => $project['title'],
					'description' => $project['description'],
					'user' => $project['fk_user_id'],
					'status' => $project['fk_projectstatus_id']
				);
				$this->session->set_userdata('active_project', $sess_array);

				redirect('editor/manage', 'location');
			}
		}
	}
	public function deleteProject() {
		$this->load->helper('url');
		$user = $this->session->userdata('user_auth');
		$sett = $this->session->userdata('active_setting');
		$project = $this->common->getProject($user['id'], $sett['project_id']);
		if($project) {
			$pass = $this->common->deleteProject($user['id'], $sett['project_id']);
			if($pass) {
				$dirPath = FCPATH . 'resources/' . $user['id'] . '/' . $sett['project_id'] . '/';
				$this->deleteDir($dirPath);
				redirect('project');
			}
			else {
				$head['title'] = "Project's Setting";
				$self['user'] = $user;
				$data['project'] = $this->common->getProject($project_id);
				$data['error'] = array('error' => "error deleting, try again later");
				$this->load->view('project_head', $head);
				$this->load->view('menu_view', $self);
				$this->load->view('project_setting_view', $data);
				$this->load->view('foot');
			}
		}
		else {
			$head['title'] = "Forbidden";
			$self['user'] = $user;
			$data['message'] = "You are not authorized to delete!";
			$this->load->view('forbidden_head', $head);
			$this->load->view('menu_view', $self);
			$this->load->view('forbidden_view', $data);
			$this->load->view('foot');
		}
	}
	private function deleteDir($dirPath) {
		if (! is_dir($dirPath)) {
			throw new InvalidArgumentException("$dirPath must be a directory");
		}
		if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
			$dirPath .= '/';
		}
		$files = glob($dirPath . '*', GLOB_MARK);
		foreach ($files as $file) {
			if (is_dir($file)) {
				self::deleteDir($file);
			}
			else {
				unlink($file);
			}
		}
		rmdir($dirPath);
	}
}

?>