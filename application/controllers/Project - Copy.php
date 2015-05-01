<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Project extends CI_Controller {

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
		$head['title'] = "Project";

		$this->load->vars($data);
		
		$this->load->view('project_head', $head);
		$this->load->view('menu_view');
		$this->load->view('project_view');
		$this->load->view('foot');
	}

	public function newProject() {
		if($this->input->is_ajax_request()) {
			$sess = $this->session->userdata('logged_in');
			$title = $this->input->post('title');
			if(!empty($title)) {
				$new = $this->common->createProject($title, $sess['id']);
				echo $new;
			}
		}
		else {
			exit('No direct script access allowed');
		}
	}

	public function loadProject() {
		$sess = $this->session->userdata('logged_in');
		$proj = $this->common->getProject($sess['id']);
		var_dump($proj);
		foreach ($proj as $val) {
			?>
				<div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;">
					<div class="media-left">
						<img src="../resources/<?php echo $sess['id']; ?>/cover.jpg" class="media-object project-cover"/>
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h3 class="media-heading"><?php echo $val['title']; ?></h3>
						</div>
						<div>
							<dl class="dl-horizontal" style="margin-left:-50px;">
							<dt>Description: </dt>
							<dd><?php echo $val['description']; ?></dd>
							<dt>Created: </dt>
							<dd><?php echo $val['created_date']; ?></dd>
							<dt>Last update: </dt>
							<dd><?php echo $val['updated_date']; ?></dd>
							<dt>Status: </dt>
							<dd><?php echo $val['status']; ?></dd>
							</dl>
						</div>
						<div class="project-action" style="position: absolute; right: 50px; bottom: 20px;">
							<button type="button" class="btn btn-warning">Resource Editor</button>
							<button type="button" class="btn btn-warning">VN Editor</button>
							<button type="button" class="btn disabled">Play</button>
						</div>
					</div>
				</div>
			<?php
		}
	}

	public function loadPublishedProject() {
		$page = 1;
		$sess = $this->session->userdata('logged_in');
		$proj = $this->common->getProject($sess['id']);
		foreach ($proj as $val) {
			?>
				<div class="media" style="background-color: #ddd; margin: 10px 20px; padding: 10px;">
					<div class="media-left">
						<img src="../resources/<?php echo $sess['id']; ?>/cover.jpg" class="media-object project-cover"/>
					</div>
					<div class="media-body" style="margin: 15px;">
						<div class="project-title">
							<h3 class="media-heading"><?php echo $val['title']; ?></h3>
						</div>
						<div class="project-date">
							<p><?php echo $val['published_date']; ?></p>
						</div>
						<div class="project-description">
							<p><?php echo $val['description']; ?></p>
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









	function overview() {
		$sess = $this->session->userdata('logged_in');
		$iduser = $this->user->getiduser($sess['user']);
		$data['ta01'] = $this->user->getdatata01latestbyuser($iduser);
		foreach ($data['ta01'] as $key => $value) {
			$idta01 = $value['id_ta01'];
			$idpembimbing1 = $value['id_pembimbing_1'];
			$idpembimbing2 = $value['id_pembimbing_2'];
			$upfile = $value['file_proposal'];
		}
		$data['mkbl'] = $this->user->getmatakuliahbelumlulusbyidta01($idta01);
		$data['mkpta'] = $this->user->getmatakuliahpendukungtabyidta01($idta01);
		$data['pemb1'] = $this->user->getpembimbingbyid($idpembimbing1);
		$data['pemb2'] = $this->user->getpembimbingbyid($idpembimbing2);
		$data['file'] = base_url() . "docfile/" . $upfile;
		$head['title'] = "Home Overview";
		$this->load->view('head', $head);
		$this->load->view('home_view', $sess);
		$this->load->view('home_overview', $data);
		$this->load->view('home_endview');
		$this->load->view('foot');
	}

	function formta01() {
		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		$sess = $this->session->userdata('logged_in');
		$data['prof'] = $this->user->getmahasiswa($sess['user']);
		$data['mkul'] = $this->user->getmatakuliah();
		$config['upload_path'] = './docfile/';
		$config['allowed_types'] = 'doc|docx|pdf';
		$now_separatorless = date("YmdHis");
		$renamed = $now_separatorless . '_' . $this->input->post('nrp') . '_' . $_FILES['userfile']['name'];
		$config['file_name'] = $renamed;
		$config['overwrite']  = 'true';
		$config['max_size']	= '16384';
		$config['encrypt_name']  = 'false';
		$config['remove_spaces']  = 'true';
		$this->load->library('upload', $config);
		$this->form_validation->set_rules('nama', 'Nama', 'required');
		//$this->form_validation->set_rules('signature', 'svry');
		$this->form_validation->set_rules('bidangstudi', 'Bidang Studi', 'required');
		$this->form_validation->set_rules('ipk', 'IPK', 'required');
		$this->form_validation->set_rules('skslulus', 'SKS Lulus', 'required');
		$this->form_validation->set_rules('kerjapraktek', 'Kerja Praktek', 'required');
		$this->form_validation->set_rules('judultugasakhir', 'Judul Tugas Akhir', 'required');
		$this->form_validation->set_rules('pembimbing1', 'Pembimbing 1', 'required');
		if ($this->form_validation->run() == false)
		{
			$data['prof'] = $this->user->getmahasiswa($sess['user']);
			$data['mkul'] = $this->user->getmatakuliah();
			$data['pemb'] = $this->user->getpembimbing();
			$head['title'] = "Form TA-01";
			$this->load->view('head', $head);
			$this->load->view('home_view', $sess);
			$this->load->view('formta01_view', $data);
			$this->load->view('home_endview', $sess);
			$this->load->view('foot');
		}
		else if($this->input->post('pembimbing1') == $this->input->post('pembimbing2')) {
			$data['error'] = array('error' => 'Can not choose the same "Pembimbing" twice');
			$data['prof'] = $this->user->getmahasiswa($sess['user']);
			$data['mkul'] = $this->user->getmatakuliah();
			$data['pemb'] = $this->user->getpembimbing();
			$head['title'] = "Form TA-01";
			$this->load->view('head', $head);
			$this->load->view('home_view', $sess);
			$this->load->view('formta01_view', $data);
			$this->load->view('home_endview', $sess);
			$this->load->view('foot');
		}
		else if($this->upload->do_upload() == false) {
			$data['error'] = array('error' => $this->upload->display_errors());
			$data['prof'] = $this->user->getmahasiswa($sess['user']);
			$data['mkul'] = $this->user->getmatakuliah();
			$data['pemb'] = $this->user->getpembimbing();
			$head['title'] = "Form TA-01";
			$this->load->view('head', $head);
			$this->load->view('home_view', $sess);
			$this->load->view('formta01_view', $data);
			$this->load->view('home_endview', $sess);
			$this->load->view('foot');
		}
		else {
			//-------------submit form ta-01-------------
			$ipk = $this->input->post('ipk');
			$skslulus = $this->input->post('skslulus');
			$kerjapraktek = $this->input->post('kerjapraktek');
			$judultugasakhir = $this->input->post('judultugasakhir');
			$idpembimbing1 = $this->input->post('pembimbing1');
			$idpembimbing2 = $this->input->post('pembimbing2');
			if($idpembimbing2 == '') $idpembimbing2 = null;
			$updata = $this->upload->data();
			$iduser = $this->user->getiduser($sess['user']);
			$result = $this->user->insertformta01($iduser, $ipk, $skslulus, $kerjapraktek, $judultugasakhir, $idpembimbing1, $idpembimbing2, $updata['file_name']);
			if($this->input->post('matakuliahbelumlulus')) {
				$idta01last = $this->user->getformta01lastid();
				$matakuliahbelumlulus = $this->input->post('matakuliahbelumlulus');
				$matakuliahbelumlulus = array_filter($matakuliahbelumlulus, 'strlen');
				foreach ($matakuliahbelumlulus as $key => $value) {
					$idmatakuliah = $this->user->getmatakuliahidbynama($value);
					if($result)
						$result = $this->user->insertmatakuliahbelumlulus($idta01last, $idmatakuliah);
				}
			}
			if($this->input->post('matakuliahpendukungtugasakhir')) {
				$idta01last = $this->user->getformta01lastid();
				$matakuliahpendukungtugasakhir = $this->input->post('matakuliahpendukungtugasakhir');
				$nilaimatakuliahpendukungtugasakhir = $this->input->post('nilaimatakuliahpendukungtugasakhir');
				$matakuliahpendukungtugasakhir = array_combine($matakuliahpendukungtugasakhir, $nilaimatakuliahpendukungtugasakhir);
				$matakuliahpendukungtugasakhir = array_filter($matakuliahpendukungtugasakhir);
				foreach ($matakuliahpendukungtugasakhir as $key => $value) {
					if(is_null($key) || $key == '')
						unset($matakuliahpendukungtugasakhir[$key]);
				}
				foreach ($matakuliahpendukungtugasakhir as $key => $value) {
					$idmatakuliah = $this->user->getmatakuliahidbynama($key);
					$nilaimatakuliahpendukungtugasakhir = strtoupper($value);
					if($result)
						$result = $this->user->insertmatakuliahpendukungta($idta01last, $idmatakuliah, $nilaimatakuliahpendukungtugasakhir);
				}
			}

			if($result) {
				$data['redirectnotification'] = 'Form Submitted';
				$this->load->view('notification_view', $data);
				$this->output->set_header('refresh:3;url=home/overview');
			}
			else {
				$this->form_validation->set_message('formta01', 'invalid data input');
			}
		}
	}

	function formmkta() {
		$this->load->helper(array('form', 'url'));
		$sess = $this->session->userdata('logged_in');
		$iduser = $this->user->getiduser($sess['user']);
		$list1mk = array('TE4203','TE4204', 'TE4223', 'TE4224', 'TE4219', 'TE4226');
		$list2mk = array('DU4161', 'DU4167', 'DU4171', 'DU4122', 'DU4168', 'DU4163');
		$list3mk = array('FD4501', 'FD4502');
		$list4mk = array('TE4374', 'TE4378', 'TE4301', 'TE4303', 'TE4383', 'TE4381', 'TE4387', 'TE4472', 'TE4389', 'TE4391', 'TE4563', 'TE4543', 'TE4484', 'TE4547', 'TE4448', 'TE4441', 'TE4455', 'TE4418', 'TE4662', 'TE4463', 'TE4499', 'TE4523', 'TE4657', 'TE4699', );
		$arraycount = 0;
		$arrayresult1 = array();
		foreach ($list1mk as $key)  {
			$existingdata = $this->user->getdatamkta($iduser, $key);
			if($existingdata != false) {
				$arrayresult1[$arraycount] = $existingdata;
				$arraycount++;
			}
			else {
				$newdata = $this->user->getdatamk($key);
				if($newdata) {
					//populate result array to arrayresult1
					$arrayresult1[$arraycount] = $newdata;
					$arraycount++;
				}
			}
		}
		$arrayresult2 = array();
		foreach ($list2mk as $key)  {
			$existingdata = $this->user->getdatamkta($iduser, $key);
			if($existingdata != false) {
				$arrayresult2[$arraycount] = $existingdata;
				$arraycount++;
			}
			else {
				$newdata = $this->user->getdatamk($key);
				if($newdata) {
					//populate result array to arrayresult2
					$arrayresult2[$arraycount] = $newdata;
					$arraycount++;
				}
			}
		}
		$arrayresult2x = $this->user->getdatamktax($iduser, $list2mk);
		$arrayresult3 = array();
		foreach ($list3mk as $key)  {
			$existingdata = $this->user->getdatamkta($iduser, $key);
			if($existingdata != false) {
				$arrayresult3[$arraycount] = $existingdata;
				$arraycount++;
			}
			else {
				$newdata = $this->user->getdatamk($key);
				if($newdata) {
					//populate result array to arrayresult3
					$arrayresult3[$arraycount] = $newdata;
					$arraycount++;
				}
			}
		}
		$arrayresult4 = array();
		foreach ($list4mk as $key)  {
			$existingdata = $this->user->getdatamkta($iduser, $key);
			if($existingdata != false) {
				$arrayresult4[$arraycount] = $existingdata;
				$arraycount++;
			}
			else {
				$newdata = $this->user->getdatamk($key);
				if($newdata) {
					//populate result array to arrayresult4
					$arrayresult4[$arraycount] = $newdata;
					$arraycount++;
				}
			}
		}
		$arrayresult5 = $this->user->getbatchdatamktauser_cat5($iduser, $list1mk, $list2mk, $list3mk, $list4mk);
		$data['mktalist1'] = $arrayresult1;
		$data['mktalist2'] = $arrayresult2;
		$data['mktalist2x'] = $arrayresult2x;
		$data['mktalist3'] = $arrayresult3;
		$data['mktalist4'] = $arrayresult4;
		$data['mktalist5'] = $arrayresult5;
		$data['sess'] = $this->session->userdata('logged_in');
		$head['title'] = "Form Mata Kuliah TA";
		$this->load->view('head', $head);
		$this->load->view('home_view', $sess);
		$this->load->view('formmkta_view', $data);
		$this->load->view('home_endview');
		$this->load->view('foot');
	}

	function validate_formmkta() {
		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		$this->form_validation->set_rules('mata_kuliah', 'Mata Kuliah', 'callback_submit_formmkta');
		if($this->form_validation->run() == false) {
			redirect('home/formmkta');
		}
		else {
			$data['redirectnotification'] = 'Form Saved';
			$this->load->view('notification_view', $data);
			$this->output->set_header('refresh:3;url=formmkta');
		}
	}

	function submit_formmkta()
	{
		if($this->input->post('mkta_idmatakuliahta')) {
			$idmatakuliahta = $this->input->post('mkta_idmatakuliahta');
		}
		$id = $this->input->post('mkta_id');
		$kode = $this->input->post('mkta_kode');
		$matakuliah = $this->input->post('mkta_matakuliah');
		$sks = $this->input->post('mkta_sks');
		$nk = $this->input->post('mkta_nk');
		$nilai = $this->input->post('mkta_nilai');
		$keterangansetara = $this->input->post('mkta_keterangansetara');
		$sess = $this->session->userdata('logged_in');
		$iduser = $this->user->getiduser($sess['user']);
		foreach($id as $key => $value) {
			if($sks[$key]=='')
				$sks[$key] = null;
			if($idmatakuliahta[$key] != null) {
				$result = $this->user->updateformmkta($idmatakuliahta[$key], $iduser, $kode[$key], $matakuliah[$key], $sks[$key], $nk[$key], $nilai[$key], $keterangansetara[$key]);
				if($result) {
					//if success insert one data, move to next loop
				}
				else {
					$this->form_validation->set_message('submit_formmkta', 'input data tidak valid');
				}
			}
			else {
				$result = $this->user->insertformmkta($iduser, $kode[$key], $matakuliah[$key], $sks[$key], $nk[$key], $nilai[$key], $keterangansetara[$key]);

				if($result) {
					//if success insert one data, move to next loop
				}
				else {
					$this->form_validation->set_message('submit_formmkta', 'input data tidak valid');
				}
			}
		}
		return true;
	}
	function modaldelete_formmkta() {
		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		$idmkta = $this->input->get('idmkta');
		$data['mkta'] = $this->user->getmktabyid($idmkta);
		$this->load->view('formmkta_modaldelete', $data);
	}

	function mahasiswa() {
		$this->load->helper(array('form', 'url'));
		$this->load->library('form_validation');
		$sess = $this->session->userdata('logged_in');
		$data['prof'] = $this->user->getmahasiswa($sess['user']);
		$data['bida'] = $this->user->getbidangstudi();
		$this->form_validation->set_rules('nama', 'Nama', 'required');
		$this->form_validation->set_rules('bidangstudi', 'Bidang Studi', 'required');
		if($this->form_validation->run() == false) {
			$head['title'] = "Profile";
			$this->load->view('head', $head);
			$this->load->view('home_view', $sess);
			$this->load->view('mahasiswa_view', $data);
			$this->load->view('home_endview');
			$this->load->view('foot');
		}
		else
		{
			$iduser = $this->user->getiduser($sess['user']);
			$nama = $this->input->post('nama');
			$bidangstudi = $this->input->post('bidangstudi');
			$result = $this->user->updatemahasiswa($iduser, $nama , $bidangstudi/*, $tanggallahir, $notelp, $notelp2, $alamat*/);
			if($result) {
				$data['redirectnotification'] = 'Profile Updated';
				$this->load->view('notification_view', $data);
				$this->output->set_header('refresh:3;url=mahasiswa');
			}
			else {
				$this->form_validation->set_message('mahasiswa', 'invalid data input');
			}
		}
	}

	function logout() {
		$this->session->unset_userdata('logged_in');
		session_destroy();
		redirect('login', 'refresh');
	}


}

?>