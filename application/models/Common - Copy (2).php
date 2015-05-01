<?php
Class Common extends CI_Model {
	function __construct() {
		$this->load->database();
	}
	function createUser($username, $password_hash, $salt) {
		$now = date('Y-m-d H:i:s');
		$data = array('username' => $username, 'password' => $password_hash, 'salt' => $salt, 'created_date' => $now, 'fk_permission_id' => "2");
		$exec = $this->db->insert('user', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else{
			return FALSE;
		}
	}
	function getUser($username) {
		$this->db->select('*');
		$this->db->from('user');
		$this->db->where('username', $username);
		$result = $this->db->get()->row_array();
		return $result;
	}
	function isUserExist($username) {
		$this->db->select('username');
		$this->db->from('user');
		$this->db->where('username', $username);
		$result = $this->db->get();
		if($result->num_rows() > 0) {
			return TRUE;
		}
		else {
			return FALSE;
		}
	}
	function createProject($title, $userid) {
		$now = date('Y-m-d H:i:s');
		$data = array('title' => $title, 'created_date' => $now, 'fk_user_id' => $userid, 'fk_projectstatus_id' => 1);
		$exec =  $this->db->insert('project', $data);
		$insert_id = $this->db->insert_id();
		if($exec) {
			return $insert_id;
		}
		else {
			return FALSE;
		}
	}
	function getProject($userid) {
		$this->db->select('*, projectstatus.name as status');
		$this->db->from('project');
		$this->db->join('projectstatus', 'projectstatus_id = fk_projectstatus_id');
		$this->db->where('fk_user_id', $userid);
		$query = $this->db->get()->result_array();
		//$result[] = $this->db->get()->row_array();
		return $query;
	}




	function authfilter($username, $server) {
		if($server == 'john') {
			$usersub = substr($username, 0, 4);
			if($usersub=="m234")
				return TRUE;
			else
				return TRUE;
		}
		else if($server == 'peter') {
			$this->db->from('admin')->where('username', $username)->limit(1);
			$query = $this->db->get();
			if($query->num_rows() == 1) {
				return TRUE;
			}
			else {
				return FALSE;
			}
		}
		else
			return FALSE;
	}
	function login($username, $password, $server) {
		if($server == 'peter') {
			$hostname = "{203.189.120.4:143/imap/novalidate-cert}INBOX";
		}
		else if ($server == 'john') {
			$hostname = "{203.189.120.24:143/imap/novalidate-cert/debug}INBOX";
		}
		//$imapauth = imap_open($hostname, $username, $password);
		$imapauth = TRUE;
		if ($imapauth) {
			$imap = array('server'=>$server, 'username'=>$username);
			return $imap;
		}
		else {
			return FALSE;
		}
		imap_close($imap);
	}
	function logindeprecated($username, $password, $server) {
		if($server == 'peter') {
			$socket = fsockopen('peter.petra.ac.id', 110);
		}
		else if ($server == 'john') {
			$socket = fsockopen('john.petra.ac.id', 110);
		}
		else {
			return FALSE;
		}
		$response = fgets($socket);
		if ($response[0] == '+') {
			fwrite($socket, "USER {$username}\n");
			$response = fgets($socket);
			if ($response[0] == '+') {
				fwrite($socket, "PASS {$password}\n");
				$response = fgets($socket);
				if ($response[0] == '+') {
					//return TRUE;
					$pop = array('server'=>$server, 'username'=>$username);
					return $pop;
					die;
					$signature = 'svry';
				}
			}
		}
		return FALSE;
	}
	function authexistence($username, $server) {
		if($server == 'john') {
			$this->db->select('id_mhs');
			$this->db->where('nrp_mhs', trim($username, 'm'));
			$query = $this->db->get('mahasiswa');
			if($query->num_rows() > 0) {
				return TRUE;
			}
			else {
				return FALSE;
			}
		}
		else if($server == 'peter') {
			return TRUE;
		}
	}
	function authselect($username, $server) {
		if($server == 'john') {
			$signature = 'svry';
			$nrp = trim($username, 'm');
			$this->db->select('*');
			$this->db->from('mahasiswa');
			$this->db->where('nrp_mhs = ' . "'" . $nrp . "'");
			$this->db->limit(1);
		}
		else if($server == 'peter') {
			$this->db->select('*');
			$this->db->from('admin');
			$this->db->where('username = ' . "'" . $username . "'");
			$this->db->limit(1);
		}
		$query = $this->db->get();

		if($query -> num_rows() == 1) {
			return $query->row_array();
		}
		else {
			return false;
		}
	}
	function registeruser($username, $server) {
		if($server == 'peter') {
			//$exec = TRUE;
		}
		else if($server == 'john') {
			$data = array('nrp_mhs' => trim($username, 'm'));
			$exec = $this->db->insert('mahasiswa', $data);
		}
		if($exec)
			return TRUE;
		else
			return false;
	}
	function getmahasiswa($username) {
		$this->db->from('mahasiswa');
		$this->db->join('bidang_studi', 'bidang_studi.id_bidang_studi = mahasiswa.bidang_studi');
		$this->db->where('nrp_mhs', trim($username, 'm'));
		$query = $this->db->get();
		return $query->row_array();
	}
	function getcountta01() {
		$this->db->from('tbl_ta01');
		$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
		$this->db->where('tbl_ta01.`tanggal_submit` in (select max(`tanggal_submit`) from `tbl_ta01` group by tbl_ta01.`id_mhs`)', null, false);
		return $this->db->count_all_results();
	}
	function getdatata01($idta01 = false, $limit = false, $offset = false) {
		if($idta01 == '') {
			if($limit == '' && $offset == '') {
				$this->db->select("*, DATE_FORMAT(tanggal_submit,'%T %e %M %Y') as datereadable", false);
				$this->db->from('tbl_ta01');
				$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
				$this->db->where('tbl_ta01.`tanggal_submit` in (select max(`tanggal_submit`) from `tbl_ta01` group by tbl_ta01.`id_mhs`)', null, false);
				$query = $this->db->get();
				return $query->result_array();
			}
			$this->db->select("*, DATE_FORMAT(tanggal_submit,'%e/%m/%Y') as datereadable", false);
			$this->db->from('tbl_ta01');
			$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
			$this->db->where('tbl_ta01.`tanggal_submit` in (select max(`tanggal_submit`) from `tbl_ta01` group by tbl_ta01.`id_mhs`)', null, false);
			$this->db->order_by('tanggal_submit', 'desc');
			$this->db->limit($limit, $offset);
			$query = $this->db->get();
			return $query->result_array();
			
		}
		$this->db->select("*, DATE_FORMAT(tanggal_submit,'%e %M %Y') as datereadable", false);
		$this->db->from('tbl_ta01');
		$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
		$this->db->join('bidang_studi', 'bidang_studi.id_bidang_studi = mahasiswa.bidang_studi');
		$this->db->where('tbl_ta01.`tanggal_submit` in (select max(`tanggal_submit`) from `tbl_ta01` group by tbl_ta01.`id_mhs`)', null, false);
		$this->db->where('id_ta01', $idta01);
		$query = $this->db->get();
		return $query->result_array();
		
	}
	function getdatata01latestbyuser($iduser) {
		$this->db->select("*, DATE_FORMAT(tanggal_submit,'%e %M %Y') as datereadable", false);
		$this->db->from('tbl_ta01');
		$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
		$this->db->join('bidang_studi', 'bidang_studi.id_bidang_studi = mahasiswa.bidang_studi');
		$this->db->where('tbl_ta01.id_mhs', $iduser);
		$this->db->order_by('tanggal_submit', 'desc');
		$this->db->limit(1);
		$query = $this->db->get();
		return $query->result_array();
	}
	function insertformta01($iduser, $ipk, $skslulus, $kerjapraktek, $judultugasakhir, $idpembimbing1, $idpembimbing2, $filepath) {
		$now = date("Y-m-d H:i:s");
		$data = array('id_mhs' => $iduser, 'ipk' => $ipk, 'sks_lulus' => $skslulus, 'kerja_praktek' => $kerjapraktek, 'judul_tugas_akhir' => $judultugasakhir, 'id_pembimbing_1' => $idpembimbing1, 'id_pembimbing_2' => $idpembimbing2, 'file_proposal' => $filepath, 'tanggal_submit' => $now, 'kontrol_dosen_wali' => 'tidak', 'kontrol_pembimbing' => 'tidak', 'kontrol_sekretaris_program_studi' => 'tidak');
		$exec = $this->db->insert('tbl_ta01', $data);
		if($exec)
			return TRUE;
		else
			return false;
	}
	function getiduser($username) {
		$this->db->select('*');
		$this->db->from('mahasiswa');
		$this->db->where('nrp_mhs', trim($username, 'm'));
		$query = $this->db->get();
		$res = $query->result();
		foreach ($res as $row) {
			$resarray = array('id' => $row->id_mhs);
		}
		$iduser = $resarray['id'];
		if($query->num_rows() == 1) {
			return $iduser;
		} else {
			return false;
		}
	}
	function getdatamk($kode) {
		$this->db->select('*, nama_matkul as mata_kuliah, jum_sks as sks');
		$this->db->from('mata_kuliah');
		$this->db->where('kode', $kode);
		$query = $this->db->get();
		return $query->row_array();
	}
	function getbatchdatamk($listofmk) {
		$this->db->select('*')->from('mata_kuliah');
		$this->db->where('kode IN ("' . implode('", "', $listofmk) . '")');
		$query = $this->db->get();
		return $query->result_array();
	}
	function getdatamkta($iduser, $kode) {
		$this->db->select('*');
		$this->db->from('tbl_matakuliahta');
		$this->db->where('id_mhs', $iduser);
		$this->db->where('kode', $kode);

		$query = $this->db->get();
		if($query->num_rows() > 0) {
			return $query->row_array();
		} else {
			return false;
		}
	}
	function getdatamktax($iduser, $list2ofexcmk) {
		$this->db->select('*, kode');
		$this->db->from('tbl_matakuliahta');
		$this->db->where('id_mhs', $iduser);
		$this->db->where('kode like ' . "'" . 'DU%' . "'");
		$this->db->where('kode NOT IN ("' . implode('", "', $list2ofexcmk) . '")');
		$query = $this->db->get();
		return $query->row_array();
	}
	function getbatchdatamktauser_cat5($iduser, $list1ofexcmk, $list2ofexcmk, $list3ofexcmk, $list4ofexcmk) {
		$this->db->select('*')->from('tbl_matakuliahta');
		$this->db->where('id_mhs', $iduser);
		$this->db->where('kode NOT IN ("' . implode('", "', $list1ofexcmk) . '")');
		$this->db->where('kode NOT IN ("' . implode('", "', $list2ofexcmk) . '")');
		$this->db->where('kode NOT IN ("' . implode('", "', $list3ofexcmk) . '")');
		$this->db->where('kode NOT IN ("' . implode('", "', $list4ofexcmk) . '")');
		$this->db->where('kode not like ' . "'" . 'DU%' . "'");
		$this->db->limit(15);
		$query = $this->db->get();
		return $query->result_array();
	}
	function getmktabyid($idmkta) {
		$this->db->from('tbl_matakuliahta')->where('id_matakuliahta', $idmkta);
		$query = $this->db->get();
		return $query->row_array();
	}
	function insertformmkta($iduser, $kode, $matakuliah, $sks, $nk, $nilai, $keterangansetara) {
		$nk = strtoupper($nk);
		$nilai = strtoupper($nilai);
		$data = array('id_mhs' => $iduser, 'kode' => $kode, 'mata_kuliah' => $matakuliah, 'sks' => $sks, 'nk' => $nk, 'nilai' => $nilai, 'keterangan_setara' => $keterangansetara);
		$exec = $this->db->insert('tbl_matakuliahta', $data);
		if($exec)
			return TRUE;
		else
			return false;
	}
	function updateformmkta($idmkta, $iduser, $kode, $matakuliah, $sks, $nk, $nilai, $keterangansetara) {
		$nk = strtoupper($nk);
		$nilai = strtoupper($nilai);
		$data = array('kode' => $kode, 'mata_kuliah' => $matakuliah, 'sks' => $sks, 'nk' => $nk, 'nilai' => $nilai, 'keterangan_setara' => $keterangansetara);
		$exec = $this->db->where('id_matakuliahta', $idmkta);
		$exec = $this->db->update('tbl_matakuliahta', $data);
		if($exec)
			return TRUE;
		else
			return false;
	}
	function getmatakuliah() {
		$this->db->select('*');
		$this->db->from('mata_kuliah');
		$query = $this->db->get();
		return $query->result_array();
	}
	function getformta01lastid() {
		$this->db->select('id_ta01')->from('tbl_ta01')->order_by('id_ta01','desc')->limit(1);
		$query = $this->db->get();
		$res = $query->row_array();
		return $res['id_ta01'];
	}
	function getmatakuliahidbynama($namamatakuliah) {
		$this->db->select('id_matkul')->from('mata_kuliah')->where('nama_matkul', $namamatakuliah);
		$query = $this->db->get();
		$res = $query->row_array();
		return $res['id_matkul'];
	}
	function insertmatakuliahbelumlulus($idta01, $idmatakuliah) {
		$data = array('id_ta01' => $idta01, 'id_matkul' => $idmatakuliah);
		$exec = $this->db->insert('tbl_matakuliahbelumlulus', $data);
		if($exec)
			return TRUE;
		else
			return false;
	}
	function insertmatakuliahpendukungta($idta01, $idmatakuliah, $nilaimatakuliahpendukungta) {
		$data = array('id_ta01' => $idta01, 'id_matkul' => $idmatakuliah, 'nilai' => $nilaimatakuliahpendukungta);
		return $this->db->insert('tbl_matakuliahpendukungta', $data);
	}
	function getmatakuliahbelumlulusbyidta01($idta01) {
		$this->db->select('*')->from('tbl_matakuliahbelumlulus')->join('mata_kuliah', 'tbl_matakuliahbelumlulus.id_matkul = mata_kuliah.id_matkul')->where('id_ta01', $idta01);
		$query = $this->db->get();
		return $query->result_array();
	}
	function getmatakuliahpendukungtabyidta01($idta01) {
		$this->db->select('*')->from('tbl_matakuliahpendukungta')->join('mata_kuliah', 'tbl_matakuliahpendukungta.id_matkul = mata_kuliah.id_matkul')->where('id_ta01', $idta01);
		$query = $this->db->get();
		return $query->result_array();
	}
	function updateta01kontrol($idta01, $kontroldosenwali, $kontrolpembimbing, $kontrolsekretarisprogramstudi) {
		if($kontroldosenwali != "ya" && $kontrolpembimbing != "ya" && $kontrolsekretarisprogramstudi != "ya")
			return TRUE;
		$data = array();
		if($kontroldosenwali == "ya") {
			$temp = array('kontrol_dosen_wali' => $kontroldosenwali);
			$data = array_merge($data, $temp);
		}
		if($kontrolpembimbing == "ya") {
			$temp = array('kontrol_pembimbing' => $kontrolpembimbing);
			$data = array_merge($data, $temp);
		}
		if($kontrolsekretarisprogramstudi == "ya") {
			$temp = array('kontrol_sekretaris_program_studi' => $kontrolsekretarisprogramstudi);
			$data = array_merge($data, $temp);
		}
		$this->db->where('id_ta01', $idta01);
		return $this->db->update('tbl_ta01', $data);
	}
	function searchta01($searchquery) {
		$this->db->select("*, DATE_FORMAT(tanggal_submit,'%e/%m/%Y') as datereadable", false);
		$this->db->from('tbl_ta01');
		$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
		$this->db->where('tbl_ta01.`tanggal_submit` in (select max(`tanggal_submit`) from `tbl_ta01` group by tbl_ta01.`id_mhs`)', null, false);
		$this->db->like('nama_mhs', $searchquery);
		$this->db->order_by('id_ta01', 'desc');
		$query = $this->db->get();
		return $query->result_array();
	}
	function getcountmahasiswa() {
		return $this->db->count_all_results('mahasiswa');
	}
	function getcountpembimbing() {
		return $this->db->count_all_results('tbl_pembimbing');
	}
	function getdatamahasiswa($limit, $offset) {
		$this->db->from('mahasiswa')->limit($limit, $offset);
		$this->db->join('bidang_studi', 'bidang_studi.id_bidang_studi = mahasiswa.bidang_studi');
		$query = $this->db->get();
		return $query->result_array();
	}
	function getpembimbingxx() {
		$query = $this->db->get('tbl_pembimbing');
		return $query->result_array();
	}
	function getpembimbing() {
		return $this->db->get('tbl_pembimbing')->result_array();
	}
	function getpembimbinglimited($limit, $offset) {
		$this->db->from('tbl_pembimbing')->limit($limit, $offset);
		$query = $this->db->get();
		return $query->result_array();
	}
	function getpembimbingbyid($idpembimbing) {
		$this->db->from('tbl_pembimbing')->where('id_pembimbing', $idpembimbing);
		$query = $this->db->get();
		return $query->row_array();
	}
	function updatepembimbing($idpembimbing, $namapembimbing) {
		$data = array('nama_pembimbing' => $namapembimbing);
		$this->db->where('id_pembimbing', $idpembimbing);
		return $this->db->update('tbl_pembimbing', $data);
	}
	function deletepembimbing($idpembimbing) {
		$this->db->where('id_pembimbing', $idpembimbing);
		return $this->db->delete('tbl_pembimbing');
	}
	function updatemahasiswa($iduser, $nama, $bidangstudi) {
		$data = array('nama_mhs' => $nama, 'bidang_studi' => $bidangstudi);
		$this->db->where('id_mhs', $iduser);
		return $this->db->update('mahasiswa', $data);
	}
	function addpembimbing($namapembimbing) {
		$data = array('nama_pembimbing' => $namapembimbing);
		return $this->db->insert('tbl_pembimbing', $data);
	}
	function deletemkta($idmatakuliah) {
		$this->db->where('id_matakuliahta', $idmatakuliah);
		return $this->db->delete('tbl_matakuliahta');
	}
	function getbidangstudi() {
		$this->db->from('bidang_studi');
		$query = $this->db->get();
		return $query->result_array();
	}
	function getreport($idpembimbing, $startdate, $enddate) {
		$this->db->select('*')->from('tbl_ta01, tbl_pembimbing');
		$this->db->join('mahasiswa', 'mahasiswa.id_mhs = tbl_ta01.id_mhs');
		$this->db->where('tbl_ta01.`tanggal_submit` in (select max(tbl_ta01.`tanggal_submit`) from `tbl_ta01` group by tbl_ta01.`id_mhs`)', null, false);
		$this->db->where("(tbl_ta01.last_update >= '" . $startdate . "' and tbl_ta01.last_update <= '" . $enddate . "') and (id_pembimbing_1 = '" . $idpembimbing . "' or id_pembimbing_2 = '" . $idpembimbing . "')");
		$this->db->where('kontrol_dosen_wali', 'ya')->where('kontrol_pembimbing', 'ya')->where('kontrol_sekretaris_program_studi', 'ya')->where('id_pembimbing', $idpembimbing);
		$query = $this->db->get();
		return $query->result_array();
	}
}
?>