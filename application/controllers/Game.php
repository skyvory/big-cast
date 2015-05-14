<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Game extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->model('game_model','',TRUE);
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
		
	}

	public function play() {
		$this->load->helper('form');
		$this->load->helper('url');
		
		$head['title'] = "VN";
		$user = $this->session->userdata('user_auth');
		$data['sess'] = $user;
		$project_id = $this->uri->segment(3);
		$pass = $this->game_model->getProject($project_id);
		$this->load->vars($data);
		if($pass) {
			if($pass['fk_projectstatus_id'] == 2) {
				$sess_array = array(
					'id' => $project_id,
					'creator_id' => $pass['fk_user_id']
				);
				$this->session->set_userdata('active_game', $sess_array);
				$this->load->view('game_head', $head);
				$this->load->view('menu_view');
				$this->load->view('game_view');
				$this->load->view('foot');
			}
		}
		else {
			$data['message'] = "Game not found!";
			$this->load->view('game_head', $head);
			$this->load->view('menu_view');
			$this->load->view('game_forbidden');
			$this->load->view('foot');
		}

		
	}
	public function loadConfiguration() {
		$user = $this->session->userdata('user_auth');
		$game = $this->session->userdata('active_game');
		$pass_config = $this->game_model->getConfiguration($user['id'], $game['id']);
		if($pass_config) {
			$config = array(
				'configuration_id' => $pass_config['configuration_id'],
				'fk_fonttype_id' => $pass_config['fk_fonttype_id'],
				'text_speed' => $pass_config['text_speed'],
				'bgm_volume' => $pass_config['bgm_volume'],
				'voice_volume' => $pass_config['voice_volume'],
				'sfx_volume' => $pass_config['sfx_volume'],
				'creator_id' => $game['creator_id']				
			);
		}
		else {
			$config = array(
				'game_id' => $game['id'],
				'creator_id' => $game['creator_id'],
				'configuration_id' => "",
				'fk_fonttype_id' => "1",
				'text_speed' => "1",
				'bgm_volume' => "1",
				'voice_volume' => "1",
				'sfx_volume' => "1",
			);
		}
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($config, JSON_PRETTY_PRINT));
	}
	public function loadLine() {
		$game = $this->session->userdata('active_game');
		$head = $this->input->post('head');
		$limit = $this->input->post('limit');
		$pass_line = $this->game_model->getLine($game['id'], $limit, $head);
		$line = array();
		$sprite = array();
		$choice = array();
		$i = 0;
		foreach ($pass_line as $key => $value) {
			if($value['fk_linetype_id'] == 1) {
				$pass_background = $this->game_model->getBackground($value['line_id']);
				if($pass_background) {
					$background = array(
						'background_resource_id' => $pass_background['resource_id'],
						'background_file_name' => $pass_background['file_name']
					);
				}
				else {
					$background = array(
						'background_resource_id' => null,
						'background_file_name' => null
					);
				}
				$pass_bgm = $this->game_model->getBgm($value['line_id']);
				if($pass_bgm) {
					$bgm = array(
						'bgm_resource_id' => $pass_bgm['resource_id'],
						'bgm_file_name' => $pass_bgm['file_name']
					);
				}
				else {
					$bgm = array(
						'bgm_resource_id' => null,
						'bgm_file_name' => null
					);
				}
				$pass_sfx = $this->game_model->getSfx($value['line_id']);
				if($pass_sfx) {
					$sfx = array(
						'sfx_resource_id' => $pass_sfx['resource_id'],
						'sfx_file_name' => $pass_sfx['file_name']
					);
				}
				else {
					$sfx = array(
						'sfx_resource_id' => null,
						'sfx_file_name' => null
					);
				}
				$pass_voice = $this->game_model->getVoice($value['line_id']);
				if($pass_voice) {
					$voice = array(
						'voice_resource_id' => $pass_voice['resource_id'],
						'voice_file_name' => $pass_voice['file_name']
					);
				}
				else {
					$voice = array(
						'voice_resource_id' => null,
						'voice_file_name' => null
					);
				}
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'speaker' => utf8_encode($value['speaker']),
					'content' => utf8_encode($value['content']),
					'fk_effect_id' => utf8_encode($value['fk_effect_id']),
					'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'background_resource_id' => utf8_encode($background['background_resource_id']),
					'background_file_name' => utf8_encode($background['background_file_name']),
					'bgm_resource_id' => utf8_encode($bgm['bgm_resource_id']),
					'bgm_file_name' => utf8_encode($bgm['bgm_file_name']),
					'sfx_resource_id' => utf8_encode($sfx['sfx_resource_id']),
					'sfx_file_name' => utf8_encode($sfx['sfx_file_name']),
					'voice_resource_id' => utf8_encode($voice['voice_resource_id']),
					'voice_file_name' => utf8_encode($voice['voice_file_name']),
					'sprite' => array()
				);
				$pass_sprite = $this->game_model->getSprite($value['line_id']);
				if($pass_sprite) {
					foreach ($pass_sprite as $key => $value) {
						$line[$i]['sprite'][] = array(
							'sprite_id' => utf8_encode($value['sprite_id']),
							'position_x' => utf8_encode($value['position_x']),
							'position_y' => utf8_encode($value['position_y']),
							'position_z' => utf8_encode($value['position_z']),
							'sprite_resource_id' => utf8_encode($value['resource_id']),
							'sprite_file_name' => utf8_encode($value['file_name'])
						);
					}
				}
			}
			else if($value['fk_linetype_id'] == 2) {
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'choice' => array()
				);
				$pass_choice = $this->game_model->getChoice($value['line_id']);
				if($pass_choice) {
					foreach ($pass_choice as $key => $value) {
						$line[$i]['choice'][] = array(
							'choice_id' => utf8_encode($value['choice_id']),
							'content' => utf8_encode($value['content']),
							'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
							'look_ahead' => array()
						);
						// enchanced
						if($value['jumpto_line_id'] != null) {
							$sequence_after = $this->game_model->getLineSequence($value['jumpto_line_id']);
							$pass_line_ahead = $this->game_model->getLine($game['id'], 8, $sequence_after-1);
							// $this->fb->log($value['content']);
							// $this->fb->log($pass_line_ahead);
							// >>>
						}
					}
				}
			}
			else if($value['fk_linetype_id'] == 3) {
				$pass_video = $this->game_model->getVideo($value['line_id']);
				$video = array();
				if($pass_video) {
					$video = array(
						'video_resource_id' => $pass_video['resource_id'],
						'video_file_name' => $pass_video['file_name']
					);
				}
				else {
					$video = array(
						'video_resource_id' => null,
						'video_file_name' => null
					);
				}
				$line[$i] = array(
					'line_id' => utf8_encode($value['line_id']),
					'sequence' => utf8_encode($value['sequence']),
					'jumpto_line_id' => utf8_encode($value['jumpto_line_id']),
					'fk_linetype_id' => utf8_encode($value['fk_linetype_id']),
					'video_resource_id' => utf8_encode($video['video_resource_id']),
					'video_file_name' => utf8_encode($video['video_file_name'])
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
		} //foreach
		$this->output->set_content_type('application/json');
		$this->output->set_output(json_encode($line, JSON_PRETTY_PRINT));
	}

}

?>