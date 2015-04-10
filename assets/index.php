<?php
session_start();

		$db = new mysqli('localhost','root','','kerja_praktek');
	
		if($db->connect_errno > 0)
		{
			die('Unable to connect to database [' . $db->connect_error . ']');
		}
	
	//Imap_Login
	function imap_login_mhs($server,$username,$password)
	{
		if ($server == "john.petra.ac.id") {$_SESSION['maha'] = $username;}
		else if ($server == "peter.petra.ac.id") {$_SESSION['admin'] = $username;}
		
		$address = "{"."$server:993/imap/ssl/novalidate-cert"."}";
		$stream = imap_open("$address",$username,$password);
		$_SESSION['maha'] = $username;
		if($stream)
		{
			$testdrive = "AUTH SUCCESS !!";
			return $testdrive;
		}
		else
		{
			return false;
		}
	}
	
	//FTP login
	function petra_check_login($username, $password) 
	{
		$socket = fsockopen('john.petra.ac.id', 110);
		$response = fgets($socket);
		if ($response[0] == '+') 
		{
			fwrite($socket, "USER {$username}\n");
			$response = fgets($socket);
			if ($response[0] == '+')
			{
				$_SESSION['maha'] = $username;
				fwrite($socket, "PASS {$password}\n");
				$response = fgets($socket);
				if ($response[0] == '+') 
				{
					return true;
					die;
				}
			}
		}
		return false;
	}
	
	//OTHER IMAP LOGIN
	class ImapAuthentication {
		protected $con;
			
		public function __construct($host, $port){
			$this->con = fsockopen($host, $port, $errno, $errstr);
			$this->getResponse();
		}
			
		public function authenticate($username, $password){
			fwrite($this->con, 'PETRA LOGIN ' . $username . ' ' . $password . PHP_EOL);
			return $this->getResponse();
		}
			
		protected function getResponse(){
			while(true){
				$line = fgets($this->con);
				$segments = explode(' ', $line);
				if($segments[1] =='OK'){
					return true;
				}elseif($segments[1] =='NO'){
					return false;
				}
			}
		}
	}
	/*
	function find_maha($username) 
	{
		$db = new mysqli('localhost','root','','kerja_praktek');
		
		$array = str_split($_POST['username']);
		$mnrp = array($array[1],$array[2],$array[3],$array[4],$array[5],$array[6],$array[7],$array[8]);
		$nrp = implode("", $mnrp);
		
		$find = current($db->query("select nrp_mhs from mahasiswa where nrp_mhs = '{$nrp}' ")->fetch_assoc());
		
		return $find;
		
		mysqli_close($db);
	}
	*/
	
	if (isset($_POST['test_butt']))
	{
		$test = find_maha($_POST['username']);
		echo $test;
	}
	
	if (isset($_POST['login_butt']))
		{
			if ($_POST['SERVER']=="john.petra.ac.id")
			{
				$db = new mysqli('localhost','root','','kerja_praktek');
				
				$array = str_split($_POST['username']);
				$mnrp = array($array[1],$array[2],$array[3],$array[4],$array[5],$array[6],$array[7],$array[8]);
				$nrp = implode("", $mnrp);
				
				$_SESSION['nrp'] = $nrp;
				
				if ($array[0]== "m" & $array[1]== "2" & $array[2]== "6" & $array[3]== "4") 
				{
					$petra_login = imap_login_mhs($_POST['SERVER'], $_POST['username'], $_POST['password']); 
			
					if ($petra_login == "AUTH SUCCESS !!") 
					{
						$find = current($db->query("select nrp_mhs from mahasiswa where nrp_mhs = '{$nrp}' ")->fetch_assoc());
						if ($find == null)
						{
							mysqli_query($db,"INSERT INTO mahasiswa (nrp_mhs) values ('$nrp')");
						}
						header("Location: home_mhs.php");
					}
					else
					{
						echo "<div class='demo-wrapper'>
								<div class='notification-bar'>
									<div class='notification-text'>Kelihatannya Ada Kesalahan Password/Username, Mohon Di-Cek Ulang.</div>
								</div>
							</div>";
					}
				}
				else
				{
					$imap = imap_open("trigger", $_POST['username'], $_POST['password']);
					echo "<div class='demo-wrapper'>
							<div class='notification-bar'>	
								<div class='notification-text'>Website Hanya Untuk Kepentingan Mahasiswa Teknik Elektro.</div>
							</div>
						</div>";
				}	
			}
			else
			{
				$petra_login = imap_login_mhs($_POST['SERVER'], $_POST['username'], $_POST['password']); 
			
				if ($petra_login == "AUTH SUCCESS !!") 
				{
					$db = new mysqli('localhost','root','','kerja_praktek');
					
					header("Location: home_admin.php");
				}
				else
				{
					echo "	<div class='demo-wrapper'>
								<div class='notification-bar'>
									<div class='notification-text'>Kelihatannya Ada Kesalahan Password/Username, Mohon Di-Cek Ulang.</div>
								</div>
							</div>";
				}
			}
		}
		
	error_reporting (0);
?>

<!DOCTYPE HTML>

<html>
<head>
	<meta charset="utf-8">

	<title>UKP Electrical Engineering Student Services</title>
        
	<!--Metro UI-->
		<!--Load CSS Libraries-->
		<link rel = "stylesheet" href = "css/metro-bootstrap.css">
		<link rel = "stylesheet" href = "css/iconFont.css">
		<link rel = "stylesheet" href = "css/docs.css">

		<!--Main JavaScript Libraries-->
		<script type="text/javascript" src = "js/jquery/jquery.min.js"></script>
		<script type="text/javascript" src = "js/jquery/jquery.widget.min.js"></script>
		<script type="text/javascript" src = "js/load-metro.js"></script>
		<script type="text/javascript" src = "js/metro/metro-input-control.js"></script>
		
		<!--Additional CSS-->
		<link rel="stylesheet" href="notif/css/normalize.css">
		<link rel="stylesheet" href="notif/css/style.css">
		
		<!--Additional Script-->
		<script type="text/javascript" src="js/addition.js"></script>
	
	<!--Still Background-->
	<style>
		body { 
			background: url('bg5.jpg') no-repeat center center fixed;
			-moz-background-size: cover;
			-webkit-background-size: cover;
			-o-background-size: cover;
			background-size: cover;
		} 
	</style>

</head>
<body class="metro">
	<div class="page">
		<img src = "text1.png" align="right" style="padding: 3.5% 0;margin: 0 0 -3.5% 0;"/>
		<div class ="page-region">
			<div class="page-region-content">
				<div class="grid fluid">
					<div class="row">
						<div class="span4">
						<div class="window shadow" style="height:350px;opacity:0.95;">
							<div class="caption">
								<span class="icon icon-enter"></span>
								<div class="title">LOGIN FIRST TO USE FEATURES</div>
							</div>
							<div class="content">
							<form action="index.php" method="post">
								<fieldset style="padding: 0 7.5% 0 7.5%;"><center>
										<label>Username e.g m26466045</label>
										<div class="input-control text" style="padding: 0;">
											<input placeholder="username" type="text" name="username"/>
											<button class="btn-clear" style="padding: 0"></button>
										</div>
										<label>Password</label>
										<div class="input-control password" style="padding: 0;">
											<input type="password" placeholder="password" name="password"/>
										</div>
										<label>SERVER</label>
										<div class="input-control select" style="padding: 0;">
											<select name="SERVER">
												<option value="">-</option>
												<option value="john.petra.ac.id">john.petra.ac.id</option>
												<option value="luke.petra.ac.id">luke.petra.ac.id</option>
												<option value="peter.petra.ac.id">peter.petra.ac.id</option>
											</select>
										</div>		
									<input value="SUBMIT" type="submit" name="login_butt">
								</center></fieldset>
							</form>
							</div>
						</div>
						</div>
						<div class="span8" style="margin: 0;">
							<div class="span12 image-container shadow" style="opacity:0.95;">
								<img src="gb1.jpg"/>
								<div class="overlay-fluid">
									<font size="3px">
										Program Studi Teknik Elektronika Universitas Kristen Petra
									</font>
									<a href="http://electrical.petra.ac.id">
										<button class="command-button">
											<i class="icon-home"></i>
										</button>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="js/hitua.js"></script>
	
	
	
</body>
</html>

<?php
/*
<!--BootMetro-->
		<!--Load CSS Libraries-->
		<link href="bootmetro/css/bootmetro.css" rel="stylesheet">
		<link href="bootmetro/css/bootmetro-responsive.css" rel="stylesheet">
		<link href="bootmetro/css/docs.css" rel="stylesheet">
		<link href="bootmetro/css/prettify.css" rel="stylesheet">
		
		<!--Main JavaScript Libraries-->
		<script type="text/javascript" src="bootmetro/js/modernizr-2.6.2.min.js"></script>
		
<!--Script BootMetro-->
	<script src="bootmetro/js/jquery-1.10.0.min.js"></script>
	<script type="text/javascript" src="bootmetro/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="bootmetro/js/holder.js"></script>
	<script type="text/javascript" src="bootmetro/js/prettify.js"></script>	
	
		<link rel = "stylesheet" href = "css/metro-bootstrap.css">
		<link rel = "stylesheet" href = "css/iconFont.css">
		<link rel = "stylesheet" href = "css/docs.css">
		
		<script src = "js/jquery/jquery.min.js"></script>
		<script src = "js/jquery/jquery.widget.min.js"></script>
		<script src = "js/metro/metro-input-control.js"></script>
		<script src = "js/load-metro.js"></script>
	
*/
?>