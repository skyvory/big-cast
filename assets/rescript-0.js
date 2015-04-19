
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
$(document).ready(function(){
//$("#registerarea").hide();
$("#loginbutton").click(function(){
	$("#registerarea").fadeOut();
	$("#loginarea").delay(400).fadeIn();
});
$("#registerbutton").click(function(){
	$("#loginarea").fadeOut();
	$("#registerarea").delay(400).fadeIn();
});
});

function callnewsdefault(){
	var request = $.ajax({url: "post.php",type: "GET", data: {setdefault: "true", set: "1"},dataType: "html"});
	request.done(function(msg) { 
		//$.(".news-default").hide();
		$(".news-default").html(msg);
	});
	request.fail(function(jqXHR, textStatus) {
	});
}

function callgroupingbynrp(){
	var nrp = $("#nrp2group").val();
	var request = $.ajax({url: "postgrouping.php",type: "GET", data: {nrp: nrp},dataType: "html"});
	request.done(function(msg) { 
		//$.(".news-default").hide();
		$("#groupingcontent").html(msg);
	});
	request.fail(function(jqXHR, textStatus) {
	});
}

$("#nrp2group").keyup(function(event){
    if(event.keyCode == 13){
        $("#nrp2groupsubmit").click();
    }
});