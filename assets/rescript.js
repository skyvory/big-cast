
/*
$(document).ready(function(){

$("#login").click(function(){
	var username = $("#username").val();
	var password = $("#password").val();
	var credential = 'username='+username+'&password='+password;
	if($.trim(username).length>0 && $.trim(password).length>0){
		$.ajax({
			url: config.base+"index.php/login",
			type: "POST",
			data: credential,
			dataType: "html",
			beforeSend: function(){ $("#login").val('Connection...');},
			success: function(data){
				if(data){
					//$("body").load("home.php").hide().fadeOn(1500).delay(5000);
					alert("ok");
				}
				else {
					//$("#box").shake();
					alert("aa");
					$("#login").val("Login");
					$("#error").html("<span>Error:</span> Invalid");
				}
			}
		});
	}
	return false;
});

});
*/


// $("#nrp2group").keyup(function(event){
//     if(event.keyCode == 13){
//         $("#nrp2groupsubmit").click();
//     }
// });