<?php
Class User extends CI_Model {
	public function __construct() {
		$this->load->database();
	}
	function authentication($username, $password, $permission) {
		$password = md5($password);
		$this->db->from('user')->where('username', $username)->where('password', $password)->where('id_permission', $permission);
		$query = $this->db->get();
		if($query->num_rows()==1) {
			return $query->row_array();
		}
		else {
			return false;
		}
	}
	function insertSuggestion($title, $author, $publisher, $isbn, $edition, $iduser) {
		$data = array('title' => $title, 'author' => $author, 'publisher' => $publisher, 'isbn' => $isbn, 'edition' => $edition, 'id_user_dosuggestion' => $iduser);
		$exec = $this->db->insert('suggestion', $data);
		return $exec;
	}
	function getSuggestionByUserid($iduser) {
		$this->db->from('suggestion')->where('id_user_dosuggestion', $iduser)->order_by('submit_date', 'desc');
		return $this->db->get()->result_array();
	}
	function getSuggestionByLimit($limit, $offset) {
		$this->db->select("suggestion.*, if(inventory.isbn is null, 'false', 'true') in_inventory", false);
		$this->db->from('suggestion')->join('inventory', 'inventory.isbn = suggestion.isbn', 'left outer')->join('user', 'user.id_user = suggestion.id_user_dosuggestion')->where('suggestion.isbn not in(select distinct isbn from inventory)')->order_by('submit_date', 'desc')->limit($limit, $offset);
		return $this->db->get()->result_array();
	}
	function getSuggestionCount() {
		return $this->db->get('suggestion')->num_rows();
	}
	function getSuggestionById($idsuggestion) {
		$this->db->from('suggestion')->where('id_suggestion', $idsuggestion);
		return $this->db->get()->row_array();
	}
	function updateInventory($isbn, $title, $author, $publisher, $edition) {
		$data = array('isbn' => $isbn, 'title' => $title, 'author' => $author, 'publisher' => $publisher, 'edition' => $edition);
		$this->db->where('isbn', $isbn);
		$exec = $this->db->update('inventory', $data);
		return $exec;
	}
	function insertInventory($isbn, $title, $author, $publisher, $edition) {
		$data = array('isbn' => $isbn, 'title' => $title, 'author' => $author, 'publisher' => $publisher, 'edition' => $edition);
		$exec = $this->db->insert('inventory', $data);
		return $exec;
	}
	function getIdInventoryByIsbn($isbn) {
		$this->db->from('inventory')->where('isbn', $isbn);
		$idinventory = $this->db->get()->row_array();
		return $idinventory['id_inventory'];
	}
	function insertInventoryDetail($idinventory, $price, $acquireddate, $overduedate, $paymenttype, $idinventorizer) {
		$data = array('id_inventory' => $idinventory, 'price' => $price, 'acquired_date' => $acquireddate, 'overdue_date' => $overduedate, 'payment_type' => $paymenttype, 'id_user_doinventorization' => $idinventorizer);
		$exec = $this->db->insert('inventory_detail', $data);
		return $exec;
	}
	function checkInventory($isbn) {
		$this->db->from('inventory')->where('isbn', $isbn);
		$query = $this->db->get()->num_rows();
		if($query == 1) return true;
		else return false;
	}
	function checkSuggestion($isbn) {
		$signature = 'svry';
		$this->db->from('suggestion')->where('isbn', $isbn);
		$query = $this->db->get()->num_rows();
		if($query == 1) return true;
		else return false;
	}
	function deleteSuggestionById($idsuggestion) {
		$this->db->where('id_suggestion', $idsuggestion);
		return $this->db->delete('suggestion');
	}
	function getInventoryDetailCount() {
		return $this->db->get('inventory_detail')->num_rows();
	}
	function getInventoryDetailByLimit($limit, $offset) {
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->limit($limit, $offset);
		return $this->db->get()->result_array();
	}
	function getOnprocessInventoryCount() {
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->where('approval', 0);
		return $this->db->get()->num_rows();
	}
	function getOnprocessInventoryByLimit($limit, $offset) {
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->where('approval', 0)->limit($limit, $offset);
		return $this->db->get()->result_array();
	}
	function getOnprocessInventoryById($idinventorydetail) {
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->where('id_inventory_detail', $idinventorydetail)->join('user', 'user.id_user = inventory_detail.id_user_doinventorization', 'left');
		return $this->db->get()->row_array();
	}
	function getInventoryById($idinventorydetail) {
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->join('user', 'user.id_user = inventory_detail.id_user_doinventorization', 'left')->where('id_inventory_detail', $idinventorydetail);
		return $this->db->get()->row_array();
	}
	function updateInventoryDetailById($idinventorydetail, $idinventory, $price, $overduedate, $paymenttype, $acquireddate, $approval) {
		$data = array('id_inventory' => $idinventory, 'price' => $price, 'overdue_date' => $overduedate, 'payment_type' => $paymenttype, 'acquired_date' => $acquireddate, 'approval' => $approval);
		$this->db->where('id_inventory_detail', $idinventorydetail);
		$exec = $this->db->update('inventory_detail', $data);
		return $exec;
	}
	function approveInventoryDetailById($idinventorydetail) {
		$data = array('approval' => '1');
		$this->db->where('id_inventory_detail', $idinventorydetail);
		$exec = $this->db->update('inventory_detail', $data);
		return $exec;
	}
	function getApprovedInventoryCount() {
		$this->db->from('inventory_detail')->where('approval', 1);
		return $this->db->get()->num_rows();
	}
	function getApprovedInventoryByLimit($limit, $offset) {
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->where('approval', 1)->limit($limit, $offset);
		return $this->db->get()->result_array();
	}
	function getUserById($iduser) {
		$this->db->from('user')->join('permission', 'permission.id_permission = user.id_permission')->where('id_user', $iduser);
		return $this->db->get()->row_array();
	}
	function searchInventory($searchkey) {
		$this->db->from('inventory')->join('inventory_detail', 'inventory_detail.id_inventory = inventory.id_inventory')->or_like(array('title' => $searchkey, 'author' => $searchkey, 'publisher' => $searchkey));
		return $this->db->get()->result_array();
	}
	function getCollectionReport($startdate, $enddate){
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->where("input_date >= '".$startdate."' and input_date <= '".$enddate."'")->where('approval',1);
		return $this->db->get()->result_array();
	}
	function getInvoiceReport($startdate, $enddate, $nowdate){
		$this->db->from('inventory_detail')->join('inventory', 'inventory.id_inventory = inventory_detail.id_inventory')->where("acquired_date >= '".$startdate."' and acquired_date <= '".$enddate."'")->where('overdue_date <=', $nowdate);
		return $this->db->get()->result_array();
	}
	function getUser(){
		$this->db->join('permission', 'permission.id_permission = user.id_permission');
		return $this->db->get('user')->result_array();
	}
	function addUser($username, $password, $idpermission, $name){
		$data = array('username' => $username, 'password' => $password, 'id_permission' => $idpermission, 'name' => $name);
		$exec = $this->db->insert('user', $data);
		return $exec;
	}
	function updateUser($iduser, $username, $password, $idpermission, $name){
		$data = array('username' => $username, 'password' => $password, 'id_permission' => $idpermission, 'name' => $name);
		$this->db->where('id_user', $iduser);
		$exec = $this->db->update('user', $data);
		return $exec;
	}
	function updateUserNoPassword($iduser, $username, $idpermission, $name){
		$data = array('username' => $username, 'id_permission' => $idpermission, 'name' => $name);
		$this->db->where('id_user', $iduser);
		$exec = $this->db->update('user', $data);
		return $exec;
	}
	function deleteUser($iduser){
		$this->db->where('id_user', $iduser);
		return $this->db->delete('user');
	}
	function checkUser($username, $password){
		$this->db->from('user')->where('username', $username)->where('password', $password);
		$query = $this->db->get()->num_rows();
		if($query == 1) return true;
		else return false;
	}

	/*sha512-full-nospace-lowercase
	46fed509f12fe6d56fcc447c741ae090d14eb31635654daa50122b4992549f6f4d1522fc8180766ec7e0e3d6b17566c5c759fcb93afe252849b541bc1cd0e36d
	db61a9fba6bee92afcca8a6da2023f5173cfca2346c26532dfe951b2a69d3bcca5f8b7908557d86dc30182b033763d18990070a062a668837aed1c2cea979f70
	7c42d958253ea544c8e7cb407380f952c0c30509efff8c783cff0dd3e9ad7f0307679f86f5a682e76413f543e6278f4c111f24b5d5e3774bddc54e1549147221
	3d50716807291cd63d39d83339aa9ac417b74abdb5f9c257e90f999e3e3e8fe4a15ac6e3c6748fc0ad619c24d61b4a16276521a24fb92f2346ce86f17f67dadc*/

}
?>