<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Editor extends CI_Controller {

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
	function manage($project_id = FALSE) {
		$this->load->helper('form');
		$this->load->helper('url');
		
		$user = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$data['user'] = $user;
		$head['title'] = "Editor";
		$head['uid'] = $user['id'];
		$head['proj'] = $proj['id'];

		$per_page = 50;
		$total_line = $this->common->getTotalLine($proj['id']);
		$total_page = ceil($total_line / $per_page);
		if($total_page > 1) {
			$current_page = $total_page;
		}
		else {
			$current_page = 1;
		}
		$editor['page'] = array(
			'current_page' => $current_page,
			'total_page' => $total_page
		);


		$this->load->vars($data);
		$this->load->view('editor_head', $head);
		$this->load->view('menu_view');
		$this->load->view('editor_view', $editor);
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
	
	// public function loadLinePagination() {
	// 	$this->load->helper('url');
	// 	$this->load->library('pagination');
	// 	$proj = $this->session->userdata('active_project');
	// 	// pagination
	// 	$config['page_query_string'] = TRUE;
	// 	$page = 0;
	// 	$config['base_url'] = base_url() . 'editor/loadLineData';
	// 	$config['total_rows'] = $this->common->getTotalLine($proj['id']);
	// 	// $this->fb->log($config['total_rows']);

	// 	$config['per_page'] = 3; //20
	// 	$config['num_links'] = 8;
	// 	$config['use_page_numbers'] = FALSE;
	// 	// $config['first_tag_open'] = '<li class="first">';
	// 	// $config['first_link'] = '<i class="icon-first-2"></i> First';
	// 	// $config['first_tag_close'] = '</li>';
	// 	// $config['prev_tag_open'] = ' <li class="prev">';
	// 	// $config['prev_link'] = '<i class="icon-previous"></i> Prev';
	// 	// $config['prev_tag_close'] = '</li>';
	// 	// $config['cur_tag_open'] = '<li class="active"><a>';
	// 	// $config['cur_tag_close'] = '</a></li>';
	// 	// $config['num_tag_open'] = '<li>';
	// 	// $config['num_tag_close'] = '</li>';
	// 	// $config['next_tag_open'] = '<li class="next">';
	// 	// $config['next_link'] = 'Next  <i class="icon-next"></i>';
	// 	// $config['next_tag_close'] = '</li>';
	// 	// $config['last_tag_open'] = '<li class="last">';
	// 	// $config['last_link'] = 'Last <i class="icon-last-2"></i>';
	// 	// $config['last_tag_close'] = '</li>';
	// 	$this->pagination->initialize($config);
	// 	$page = $this->pagination->create_links();
	// 	echo $page;
	// }
	public function loadLineData() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');

		$current_page = $this->input->post('current');
		$page = $this->input->post('to');
		$by = $this->input->post('by');
		$per_page = 50;
		$total_line = $this->common->getTotalLine($proj['id']);
		$total_page = ceil($total_line / $per_page);
		if($by == "0") {
			if($page == "last") {
				$page = $total_page;
			}
			else if($page == "first") {
				$page = 1;
			}
			else if($page == "previous") {
				$page = $current_page - 1;
			}
			else if($page == "next") {
				$page = $current_page +1;
			}
			// not put with "or" condition so previous and next won't generate error due to out of page
			if($page > $total_page) {
				$page = $total_page;
			}
			else if($page < 1) {
				$page = 1;
			}
		}
		

		// $this->fb->log($page);
		// (conditional) load with search or page
		if($by == "0") {
			// offset is automatically 0 if string put as value (php)
			$offset = ($page - 1) * $per_page;
		}
		else if($by == "label") {
			$pass = $this->common->getLineSequenceByLabel($proj['id'], $page);
			if($pass) {
				$offset = $pass - 1;
			}
			else {
				$offset = 0;
			}
		}

		
		$pass_line = $this->common->getLine($proj['id'], $per_page, $offset);
		$line = array();
		$sprite = array();
		$i = 0;
		foreach ($pass_line as $key => $value) {
			if($value['fk_linetype_id'] == 1) {
				$pass_background = $this->common->getBackground($value['line_id']);
				if($pass_background) {
					$background = array(
						'background_resource_id' => $pass_background['resource_id'],
						'background_name' => $pass_background['name'],
						'background_file_name' => $pass_background['file_name']
					);
				}
				else {
					$background = array(
						'background_resource_id' => null,
						'background_name' => null,
						'background_file_name' => null
					);
				}
				$pass_bgm = $this->common->getBgm($value['line_id']);
				if($pass_bgm) {
					$bgm = array(
						'bgm_resource_id' => $pass_bgm['resource_id'],
						'bgm_name' => $pass_bgm['name'],
						'bgm_file_name' => $pass_bgm['file_name']
					);
				}
				else {
					$bgm = array(
						'bgm_resource_id' => null,
						'bgm_name' => null,
						'bgm_file_name' => null
					);
				}
				$pass_sfx = $this->common->getSfx($value['line_id']);
				if($pass_sfx) {
					$sfx = array(
						'sfx_resource_id' => $pass_sfx['resource_id'],
						'sfx_name' => $pass_sfx['name'],
						'sfx_file_name' => $pass_sfx['file_name']
					);
				}
				else {
					$sfx = array(
						'sfx_resource_id' => null,
						'sfx_name' => null,
						'sfx_file_name' => null
					);
				}
				$pass_voice = $this->common->getVoice($value['line_id']);
				if($pass_voice) {
					$voice = array(
						'voice_resource_id' => $pass_voice['resource_id'],
						'voice_name' => $pass_voice['name'],
						'voice_file_name' => $pass_voice['file_name']
					);
				}
				else {
					$voice = array(
						'voice_resource_id' => null,
						'voice_name' => null,
						'voice_file_name' => null
					);
				}
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'label' => utf8_encode($value['label']),
					'speaker' => utf8_encode($value['speaker']),
					'content' => utf8_encode($value['content']),
					'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'background_resource_id' => utf8_encode($background['background_resource_id']),
					'background_name' => utf8_encode($background['background_name']),
					'background_file_name' => utf8_encode($background['background_file_name']),
					'bgm_resource_id' => utf8_encode($bgm['bgm_resource_id']),
					'bgm_name' => utf8_encode($bgm['bgm_name']),
					'bgm_file_name' => utf8_encode($bgm['bgm_file_name']),
					'sfx_resource_id' => utf8_encode($sfx['sfx_resource_id']),
					'sfx_name' => utf8_encode($sfx['sfx_name']),
					'sfx_file_name' => utf8_encode($sfx['sfx_file_name']),
					'voice_resource_id' => utf8_encode($voice['voice_resource_id']),
					'voice_name' => utf8_encode($voice['voice_name']),
					'voice_file_name' => utf8_encode($voice['voice_file_name']),
					'sprite' => array(),
					'jumpto_line_label' => utf8_encode($value['jumpto_line_label'])
				);
				$pass_sprite = $this->common->getSprite($value['line_id']);
				if($pass_sprite) {
					foreach ($pass_sprite as $key => $value) {
						$line[$i]['sprite'][] = array(
							'sprite_id' => utf8_encode($value['sprite_id']),
							'position_x' => utf8_encode($value['position_x']),
							'position_y' => utf8_encode($value['position_y']),
							'position_z' => utf8_encode($value['position_z']),
							'fk_effect_id' => utf8_encode($value['fk_effect_id']),
							'sprite_resource_id' => utf8_encode($value['fk_resource_id']),
							'sprite_name' => utf8_encode($value['name']),
							'sprite_file_name' => utf8_encode($value['file_name']),
							'sprite_character_name' => utf8_encode($value['character_name']),
							'sprite_figure_name' => utf8_encode($value['figure_name']),
							'sprite_expression_name' => utf8_encode($value['expression_name'])
						);
					}
				}
			}
			else if($value['fk_linetype_id'] == 2) {
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'label' => utf8_encode($value['label']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'choice' => array()
				);
				$pass_choice = $this->common->getChoice($value['line_id']);
				if($pass_choice) {
					$j = 1;
					foreach ($pass_choice as $key => $value) {
						$line[$i]['choice'][] = array(
							'choice_id' => utf8_encode($value['choice_id']),
							'content' => utf8_encode($value['content']),
							'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
							'choice_temp_index' => utf8_encode($j),
							'jumpto_line_label' => utf8_encode($value['jumpto_line_label'])
						);
						$j++;
					}
					// make empty object placeholder if choice in db not enough
					if(count($pass_choice) < 4) {
						for ($j = count($pass_choice)+1; $j <=4 ; $j++) { 
							$line[$i]['choice'][] = array(
								'choice_id' => "new",
								'content' => "",
								'jumpto_line_id' => "",
								'choice_temp_index' => utf8_encode($j),
								'jumpto_line_label' => ""
							);
						}
					}
				}
				else {
					// create empty object for placeholder
					for ($j = 1; $j <=4 ; $j++) { 
						$line[$i]['choice'][] = array(
							'choice_id' => "new",
							'content' => "",
							'jumpto_line_id' => "",
							'choice_temp_index' => utf8_encode($j)
						);
					}
				}
				
			}
			else if($value['fk_linetype_id'] == 3) {
				$pass_video = $this->common->getVideo($value['line_id']);
				$video = array();
				if($pass_video) {
					$video = array(
						'video_resource_id' => $pass_video['resource_id'],
						'video_name' => $pass_video['name'],
						'video_file_name' => $pass_video['file_name']
					);
				}
				else {
					$video = array(
						'video_resource_id' => null,
						'video_name' => null,
						'video_file_name' => null
					);
				}
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'label' => utf8_encode($value['label']),
					'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'video_resource_id' => utf8_encode($video['video_resource_id']),
					'video_name' => utf8_encode($video['video_name']),
					'video_file_name' => utf8_encode($video['video_file_name']),
					'jumpto_line_label' => utf8_encode($value['jumpto_line_label'])
				);
			}
			else if($value['fk_linetype_id'] == 4) {
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id'])
				);
			}

			$i++;
		}


/*		BROKEN
		$pass = $this->common->getLine($sess['id'], $proj['id'], $limit, $offset);
		// $pass = array(array('inside' => 'none', array('moreinsider' => 'really bad')), array('id' => '1'));
		$head = $pass[0]['sequence'];
		$i = 0;
		$head = "empty";
		$line = array();
		$sprite = array();
		// reconstruct query result into nested array, combine duplicate line holding different sprite value
		foreach ($pass as $key => $value) {
			if($value['sequence'] == $head && $value['sprite_id'] != FALSE) {
				$line[$i-1]['sprite'][] = array(
					// utf-8 encode for proper null value on json
					// not using utf8 encode would result in input value populated with string "null"
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
					'voice_file_name' => utf8_encode($value['voice_file_name']),
					'sprite' => array()
				);
				if($value['sprite_id'] != FALSE) {
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
				}
				$head = $value['sequence'];
				$i++;
			}
		}
*/
		// var_dump($line);
		// echo json_encode($line, JSON_PRETTY_PRINT);
		// alpha! $info = array('last_active_sequence' => 0, 'name' => "new line", 'type' => "text");
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($line, JSON_PRETTY_PRINT));
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
		$this->output->set_output(json_encode($list, JSON_PRETTY_PRINT));
	}
	public function loadBackgroundList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceBackground($sess['id'], $proj['id']);
		$list = array();
		foreach ($pass as $key => $value) {
			$thumb_name = $this->trimExtension($value['file_name']) . '_thumb' . $this->extractExtension($value['file_name']);
			$list[] = array(
				'resource_id' => $value['resource_id'],
				'name' => $value['name'],
				'thumb_name' => $thumb_name,
				'file_name' => $value['file_name']
			);
		}
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($list, JSON_PRETTY_PRINT));
	}
	public function loadBgmList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceBgm($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function loadSfxList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceSfx($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function loadVoiceList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceVoice($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function loadLabelList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getLineLabel($sess['id'], $proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function loadSpriteList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceSprite($sess['id'], $proj['id']);
		$list = array();
		foreach ($pass as $key => $value) {
			$thumb_name = $this->trimExtension($value['file_name']) . '_thumb' . $this->extractExtension($value['file_name']);
			$list[] = array(
				'resource_id' => $value['resource_id'],
				'name' => $value['name'],
				'thumb_name' => $thumb_name,
				'character_name' => $value['character_name'],
				'figure_name' => $value['figure_name'],
				'expression_name' => $value['expression_name'],
				'file_name' => $value['file_name'],
			);
		}
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function loadEffectList() {
		$sess = $this->session->userdata('user_auth');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getEffect();
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function loadVideoList() {
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->getResourceVideo($proj['id']);
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	}
	public function newLine() {
		$line_type = $this->input->post('linetype');
		$sequence = $this->input->post('sequence');
		$proj = $this->session->userdata('active_project');
		$pass = $this->common->createLine($proj['id'], $sequence, $line_type);
		if($pass != null) {
			$this->output->set_content_type('text/html');
			$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
		}
	}
	public function removeLine() {
		$proj = $this->session->userdata('active_project');
		$line_id = $this->input->post('lineid');
		$pass = $this->common->deleteLine($line_id, $proj['id']);
		if($pass) {
			echo "1";
		}
	}
	public function newLineX() {
		echo "0";
	}
	//unnecessary!
	// public function newSprite() {
	// 	$sess = $this->session->userdata('user_auth');
	// 	$proj = $this->session->userdata('active_project');
	// 	$line_id = $this->input->post('lineid');
	// 	$pass = $this->common->createSprite($proj['id'],$line_id);
	// 	if($pass != null) {
	// 		$this->output->set_content_type('application/json');
	// 		$this->output->set_output(json_encode($pass, JSON_PRETTY_PRINT));
	// 	}
	// }
	public function saveLineData() {
		$delete_json = $this->input->post('deletedata');
		$line_json = $this->input->post('linedata');
		$sprite_json = $this->input->post('spritedata');
		$choice_json = $this->input->post('choicedata');
		$delete = json_decode($delete_json, TRUE);
		$line = json_decode($line_json, TRUE);
		$sprite = json_decode($sprite_json, TRUE);
		$choice = json_decode($choice_json, TRUE);
		$sprite_to_delete = array();
		$line_to_delete = array();
		foreach ($delete as $key => $value) {
			if($value['object'] == "sprite") {
				$sprite_to_delete[] = $value['id'];
			}
			// else if($value['object'] == "line") {
			// 	$line_to_delete[] = $value['id'];
			// }
		}
		$lineres = array();
		// validation, assign default value, assign lineres
		foreach ($line as $key => $value) {
			if($value['fk_linetype_id'] == 1) {
				if(empty($value['label'])) {
					$line[$key]['label'] = null;
				}
				if(empty($value['speaker'])) {
					$line[$key]['speaker'] = null;
				}
				if(empty($value['content'])) {
					$line[$key]['content'] = null;
				}
				if(empty($value['jumpto_line_id'])) {
					$line[$key]['jumpto_line_id'] = null;
				}
				// if resource assigned, append to lineres for db insert
				if(isset($value['background_resource_id'])) {
					$lineres[] = array(
						'line_id' => $value['line_id'],
						'resource_id' => $value['background_resource_id'],
						'resource_type_id' => 2
					);
				}
				if(isset($value['bgm_resource_id'])) {
					$lineres[] = array(
						'line_id' => $value['line_id'],
						'resource_id' => $value['bgm_resource_id'],
						'resource_type_id' => 3
					);
				}
				if(isset($value['sfx_resource_id'])) {
					$lineres[] = array(
						'line_id' => $value['line_id'],
						'resource_id' => $value['sfx_resource_id'],
						'resource_type_id' => 4
					);
				}
				if(isset($value['voice_resource_id'])) {
					$lineres[] = array(
						'line_id' => $value['line_id'],
						'resource_id' => $value['voice_resource_id'],
						'resource_type_id' => 5
					);
				}
			}
			else if($value['fk_linetype_id'] == 2) {
				if(empty($value['label'])) {
					$line[$key]['label'] = null;
				}
				// add default key and value
				$line[$key]['speaker'] = null;
				$line[$key]['content'] = null;
				$line[$key]['jumpto_line_id'] = null;
			}
			else if($value['fk_linetype_id'] == 3) {
				if(empty($value['label'])) {
					$line[$key]['label'] = null;
				}
				if(empty($value['jumpto_line_id'])) {
					$line[$key]['jumpto_line_id'] = null;
				}
				// add default key and value
				$line[$key]['speaker'] = null;
				$line[$key]['content'] = null;
				// append video data to lineres
				if(!empty($value['video_resource_id'])) {
					$lineres[] = array(
						'line_id' => $value['line_id'],
						'resource_id' => $value['video_resource_id'],
						'resource_type_id' => 6
					);
				}
			}
			else if($value['fk_linetype_id'] == 4) {
				$line[$key]['label'] = null;
				$line[$key]['speaker'] = null;
				$line[$key]['content'] = null;
				$line[$key]['jumpto_line_id'] = null;
			}
			// change var type
			$value['sequence'] = (int) $value['sequence'];
			// check if true int
			if(!is_int($value['sequence'])){
				unset($line[$key]);
			}
		}
		$sprite_to_create = array();
		$sprite_to_update = array();
		foreach ($sprite as $key => $value) {
			// assign default value if not valid
			$value['position_x'] = (int) $value['position_x'];
			if(!is_int($value['position_x'])) {
				$value['position_x'] = 0;
			}
			$value['position_y'] = (int) $value['position_y'];
			if(!is_int($value['position_y'])) {
				$value['position_y'] = 0;
			}
			$value['position_z'] = (int) $value['position_z'];
			if(!is_int($value['position_z'])) {
				$value['position_z'] = 0;
			}
			if($value['fk_resource_id'] != null) {
				if($value['sprite_id'] == "new") {
					$sprite_to_create[] = array(
						'fk_resource_id' => $value['fk_resource_id'],
						'position_x' => $value['position_x'],
						'position_y' => $value['position_y'],
						'position_z' => $value['position_z'],
						'fk_effect_id' => $value['fk_effect_id'],
						'fk_line_id' => $value['fk_line_id'],
						// used to return assigned id back on view
						'sprite_temp_index' => $value['sprite_temp_index']
					);
				}
				else {
					$sprite_to_update[] = array(
						'sprite_id' => $value['sprite_id'],
						'fk_resource_id' => $value['fk_resource_id'],
						'position_x' => $value['position_x'],
						'position_y' => $value['position_y'],
						'position_z' => $value['position_z'],
						'fk_effect_id' => $value['fk_effect_id'],
						'fk_line_id' => $value['fk_line_id']
					);
				}
			}
		}
		$choice_to_create = array();
		$choice_to_update = array();
		foreach ($choice as $key => $value) {
			if(empty($value['jumpto_line_id'])) {
				$value['jumpto_line_id'] = null;
			}
			if($value['choice_id'] == "new") {
				$choice_to_create[] = array(
					'content' => $value['content'],
					'jumpto_line_id' => $value['jumpto_line_id'],
					'fk_line_id' => $value['fk_line_id'],
					'choice_temp_index' => $value['choice_temp_index']
				);
			}
			else {
				$choice_to_update[] = array(
					'choice_id' => $value['choice_id'],
					'content' => $value['content'],
					'jumpto_line_id' => $value['jumpto_line_id']
				);
			}
		}
		// check for data existence and write to database
		$status = TRUE;
		// line text update
		if(count($line) > 0  && $status == TRUE) {
			$pass_line_update = $this->common->updateTextLine($line);
			if(!$pass_line_update) {
				$status = FALSE;
			}
		}
		// line resource update
		if(count($lineres) > 0  && $status == TRUE) {
			foreach ($lineres as $key => $value) {
				$lineres_resource = $this->common->getLineres($value['line_id'], $value['resource_type_id']);
				if($lineres_resource) {
					$pass_lineres_update = $this->common->updateLineres($value['line_id'], $value['resource_id'], $lineres_resource['fk_resource_id']);
					// unnecessary!
					// switch ($value['resource_type_id']) {
					// 	case 2:
					// 		$pass_lineres_update = $this->common->updateLineres($value['line_id'], $value['background_resource_id'], $lineres_resource);
					// 		break;
					// 	case 3:
					// 		$pass_lineres_update = $this->common->updateLineres($value['line_id'], $value['bgm_resource_id'], $lineres_resource);
					// 		break;
					// 	case 4:
					// 		$pass_lineres_update = $this->common->updateLineres($value['line_id'], $value['sfx_resource_id'], $lineres_resource);
					// 		break;
					// 	case 5:
					// 		$pass_lineres_update = $this->common->updateLineres($value['line_id'], $value['voice_resource_id'], $lineres_resource);
					// 		break;
					// 	default:
					// 		$pass_lineres_update = FALSE;
					// 		break;
					// }
					if(!$pass_lineres_update) {
						$status = FALSE;
					}
				}
				else {
					$pass_lineres_create = $this->common->createLineres($value['line_id'], $value['resource_id']);
					// unnecessary!
					// switch ($value['resource_type_id']) {
					// 	case 2:
					// 		$pass_lineres_create = $this->common->createLineres($value['line_id'], $value['background_resource_id']);
					// 		break;
					// 	case 3:
					// 		$pass_lineres_create = $this->common->createLineres($value['line_id'], $value['bgm_resource_id']);
					// 		break;
					// 	case 4:
					// 		$pass_lineres_create = $this->common->createLineres($value['line_id'], $value['sfx_resource_id']);
					// 		break;
					// 	case 5:
					// 		$pass_lineres_create = $this->common->createLineres($value['line_id'], $value['voice_resource_id']);
					// 		break;
					// 	default:
					// 		$pass_lineres_create = FALSE;
					// 		break;
					// }
					if(!$pass_lineres_create) {
						$status = FALSE;
					}
				}
			}
		}
		// array for return data
		$create_status = array();
		// sprite create
		if(count($sprite_to_create) > 0  && $status == TRUE) {
			$pass_sprite_create = $this->common->createSprite($sprite_to_create);
			if(!$pass_sprite_create) {
				$status = FALSE;
			}
			else {
				foreach ($pass_sprite_create as $key => $value) {
					$create_status[] = array(
						'object' => 'sprite',
						'fk_line_id' => utf8_encode($value['fk_line_id']),
						'sprite_temp_index' => utf8_encode($value['sprite_temp_index']),
						'sprite_id' => utf8_encode($value['sprite_id'])
					);
				}
				
			}
		}
		// sprite update
		if(count($sprite_to_update) > 0  && $status == TRUE) {
			$pass_sprite_update = $this->common->updateSprite($sprite_to_update);
			if(!$pass_sprite_update) {
				$status = FALSE;
			}
		}
		// choice create
		if(count($choice_to_create) > 0 && $status == TRUE) {
			$pass_choice_create = $this->common->createChoice($choice_to_create);
			if(!$pass_choice_create) {
				$status = FALSE;
			}
			else {
				foreach ($pass_choice_create as $key => $value) {
					$create_status[] = array(
						'object' => 'choice',
						'fk_line_id' => utf8_encode($value['fk_line_id']),
						'choice_temp_index' => utf8_encode($value['choice_temp_index']),
						'choice_id' => utf8_encode($value['choice_id'])
					);
				}
			}
		}
		// choice update
		if(count($choice_to_update) > 0 && $status == TRUE) {
			$pass_choice_update = $this->common->updateChoice($choice_to_update);
			if(!$pass_choice_update) {
				$status = FALSE;
			}
		}
		// sprite delete
		if(count($sprite_to_delete) > 0 && $status == TRUE) {
			$pass_sprite_delete = $this->common->deleteSprite($sprite_to_delete);
			if(!$pass_sprite_delete) {
				$status = FALSE;
			}
		}
		// line delete
		// if(count($line_to_delete) > 0 && $status == TRUE) {
		// 	$pass_line_delete = $this->common->deleteLine($line_to_delete);
		// 	if(!$pass_line_delete) {
		// 		$status = FALSE;
		// 	}
		// }
		// output
		if($status == TRUE) {
			$this->output->set_content_type('application/json');
			$this->output->set_output(json_encode($create_status, JSON_PRETTY_PRINT));
		}
	}

}

?>