<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Editor extends CI_Controller {

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
		//no direct access
		// ! REDIRECT TO MANAGE URL !
	}
	function manage($project_id = FALSE) {
		$this->load->helper('form');
		$this->load->helper('url');
		
		$data['sess'] = $this->session->userdata('user_auth');
		$head['title'] = "Editor";

		$this->load->vars($data);
		$this->load->view('editor_head', $head);
		$this->load->view('menu_view');
		$this->load->view('editor_view');
		$this->load->view('foot');
	}
	
	private function trimExtension($filestring) {
		$string = preg_replace('/\\.[^.\\s]{3,4}$/', '', $filestring);
		return $string;
	}
	
	private function extractExtension($filestring) {
		$string = '.' . preg_replace('/^.*\.([^.]+)$/D', '$1', $filestring);
		return $string;
	}
	
	public function loadLineData() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$limit = $this->input->post('limit');
		$offset = $this->input->post('offset');
		$limit = 9;
		$offset = 0;
		$pass = $this->common->getLine($sess['id'], $proj['id'], $limit, $offset);
		// $pass = array(array('inside' => 'none', array('moreinsider' => 'really bad')), array('id' => '1'));
		$head = $pass[0]['sequence'];
		$i = 0;
		$head = "empty";
		$line = array();
		$sprite = array();
		// reconstruct query result into nested array, combine duplicate line holding different sprite value
		foreach ($pass as $key => $value) {
			if($value['sequence'] == $head) {
				$line[$i-1]['sprite'][] = array(
					// utf-8 encode for proper null value on json
					'sprite_id' => utf8_encode($value['sprite_id']),
					'fk_resource_id' => utf8_encode($value['fk_resource_id']),
					'position_x' => utf8_encode($value['position_x']),
					'position_y' => utf8_encode($value['position_y']),
					'position_z' => utf8_encode($value['position_z']),
					'sprite_resource_id' => utf8_encode($value['sprite_resource_id']),
					'sprite_name' => utf8_encode($value['sprite_name']),
					'sprite_file_name' => utf8_encode($value['sprite_file_name']),
					'sprite_character_name' => utf8_encode($value['sprite_character_name']),
					'sprite_figure_name' => utf8_encode($value['sprite_figure_name']),
					'sprite_expression_name' => utf8_encode($value['sprite_expression_name'])
				);
			}
			else {
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'label' => utf8_encode($value['label']),
					'speaker' => utf8_encode($value['speaker']),
					'content' => utf8_encode($value['content']),
					'fk_effect_id' => utf8_encode($value['fk_effect_id']),
					'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'background_resource_id' => utf8_encode($value['background_resource_id']),
					'background_name' => utf8_encode($value['background_name']),
					'background_file_name' => utf8_encode($value['background_file_name']),
					'bgm_resource_id' => utf8_encode($value['bgm_resource_id']),
					'bgm_name' => utf8_encode($value['bgm_name']),
					'bgm_file_name' => utf8_encode($value['bgm_file_name']),
					'sfx_resource_id' => utf8_encode($value['sfx_resource_id']),
					'sfx_name' => utf8_encode($value['sfx_name']),
					'sfx_file_name' => utf8_encode($value['sfx_file_name']),
					'voice_resource_id' => utf8_encode($value['voice_resource_id']),
					'voice_name' => utf8_encode($value['voice_name']),
					'voice_file_name' => utf8_encode($value['voice_file_name'])
				);
				$line[$i]['sprite'][] = array(
					'sprite_id' => utf8_encode($value['sprite_id']),
					'fk_resource_id' => utf8_encode($value['fk_resource_id']),
					'position_x' => utf8_encode($value['position_x']),
					'position_y' => utf8_encode($value['position_y']),
					'position_z' => utf8_encode($value['position_z']),
					'sprite_resource_id' => utf8_encode($value['sprite_resource_id']),
					'sprite_name' => utf8_encode($value['sprite_name']),
					'sprite_file_name' => utf8_encode($value['sprite_file_name']),
					'sprite_character_name' => utf8_encode($value['sprite_character_name']),
					'sprite_figure_name' => utf8_encode($value['sprite_figure_name']),
					'sprite_expression_name' => utf8_encode($value['sprite_expression_name'])
				);
				$head = $value['sequence'];
				$i++;
			}
		}
		// var_dump($line);
		// echo json_encode($line, JSON_PRETTY_PRINT);
		// alpha! $info = array('last_active_sequence' => 0, 'name' => "new line", 'type' => "text");
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($line), JSON_PRETTY_PRINT);
	}
	public function loadCharacterList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceCharacter($sess['id'], $proj['id']);
		$list = array();
		foreach ($pass as $key => $value) {
			$list[] = $value['character_name'];
		}
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($list), JSON_PRETTY_PRINT);
	}
	public function loadBackgroundList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceBackground($sess['id'], $proj['id']);
		$list = array();
		foreach ($pass as $key => $value) {
			$thumb_name = $this->trimExtension($value['file_name']) . '_thumb' . $this->extractExtension($value['file_name']);
			$list[] = array('resource_id' => $value['resource_id'], 'name' => $value['name'], 'thumb_name' => $thumb_name);
		}
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($list), JSON_PRETTY_PRINT);
	}
	public function loadBgmList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceBgm($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass), JSON_PRETTY_PRINT);
	}
	public function loadSfxList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceSfx($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass), JSON_PRETTY_PRINT);
	}
	public function loadVoiceList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceVoice($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass), JSON_PRETTY_PRINT);
	}
	public function loadLabelList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getLineLabel($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass), JSON_PRETTY_PRINT);
	}
	public function loadSpriteList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceSprite($sess['id'], $proj['id']);
		$list = array();
		foreach ($pass as $key => $value) {
			$thumb_name = $this->trimExtension($value['file_name']) . '_thumb' . $this->extractExtension($value['file_name']);
			$list[] = array('resource_id' => $value['resource_id'], 'name' => $value['name'], 'thumb_name' => $thumb_name, 'character_name' => $value['character_name'], 'figure_name' => $value['figure_name'], 'expression_name' => $value['expression_name']);
		}
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass), JSON_PRETTY_PRINT);
	}
	public function loadEffectList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getEffect();
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass), JSON_PRETTY_PRINT);
	}

}

?>